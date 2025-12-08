// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://localhost:7023',
  FLASK_URL: import.meta.env.VITE_FLASK_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
};

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  
  // Subjects/Courses
  SUBJECTS: {
    BASE: '/subjects',
    BY_ID: (id: string) => `/subjects/${id}`,
    SEARCH: '/subjects/search',
    BY_CATEGORY: (category: string) => `/subjects/category/${category}`,
  },
  
  // Cart
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    REMOVE: (id: string) => `/cart/remove/${id}`,
    CLEAR: '/cart/clear',
  },
  
  // Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
  },
  
  // Payments
  PAYMENTS: {
    BASE: '/payments',
  },
  
  // User Profile
  USERS: {
    PROFILE: '/users/profile',
    STATISTICS: (id: string) => `/users/${id}/statistics`,
    BY_ID: (id: string) => `/users/${id}`,
  },
  
  // Favorites
  FAVORITES: {
    BASE: '/favorites',
    BY_ID: (id: string) => `/favorites/${id}`,
  },
  
  // History
  HISTORY: {
    BASE: '/history',
    BY_TYPE: (type: string) => `/history/${type}`,
  },
  
  // AI (Flask)
  AI: {
    STUDY_PLAN: '/ai/study-plan',
    PREDICT_SUCCESS: '/ai/predict-success',
    RECOMMENDATIONS: (id: string) => `/ai/recommendations/${id}`,
    CHAT: '/ai/chat',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    SUBJECTS: '/admin/subjects',
    ORDERS: '/admin/orders',
    ANALYTICS: '/admin/analytics',
  },
};

export default API_CONFIG;