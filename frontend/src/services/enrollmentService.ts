import { api } from './api';

/**
 * Service pour gérer les inscriptions aux cours
 * Gère l'inscription et la gestion des cours pour les utilisateurs
 */
const enrollmentService = {
  /**
   * Inscrire un utilisateur à un cours
   * @param userId - ID de l'utilisateur
   * @param subjectId - ID du cours/sujet
   */
  enrollUser: async (userId: number, subjectId: number) => {
    return api.post('/api/enrollments', {
      userId,
      subjectId,
    });
  },

  /**
   * Obtenir les inscriptions d'un utilisateur
   * @param userId - ID de l'utilisateur
   */
  getUserEnrollments: async (userId: number) => {
    return api.get(`/api/enrollments/user/${userId}`);
  },

  /**
   * Vérifier si un utilisateur est inscrit à un cours
   * @param userId - ID de l'utilisateur
   * @param subjectId - ID du cours/sujet
   */
  isEnrolled: async (userId: number, subjectId: number) => {
    try {
      const response = await api.get(`/api/enrollments/${userId}/${subjectId}`);
      return response.data ? true : false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Obtenir les détails d'une inscription
   * @param userId - ID de l'utilisateur
   * @param subjectId - ID du cours/sujet
   */
  getEnrollment: async (userId: number, subjectId: number) => {
    return api.get(`/api/enrollments/${userId}/${subjectId}`);
  },
};

export default enrollmentService;
