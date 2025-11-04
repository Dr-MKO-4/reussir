import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn, 
  signUp, 
  signOut, 
  confirmSignUp,
  getCurrentUser,
  fetchUserAttributes,
  resetPassword,
  confirmResetPassword,
  updatePassword
} from 'aws-amplify/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    checkUser();
  }, []);

  // Vérifier si l'utilisateur est connecté
  const checkUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setUser({
        ...currentUser,
        attributes
      });
      
      setError(null);
    } catch (err) {
      console.log('No authenticated user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const handleSignUp = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);

      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name
          },
          autoSignIn: true
        }
      });

      setLoading(false);

      return {
        success: true,
        isSignUpComplete,
        userId,
        nextStep,
        message: 'Inscription réussie. Veuillez vérifier votre email.'
      };
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message);
      setLoading(false);
      
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Confirmation d'inscription
  const handleConfirmSignUp = async (email, code) => {
    try {
      setLoading(true);
      setError(null);

      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code
      });

      setLoading(false);

      return {
        success: true,
        isSignUpComplete,
        nextStep,
        message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.'
      };
    } catch (err) {
      console.error('Confirm sign up error:', err);
      setError(err.message);
      setLoading(false);
      
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Connexion
  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password
      });

      if (isSignedIn) {
        await checkUser();
        
        return {
          success: true,
          message: 'Connexion réussie'
        };
      } else {
        setLoading(false);
        
        return {
          success: false,
          nextStep,
          message: 'Étapes supplémentaires requises'
        };
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message);
      setLoading(false);
      
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Déconnexion
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setError(null);
      
      // Nettoyer le localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('idToken');
      
      return {
        success: true,
        message: 'Déconnexion réussie'
      };
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err.message);
      
      return {
        success: false,
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation de mot de passe
  const handleResetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);

      const output = await resetPassword({ username: email });
      const { nextStep } = output;

      setLoading(false);

      return {
        success: true,
        nextStep,
        message: 'Code de réinitialisation envoyé à votre email'
      };
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message);
      setLoading(false);
      
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Confirmation de réinitialisation de mot de passe
  const handleConfirmResetPassword = async (email, code, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword
      });

      setLoading(false);

      return {
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      };
    } catch (err) {
      console.error('Confirm reset password error:', err);
      setError(err.message);
      setLoading(false);
      
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Changer le mot de passe (utilisateur connecté)
  const handleUpdatePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      await updatePassword({
        oldPassword,
        newPassword
      });

      setLoading(false);

      return {
        success: true,
        message: 'Mot de passe modifié avec succès'
      };
    } catch (err) {
      console.error('Update password error:', err);
      setError(err.message);
      setLoading(false);
      
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Valeur du contexte
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    updatePassword: handleUpdatePassword,
    refreshUser: checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;