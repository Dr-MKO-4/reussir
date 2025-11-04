import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Créer une instance Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête (ajouter le token JWT)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter un timestamp pour le cache
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse (gérer les erreurs et refresh token)
apiClient.interceptors.response.use(
  (response) => {
    // Réponse réussie, retourner les données
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Gérer l'erreur 401 (token expiré)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenter de rafraîchir le token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Pas de refresh token, rediriger vers login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Appeler l'endpoint de refresh
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );
        
        const { accessToken, idToken } = response.data;
        
        // Sauvegarder les nouveaux tokens
        localStorage.setItem('accessToken', accessToken);
        if (idToken) {
          localStorage.setItem('idToken', idToken);
        }
        
        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh token invalide, déconnecter l'utilisateur
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('user');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Gérer les autres erreurs
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Une erreur est survenue';
    
    console.error('API Error:', {
      status: error.response?.status,
      message: errorMessage,
      endpoint: error.config?.url
    });
    
    // Retourner une erreur structurée
    return Promise.reject({
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
      original: error
    });
  }
);

// Méthodes utilitaires
const api = {
  // GET request
  get: (url, config = {}) => {
    return apiClient.get(url, config);
  },
  
  // POST request
  post: (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
  },
  
  // PUT request
  put: (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
  },
  
  // PATCH request
  patch: (url, data = {}, config = {}) => {
    return apiClient.patch(url, data, config);
  },
  
  // DELETE request
  delete: (url, config = {}) => {
    return apiClient.delete(url, config);
  },
  
  // Upload de fichier
  upload: (url, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
  
  // Health check
  healthCheck: () => {
    return apiClient.get('/health');
  },
};

// Export de l'instance et des méthodes
export { apiClient, API_BASE_URL };
export default api;