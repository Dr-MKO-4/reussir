// src/pages/Signup.tsx - Version corrigée avec redirection appropriée

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import BackgroundAnimation from '../components/ui/BackgroundAnimation';
import HeroSection from '../components/auth/HeroSection';
import SignupForm from '../components/auth/SignupForm';
import SuccessModal from '../components/ui/SuccessModal';
import Modal from '../components/ui/Modal';
import styles from './Signup.module.css';

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, isLoading, error, clearError, user, isAuthenticated } = useAuth();
  const { error: showError, info: showInfo, success: showSuccess } = useToast();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalData, setSuccessModalData] = useState({
    title: '',
    message: '',
    type: 'success' as 'success' | 'info' | 'warning'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Sync with global dark mode
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

  // SUPPRESSION : Suppression de la redirection automatique après inscription
  // L'utilisateur doit d'abord vérifier son email avant d'être connecté

  // CORRECTION : Gestion améliorée de l'inscription sans connexion automatique
  const handleSignup = async (data: SignupData) => {
    try {
      setLocalLoading(true);
      clearError();
      
      const username = generateUsername(data.firstName, data.lastName);
      const signupData = { ...data, username };

      await signup(signupData);
      
      // CORRECTION : Toujours rediriger vers la vérification d'email après inscription réussie
      setSuccessModalData({
        title: `Bienvenue ${data.firstName}!`,
        message: 'Votre compte a été créé avec succès. Un email de vérification a été envoyé à votre adresse. Veuillez vérifier votre email pour activer votre compte.',
        type: 'success'
      });
      
      setShowSuccessModal(true);
      
      showSuccess(
        'Compte créé!',
        'Vérifiez votre email pour l\'activer'
      );
      
      // MODIFICATION CRITIQUE : Toujours rediriger vers verify-email après inscription
      setTimeout(() => {
        navigate('/verify-email', { replace: true });
      }, 3000);
      
    } catch (error: unknown) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Erreur lors de la création du compte';
      
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string };
        errorMessage = errorObj.message;
        
        // Messages courts pour les toasts
        if (errorMessage.includes('existe déjà')) {
          errorMessage = 'Cette adresse email est déjà utilisée';
        } else if (errorMessage.includes('mot de passe')) {
          errorMessage = 'Mot de passe non conforme';
        } else if (errorMessage.includes('email invalide')) {
          errorMessage = 'Adresse email invalide';
        }
      }
      
      showError('Erreur d\'inscription', errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLocalLoading(true);
      clearError();
      showInfo('Redirection Google', 'Veuillez patienter...');
      
      await loginWithGoogle();
      
      // CORRECTION : Après Google signup, vérifier si le profil doit être complété
      // Cette logique sera gérée dans le AuthContext après la connexion Google
      
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as { message: string };
        if (errorObj.message !== 'Authentification annulée') {
          showError('Erreur Google', errorObj.message || 'Erreur d\'authentification');
        }
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const handleLogin = () => navigate('/login', { replace: true });
  const handleSuccessModalClose = () => setShowSuccessModal(false);

  const generateUsername = (firstName: string, lastName: string): string => {
    const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${baseUsername}${randomSuffix}`;
  };

  // Utiliser le loading combiné (contexte + local)
  const isFormLoading = isLoading || localLoading;

  return (
    <div className={`${styles.signupPage} ${isDarkMode ? 'dark' : ''}`}>
      <BackgroundAnimation />

      <div className={styles.signupContainer}>
        <HeroSection
          title="Rejoignez-nous!"
          subtitle="Créez votre compte Réussir et commencez votre parcours vers le succès ensemble"
        />

        <SignupForm
          onSubmit={handleSignup}
          onGoogleSignup={handleGoogleSignup}
          onLogin={handleLogin}
          loading={isFormLoading}
        />
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={successModalData.title}
        message={successModalData.message}
        type={successModalData.type}
        autoClose={4000}
      />

      {error && (
        <Modal
          isOpen={!!error}
          onClose={clearError}
          title="Erreur d'inscription"
          size="small"
        >
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: isDarkMode ? '#F1F5F9' : '#1A202C'
          }}>
            <p style={{ 
              color: 'var(--color-secondary-orange)', 
              marginBottom: '20px',
              lineHeight: '1.5'
            }}>
              {error}
            </p>
            <button
              onClick={clearError}
              style={{
                background: 'var(--color-primary-blue)',
                color: isDarkMode ? '#000000' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
            >
              Compris
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Signup;