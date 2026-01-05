import { api } from './api';

/**
 * Service pour gérer le catalogue de sujets/contenus éducatifs
 */
const catalogService = {
  // ==================== RECHERCHE & DÉCOUVERTE ====================
  
  /**
   * Rechercher des sujets avec filtres
   */
  searchSubjects: async (params: Record<string, any> = {}) => {
    const {
      query = '',
      category = null,
      difficulty = null,
      price = null,
      isFree = null,
      page = 1,
      limit = 20,
      sort = 'relevance',
    } = params;

    const queryParams = new URLSearchParams();
    if (query) queryParams.append('q', query);
    if (category) queryParams.append('category', category);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (price) queryParams.append('price', price);
    if (isFree !== null) queryParams.append('isFree', String(isFree));
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    queryParams.append('sort', sort);

    return api.get(`/subjects/search?${queryParams}`);
  },

  /**
   * Obtenir tous les sujets
   */
  getAllSubjects: async (page = 1, limit = 20) => {
    return api.get(`/subjects?page=${page}&limit=${limit}`);
  },

  /**
   * Obtenir les détails d'un sujet
   */
  getSubjectDetails: async (subjectId: string) => {
    return api.get(`/subjects/${subjectId}`);
  },

  /**
   * Obtenir les sujets par catégorie
   */
  getSubjectsByCategory: async (categoryName: string, page = 1, limit = 20) => {
    return api.get(`/subjects/category/${categoryName}?page=${page}&limit=${limit}`);
  },

  /**
   * Obtenir les sujets populaires
   */
  getPopularSubjects: async (limit = 10) => {
    return api.get(`/subjects?sort=popular&limit=${limit}`);
  },

  /**
   * Obtenir les sujets récents
   */
  getRecentSubjects: async (limit = 10) => {
    return api.get(`/subjects?sort=recent&limit=${limit}`);
  },

  /**
   * Obtenir les catégories disponibles
   */
  getCategories: async () => {
    return api.get('/subjects/categories');
  },

  /**
   * Obtenir les filtres disponibles
   */
  getFilters: async () => {
    return api.get('/subjects/filters');
  },

  /**
   * Obtenir les sujets similaires
   */
  getSimilarSubjects: async (subjectId: string, limit = 5) => {
    return api.get(`/subjects/${subjectId}/similar?limit=${limit}`);
  },

  // ==================== ADMIN - GESTION DES SUJETS ====================

  /**
   * Créer un nouveau sujet (Admin)
   */
  createSubject: async (subjectData: Record<string, any>) => {
    return api.post('/subjects', subjectData);
  },

  /**
   * Modifier un sujet (Admin)
   */
  updateSubject: async (subjectId: string, subjectData: Record<string, any>) => {
    return api.put(`/subjects/${subjectId}`, subjectData);
  },

  /**
   * Supprimer un sujet (Admin)
   */
  deleteSubject: async (subjectId: string) => {
    return api.delete(`/subjects/${subjectId}`);
  },

  // ==================== FAVORIS ====================

  /**
   * Obtenir les favoris de l'utilisateur
   */
  getFavorites: async () => {
    return api.get('/favorites');
  },

  /**
   * Ajouter un sujet aux favoris
   */
  addToFavorites: async (subjectId: string) => {
    return api.post(`/favorites/${subjectId}`);
  },

  /**
   * Retirer un sujet des favoris
   */
  removeFromFavorites: async (subjectId: string) => {
    return api.delete(`/favorites/${subjectId}`);
  },

  // ==================== HISTORIQUE ====================

  /**
   * Obtenir l'historique de l'utilisateur
   */
  getHistory: async (params: { page?: number; limit?: number; type?: string } = {}) => {
    const { page = 1, limit = 20, type } = params;
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (type) queryParams.append('type', type);
    
    return api.get(`/history?${queryParams}`);
  },

  /**
   * Obtenir l'historique par type
   */
  getHistoryByType: async (type: string) => {
    return api.get(`/history/${type}`);
  },

  /**
   * Ajouter une entrée à l'historique
   */
  addToHistory: async (historyData: Record<string, any>) => {
    return api.post('/history', historyData);
  },

  /**
   * Effacer l'historique
   */
  clearHistory: async () => {
    return api.delete('/history');
  },

  // ==================== STATISTIQUES UTILISATEUR ====================

  /**
   * Obtenir les statistiques de l'utilisateur
   */
  getUserStats: async (userId?: string) => {
    const url = userId ? `/api/users/${userId}/statistics` : '/api/users/profile/statistics';
    return api.get(url);
  },

  // ==================== IA & RECOMMANDATIONS ====================

  /**
   * Obtenir les recommandations IA
   */
  getAIRecommendations: async (subjectId?: string) => {
    const url = subjectId 
      ? `/api/ai/recommendations/${subjectId}` 
      : '/api/ai/recommendations';
    return api.get(url);
  },

  /**
   * Analyser un sujet avec l'IA
   */
  analyzeSubject: async (subjectId: string) => {
    return api.post(`/api/ai/analyze/${subjectId}`);
  },

  /**
   * Prédire le succès pour un sujet
   */
  predictSuccess: async (subjectId: string) => {
    return api.post('/ai/predict-success', { subjectId });
  },

  /**
   * Générer un plan d'étude
   */
  generateStudyPlan: async (planData: Record<string, any>) => {
    return api.post('/ai/study-plan', planData);
  },

  /**
   * Chat avec l'IA
   */
  chatWithAI: async (message: string, context?: Record<string, any>) => {
    return api.post('/ai/chat', { message, context });
  },

  /**
   * Obtenir les habitudes d'étude
   */
  getStudyHabits: async () => {
    return api.get('/ai/study-habits');
  },
};

export default catalogService;

// Export utilitaire utilisé par CatalogPage
export const fetchCatalogItems = async (page = 1, limit = 50) => {
  // Utilise explicitement l'endpoint /api/subjects (controllers utilisent le préfixe /api)
  return catalogService.getAllSubjects(page, limit);
};