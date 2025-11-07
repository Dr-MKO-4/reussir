import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * Configuration de base de l'API
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Instance Axios configurée
 */
const apiClient: AxiosInstance = axios.create(API_CONFIG);

/**
 * Request Interceptor - Ajoute le token d'authentification
 */
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log des requêtes en développement
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Gestion des erreurs et refresh token
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log des réponses en développement
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Gestion de l'erreur 401 (Non autorisé)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;

          // Sauvegarder les nouveaux tokens
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Réessayer la requête originale avec le nouveau token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Rediriger vers la page de connexion
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Gestion des autres erreurs
    const errorMessage = getErrorMessage(error);
    
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

/**
 * Extraire un message d'erreur lisible
 */
function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    // Erreur de réponse du serveur
    const data = error.response.data as any;
    return data?.message || data?.error || `Erreur ${error.response.status}`;
  } else if (error.request) {
    // Pas de réponse reçue
    return 'Aucune réponse du serveur. Vérifiez votre connexion.';
  } else {
    // Erreur lors de la configuration de la requête
    return error.message || 'Erreur inconnue';
  }
}

/**
 * Interface pour les réponses API paginées
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interface pour les réponses API standard
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Interface pour les erreurs API
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Classe de service API avec méthodes utilitaires
 */
class ApiService {
  /**
   * GET Request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * POST Request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * PUT Request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * PATCH Request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * DELETE Request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Upload de fichier avec progression
   */
  async upload<T>(
    url: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });

      return response.data.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Téléchargement de fichier
   */
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      // Créer un lien de téléchargement
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: getErrorMessage(error),
      status: error.response?.status,
      code: (error.response?.data as any)?.code,
      details: error.response?.data,
    };

    return apiError;
  }

  /**
   * Vérifier si une erreur est une erreur réseau
   */
  isNetworkError(error: any): boolean {
    return error.message === 'Network Error' || !error.response;
  }

  /**
   * Vérifier si une erreur est une erreur d'authentification
   */
  isAuthError(error: any): boolean {
    return error.status === 401 || error.status === 403;
  }

  /**
   * Vérifier si une erreur est une erreur de validation
   */
  isValidationError(error: any): boolean {
    return error.status === 400 || error.status === 422;
  }
}

// Exporter l'instance singleton
export const api = new ApiService();

// Exporter l'instance axios brute pour les cas spéciaux
export { apiClient };

// Exporter les types axios pour utilisation externe
export type { AxiosRequestConfig, AxiosResponse, AxiosError };

export default api;