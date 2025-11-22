import api from './api';

/**
 * Service pour gérer le catalogue de sujets/contenus éducatifs
 */
const catalogService = {
  // ==================== RECHERCHE & DÉCOUVERTE ====================
  searchSubjects: async (params: Record<string, any> = {}) => {
    const {
      query = '',
      concours = null,
      matiere = null,
      annee = null,
      difficulte = null,
      prix = null,
      duree = null,
      gratuit = null,
      page = 1,
      limit = 20,
      sort = 'pertinence',
    } = params;
    const queryParams = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit),
      sort,
    });
    if (concours) queryParams.append('concours', concours);
    if (matiere) queryParams.append('matiere', matiere);
    if (annee) queryParams.append('annee', annee);
    if (difficulte) queryParams.append('difficulte', difficulte);
    if (prix) queryParams.append('prix', prix);
    if (duree) queryParams.append('duree', duree);
    if (gratuit !== null) queryParams.append('gratuit', gratuit);
    return api.get(`/api/catalog/search?${queryParams}`);
  },
  getPopularSubjects: async (limit = 10) => api.get(`/api/catalog/popular?limit=${limit}`),
  getRecentSubjects: async (limit = 10) => api.get(`/api/catalog/recent?limit=${limit}`),
  getCategories: async () => api.get('/api/catalog/categories'),
  getFilters: async () => api.get('/api/catalog/filters'),
  getSubjectDetails: async (subjectId: number) => api.get(`/api/catalog/subjects/${subjectId}`),
  getSimilarSubjects: async (subjectId: number, limit = 5) => api.get(`/api/catalog/subjects/${subjectId}/similar?limit=${limit}`),
  getAIRecommendations: async (subjectId: number) => api.get(`/api/ai/recommendations/${subjectId}`),
  analyzeSubject: async (subjectId: number) => api.post(`/api/ai/analyze/${subjectId}`),
  predictSuccess: async (subjectId: number, userId: number) => api.get(`/api/ai/predict/${subjectId}/${userId}`),
  getFavorites: async (userId: number) => api.get(`/api/users/${userId}/favorites`),
  addToFavorites: async (userId: number, subjectId: number) => api.post(`/api/users/${userId}/favorites`, { subjectId }),
  removeFromFavorites: async (userId: number, subjectId: number) => api.delete(`/api/users/${userId}/favorites/${subjectId}`),
  getHistory: async (userId: number, params: { page?: number; limit?: number } = {}) => {
    const { page = 1, limit = 20 } = params;
    return api.get(`/api/users/${userId}/history?page=${page}&limit=${limit}`);
  },
  addToHistory: async (userId: number, subjectId: number, data: Record<string, any> = {}) => api.post(`/api/users/${userId}/history`, { subjectId, ...data }),
  clearHistory: async (userId: number) => api.delete(`/api/users/${userId}/history`),
  getUserStats: async (userId: number) => api.get(`/api/users/${userId}/stats`),
  getStudyHabits: async (userId: number) => api.get(`/api/ai/study-habits/${userId}`),
  getStudyPlan: async (userId: number) => api.get(`/api/ai/study-plan/${userId}`),
};

export default catalogService;
