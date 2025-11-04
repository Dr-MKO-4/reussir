// src/types/auth.ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  AUTO = 'AUTO'
}

export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS_ONLY = 'FRIENDS_ONLY'
}

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profile?: UserProfile;
  preferences?: UserPreferences;
  profilePicture?: string;

}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  birthDate?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;

}

export interface UserPreferences {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showLastSeen: boolean;
  createdAt: string;
  updatedAt: string;
   theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLastSeen: boolean;
  };
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SignupResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  emailOrUsername: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  birthDate?: string;
  phoneNumber?: string;
}

export interface SessionInfo {
  id: string;
  userId: string;
  deviceInfo?: string;
  ipAddress?: string;
  userAgent?: string;
  isCurrent: boolean;
  lastActivity: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  userId?: string;
  event: string;
  severity: 'INFO' | 'WARN' | 'ERROR';
  ipAddress?: string;
  userAgent?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  failedLoginsToday: number;
  totalSessions: number;
  activeSessions: number;
}

export interface UserStats {

}
export interface User {
   id: string;
   email: string;
   username?: string;
   firstName: string;
   lastName: string;
   role: UserRole;
   isActive: boolean;
   isEmailVerified: boolean;
   twoFactorEnabled: boolean;
   avatar?: string;
   createdAt: string;
   updatedAt: string;
   lastLoginAt?: string;
   profile?: UserProfile;
   preferences?: UserPreferences;
   profilePicture?: string;
   jobTitle?: string;
   company?: string;
}



export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showLastSeen: boolean;
  };
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  dateOfBirth?: Date;
  phone?: string;
  jobTitle?: string;
  company?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export interface UserStats {
  userId: string;
  totalLogins: number;
  lastLoginAt: Date;
  accountCreatedAt: Date;
  isActive: boolean;
  failedLoginAttempts: number;
  lastFailedLoginAt?: Date;
  totalSessions: number;
  loginCount: number;
  profileCompleteness: number;
}

// Types pour les formulaires
export interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  website?: string;
  location?: string;
  dateOfBirth?: Date;
  phone?: string;
  profilePicture?: File;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Types pour les réponses API
export interface AuthResponse {
  success: boolean;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
    requiresEmailVerification?: boolean;
    shouldCompleteProfile?: boolean;
}

export interface UserResponse {
  success: boolean;
  user: User;
  message: string;
}

export interface UsersListResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Types pour la validation
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  field: string;
  isValid: boolean;
  error?: string;
}

// Types pour les filtres et recherche
export interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

export interface UserSortOptions {
  field: 'createdAt' | 'lastLoginAt' | 'email' | 'firstName' | 'lastName';
  direction: 'asc' | 'desc';
}

// Types pour les sessions
export interface UserSession {
  id: string;
  userId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
}

// Types pour les activités
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Types pour les notifications
export interface UserNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SECURITY = 'security',
  MARKETING = 'marketing'
}

export default User;