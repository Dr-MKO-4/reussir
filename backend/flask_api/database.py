# database.py
# Connexion et gestion de la base de données pour le service Flask
#!/usr/bin/env python3
"""
Module de gestion de la base de données.
Utilise SQLAlchemy pour PostgreSQL (ou SQLite en dev).
"""

import os
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.pool import NullPool
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        """Initialise la connexion à la base de données."""
        db_type = os.getenv('DB_TYPE', 'sqlite')  # sqlite ou postgresql
        
        if db_type == 'postgresql':
            user = os.getenv('DB_USER', 'postgres')
            password = os.getenv('DB_PASSWORD', 'postgres')
            host = os.getenv('DB_HOST', 'localhost')
            port = os.getenv('DB_PORT', '5432')
            database = os.getenv('DB_NAME', 'educational_ai')
            
            connection_string = f"postgresql://{user}:{password}@{host}:{port}/{database}"
        else:
            # SQLite pour dev
            db_path = os.getenv('DB_PATH', 'data/educational.db')
            connection_string = f"sqlite:///{db_path}"
        
        self.engine = create_engine(connection_string, poolclass=NullPool)
        logger.info(f"Database connected: {db_type}")
    
    def execute_query(self, query, params=None):
        """Exécute une requête SQL et retourne les résultats."""
        with self.engine.connect() as conn:
            result = conn.execute(text(query), params or {})
            conn.commit()
            return result
    
    def fetch_df(self, query, params=None):
        """Exécute une requête et retourne un DataFrame."""
        return pd.read_sql(text(query), self.engine, params=params)
    
    # ==================== USERS ====================
    def get_user_by_id(self, user_id):
        """Récupère un utilisateur par son ID."""
        query = "SELECT * FROM users WHERE user_id = :user_id"
        df = self.fetch_df(query, {'user_id': user_id})
        return df.iloc[0].to_dict() if not df.empty else None
    
    def get_all_users(self):
        """Récupère tous les utilisateurs."""
        df = self.fetch_df("SELECT * FROM users")
        return df.to_dict('records')
    
    # ==================== CONTENTS ====================
    def get_content_by_id(self, content_id):
        """Récupère un contenu par son ID."""
        query = "SELECT * FROM contents WHERE content_id = :content_id"
        df = self.fetch_df(query, {'content_id': content_id})
        return df.iloc[0].to_dict() if not df.empty else None
    
    def get_all_contents(self):
        """Récupère tous les contenus."""
        df = self.fetch_df("SELECT * FROM contents")
        return df.to_dict('records')
    
    def get_contents_by_theme(self, theme):
        """Récupère les contenus d'un thème spécifique."""
        query = "SELECT * FROM contents WHERE theme = :theme"
        df = self.fetch_df(query, {'theme': theme})
        return df.to_dict('records')
    
    # ==================== INTERACTIONS ====================
    def get_user_interactions(self, user_id):
        """Récupère toutes les interactions d'un utilisateur."""
        query = """
            SELECT i.*, c.titre, c.theme, c.difficulte
            FROM interactions i
            JOIN contents c ON i.content_id = c.content_id
            WHERE i.user_id = :user_id
            ORDER BY i.timestamp DESC
        """
        df = self.fetch_df(query, {'user_id': user_id})
        return df.to_dict('records')
    
    def get_content_interactions(self, content_id):
        """Récupère toutes les interactions pour un contenu."""
        query = "SELECT * FROM interactions WHERE content_id = :content_id"
        df = self.fetch_df(query, {'content_id': content_id})
        return df.to_dict('records')
    
    def get_all_interactions(self):
        """Récupère toutes les interactions."""
        df = self.fetch_df("SELECT * FROM interactions")
        return df.to_dict('records')
    
    # ==================== STATISTIQUES ====================
    def get_user_stats(self, user_id):
        """Calcule les statistiques d'un utilisateur."""
        query = """
            SELECT 
                COUNT(*) as total_interactions,
                SUM(CASE WHEN reussite THEN 1 ELSE 0 END) as total_reussites,
                AVG(temps_passe) as avg_temps_passe,
                AVG(clics) as avg_clics,
                COUNT(DISTINCT content_id) as contenus_distincts
            FROM interactions
            WHERE user_id = :user_id
        """
        df = self.fetch_df(query, {'user_id': user_id})
        
        if df.empty:
            return {
                'total_interactions': 0,
                'total_reussites': 0,
                'taux_reussite': 0.0,
                'avg_temps_passe': 0.0,
                'avg_clics': 0.0,
                'contenus_distincts': 0
            }
        
        stats = df.iloc[0].to_dict()
        stats['taux_reussite'] = (
            stats['total_reussites'] / stats['total_interactions']
            if stats['total_interactions'] > 0 else 0.0
        )
        return stats
    
    def get_content_stats(self, content_id):
        """Calcule les statistiques d'un contenu."""
        query = """
            SELECT 
                COUNT(*) as total_interactions,
                SUM(CASE WHEN reussite THEN 1 ELSE 0 END) as total_reussites,
                AVG(temps_passe) as avg_temps_passe,
                AVG(clics) as avg_clics,
                COUNT(DISTINCT user_id) as utilisateurs_distincts
            FROM interactions
            WHERE content_id = :content_id
        """
        df = self.fetch_df(query, {'content_id': content_id})
        
        if df.empty:
            return None
        
        stats = df.iloc[0].to_dict()
        stats['taux_reussite'] = (
            stats['total_reussites'] / stats['total_interactions']
            if stats['total_interactions'] > 0 else 0.0
        )
        return stats
    
    # ==================== MATRIX OPERATIONS ====================
    def get_user_item_matrix(self):
        """
        Crée une matrice utilisateur-contenu pour le filtrage collaboratif.
        Retourne un DataFrame avec user_id en index, content_id en colonnes.
        """
        query = """
            SELECT 
                user_id, 
                content_id,
                CASE WHEN reussite THEN 1.0 ELSE 0.0 END as score
            FROM interactions
        """
        df = self.fetch_df(query)
        
        # Pivot: lignes = users, colonnes = contents, valeurs = moyenne des scores
        matrix = df.pivot_table(
            index='user_id',
            columns='content_id',
            values='score',
            aggfunc='mean',
            fill_value=0
        )
        return matrix
    
    def get_interaction_features(self):
        """
        Récupère les features pour le ML (recommandation/prédiction).
        Retourne un DataFrame avec toutes les colonnes nécessaires.
        """
        query = """
            SELECT 
                i.user_id,
                i.content_id,
                u.age,
                u.niveau,
                c.difficulte,
                c.theme,
                i.clics,
                i.temps_passe,
                i.reussite
            FROM interactions i
            JOIN users u ON i.user_id = u.user_id
            JOIN contents c ON i.content_id = c.content_id
        """
        return self.fetch_df(query)


def init_db():
    """
    Initialise la base de données en important les CSV générés.
    À exécuter une seule fois au premier lancement.
    """
    db = Database()
    data_dir = 'data'
    
    try:
        # Lire les CSV
        users_df = pd.read_csv(f'{data_dir}/users.csv')
        contents_df = pd.read_csv(f'{data_dir}/contents.csv')
        interactions_df = pd.read_csv(f'{data_dir}/interactions.csv')
        
        # Créer les tables et importer
        users_df.to_sql('users', db.engine, if_exists='replace', index=False)
        contents_df.to_sql('contents', db.engine, if_exists='replace', index=False)
        interactions_df.to_sql('interactions', db.engine, if_exists='replace', index=False)
        
        logger.info("✅ Base de données initialisée avec succès")
        logger.info(f"  - {len(users_df)} utilisateurs")
        logger.info(f"  - {len(contents_df)} contenus")
        logger.info(f"  - {len(interactions_df)} interactions")
        
    except FileNotFoundError as e:
        logger.error(f"❌ Fichiers CSV non trouvés: {e}")
        logger.error("Exécute d'abord le script de génération de données")
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'initialisation: {e}")


if __name__ == "__main__":
    # Test de connexion
    logging.basicConfig(level=logging.INFO)
    init_db()