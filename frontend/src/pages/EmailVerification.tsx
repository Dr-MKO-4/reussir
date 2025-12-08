// src/pages/EmailVerification.tsx - Version corrigée pour éviter les appels multiples

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import BackgroundAnimation from '../components/ui/BackgroundAnimation';
import Modal from '../components/ui/Modal';
import styles from './EmailVerification.module.css';

// Types pour les états de vérification
type VerificationState = 'initial' | 'verifying' | 'success' | 'error' | 'expired' | 'resend' | 'already_verified';

interface EmailVerificationProps {}

const EmailVerification: React.FC<EmailVerificationProps> = () => {
  // Hooks de base
  const { token: urlToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, user, isLoading, clearError, isAuthenticated } = useAuth();
  const { success: showSuccess, error: showError } = useToast();

  // States
  const [verificationState, setVerificationState] = useState<VerificationState>('initial');
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // CORRECTION CRITIQUE: Utiliser useRef pour éviter les appels multiples
  const verificationInProgress = useRef(false);
  const verificationCompleted = useRef(false);

  // Récupérer le token depuis les paramètres URL, query string, ou localStorage
  const getToken = useCallback((): string | null => {
    // D'abord vérifier l'URL
    if (urlToken) return urlToken;
    const queryToken = searchParams.get('token');
    if (queryToken) return queryToken;
    // Ensuite vérifier localStorage (pour les signups)
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken && storedToken !== 'undefined') return storedToken;
    } catch (e) {
      console.warn('localStorage access failed:', e);
    }
    return null;
  }, [urlToken, searchParams]);

  // Vérifier si l'utilisateur est déjà connecté et vérifié
  useEffect(() => {
    if (isAuthenticated && user?.isEmailVerified && !verificationCompleted.current) {
      console.log('✅ Utilisateur déjà connecté et vérifié, redirection...');
      setVerificationState('already_verified');
      verificationCompleted.current = true;
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fonction principale de vérification du token
  const handleVerifyToken = useCallback(async (verificationToken: string) => {
    // CORRECTION: Vérifications pour éviter les appels multiples
    if (verificationInProgress.current) {
      console.log('🔄 Vérification déjà en cours, ignorée');
      return;
    }

    if (verificationCompleted.current) {
      console.log('✅ Vérification déjà complétée, ignorée');
      return;
    }

    try {
      console.log('🔍 Début vérification du token:', verificationToken.substring(0, 10) + '...');
      
      // Marquer comme en cours
      verificationInProgress.current = true;
      setVerificationState('verifying');
      clearError();
      
      // Appel de la fonction de vérification du contexte
      await verifyEmail(verificationToken);
      
      console.log('✅ Vérification réussie');
      verificationCompleted.current = true;
      setVerificationState('success');
      setShowSuccessModal(true);
      
      showSuccess(
        'Email vérifié !',
        'Votre adresse email a été vérifiée avec succès.'
      );

      // Redirection automatique après 3 secondes
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 3000);

    } catch (error: any) {
      console.error('❌ Erreur de vérification:', error);
      
      const errorMessage = error?.message || 'Erreur de vérification';
      
      // Gestion des différents types d'erreurs
      if (errorMessage.includes('expiré') || errorMessage.includes('expired')) {
        setVerificationState('expired');
      } else if (errorMessage.includes('déjà utilisé') || errorMessage.includes('already used')) {
        if (isAuthenticated) {
          setVerificationState('success');
          verificationCompleted.current = true;
          showSuccess('Déjà vérifié', 'Votre email est déjà vérifié.');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 2000);
          return;
        } else {
          setVerificationState('error');
        }
      } else if (errorMessage.includes('invalide') || errorMessage.includes('invalid')) {
        setVerificationState('error');
      } else {
        setVerificationState('error');
      }
      
      showError(
        'Erreur de vérification',
        errorMessage
      );
    } finally {
      verificationInProgress.current = false;
    }
  }, [verifyEmail, clearError, isAuthenticated, showSuccess, showError, navigate]);

  // CORRECTION: Effect plus robuste pour éviter les appels multiples
  useEffect(() => {
    const token = getToken();
    
    // Si on a déjà terminé, ne rien faire
    if (verificationCompleted.current) {
      console.log('✅ Vérification déjà terminée, ignorée');
      return;
    }
    
    if (token && !verificationInProgress.current) {
      console.log('🎯 Token trouvé, début vérification:', token.substring(0, 10) + '...');
      handleVerifyToken(token);
    } else if (!token && verificationState === 'initial') {
      console.log('⚠️ Aucun token trouvé, passage en mode resend');
      setVerificationState('resend');
    }
  }, []); // IMPORTANT: Dépendances vides pour éviter les re-exécutions

  // Countdown pour le renvoi d'email
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Fonction pour renvoyer l'email de vérification
  const handleResendEmail = useCallback(async () => {
    if (countdown > 0 || resendLoading) return;
    
    // Récupérer l'email de différentes sources possibles
    const userEmail = user?.email || 
                     localStorage.getItem('tempUserEmail') || 
                     sessionStorage.getItem('tempUserEmail') ||
                     searchParams.get('email');
    
    if (!userEmail) {
      showError(
        'Email requis',
        'Impossible de déterminer l\'adresse email. Veuillez saisir votre email.'
      );
      
      // Afficher un prompt pour l'email
      const email = prompt('Veuillez saisir votre adresse email :');
      if (!email || !email.includes('@')) {
        return;
      }
      
      // Réessayer avec l'email saisi
      await resendEmailWithAddress(email.toLowerCase().trim());
      return;
    }

    await resendEmailWithAddress(userEmail);
  }, [countdown, resendLoading, user?.email, searchParams, showError]);

  // Fonction utilitaire pour renvoyer l'email
  const resendEmailWithAddress = useCallback(async (email: string) => {
    try {
      console.log('📧 Renvoi email pour:', email);
      setResendLoading(true);
      
      // Appel API direct au lieu d'utiliser le contexte
      const response = await fetch('/auth/resend-verification-public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi');
      }

      const data = await response.json();
      
      setCountdown(60);
      showSuccess(
        'Email envoyé !',
        'Un nouvel email de vérification a été envoyé.'
      );
      
      // Stocker l'email pour de futures tentatives
      localStorage.setItem('tempUserEmail', email);
      
    } catch (error: any) {
      console.error('❌ Erreur renvoi email:', error);
      
      // Gestion des erreurs spécifiques
      if (error.message?.includes('429') || error.message?.includes('tentatives')) {
        showError(
          'Trop de tentatives',
          'Trop de tentatives récentes. Réessayez dans 15 minutes.'
        );
      } else if (error.message?.includes('404') || error.message?.includes('introuvable')) {
        showError(
          'Compte introuvable',
          'Aucun compte trouvé avec cette adresse email.'
        );
        setTimeout(() => {
          navigate('/signup');
        }, 3000);
      } else {
        showError(
          'Erreur d\'envoi',
          error?.message || 'Impossible d\'envoyer l\'email'
        );
      }
    } finally {
      setResendLoading(false);
    }
  }, [showSuccess, showError, navigate]);

  // Gestionnaires de navigation
  const handleGoToDashboard = useCallback(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoToLogin = useCallback(() => {
    // Nettoyer les données temporaires
    localStorage.removeItem('tempUserEmail');
    sessionStorage.removeItem('tempUserEmail');
    navigate('/login', { replace: true });
  }, [navigate]);

  // Composants de rendu pour chaque état
  const renderVerifyingState = () => (
    <div className={styles.stateContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.spinnerLarge}>
          <div className={styles.spinner} />
        </div>
      </div>
      
      <h1 className={styles.title}>Vérification en cours...</h1>
      <p className={styles.subtitle}>
        Nous vérifions votre adresse email, veuillez patienter.
      </p>
      
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className={styles.stateContainer}>
      <div className={styles.iconContainer}>
        <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className={styles.title}>Email vérifié !</h1>
      <p className={styles.subtitle}>
        Félicitations ! Votre adresse email a été vérifiée avec succès.
        {isAuthenticated ? 
          ' Vous allez être redirigé vers votre tableau de bord.' : 
          ' Vous pouvez maintenant vous connecter.'
        }
      </p>
      
      <div className={styles.buttonGroup}>
        <button
          onClick={handleGoToDashboard}
          className={styles.primaryButton}
        >
          {isAuthenticated ? 'Aller au tableau de bord' : 'Se connecter'}
        </button>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className={styles.stateContainer}>
      <div className={styles.iconContainer}>
        <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className={styles.title}>Vérification échouée</h1>
      <p className={styles.subtitle}>
        Le lien de vérification est invalide ou a déjà été utilisé.
      </p>
      
      <div className={styles.buttonGroup}>
        <button
          onClick={handleResendEmail}
          className={styles.primaryButton}
          disabled={countdown > 0 || resendLoading}
        >
          {resendLoading ? (
            <>
              <div className={styles.spinner} />
              Envoi en cours...
            </>
          ) : countdown > 0 ? (
            `Renvoyer dans ${countdown}s`
          ) : (
            'Renvoyer un email'
          )}
        </button>
        
        <button
          onClick={handleGoToLogin}
          className={styles.secondaryButton}
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );

  const renderExpiredState = () => (
    <div className={styles.stateContainer}>
      <div className={styles.iconContainer}>
        <svg className={styles.warningIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h1 className={styles.title}>Lien expiré</h1>
      <p className={styles.subtitle}>
        Ce lien de vérification a expiré. Les liens sont valides pendant 24 heures.
        Demandez un nouveau lien de vérification.
      </p>
      
      <div className={styles.buttonGroup}>
        <button
          onClick={handleResendEmail}
          className={styles.primaryButton}
          disabled={countdown > 0 || resendLoading}
        >
          {resendLoading ? (
            <>
              <div className={styles.spinner} />
              Envoi en cours...
            </>
          ) : countdown > 0 ? (
            `Renvoyer dans ${countdown}s`
          ) : (
            'Obtenir un nouveau lien'
          )}
        </button>
        
        <button
          onClick={handleGoToLogin}
          className={styles.secondaryButton}
        >
          Retour à la connexion
        </button>
      </div>
    </div>
  );

  const renderAlreadyVerifiedState = () => (
    <div className={styles.stateContainer}>
      <div className={styles.iconContainer}>
        <svg className={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className={styles.title}>Déjà vérifié !</h1>
      <p className={styles.subtitle}>
        Votre email est déjà vérifié. Vous allez être redirigé vers votre tableau de bord.
      </p>
      
      <div className={styles.buttonGroup}>
        <button
          onClick={handleGoToDashboard}
          className={styles.primaryButton}
        >
          Continuer vers le dashboard
        </button>
      </div>
    </div>
  );

  const renderResendState = () => {
    const userEmail = user?.email || 
                     localStorage.getItem('tempUserEmail') || 
                     searchParams.get('email');
    
    return (
      <div className={styles.stateContainer}>
        <div className={styles.iconContainer}>
          <svg className={styles.emailIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
        
        <h1 className={styles.title}>Vérifiez votre email</h1>
        <p className={styles.subtitle}>
          {userEmail ? (
            <>
              Nous avons envoyé un lien de vérification à <strong>{userEmail}</strong>.
              Cliquez sur le lien dans l'email pour vérifier votre compte.
            </>
          ) : (
            'Un email de vérification vous a été envoyé. Cliquez sur le lien pour vérifier votre compte.'
          )}
        </p>
        
        <div className={styles.infoBox}>
          <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className={styles.infoContent}>
            <p className={styles.infoTitle}>Vous ne trouvez pas l'email ?</p>
            <ul className={styles.infoList}>
              <li>Vérifiez votre dossier spam/courrier indésirable</li>
              <li>Assurez-vous que l'adresse email est correcte</li>
              <li>L'email peut prendre quelques minutes à arriver</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.buttonGroup}>
          <button
            onClick={handleResendEmail}
            className={styles.primaryButton}
            disabled={countdown > 0 || resendLoading}
          >
            {resendLoading ? (
              <>
                <div className={styles.spinner} />
                Envoi en cours...
              </>
            ) : countdown > 0 ? (
              `Renvoyer dans ${countdown}s`
            ) : (
              'Renvoyer l\'email'
            )}
          </button>
          
          <button
            onClick={handleGoToDashboard}
            className={styles.secondaryButton}
          >
            {isAuthenticated ? 'Continuer vers le dashboard' : 'Se connecter'}
          </button>
        </div>
      </div>
    );
  };

  // Fonction pour rendre l'état actuel
  const renderCurrentState = () => {
    switch (verificationState) {
      case 'verifying':
        return renderVerifyingState();
      case 'success':
        return renderSuccessState();
      case 'error':
        return renderErrorState();
      case 'expired':
        return renderExpiredState();
      case 'already_verified':
        return renderAlreadyVerifiedState();
      case 'resend':
        return renderResendState();
      default:
        return renderResendState();
    }
  };

  // Afficher le loading global du contexte
  if (isLoading && verificationState === 'initial') {
    return (
      <div className={styles.verificationPage}>
        <BackgroundAnimation />
        <div className={styles.verificationContainer}>
          <div className={styles.verificationCard}>
            {renderVerifyingState()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.verificationPage}>
      <BackgroundAnimation />
      
      <div className={styles.verificationContainer}>
        <div className={styles.verificationCard}>
          {renderCurrentState()}
        </div>
      </div>

      {/* Modal de succès */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Vérification réussie !"
        size="small"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalIcon}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <p className={styles.modalText}>
            Votre email a été vérifié avec succès ! Vous pouvez maintenant accéder à toutes les fonctionnalités de votre compte.
          </p>
          
          <div className={styles.modalButtons}>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/dashboard', { replace: true });
              }}
              className={styles.primaryButton}
            >
              Continuer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmailVerification;