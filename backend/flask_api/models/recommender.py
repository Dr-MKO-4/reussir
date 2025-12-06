# recommender.py
# Système de recommandation pour le service Flask
#!/usr/bin/env python3
"""
Système de recommandation hybride.
Combine : filtrage collaboratif + content-based + règles métier.
"""

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger(__name__)

class Recommender:
    def __init__(self, database):
        """
        Initialise le système de recommandation.
        
        Args:
            database: instance de la classe Database
        """
        self.db = database
        self.user_item_matrix = None
        self.content_features = None
        self.user_similarity = None
        self.scaler = StandardScaler()
    
    def _load_data(self):
        """Charge et prépare les données pour la recommandation."""
        # Matrice utilisateur-contenu
        self.user_item_matrix = self.db.get_user_item_matrix()
        
        # Features des contenus
        contents = self.db.get_all_contents()
        self.content_features = pd.DataFrame(contents)
    
    def _compute_user_similarity(self):
        """
        Calcule la similarité entre utilisateurs (filtrage collaboratif).
        Utilise la similarité cosinus sur la matrice user-item.
        """
        if self.user_item_matrix is None:
            self._load_data()
        
        # Similarité entre utilisateurs (lignes de la matrice)
        matrix_values = self.user_item_matrix.values
        self.user_similarity = cosine_similarity(matrix_values)
        
        # DataFrame pour faciliter l'accès
        self.user_similarity = pd.DataFrame(
            self.user_similarity,
            index=self.user_item_matrix.index,
            columns=self.user_item_matrix.index
        )
    
    def recommend(self, user_id, limit=10):
        """
        Recommande des contenus pour un utilisateur.
        Approche hybride : collaborative filtering + content-based.
        
        Args:
            user_id (int): ID de l'utilisateur
            limit (int): nombre de recommandations
        
        Returns:
            list[dict]: contenus recommandés avec scores
        """
        # Charger les données si nécessaire
        if self.user_item_matrix is None:
            self._load_data()
        
        if self.user_similarity is None:
            self._compute_user_similarity()
        
        # 1. Filtrage collaboratif
        cf_scores = self._collaborative_filtering(user_id)
        
        # 2. Content-based filtering
        cb_scores = self._content_based_filtering(user_id)
        
        # 3. Règles métier (niveau utilisateur vs difficulté contenu)
        business_scores = self._business_rules_scoring(user_id)
        
        # 4. Combiner les scores (poids ajustables)
        final_scores = (
            0.4 * cf_scores +
            0.3 * cb_scores +
            0.3 * business_scores
        )
        
        # 5. Filtrer les contenus déjà vus (optionnel)
        seen_contents = self._get_user_seen_contents(user_id)
        final_scores = final_scores.drop(seen_contents, errors='ignore')
        
        # 6. Trier et limiter
        top_contents = final_scores.nlargest(limit)
        
        # 7. Enrichir avec les métadonnées
        recommendations = []
        for content_id, score in top_contents.items():
            content = self.db.get_content_by_id(content_id)
            if content:
                recommendations.append({
                    'content_id': int(content_id),
                    'titre': content['titre'],
                    'theme': content['theme'],
                    'difficulte': content['difficulte'],
                    'score': round(float(score), 3),
                    'description': content['description']
                })
        
        return recommendations
    
    def _collaborative_filtering(self, user_id):
        """
        Recommandation par filtrage collaboratif.
        Prédit les scores basés sur les utilisateurs similaires.
        """
        if user_id not in self.user_similarity.index:
            # Utilisateur nouveau ou sans historique
            return pd.Series(0, index=self.user_item_matrix.columns)
        
        # Similarités avec les autres utilisateurs
        similar_users = self.user_similarity.loc[user_id].drop(user_id)
        
        # Top K utilisateurs similaires (K=10)
        top_similar = similar_users.nlargest(10)
        
        if len(top_similar) == 0:
            return pd.Series(0, index=self.user_item_matrix.columns)
        
        # Prédiction : moyenne pondérée des scores des utilisateurs similaires
        predictions = pd.Series(0.0, index=self.user_item_matrix.columns)
        
        for similar_user_id, similarity in top_similar.items():
            if similar_user_id in self.user_item_matrix.index:
                user_scores = self.user_item_matrix.loc[similar_user_id]
                predictions += similarity * user_scores
        
        # Normaliser
        predictions = predictions / top_similar.sum() if top_similar.sum() > 0 else predictions
        
        return predictions
    
    def _content_based_filtering(self, user_id):
        """
        Recommandation basée sur le contenu.
        Suggère des contenus similaires à ceux que l'utilisateur a aimés.
        """
        # Récupérer l'historique de l'utilisateur
        interactions = self.db.get_user_interactions(user_id)
        
        if not interactions:
            # Pas d'historique, retourner scores uniformes
            return pd.Series(0.5, index=self.content_features['content_id'])
        
        # Contenus réussis par l'utilisateur
        liked_contents = [
            inter['content_id'] for inter in interactions
            if inter['reussite']
        ]
        
        if not liked_contents:
            return pd.Series(0.3, index=self.content_features['content_id'])
        
        # Profil utilisateur : thèmes et difficultés préférés
        liked_data = self.content_features[
            self.content_features['content_id'].isin(liked_contents)
        ]
        
        preferred_themes = liked_data['theme'].value_counts()
        avg_difficulty = liked_data['difficulte'].mean()
        
        # Scorer chaque contenu
        scores = []
        for _, content in self.content_features.iterrows():
            score = 0.0
            
            # Bonus si thème préféré
            if content['theme'] in preferred_themes.index:
                theme_weight = preferred_themes[content['theme']] / len(liked_contents)
                score += theme_weight * 0.7
            
            # Bonus si difficulté proche
            difficulty_diff = abs(content['difficulte'] - avg_difficulty)
            difficulty_score = 1 - difficulty_diff  # plus proche = meilleur
            score += difficulty_score * 0.3
            
            scores.append(score)
        
        return pd.Series(scores, index=self.content_features['content_id'])
    
    def _business_rules_scoring(self, user_id):
        """
        Appliquer des règles métier pour ajuster les scores.
        Exemple : adapter la difficulté au niveau de l'utilisateur.
        """
        user = self.db.get_user_by_id(user_id)
        
        if not user:
            return pd.Series(0.5, index=self.content_features['content_id'])
        
        # Mapping niveau → difficulté recommandée
        niveau_to_difficulty = {
            'débutant': (0.1, 0.4),
            'intermédiaire': (0.3, 0.7),
            'avancé': (0.6, 1.0)
        }
        
        min_diff, max_diff = niveau_to_difficulty.get(user['niveau'], (0.3, 0.7))
        
        # Scorer chaque contenu
        scores = []
        for _, content in self.content_features.iterrows():
            diff = content['difficulte']
            
            # Score = 1 si dans la plage, diminue sinon
            if min_diff <= diff <= max_diff:
                score = 1.0
            elif diff < min_diff:
                score = 0.5 + 0.5 * (diff / min_diff)  # trop facile
            else:
                score = 0.5 + 0.5 * ((1 - diff) / (1 - max_diff))  # trop difficile
            
            scores.append(score)
        
        return pd.Series(scores, index=self.content_features['content_id'])
    
    def _get_user_seen_contents(self, user_id):
        """Retourne la liste des content_id déjà vus par l'utilisateur."""
        interactions = self.db.get_user_interactions(user_id)
        return [inter['content_id'] for inter in interactions]
    
    def recommend_filtered(self, user_id, theme=None, difficulty_range=None, limit=10):
        """
        Recommandations avec filtres supplémentaires.
        
        Args:
            user_id (int): ID utilisateur
            theme (str, optional): filtrer par thème
            difficulty_range (tuple, optional): (min, max) difficulté
            limit (int): nombre de résultats
        
        Returns:
            list[dict]: recommandations filtrées
        """
        # Obtenir les recommandations de base
        recommendations = self.recommend(user_id, limit=limit * 3)  # sursample
        
        # Appliquer les filtres
        filtered = []
        for rec in recommendations:
            # Filtre thème
            if theme and rec['theme'] != theme:
                continue
            
            # Filtre difficulté
            if difficulty_range:
                min_diff, max_diff = difficulty_range
                if not (min_diff <= rec['difficulte'] <= max_diff):
                    continue
            
            filtered.append(rec)
            
            if len(filtered) >= limit:
                break
        
        return filtered
    
    def get_similar_contents(self, content_id, limit=5):
        """
        Trouve des contenus similaires à un contenu donné.
        Basé sur le thème et la difficulté.
        """
        target = self.db.get_content_by_id(content_id)
        
        if not target:
            return []
        
        if self.content_features is None:
            self._load_data()
        
        # Calculer la similarité avec tous les contenus
        similarities = []
        for _, content in self.content_features.iterrows():
            if content['content_id'] == content_id:
                continue  # skip self
            
            score = 0.0
            
            # Même thème = +0.6
            if content['theme'] == target['theme']:
                score += 0.6
            
            # Difficulté proche = +0.4
            diff_similarity = 1 - abs(content['difficulte'] - target['difficulte'])
            score += 0.4 * diff_similarity
            
            similarities.append({
                'content_id': int(content['content_id']),
                'titre': content['titre'],
                'theme': content['theme'],
                'difficulte': content['difficulte'],
                'similarity_score': round(score, 3)
            })
        
        # Trier et limiter
        similarities.sort(key=lambda x: x['similarity_score'], reverse=True)
        return similarities[:limit]


if __name__ == "__main__":
    # Tests unitaires
    from database import Database
    
    logging.basicConfig(level=logging.INFO)
    
    db = Database()
    recommender = Recommender(db)
    
    # Test recommandations pour user_id=1
    print("Recommandations pour utilisateur 1:")
    recs = recommender.recommend(user_id=1, limit=5)
    for rec in recs:
        print(f"  - {rec['titre']} (score: {rec['score']}, difficulté: {rec['difficulte']})")
    
    # Test contenus similaires
    print("\nContenus similaires à content_id=1:")
    similar = recommender.get_similar_contents(content_id=1, limit=3)
    for sim in similar:
        print(f"  - {sim['titre']} (similarité: {sim['similarity_score']})")