// src/pages/Login.tsx - Version corrigée avec gestion du loading

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import BackgroundAnimation from '../components/ui/BackgroundAnimation';
import HeroSection from '../components/auth/HeroSection';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import SuccessModal from '../components/ui/SuccessModal';
import Modal from '../components/ui/Modal';
import styles from './Login.module.css';

type ViewMode = 'login' | 'forgot-password';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, forgotPassword, isLoading, error, clearError, isAuthenticated, user } = useAuth();
  const { error: showError, info: showInfo, success: showSuccess } = useToast();
  
  const [currentView, setCurrentView] = useState<ViewMode>('login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'info' | 'warning'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); // AJOUTÉ: loading local

  // Sync with global dark mode and HomePage
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    document.documentElement.className.includes('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // CORRECTION: Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user && !localLoading) {
      console.log('User already authenticated, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate, localLoading]);

  const handleLogin = async (emailOrUsername: string, password: string) => {
    try {
      setLocalLoading(true); // AJOUTÉ: activer le loading local
      clearError();
      
      await login(emailOrUsername, password);
      
      setSuccessModalData({
        title: 'Connexion réussie !',
        message: 'Bienvenue ! Vous allez être redirigé vers votre espace.',
        type: 'success'
      });
      setShowSuccessModal(true);
      
      // Redirection après un délai
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      
    } catch (error: unknown) {
      let errorMessage = 'Vérifiez vos identifiants et réessayez.';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      }
      showError(
        'Erreur de connexion',
        errorMessage
      );
    } finally {
      setLocalLoading(false); // CRITIQUE: Toujours désactiver le loading local
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLocalLoading(true); // AJOUTÉ: activer le loading local
      clearError();
      showInfo('Redirection vers Google', 'Veuillez patienter...', 2000);
      
      await loginWithGoogle();
      
      setSuccessModalData({
        title: 'Connexion Google réussie !',
        message: 'Bienvenue ! Redirection en cours...',
        type: 'success'
      });
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string' &&
        (error as { message: string }).message !== 'Authentification annulée'
      ) {
        showError(
          'Erreur de connexion Google',
          (error as { message: string }).message || 'Une erreur s\'est produite lors de l\'authentification.'
        );
      } else if (
        !(
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof (error as { message?: unknown }).message === 'string'
        )
      ) {
        showError(
          'Erreur de connexion Google',
          'Une erreur s\'est produite lors de l\'authentification.'
        );
      }
    } finally {
      setLocalLoading(false); // CRITIQUE: Toujours désactiver le loading local
    }
  };

  const handleForgotPassword = async (emailOrUsername: string) => {
    try {
      setLocalLoading(true); // AJOUTÉ: activer le loading local
      clearError();
      await forgotPassword(emailOrUsername);
      
      setSuccessModalData({
        title: 'Email envoyé !',
        message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
        type: 'success'
      });
      setShowSuccessModal(true);
      
      // Retour au formulaire de connexion après succès
      setTimeout(() => {
        setCurrentView('login');
      }, 3000);
      
    } catch (error: unknown) {
      let errorMessage = 'Impossible d\'envoyer l\'email de réinitialisation.';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      }
      showError(
        'Erreur d\'envoi',
        errorMessage
      );
    } finally {
      setLocalLoading(false); // CRITIQUE: Toujours désactiver le loading local
    }
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
    clearError();
  };

  const handleSignup = () => {
    navigate('/signup', { replace: true });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  // CORRECTION: Utiliser le loading combiné
  const isFormLoading = isLoading || localLoading;

  const renderCurrentView = () => {
    switch (currentView) {
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBack={handleBackToLogin}
            isOpen={isFormLoading} // CORRECTION: Utiliser le loading combiné
          />
        );
      default:
        return (
          <LoginForm
            onSubmit={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onForgotPassword={() => setCurrentView('forgot-password')}
            onSignup={handleSignup}
            loading={isFormLoading} // CORRECTION: Utiliser le loading combiné
          />
        );
    }
  };

  const getHeroTitle = () => {
    switch (currentView) {
      case 'forgot-password':
        return 'Récupération';
      default:
        return 'Bienvenue !';
    }
  };

  const getHeroSubtitle = () => {
    switch (currentView) {
      case 'forgot-password':
        return 'Pas de panique ! Nous allons vous aider à récupérer l\'accès à votre compte en toute sécurité.';
      default:
        return 'Connectez-vous pour accéder à Réussir et découvrez toutes nos fonctionnalités pour réussir ensemble';
    }
  };

  return (
    <div className={`${styles.loginPage} ${isDarkMode ? 'dark' : ''}`}>
      <BackgroundAnimation />

      <div className={styles.loginContainer}>
        <HeroSection
          title={getHeroTitle()}
          subtitle={getHeroSubtitle()}
        />

        {renderCurrentView()}
      </div>

      {/* Modal de succès */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={successModalData.title}
        message={successModalData.message}
        type={successModalData.type}
        autoClose={currentView === 'forgot-password' ? undefined : 3000}
      />

      {/* Modal d'erreur globale (optionnel) */}
      {error && (
        <Modal
          isOpen={!!error}
          onClose={clearError}
          title="Erreur"
          size="small"
        >
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: isDarkMode ? '#F1F5F9' : '#1A202C'
          }}>
            <p style={{ 
              color: 'var(--color-secondary-orange)', 
              marginBottom: '20px' 
            }}>
              {error}
            </p>
            <button
              onClick={clearError}
              style={{
                background: 'var(--color-primary-blue)',
                color: isDarkMode ? '#000000' : '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Login;


