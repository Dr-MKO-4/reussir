import { api } from './api';

/**
 * Types pour l'authentification
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: 'student' | 'parent' | 'teacher';
  termsAccepted: boolean;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface GoogleAuthData {
  code: string;
}

/**
 * Service d'authentification
 */
class AuthService {
  private readonly STORAGE_KEYS = {
    TOKEN: 'authToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
  };

  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Sauvegarder les tokens et l'utilisateur
      this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('[Auth Service] Login error:', error);
      throw error;
    }
  }

  /**
   * Inscription utilisateur
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', data);
      
      // Sauvegarder les tokens et l'utilisateur
      this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('[Auth Service] Signup error:', error);
      throw error;
    }
  }

  /**
   * Connexion avec Google
   */
  async googleLogin(data: GoogleAuthData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/google', data);
      
      // Sauvegarder les tokens et l'utilisateur
      this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('[Auth Service] Google login error:', error);
      throw error;
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout(): Promise<void> {
    try {
      // Appeler l'API pour invalider le refresh token
      await api.post('/auth/logout', {
        refreshToken: this.getRefreshToken(),
      });
    } catch (error) {
      console.error('[Auth Service] Logout error:', error);
      // Continuer même si l'API échoue
    } finally {
      // Nettoyer le storage local
      this.clearAuthData();
    }
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(): Promise<AuthTokens> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<AuthTokens>('/auth/refresh', {
        refreshToken,
      });

      // Sauvegarder les nouveaux tokens
      this.saveTokens(response);

      return response;
    } catch (error) {
      console.error('[Auth Service] Refresh token error:', error);
      // Si le refresh échoue, déconnecter
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Demander un reset de mot de passe
   */
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      await api.post('/auth/forgot-password', data);
    } catch (error) {
      console.error('[Auth Service] Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error) {
      console.error('[Auth Service] Reset password error:', error);
      throw error;
    }
  }

  /**
   * Changer le mot de passe (utilisateur connecté)
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await api.post('/auth/change-password', data);
    } catch (error) {
      console.error('[Auth Service] Change password error:', error);
      throw error;
    }
  }

  /**
   * Vérifier l'email
   */
  async verifyEmail(data: VerifyEmailData): Promise<void> {
    try {
      await api.post('/auth/verify-email', data);
      
      // Mettre à jour le statut de vérification dans le user stocké
      const user = this.getCurrentUser();
      if (user) {
        user.isEmailVerified = true;
        this.saveUser(user);
      }
    } catch (error) {
      console.error('[Auth Service] Verify email error:', error);
      throw error;
    }
  }

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(): Promise<void> {
    try {
      await api.post('/auth/resend-verification');
    } catch (error) {
      console.error('[Auth Service] Resend verification error:', error);
      throw error;
    }
  }

  /**
   * Récupérer le profil utilisateur actuel
   */
  async getCurrentUserProfile(): Promise<User> {
    try {
      const user = await api.get<User>('/auth/me');
      
      // Mettre à jour le user stocké
      this.saveUser(user);
      
      return user;
    } catch (error) {
      console.error('[Auth Service] Get current user error:', error);
      throw error;
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  /**
   * Vérifier si l'email est vérifié
   */
  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return user?.isEmailVerified || false;
  }

  /**
   * Récupérer le token d'accès
   */
  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  /**
   * Récupérer le refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Récupérer l'utilisateur actuel depuis le storage
   */
  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem(this.STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('[Auth Service] Error parsing user from storage:', error);
      return null;
    }
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  hasRole(role: User['role']): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Vérifier si l'utilisateur a l'un des rôles
   */
  hasAnyRole(roles: User['role'][]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Sauvegarder les données d'authentification
   */
  private saveAuthData(authResponse: AuthResponse): void {
    this.saveTokens(authResponse.tokens);
    this.saveUser(authResponse.user);
  }

  /**
   * Sauvegarder les tokens
   */
  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, tokens.token);
    localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  /**
   * Sauvegarder l'utilisateur
   */
  private saveUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Nettoyer toutes les données d'authentification
   */
  private clearAuthData(): void {
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.USER);
  }

  /**
   * Initialiser le service (à appeler au démarrage de l'app)
   */
  async initialize(): Promise<User | null> {
    try {
      // Vérifier si on a un token
      if (!this.isAuthenticated()) {
        return null;
      }

      // Récupérer le profil utilisateur pour vérifier que le token est valide
      const user = await this.getCurrentUserProfile();
      return user;
    } catch (error) {
      // Si l'initialisation échoue, nettoyer le storage
      this.clearAuthData();
      return null;
    }
  }
}

// Exporter l'instance singleton
export const authService = new AuthService();

export default authService;