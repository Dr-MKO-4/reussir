// AuthContext.tsx - Corrections complètes avec fonction generateUsername

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import apiService, { ApiError } from '../services/api';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated?: boolean;
  error: string | null;
  signup: (data: SignupData) => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile: (profileData: FormData | any) => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearError: () => void;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username?: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser useRef pour suivre les opérations en cours
  const activeVerifications = useRef(new Set<string>());
  const sessionCheckInterval = useRef<NodeJS.Timeout>();

  // CORRECTION: Fonction generateUsername ajoutée
  const generateUsername = (firstName: string, lastName: string): string => {
    const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomSuffix}`;
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUserData = async (): Promise<void> => {
    try {
      const response = await apiService.get('/auth/me');
      
      if (response.data.success && response.data.data) {
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.warn('Failed to refresh user data:', error);
    }
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateProfile = async (profileData: FormData | any): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      
      // Déterminer le type de données et l'endpoint approprié
      if (profileData instanceof FormData) {
        // Upload avec fichier (photo de profil)
        response = await apiService.post('/user/profile/complete', profileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Données JSON simples pour la complétion de profil
        response = await apiService.post('/user/profile/complete', profileData);
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour du profil');
      }

      // Mettre à jour les données utilisateur locales
      if (response.data.data?.user) {
        const updatedUser = response.data.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // CRITIQUE : Supprimer le flag de complétion de profil une fois terminé
        localStorage.removeItem('shouldCompleteProfile');
        
        console.log('Profil complété avec succès:', updatedUser);
      } else {
        // Rafraîchir les données depuis le serveur
        await refreshUserData();
      }

    } catch (error: any) {
      console.error('Profile completion error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la complétion du profil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // CORRECTION: Fonction signup corrigée avec generateUsername
  const signup = async (data: SignupData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // CORRECTION: Générer le username si pas fourni
      const username = data.username || generateUsername(data.firstName, data.lastName);
      const signupData = { ...data, username };

      const response = await apiService.post('/auth/signup', signupData);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors de l\'inscription');
      }

      if (!response.data.data) {
        throw new Error('Réponse d\'inscription incomplète');
      }

      const { user: newUser, requiresEmailVerification } = response.data.data;

      // MODIFICATION CRITIQUE : Ne pas connecter automatiquement l'utilisateur
      if (requiresEmailVerification) {
        // Stocker temporairement l'email pour la page de vérification
        localStorage.setItem('tempUserEmail', data.email);
        
        console.log('Inscription réussie, email de vérification requis');
        // NE PAS définir setUser ici - l'utilisateur n'est pas encore authentifié
      } else if (newUser?.role === 'admin') {
        // Cas spécial pour les admins en attente de validation
        localStorage.setItem('tempUser', JSON.stringify(newUser));
        console.log('Admin créé, validation requise');
      } else {
        // Cas où l'utilisateur serait immédiatement connecté (rare)
        const { accessToken, refreshToken } = response.data.data;
        if (accessToken && refreshToken) {
          apiService.setTokens(accessToken, refreshToken);
          localStorage.setItem('user', JSON.stringify(newUser));
          setUser(newUser);
          startSessionCheck();
        }
      }

      console.log('Signup successful:', response.data.message);

    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // CORRECTION: Fonction login améliorée
  const login = async (emailOrUsername: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.post('/auth/login', {
        email: emailOrUsername,
        password,
      });

      if (response.status === 202 && response.data.data?.requires2FA) {
        throw new Error('Code d\'authentification à deux facteurs requis');
      }

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors de la connexion');
      }

      if (!response.data.data) {
        throw new Error('Réponse de connexion incomplète');
      }

      const { user: loggedUser, accessToken, refreshToken } = response.data.data;

      if (!accessToken) {
        throw new Error('Token d\'accès manquant');
      }

      apiService.setTokens(accessToken, refreshToken || '');
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);

      // Marquer l'activité utilisateur et démarrer la vérification de session
      localStorage.setItem('lastActivity', Date.now().toString());
      startSessionCheck();

      console.log('Login successful');

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // CORRECTION CRITIQUE: Fonction verifyEmail avec protection contre les appels multiples
  const verifyEmail = async (token: string): Promise<void> => {
    // Vérifier si cette vérification est déjà en cours
    if (activeVerifications.current.has(token)) {
      console.log('Vérification déjà en cours pour ce token, ignorée');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Marquer cette vérification comme active
      activeVerifications.current.add(token);

      console.log('Frontend - Vérification token avec connexion automatique:', token?.substring(0, 10) + '...');

      const response = await apiService.post('/auth/verify-email', { token });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors de la vérification');
      }

      // MODIFICATION CRITIQUE : Traiter la réponse avec les tokens de connexion
      const { user: verifiedUser, accessToken, refreshToken, shouldCompleteProfile } = response.data.data;

      if (!verifiedUser) {
        throw new Error('Données utilisateur manquantes dans la réponse');
      }

      if (accessToken && refreshToken) {
        // CONNEXION AUTOMATIQUE après vérification d'email
        apiService.setTokens(accessToken, refreshToken);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
        setUser(verifiedUser);
        localStorage.setItem('lastActivity', Date.now().toString());
        
        // Démarrer la vérification de session
        startSessionCheck();
        
        console.log('Utilisateur connecté automatiquement après vérification email:', verifiedUser.email);

        // MODIFICATION CRITIQUE : Stocker l'information sur la complétion du profil
        if (shouldCompleteProfile) {
          localStorage.setItem('shouldCompleteProfile', 'true');
          console.log('Profil incomplet détecté - redirection vers complete-profile nécessaire');
        } else {
          localStorage.removeItem('shouldCompleteProfile');
          console.log('Profil complet - redirection vers dashboard possible');
        }
      } else {
        // Cas où la vérification réussit mais sans connexion automatique (rare)
        console.log('Email vérifié mais pas de connexion automatique');
      }

      // Nettoyer les données temporaires
      localStorage.removeItem('tempUserEmail');

      console.log('Email verification successful avec connexion automatique');

    } catch (error: any) {
      console.error('Email verification error:', error);
      
      let errorMessage = 'Erreur lors de la vérification';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      // CRITIQUE : Nettoyer le Set des vérifications actives
      activeVerifications.current.delete(token);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Frontend - Renvoi email:', email);

      const response = await apiService.post('/auth/resend-verification-public', { email });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors du renvoi');
      }

      console.log('Verification email resent successfully');

    } catch (error: any) {
      console.error('Resend email error:', error);
      
      let errorMessage = 'Erreur lors du renvoi';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const configResponse = await apiService.get('/auth/google/url');
      
      if (!configResponse.data.success || !configResponse.data.data?.authUrl) {
        throw new Error('URL d\'autorisation Google manquante');
      }

      window.location.href = configResponse.data.data.authUrl;

    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la connexion Google';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // CORRECTION: Fonction logout améliorée
  const logout = (): void => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        apiService.post('/auth/logout', { refreshToken })
          .catch(err => console.warn('Logout API call failed:', err));
      }

      // Nettoyer toutes les données locales
      apiService.clearAllTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('tempUser');
      localStorage.removeItem('tempUserEmail');
      localStorage.removeItem('shouldCompleteProfile');
      
      setUser(null);
      setError(null);

      // CORRECTION: Nettoyer aussi les vérifications actives et arrêter la vérification de session
      activeVerifications.current.clear();
      stopSessionCheck();

      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.post('/auth/forgot-password', { email });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur lors de l\'envoi de l\'email');
      }

      console.log('Password reset email sent');

    } catch (error: any) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'envoi de l\'email';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  // AJOUTÉ: Gestion de la vérification de session
  const startSessionCheck = () => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
    }

    sessionCheckInterval.current = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity');
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 heures

      if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
        console.log('Session expired, logging out');
        logout();
      } else if (user) {
        // Mettre à jour l'activité si l'utilisateur est actif
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    }, 60000); // Vérifier chaque minute
  };

  const stopSessionCheck = () => {
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = undefined;
    }
  };

  // CORRECTION: Initialisation au chargement
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Vérifier la validité de la session
          const lastActivity = localStorage.getItem('lastActivity');
          const sessionTimeout = 24 * 60 * 60 * 1000; // 24 heures

          if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
            console.log('Stored session expired, clearing data');
            logout();
          } else {
            // Session valide, démarrer la vérification
            localStorage.setItem('lastActivity', Date.now().toString());
            startSessionCheck();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiService.clearAllTokens();
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
      }
    };

    initAuth();

    // Nettoyer à la fermeture
    return () => {
      stopSessionCheck();
    };
  }, []);

  // Mettre à jour l'activité utilisateur sur les interactions
  useEffect(() => {
    const handleUserActivity = () => {
      if (user) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user]);

  // CORRECTION: Calculer isAuthenticated de manière dynamique
  const isAuthenticated = !!user && !!localStorage.getItem('accessToken');

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    verifyEmail,
    resendVerificationEmail,
    updateProfile,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};