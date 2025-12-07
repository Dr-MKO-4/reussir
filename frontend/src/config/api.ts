// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7023',
  FLASK_URL: import.meta.env.VITE_FLASK_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
};

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNIN: '/api/auth/signin',
    SIGNUP: '/api/auth/signup',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  
  // Subjects/Courses
  SUBJECTS: {
    BASE: '/api/subjects',
    BY_ID: (id: string) => `/api/subjects/${id}`,
    SEARCH: '/api/subjects/search',
    BY_CATEGORY: (category: string) => `/api/subjects/category/${category}`,
  },
  
  // Cart
  CART: {
    BASE: '/api/cart',
    ADD: '/api/cart/add',
    REMOVE: (id: string) => `/api/cart/remove/${id}`,
    CLEAR: '/api/cart/clear',
  },
  
  // Orders
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id: string) => `/api/orders/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    BASE: '/api/payments',
  },
  
  // User Profile
  USERS: {
    PROFILE: '/api/users/profile',
    STATISTICS: (id: string) => `/api/users/${id}/statistics`,
    BY_ID: (id: string) => `/api/users/${id}`,
  },
  
  // Favorites
  FAVORITES: {
    BASE: '/api/favorites',
    BY_ID: (id: string) => `/api/favorites/${id}`,
  },
  
  // History
  HISTORY: {
    BASE: '/api/history',
    BY_TYPE: (type: string) => `/api/history/${type}`,
  },
  
  // AI (Flask)
  AI: {
    STUDY_PLAN: '/api/ai/study-plan',
    PREDICT_SUCCESS: '/api/ai/predict-success',
    RECOMMENDATIONS: (id: string) => `/api/ai/recommendations/${id}`,
    CHAT: '/api/ai/chat',
  },
  
  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
    SUBJECTS: '/api/admin/subjects',
    ORDERS: '/api/admin/orders',
    ANALYTICS: '/api/admin/analytics',
  },
};

export default API_CONFIG;