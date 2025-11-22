import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService, User, LoginCredentials, SignupData, AuthResponse } from '../services/auth';

/**
 * État d'authentification
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * Interface du contexte d'authentification
 */
interface AuthContextValue {
  // État
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
  error: string | null;

  // Actions d'authentification
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (code: string) => Promise<void>;

  // Gestion du mot de passe
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, passwordConfirmation: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, newPasswordConfirmation: string) => Promise<void>;

  // Gestion email
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;

  // Utilitaires
  refreshUser: () => Promise<void>;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
  clearError: () => void;
}

/**
 * Contexte d'authentification
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Props du Provider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider du contexte d'authentification
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialiser l'authentification au chargement de l'app
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialisation de l'authentification
   */
  const initializeAuth = async () => {
    try {
      setStatus('loading');
      
      // Vérifier si l'utilisateur est déjà connecté
      const currentUser = await authService.initialize();
      
      if (currentUser) {
        setUser(currentUser);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    } catch (err) {
      console.error('[AuthContext] Initialization error:', err);
      setStatus('unauthenticated');
      setError('Failed to initialize authentication');
    }
  };

  /**
   * Connexion
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setStatus('loading');
      setError(null);

      const response: AuthResponse = await authService.login(credentials);
      
      setUser(response.user);
      setStatus('authenticated');
    } catch (err: any) {
      console.error('[AuthContext] Login error:', err);
      setStatus('unauthenticated');
      
      const errorMessage = err.message || 'Email ou mot de passe incorrect';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Inscription
   */
  const signup = useCallback(async (data: SignupData) => {
    try {
      setStatus('loading');
      setError(null);

      const response: AuthResponse = await authService.signup(data);
      
      setUser(response.user);
      setStatus('authenticated');
    } catch (err: any) {
      console.error('[AuthContext] Signup error:', err);
      setStatus('unauthenticated');
      
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Connexion avec Google
   */
  const googleLogin = useCallback(async (code: string) => {
    try {
      setStatus('loading');
      setError(null);

      const response: AuthResponse = await authService.googleLogin({ code });
      
      setUser(response.user);
      setStatus('authenticated');
    } catch (err: any) {
      console.error('[AuthContext] Google login error:', err);
      setStatus('unauthenticated');
      
      const errorMessage = err.message || 'Erreur lors de la connexion avec Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Déconnexion
   */
  const logout = useCallback(async () => {
    try {
      setStatus('loading');
      
      await authService.logout();
      
      setUser(null);
      setStatus('unauthenticated');
      setError(null);
    } catch (err: any) {
      console.error('[AuthContext] Logout error:', err);
      
      // Même en cas d'erreur, on déconnecte côté client
      setUser(null);
      setStatus('unauthenticated');
      setError(null);
    }
  }, []);

  /**
   * Mot de passe oublié
   */
  const forgotPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      await authService.forgotPassword({ email });
    } catch (err: any) {
      console.error('[AuthContext] Forgot password error:', err);
      
      const errorMessage = err.message || 'Erreur lors de l\'envoi de l\'email';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Réinitialiser le mot de passe
   */
  const resetPassword = useCallback(async (
    token: string,
    password: string,
    passwordConfirmation: string
  ) => {
    try {
      setError(null);
      await authService.resetPassword({ token, password, passwordConfirmation });
    } catch (err: any) {
      console.error('[AuthContext] Reset password error:', err);
      
      const errorMessage = err.message || 'Erreur lors de la réinitialisation du mot de passe';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Changer le mot de passe
   */
  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
  ) => {
    try {
      setError(null);
      await authService.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirmation,
      });
    } catch (err: any) {
      console.error('[AuthContext] Change password error:', err);
      
      const errorMessage = err.message || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Vérifier l'email
   */
  const verifyEmail = useCallback(async (token: string) => {
    try {
      setError(null);
      await authService.verifyEmail({ token });
      
      // Mettre à jour le user local
      if (user) {
        setUser({ ...user, isEmailVerified: true });
      }
    } catch (err: any) {
      console.error('[AuthContext] Verify email error:', err);
      
      const errorMessage = err.message || 'Erreur lors de la vérification de l\'email';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user]);

  /**
   * Renvoyer l'email de vérification
   */
  const resendVerificationEmail = useCallback(async () => {
    try {
      setError(null);
      await authService.resendVerificationEmail();
    } catch (err: any) {
      console.error('[AuthContext] Resend verification email error:', err);
      
      const errorMessage = err.message || 'Erreur lors de l\'envoi de l\'email';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Rafraîchir les données utilisateur
   */
  const refreshUser = useCallback(async () => {
    try {
      const updatedUser = await authService.getCurrentUserProfile();
      setUser(updatedUser);
    } catch (err: any) {
      console.error('[AuthContext] Refresh user error:', err);
      
      // Si le refresh échoue, on déconnecte
      if (err.status === 401) {
        setUser(null);
        setStatus('unauthenticated');
      }
    }
  }, []);

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  const hasRole = useCallback((role: User['role']): boolean => {
    return user?.role === role;
  }, [user]);

  /**
   * Vérifier si l'utilisateur a l'un des rôles
   */
  const hasAnyRole = useCallback((roles: User['role'][]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  /**
   * Nettoyer l'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Valeurs calculées
   */
  const isAuthenticated = status === 'authenticated' && user !== null;
  const isLoading = status === 'loading';
  const isEmailVerified = user?.isEmailVerified || false;

  /**
   * Valeur du contexte
   */
  const value: AuthContextValue = {
    // État
    user,
    status,
    isAuthenticated,
    isLoading,
    isEmailVerified,
    error,

    // Actions
    login,
    signup,
    logout,
    googleLogin,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerificationEmail,
    refreshUser,
    hasRole,
    hasAnyRole,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte d'authentification
 */
export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;