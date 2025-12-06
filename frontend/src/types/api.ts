// src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    field?: string;
    details?: any;
  };
  timestamp: string;
  path: string;
  statusCode: number;
  requestId?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiListResponse<T> extends ApiResponse<PaginatedResponse<T>> {}

// Types pour les paramètres de requête
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Types pour les réponses de santé de l'API
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime?: number;
  };
  services: {
    [serviceName: string]: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      lastCheck: string;
    };
  };
}

// Types pour les statistiques
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  loginAttemptsToday: number;
  failedLoginsToday: number;
  blockedUsers: number;
}

export interface UserStats {
  totalSessions: number;
  lastLoginAt?: string;
  loginCount: number;
  failedLoginAttempts: number;
  accountCreatedAt: string;
  profileCompleteness: number;
}

// Types pour l'audit et les logs
export interface AuditLog {
  id: string;
  userId?: string;
  username?: string;
  action: string;
  entity?: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Types pour les fichiers uploadés
export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadId: string;
}

export interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  folder?: string;
}

// Types pour les notifications système
export interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Types pour la configuration système
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  isPublic: boolean;
}

// Types pour les métriques et analytics
export interface Analytics {
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    [key: string]: {
      current: number;
      previous: number;
      change: number;
      changePercent: number;
    };
  };
  charts: {
    [chartName: string]: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
      }[];
    };
  };
}