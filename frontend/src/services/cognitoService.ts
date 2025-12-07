import { 
  CognitoUserPool, 
  CognitoUser, 
  AuthenticationDetails, 
  CognitoUserSession,
  CognitoUserAttribute,
  ISignUpResult,
  ICognitoUserAttributeData
} from 'amazon-cognito-identity-js';

// Configuration Cognito depuis les variables d'environnement
const poolData = {
  UserPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
  ClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
};

const userPool = new CognitoUserPool(poolData);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface CognitoUserData {
  email: string;
  sub: string; // User ID unique
  emailVerified: boolean;
  name?: string;
  customRole?: string;
}

/**
 * Service d'authentification AWS Cognito
 */
class CognitoAuthService {
  /**
   * Connexion utilisateur
   */
  async login(credentials: LoginCredentials): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: credentials.email,
        Password: credentials.password,
      });

      const cognitoUser = new CognitoUser({
        Username: credentials.email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          // Sauvegarder le token
          const idToken = session.getIdToken().getJwtToken();
          const accessToken = session.getAccessToken().getJwtToken();
          const refreshToken = session.getRefreshToken().getToken();

          localStorage.setItem('cognitoToken', idToken);
          localStorage.setItem('cognitoAccessToken', accessToken);
          localStorage.setItem('cognitoRefreshToken', refreshToken);

          // Sauvegarder les infos utilisateur
          const userData = this.getUserDataFromToken(session);
          localStorage.setItem('user', JSON.stringify(userData));

          console.log('[Cognito] Connexion réussie', userData);
          resolve(session);
        },
        onFailure: (err: Error) => {
          console.error('[Cognito] Erreur de connexion', err);
          reject(err);
        },
        newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
          // Gérer le changement de mot de passe obligatoire
          console.warn('[Cognito] Nouveau mot de passe requis', { userAttributes, requiredAttributes });
          reject(new Error('NEW_PASSWORD_REQUIRED'));
        },
      });
    });
  }

  /**
   * Inscription utilisateur
   */
  async signUp(data: SignUpData): Promise<ISignUpResult> {
    return new Promise((resolve, reject) => {
      const attributeList: CognitoUserAttribute[] = [];

      if (data.name) {
        const nameAttribute = new CognitoUserAttribute({
          Name: 'name',
          Value: data.name,
        });
        attributeList.push(nameAttribute);
      }

      if (data.phone) {
        const phoneAttribute = new CognitoUserAttribute({
          Name: 'phone_number',
          Value: data.phone,
        });
        attributeList.push(phoneAttribute);
      }

      userPool.signUp(
        data.email,
        data.password,
        attributeList,
        [],
        (err: Error | undefined, result: ISignUpResult | undefined) => {
          if (err) {
            console.error('[Cognito] Erreur inscription', err);
            reject(err);
            return;
          }
          if (!result) {
            reject(new Error('No result from sign up'));
            return;
          }
          console.log('[Cognito] Inscription réussie', result);
          resolve(result);
        }
      );
    });
  }

  /**
   * Vérification du code de confirmation
   */
  async confirmSignUp(email: string, code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmRegistration(code, true, (err: Error | undefined, result: any) => {
        if (err) {
          console.error('[Cognito] Erreur confirmation', err);
          reject(err);
          return;
        }
        console.log('[Cognito] Confirmation réussie', result);
        resolve();
      });
    });
  }

  /**
   * Renvoyer le code de confirmation
   */
  async resendConfirmationCode(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.resendConfirmationCode((err: Error | undefined, result: any) => {
        if (err) {
          console.error('[Cognito] Erreur renvoi code', err);
          reject(err);
          return;
        }
        console.log('[Cognito] Code renvoyé', result);
        resolve();
      });
    });
  }

  /**
   * Mot de passe oublié
   */
  async forgotPassword(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.forgotPassword({
        onSuccess: (data: any) => {
          console.log('[Cognito] Code de réinitialisation envoyé', data);
          resolve();
        },
        onFailure: (err: Error) => {
          console.error('[Cognito] Erreur mot de passe oublié', err);
          reject(err);
        },
      });
    });
  }

  /**
   * Confirmer le nouveau mot de passe
   */
  async confirmPassword(email: string, code: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: (data: any) => {
          console.log('[Cognito] Mot de passe réinitialisé', data);
          resolve();
        },
        onFailure: (err: Error) => {
          console.error('[Cognito] Erreur réinitialisation', err);
          reject(err);
        },
      });
    });
  }

  /**
   * Changer le mot de passe (utilisateur connecté)
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No user logged in'));
        return;
      }

      cognitoUser.changePassword(oldPassword, newPassword, (err: Error | undefined, result: string) => {
        if (err) {
          console.error('[Cognito] Erreur changement mot de passe', err);
          reject(err);
          return;
        }
        console.log('[Cognito] Mot de passe changé', result);
        resolve();
      });
    });
  }

  /**
   * Déconnexion
   */
  logout(): void {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }

    localStorage.removeItem('cognitoToken');
    localStorage.removeItem('cognitoAccessToken');
    localStorage.removeItem('cognitoRefreshToken');
    localStorage.removeItem('user');

    console.log('[Cognito] Déconnexion réussie');
  }

  /**
   * Déconnexion globale (toutes les sessions)
   */
  async globalLogout(): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      
      if (!cognitoUser) {
        this.logout();
        resolve();
        return;
      }

      cognitoUser.globalSignOut({
        onSuccess: (msg: string) => {
          console.log('[Cognito] Déconnexion globale réussie', msg);
          this.logout();
          resolve();
        },
        onFailure: (err: Error) => {
          console.error('[Cognito] Erreur déconnexion globale', err);
          reject(err);
        },
      });
    });
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): CognitoUser | null {
    return userPool.getCurrentUser();
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      return session?.isValid() || false;
    } catch (error) {
      console.error('[Cognito] Erreur vérification authentification', error);
      return false;
    }
  }

  /**
   * Obtenir la session actuelle
   */
  async getCurrentSession(): Promise<CognitoUserSession | null> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      if (!cognitoUser) {
        resolve(null);
        return;
      }

      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(session);
      });
    });
  }

  /**
   * Rafraîchir le token
   */
  async refreshSession(): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      if (!cognitoUser) {
        reject(new Error('No user found'));
        return;
      }

      cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
          return;
        }

        if (!session) {
          reject(new Error('No session found'));
          return;
        }

        const refreshToken = session.getRefreshToken();

        cognitoUser.refreshSession(refreshToken, (refreshErr: Error | undefined, newSession: CognitoUserSession) => {
          if (refreshErr) {
            reject(refreshErr);
            return;
          }

          // Mettre à jour les tokens
          const idToken = newSession.getIdToken().getJwtToken();
          const accessToken = newSession.getAccessToken().getJwtToken();

          localStorage.setItem('cognitoToken', idToken);
          localStorage.setItem('cognitoAccessToken', accessToken);

          console.log('[Cognito] Session rafraîchie');
          resolve(newSession);
        });
      });
    });
  }

  /**
   * Obtenir le token JWT (ID Token)
   */
  async getIdToken(): Promise<string | null> {
    try {
      const session = await this.getCurrentSession();
      return session?.getIdToken().getJwtToken() || null;
    } catch (error) {
      console.error('[Cognito] Erreur récupération ID token', error);
      return null;
    }
  }

  /**
   * Obtenir l'Access Token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const session = await this.getCurrentSession();
      return session?.getAccessToken().getJwtToken() || null;
    } catch (error) {
      console.error('[Cognito] Erreur récupération access token', error);
      return null;
    }
  }

  /**
   * Obtenir les attributs utilisateur
   */
  async getUserAttributes(): Promise<ICognitoUserAttributeData[]> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No user logged in'));
        return;
      }

      cognitoUser.getUserAttributes((err: Error | undefined, attributes?: CognitoUserAttribute[]) => {
        if (err) {
          reject(err);
          return;
        }
        
        const attributeData = attributes?.map(attr => ({
          Name: attr.getName(),
          Value: attr.getValue()
        })) || [];
        
        resolve(attributeData);
      });
    });
  }

  /**
   * Mettre à jour les attributs utilisateur
   */
  async updateUserAttributes(attributes: ICognitoUserAttributeData[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No user logged in'));
        return;
      }

      const attributeList = attributes.map(attr => new CognitoUserAttribute(attr));

      cognitoUser.updateAttributes(attributeList, (err: Error | undefined, result: string) => {
        if (err) {
          console.error('[Cognito] Erreur mise à jour attributs', err);
          reject(err);
          return;
        }
        console.log('[Cognito] Attributs mis à jour', result);
        resolve();
      });
    });
  }

  /**
   * Supprimer le compte utilisateur
   */
  async deleteUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      const cognitoUser = this.getCurrentUser();
      
      if (!cognitoUser) {
        reject(new Error('No user logged in'));
        return;
      }

      cognitoUser.deleteUser((err: Error | undefined, result: string) => {
        if (err) {
          console.error('[Cognito] Erreur suppression compte', err);
          reject(err);
          return;
        }
        
        // Nettoyer le localStorage
        this.logout();
        
        console.log('[Cognito] Compte supprimé', result);
        resolve();
      });
    });
  }

  /**
   * Extraire les données utilisateur du token
   */
  private getUserDataFromToken(session: CognitoUserSession): CognitoUserData {
    const idToken = session.getIdToken();
    const payload = idToken.payload;

    return {
      email: payload.email || '',
      sub: payload.sub || '',
      emailVerified: payload.email_verified || false,
      name: payload.name,
      customRole: payload['custom:role'],
    };
  }

  /**
   * Obtenir les données utilisateur actuelles depuis localStorage
   */
  getUserData(): CognitoUserData | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('[Cognito] Erreur lecture données utilisateur', error);
      return null;
    }
  }

  /**
   * Vérifier si le token est expiré
   */
  async isTokenExpired(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      if (!session) return true;
      
      const expirationTime = session.getIdToken().getExpiration();
      const currentTime = Math.floor(Date.now() / 1000);
      
      return currentTime >= expirationTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Obtenir le temps restant avant expiration (en secondes)
   */
  async getTokenExpirationTime(): Promise<number> {
    try {
      const session = await this.getCurrentSession();
      if (!session) return 0;
      
      const expirationTime = session.getIdToken().getExpiration();
      const currentTime = Math.floor(Date.now() / 1000);
      
      return Math.max(0, expirationTime - currentTime);
    } catch (error) {
      return 0;
    }
  }
}

export const cognitoAuth = new CognitoAuthService();
export default cognitoAuth;