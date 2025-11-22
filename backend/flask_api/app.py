#!/usr/bin/env python3
"""
Service IA Flask - Phase 1 MVP
Endpoints: NLP Analysis + Recommandations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

from database import Database, init_db
from models.nlp_analyzer import NLPAnalyzer
from models.recommender import Recommender

# Configuration
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialisation
db = Database()
nlp_analyzer = NLPAnalyzer()
recommender = Recommender(db)

# ==================== HEALTH CHECK ====================
@app.route('/health', methods=['GET'])
def health():
    """Vérifie que le service est opérationnel."""
    return jsonify({
        'status': 'healthy',
        'service': 'IA Educational Service',
        'version': '1.0.0-mvp'
    })

# ==================== NLP ANALYSIS ====================
@app.route('/api/v1/analyze_content', methods=['POST'])
def analyze_content():
    """
    Analyse un contenu éducatif (NLP).
    Body: {"content_id": 1} ou {"text": "...", "title": "..."}
    """
    try:
        data = request.get_json()
        
        # Deux modes : analyse par ID ou par texte direct
        if 'content_id' in data:
            content = db.get_content_by_id(data['content_id'])
            if not content:
                return jsonify({'error': 'Content not found'}), 404
            
            text = f"{content['titre']}. {content['description']}"
            metadata = {'theme': content['theme']}
        
        elif 'text' in data:
            text = data['text']
            metadata = {'title': data.get('title', 'Untitled')}
        
        else:
            return jsonify({'error': 'Missing content_id or text'}), 400
        
        # Analyse NLP
        result = nlp_analyzer.analyze(text, metadata)
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error in analyze_content: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== RECOMMANDATIONS ====================
@app.route('/api/v1/recommendations', methods=['GET'])
def get_recommendations():
    """
    Recommande des contenus pour un utilisateur.
    Query params: user_id (requis), limit (optionnel, défaut=10)
    """
    try:
        user_id = request.args.get('user_id', type=int)
        limit = request.args.get('limit', default=10, type=int)
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Vérifier que l'utilisateur existe
        user = db.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Générer recommandations
        recommendations = recommender.recommend(user_id, limit=limit)
        
        return jsonify({
            'user_id': user_id,
            'recommendations': recommendations,
            'count': len(recommendations)
        }), 200
    
    except Exception as e:
        logger.error(f"Error in recommendations: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== RECOMMANDATIONS AVANCÉES ====================
@app.route('/api/v1/recommendations/personalized', methods=['POST'])
def get_personalized_recommendations():
    """
    Recommandations personnalisées avec filtres.
    Body: {
        "user_id": 1,
        "theme": "mathématiques" (optionnel),
        "difficulty_range": [0.3, 0.7] (optionnel),
        "limit": 10
    }
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        theme = data.get('theme')
        difficulty_range = data.get('difficulty_range')
        limit = data.get('limit', 10)
        
        recommendations = recommender.recommend_filtered(
            user_id=user_id,
            theme=theme,
            difficulty_range=difficulty_range,
            limit=limit
        )
        
        return jsonify({
            'user_id': user_id,
            'filters': {
                'theme': theme,
                'difficulty_range': difficulty_range
            },
            'recommendations': recommendations,
            'count': len(recommendations)
        }), 200
    
    except Exception as e:
        logger.error(f"Error in personalized recommendations: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== STATISTIQUES UTILISATEUR ====================
@app.route('/api/v1/users/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    """Récupère les statistiques d'un utilisateur."""
    try:
        user = db.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        stats = db.get_user_stats(user_id)
        
        return jsonify({
            'user_id': user_id,
            'profile': {
                'nom': user['nom'],
                'prenom': user['prenom'],
                'age': user['age'],
                'niveau': user['niveau'],
                'objectif': user['objectif']
            },
            'statistics': stats
        }), 200
    
    except Exception as e:
        logger.error(f"Error in user stats: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== BATCH ANALYSIS ====================
@app.route('/api/v1/analyze_all_contents', methods=['POST'])
def analyze_all_contents():
    """
    Analyse tous les contenus de la DB (NLP batch).
    Utile pour pré-calculer les embeddings/tags.
    """
    try:
        contents = db.get_all_contents()
        results = []
        
        for content in contents:
            text = f"{content['titre']}. {content['description']}"
            metadata = {'theme': content['theme']}
            
            analysis = nlp_analyzer.analyze(text, metadata)
            results.append({
                'content_id': content['content_id'],
                'analysis': analysis
            })
        
        return jsonify({
            'total_analyzed': len(results),
            'results': results
        }), 200
    
    except Exception as e:
        logger.error(f"Error in batch analysis: {e}")
        return jsonify({'error': str(e)}), 500

# ==================== MAIN ====================
if __name__ == '__main__':
    # Initialiser la DB au démarrage
    logger.info("Initialisation de la base de données...")
    init_db()
    
    # Charger le modèle NLP
    logger.info("Chargement du modèle NLP...")
    nlp_analyzer.load_model()
    
    # Démarrer le serveur
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    logger.info(f"🚀 Serveur Flask démarré sur http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)