// src/services/auth.ts
import { apiService } from './api';
import { 
  User, 
  LoginRequest, 
  LoginResponse,
  SignupRequest, 
  SignupResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest
} from '../types/auth';

export class AuthService {
  // Connexion avec email/username et mot de passe
  async login(emailOrUsername: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = {
      emailOrUsername,
      password
    };

    const response = await apiService.post<LoginResponse>('/auth/login', loginData);
    
    // Stocker les tokens
    if (response.data.data.tokens) {
      apiService.setTokens(
        response.data.data.tokens.accessToken,
        response.data.data.tokens.refreshToken
      );
    }

    return response.data.data;
  }

  // Inscription
  async signup(userData: {
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  }): Promise<SignupResponse> {
    const signupData: SignupRequest = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      acceptTerms: userData.acceptTerms
    };

    const response = await apiService.post<SignupResponse>('/auth/signup', signupData);
    
    // Stocker les tokens
    if (response.data.data.tokens) {
      apiService.setTokens(
        response.data.data.tokens.accessToken,
        response.data.data.tokens.refreshToken
      );
    }

    return response.data.data;
  }

  // Connexion avec Google
  async loginWithGoogle(): Promise<LoginResponse> {
    // Dans un vrai projet, vous utiliseriez l'API Google OAuth
    // Ici, nous simulons le processus
    try {
      // Ouvrir une popup pour l'authentification Google
      const popup = window.open(
        `${apiService.getBaseURL()}/auth/google`,
        'googleAuth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Impossible d\'ouvrir la fenêtre d\'authentification');
      }

      // Attendre la réponse de la popup
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Authentification annulée'));
          }
        }, 1000);

        // Écouter les messages de la popup
        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();

            // Stocker les tokens
            if (event.data.tokens) {
              apiService.setTokens(
                event.data.tokens.accessToken,
                event.data.tokens.refreshToken
              );
            }

            resolve({
              user: event.data.user,
              tokens: event.data.tokens
            });
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error || 'Erreur d\'authentification Google'));
          }
        };

        window.addEventListener('message', messageHandler);
      });
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'authentification Google');
    }
  }

  // Déconnexion
  async logout(refreshToken?: string): Promise<void> {
    try {
      const token = refreshToken || localStorage.getItem('refreshToken');
      if (token) {
        await apiService.post('/auth/logout', { refreshToken: token });
      }
    } catch (error) {
      // Continuer même si la requête échoue
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      this.clearTokens();
    }
  }

  // Rafraîchir le token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const refreshData: RefreshTokenRequest = {
      refreshToken
    };

    const response = await apiService.post<RefreshTokenResponse>('/auth/refresh', refreshData);
    
    // Mettre à jour les tokens stockés
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    if (response.data.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }

    return response.data.data;
  }

  // Mot de passe oublié
  async forgotPassword(emailOrUsername: string): Promise<void> {
    const forgotPasswordData: ForgotPasswordRequest = {
      emailOrUsername
    };

    await apiService.post('/auth/forgot-password', forgotPasswordData);
  }

  // Réinitialiser le mot de passe
  async resetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    const resetPasswordData: ResetPasswordRequest = {
      token,
      newPassword,
      confirmPassword
    };

    await apiService.post('/auth/reset-password', resetPasswordData);
  }

  // Changer le mot de passe
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    const changePasswordData: ChangePasswordRequest = {
      currentPassword,
      newPassword,
      confirmPassword
    };

    await apiService.post('/auth/change-password', changePasswordData);
  }

  // Vérifier le token et obtenir les informations utilisateur
  async verifyToken(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data.data;
  }

  // Mettre à jour le profil
  async updateProfile(profileData: Partial<User>): Promise<User> {
    const updateData: UpdateProfileRequest = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.profile?.bio,
      website: profileData.profile?.website,
      location: profileData.profile?.location,
      company: profileData.profile?.company,
      jobTitle: profileData.profile?.jobTitle
    };

    const response = await apiService.put<User>('/users/me', updateData);
    return response.data.data;
  }

  // Renvoyer l'email de vérification
  async resendVerificationEmail(): Promise<void> {
    await apiService.post('/auth/resend-verification');
  }

  // Vérifier l'email avec le token
  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  }

  // Activer l'authentification à deux facteurs
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await apiService.post<{ qrCode: string; secret: string }>('/auth/2fa/enable');
    return response.data.data;
  }

  // Confirmer l'activation de l'authentification à deux facteurs
  async confirm2FA(token: string): Promise<{ backupCodes: string[] }> {
    const response = await apiService.post<{ backupCodes: string[] }>('/auth/2fa/confirm', { token });
    return response.data.data;
  }

  // Désactiver l'authentification à deux facteurs
  async disable2FA(password: string): Promise<void> {
    await apiService.post('/auth/2fa/disable', { password });
  }

  // Vérifier le token 2FA
  async verify2FA(token: string): Promise<{ valid: boolean }> {
    const response = await apiService.post<{ valid: boolean }>('/auth/2fa/verify', { token });
    return response.data.data;
  }

  // Obtenir les sessions actives
  async getActiveSessions(): Promise<any[]> {
    const response = await apiService.get<any[]>('/auth/sessions');
    return response.data.data;
  }

  // Terminer une session spécifique
  async terminateSession(sessionId: string): Promise<void> {
    await apiService.delete(`/auth/sessions/${sessionId}`);
  }

  // Terminer toutes les autres sessions
  async terminateOtherSessions(): Promise<void> {
    await apiService.delete('/auth/sessions/others');
  }

  // Obtenir l'historique de connexion
  async getLoginHistory(): Promise<any[]> {
    const response = await apiService.get<any[]>('/auth/login-history');
    return response.data.data;
  }

  // Supprimer le compte
  async deleteAccount(password: string): Promise<void> {
    await apiService.delete('/users/me', {
      data: { password }
    });
    this.clearTokens();
  }

  // Exporter les données utilisateur
  async exportUserData(): Promise<Blob> {
    // IMPORTANT:
    // - On précise le type générique <Blob> pour que apiService.get infère que response.data.data est un Blob.
    // - responseType: 'blob' as const est nécessaire pour que TS conserve la valeur littérale 'blob'.
    const response = await apiService.get<Blob>('/users/me/export', {
      responseType: 'blob' as const
    });

    // Selon la structure de ton wrapper apiService (tu utilises ailleurs response.data.data),
    // on retourne response.data.data ici pour rester cohérent.
    return response.data.data as Blob;
  }

  // Méthodes utilitaires
  clearTokens(): void {
    apiService.clearAllTokens();
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated() && !apiService.isTokenExpired();
  }

  getCurrentUser(): Promise<User> {
    return this.verifyToken();
  }

  getStoredTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  async hasRole(role: string): Promise<boolean> {
    try {
      const user = await this.verifyToken();
      return user.role === role;
    } catch (error) {
      return false;
    }
  }

  // Vérifier si l'utilisateur a une permission spécifique
  async hasPermission(permission: string): Promise<boolean> {
    try {
      const user = await this.verifyToken();
      // Logique de vérification des permissions selon votre implémentation
      // Par exemple, les admins ont toutes les permissions
      return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    } catch (error) {
      return false;
    }
  }
}

// Instance singleton
export const authService = new AuthService();
export default authService;
