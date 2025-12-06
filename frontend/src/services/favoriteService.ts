/**
 * Service des favoris
 * Gestion des sujets favoris et des listes de souhaits
 */

import { Subject } from '@/types';
import { api } from './api';

// ==================== TYPES ====================

export interface FavoriteItem {
  subjectId: string;
  addedAt: Date;
  notes?: string;
}

export interface FavoriteList {
  id: string;
  name: string;
  description?: string;
  items: FavoriteItem[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SERVICE ====================

class FavoriteService {
  private STORAGE_KEY = 'user_favorites';
  private LISTS_STORAGE_KEY = 'user_favorite_lists';

  /**
   * Ajouter un sujet aux favoris
   * @param subjectId - ID du sujet
   * @param userId - ID utilisateur
   */
  async addFavorite(subjectId: string, userId?: string): Promise<boolean> {
    try {
      if (!subjectId) {
        throw new Error('ID sujet invalide');
      }

      // Si utilisateur connecté: sauvegarder en base de données
      if (userId) {
        await api.post(`/favorites`, { subjectId, userId });
      }

      // Sauvegarder aussi localement (cache)
      this.addToLocalFavorites(subjectId);
      return true;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      // Garder le favori local même si l'API échoue
      this.addToLocalFavorites(subjectId);
      return false;
    }
  }

  /**
   * Retirer un sujet des favoris
   * @param subjectId - ID du sujet
   * @param userId - ID utilisateur
   */
  async removeFavorite(subjectId: string, userId?: string): Promise<boolean> {
    try {
      if (!subjectId) {
        throw new Error('ID sujet invalide');
      }

      // Si utilisateur connecté: supprimer de la base de données
      if (userId) {
        await api.delete(`/favorites/${subjectId}`, { data: { userId } });
      }

      // Supprimer aussi du stockage local
      this.removeFromLocalFavorites(subjectId);
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression des favoris:', error);
      // Garder la suppression locale même si l'API échoue
      this.removeFromLocalFavorites(subjectId);
      return false;
    }
  }

  /**
   * Obtenir la liste des favoris
   * @param userId - ID utilisateur (optionnel)
   */
  async getFavorites(userId?: string): Promise<FavoriteItem[]> {
    try {
      // Si utilisateur connecté: récupérer depuis la base de données
      if (userId) {
        const response = await api.get(`/favorites`, {
          params: { userId },
        });
        return response.data.favorites || [];
      }

      // Sinon: retourner les favoris locaux
      return this.getLocalFavorites();
    } catch (error: any) {
      console.error('Erreur lors de la récupération des favoris:', error);
      // Fallback sur le stockage local
      return this.getLocalFavorites();
    }
  }

  /**
   * Vérifier si un sujet est dans les favoris
   * @param subjectId - ID du sujet
   * @param userId - ID utilisateur (optionnel)
   */
  async isFavorite(subjectId: string, userId?: string): Promise<boolean> {
    try {
      if (!subjectId) {
        return false;
      }

      // Si utilisateur connecté: vérifier en base de données
      if (userId) {
        const response = await api.get(`/favorites/${subjectId}`, {
          params: { userId },
        });
        return response.data.isFavorite || false;
      }

      // Sinon: vérifier le stockage local
      return this.isLocalFavorite(subjectId);
    } catch (error: any) {
      console.error('Erreur lors de la vérification des favoris:', error);
      // Fallback sur le stockage local
      return this.isLocalFavorite(subjectId);
    }
  }

  /**
   * Synchroniser les favoris locaux avec le serveur
   * @param userId - ID utilisateur
   */
  async syncFavorites(userId: string): Promise<FavoriteItem[]> {
    try {
      if (!userId) {
        throw new Error('ID utilisateur manquant');
      }

      // Obtenir les favoris locaux
      const localFavorites = this.getLocalFavorites();

      // Si pas de favoris locaux, retourner les favoris serveur
      if (localFavorites.length === 0) {
        return await this.getFavorites(userId);
      }

      // Synchroniser avec le serveur
      const response = await api.post(`/favorites/sync`, {
        userId,
        localFavorites: localFavorites.map((f) => f.subjectId),
      });

      // Mettre à jour le stockage local avec les données du serveur
      if (response.data.favorites) {
        this.setLocalFavorites(response.data.favorites);
        return response.data.favorites;
      }

      return localFavorites;
    } catch (error: any) {
      console.error('Erreur lors de la synchronisation des favoris:', error);
      // Garder les favoris locaux en cas d'erreur
      return this.getLocalFavorites();
    }
  }

  /**
   * Créer une liste de favoris personnalisée
   * @param userId - ID utilisateur
   * @param list - Données de la liste
   */
  async createFavoriteList(
    userId: string,
    list: Omit<FavoriteList, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FavoriteList | null> {
    try {
      const response = await api.post(`/favorites/lists`, {
        userId,
        ...list,
      });

      return response.data.list || null;
    } catch (error: any) {
      console.error('Erreur lors de la création de la liste:', error);
      return null;
    }
  }

  /**
   * Obtenir les listes de favoris
   * @param userId - ID utilisateur
   */
  async getFavoriteLists(userId: string): Promise<FavoriteList[]> {
    try {
      const response = await api.get(`/favorites/lists`, {
        params: { userId },
      });

      return response.data.lists || [];
    } catch (error: any) {
      console.error('Erreur lors de la récupération des listes:', error);
      return [];
    }
  }

  /**
   * Ajouter un sujet à une liste de favoris
   * @param userId - ID utilisateur
   * @param listId - ID de la liste
   * @param subjectId - ID du sujet
   */
  async addToFavoriteList(userId: string, listId: string, subjectId: string): Promise<boolean> {
    try {
      await api.post(`/favorites/lists/${listId}/items`, {
        userId,
        subjectId,
      });

      return true;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout à la liste:', error);
      return false;
    }
  }

  /**
   * Retirer un sujet d'une liste de favoris
   * @param userId - ID utilisateur
   * @param listId - ID de la liste
   * @param subjectId - ID du sujet
   */
  async removeFromFavoriteList(userId: string, listId: string, subjectId: string): Promise<boolean> {
    try {
      await api.delete(`/favorites/lists/${listId}/items/${subjectId}`, {
        data: { userId },
      });

      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la liste:', error);
      return false;
    }
  }

  /**
   * Supprimer une liste de favoris
   * @param userId - ID utilisateur
   * @param listId - ID de la liste
   */
  async deleteFavoriteList(userId: string, listId: string): Promise<boolean> {
    try {
      await api.delete(`/favorites/lists/${listId}`, {
        data: { userId },
      });

      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la liste:', error);
      return false;
    }
  }

  /**
   * Partager une liste de favoris
   * @param listId - ID de la liste
   * @param isPublic - Rendre publique ou privée
   */
  async shareFavoriteList(listId: string, isPublic: boolean): Promise<{ shareUrl?: string } | null> {
    try {
      const response = await api.patch(`/favorites/lists/${listId}`, {
        isPublic,
      });

      return { shareUrl: response.data.shareUrl };
    } catch (error: any) {
      console.error('Erreur lors du partage:', error);
      return null;
    }
  }

  /**
   * Obtenir les statistiques des favoris
   * @param userId - ID utilisateur
   */
  async getFavoriteStats(userId: string): Promise<{
    totalFavorites: number;
    totalLists: number;
    averageListSize: number;
  } | null> {
    try {
      const response = await api.get(`/favorites/stats`, {
        params: { userId },
      });

      return response.data.stats || null;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return null;
    }
  }

  // ==================== MÉTHODES LOCALES ====================

  private addToLocalFavorites(subjectId: string): void {
    const favorites = this.getLocalFavorites();

    // Vérifier si le sujet est déjà en favoris
    if (!favorites.some((f) => f.subjectId === subjectId)) {
      favorites.push({
        subjectId,
        addedAt: new Date(),
      });

      this.setLocalFavorites(favorites);
    }
  }

  private removeFromLocalFavorites(subjectId: string): void {
    const favorites = this.getLocalFavorites().filter((f) => f.subjectId !== subjectId);
    this.setLocalFavorites(favorites);
  }

  private getLocalFavorites(): FavoriteItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur lors de la lecture des favoris locaux:', error);
      return [];
    }
  }

  private isLocalFavorite(subjectId: string): boolean {
    return this.getLocalFavorites().some((f) => f.subjectId === subjectId);
  }

  private setLocalFavorites(favorites: FavoriteItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de l\'écriture des favoris locaux:', error);
    }
  }
}

// ==================== EXPORT ====================

export default new FavoriteService();
