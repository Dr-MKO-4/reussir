// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  details?: any;
}

// Configuration de base d'Axios
const API_BASE_URL ='http://localhost:5000/api';

class ApiService {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string | null> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur de requête
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Si l'erreur est 401 et qu'on n'a pas encore essayé de rafraîchir le token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Si le refresh échoue, rediriger vers login
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Récupérer le token d'accès
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Récupérer le token de rafraîchissement
  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Supprimer les tokens
  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Rafraîchir le token d'accès
  private async refreshAccessToken(): Promise<string | null> {
    // Éviter les appels multiples simultanés
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    this.refreshTokenPromise = this.performTokenRefresh(refreshToken);
    
    try {
      const newToken = await this.refreshTokenPromise;
      return newToken;
    } finally {
      this.refreshTokenPromise = null;
    }
  }

  // Effectuer le rafraîchissement du token
  private async performTokenRefresh(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/refresh`, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Gérer les erreurs
  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      const errorData = error.response.data as any;
      return {
        message: errorData.error?.message || errorData.message || 'Une erreur est survenue',
        code: errorData.error?.code || errorData.code,
        field: errorData.error?.field || errorData.field,
        details: errorData.error?.details || errorData.details,
      };
    }

    if (error.request) {
      return {
        message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
        code: 'NETWORK_ERROR',
      };
    }

    return {
      message: error.message || 'Une erreur inattendue est survenue',
      code: 'UNKNOWN_ERROR',
    };
  }

  // Méthodes HTTP génériques
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete(url, config);
  }

  // Méthodes utilitaires
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearAllTokens(): void {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Upload de fichiers
  async uploadFile<T = any>(
    url: string, 
    file: File, 
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  }

  // Download de fichiers
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Obtenir l'instance Axios brute si nécessaire
  getClient(): AxiosInstance {
    return this.client;
  }

  // Définir les headers par défaut
  setDefaultHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  // Supprimer un header par défaut
  removeDefaultHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }

  // Obtenir les informations du token (sans validation)
  getTokenPayload(): any {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      return null;
    }
  }

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    const payload = this.getTokenPayload();
    if (!payload?.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  // Obtenir le temps restant avant expiration (en secondes)
  getTokenExpirationTime(): number {
    const payload = this.getTokenPayload();
    if (!payload?.exp) return 0;

    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, payload.exp - now);
  }

  // Configurer la base URL
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  // Obtenir la base URL actuelle
  getBaseURL(): string | undefined {
    return this.client.defaults.baseURL;
  }

  // Configurer le timeout
  setTimeout(timeout: number): void {
    this.client.defaults.timeout = timeout;
  }

  // Créer une instance avec des paramètres spécifiques
  createInstance(config?: AxiosRequestConfig): AxiosInstance {
    return axios.create({
      ...this.client.defaults,
      ...config,
    });
  }
}

// Instance singleton
export const apiService = new ApiService();
export default apiService;