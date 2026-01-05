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
  phone: string;
  password: string;
  confirmPassword: string;
  role?: 'student' | 'parent' | 'teacher';
  termsAccepted?: boolean;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
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
      const response = await api.post<AuthResponse>('/auth/signin', {
        username: credentials.email,
        password: credentials.password,
      });
      
      // Utiliser localStorage ou sessionStorage selon rememberMe
      this.saveAuthData(response, credentials.rememberMe === true);
      
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
      const response = await api.post<any>('/auth/signup', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role || 'student',
      });
      
      // Transformer la réponse signup en AuthResponse
      const authResponse: AuthResponse = {
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user || {
          id: 0,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          role: data.role || 'student'
        }
      };
      
      // Pour l'inscription, utiliser sessionStorage (pas de persist par défaut)
      this.saveAuthData(authResponse, false);
      
      return authResponse;
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
      await api.post('/auth/logout', {
        refreshToken: this.getRefreshToken(),
      });
    } catch (error) {
      console.error('[Auth Service] Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken(): Promise<AuthTokens> {
    try {
      const refreshToken = localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      const response = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
      this.saveAuthData(response, true); // Sauvegarde les nouveaux tokens
      return response;
    } catch (error) {
      console.error('[Auth Service] Erreur lors du rafraîchissement du token:', error);
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
      await api.post('/auth/reset-password', {
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
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
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    } catch (error) {
      console.error('[Auth Service] Change password error:', error);
      throw error;
    }
  }

  /**
   * Vérifier l'email avec code
   */
  async verifyEmail(data: VerifyEmailData): Promise<void> {
    try {
      await api.post('/auth/verify-email', {
        email: data.email,
        code: data.code,
      });
      
      const user = this.getCurrentUser();
      if (user) {
        user.isEmailVerified = true;
        this.saveUser(user);
      }
      
      // Nettoyer les tokens après vérification (forcer un nouveau login)
      [localStorage, sessionStorage].forEach(storage => {
        storage.removeItem(this.STORAGE_KEYS.TOKEN);
        storage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
      });
    } catch (error) {
      console.error('[Auth Service] Verify email error:', error);
      throw error;
    }
  }

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await api.post('/auth/resend-verification', { email });
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
      const user = await api.get<User>('/users/profile');
      
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
    // Vérifier d'abord localStorage (persistent)
    let token = localStorage.getItem(this.STORAGE_KEYS.TOKEN);
    if (token && token !== 'undefined') return token;
    
    // Puis sessionStorage (session only)
    token = sessionStorage.getItem(this.STORAGE_KEYS.TOKEN);
    return (token && token !== 'undefined') ? token : null;
  }

  /**
   * Récupérer le refresh token
   */
  getRefreshToken(): string | null {
    // Vérifier d'abord localStorage (persistent)
    let refreshToken = localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken && refreshToken !== 'undefined') return refreshToken;
    
    // Puis sessionStorage (session only)
    refreshToken = sessionStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
    return (refreshToken && refreshToken !== 'undefined') ? refreshToken : null;
  }

  /**
   * Récupérer l'utilisateur actuel depuis le storage
   */
  getCurrentUser(): User | null {
    try {
      // Vérifier d'abord localStorage (persistent)
      let userJson = localStorage.getItem(this.STORAGE_KEYS.USER);
      if (!userJson) {
        // Puis sessionStorage (session only)
        userJson = sessionStorage.getItem(this.STORAGE_KEYS.USER);
      }
      
      // Éviter de parser "undefined" ou null
      if (!userJson || userJson === 'undefined') {
        return null;
      }
      
      return JSON.parse(userJson);
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
   * @param authResponse Les données d'auth
   * @param persist Si true, utilise localStorage (persiste). Si false, utilise sessionStorage (session seulement)
   */
  private saveAuthData(authResponse: AuthResponse, persist: boolean = false): void {
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem(this.STORAGE_KEYS.TOKEN, authResponse.token);
    storage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
    this.saveUser(authResponse.user, persist);
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
   * @param user L'utilisateur
   * @param persist Si true, utilise localStorage. Si false, utilise sessionStorage
   */
  private saveUser(user: User, persist: boolean = false): void {
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /**
   * Nettoyer toutes les données d'authentification
   */
  private clearAuthData(): void {
    // Nettoyer localStorage et sessionStorage
    [localStorage, sessionStorage].forEach(storage => {
      storage.removeItem(this.STORAGE_KEYS.TOKEN);
      storage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
      storage.removeItem(this.STORAGE_KEYS.USER);
    });
  }

  /**
   * Initialiser le service (à appeler au démarrage de l'app)
   */
  async initialize(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const user = await this.getCurrentUserProfile();
      return user;
    } catch (error) {
      this.clearAuthData();
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;