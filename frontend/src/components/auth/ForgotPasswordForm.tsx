import React, { useState } from 'react';
import styles from './ForgotPasswordForm.module.css';
import { useToast } from '../../components/ui/Toast';
import { authService } from '../../services/auth';

interface ForgotPasswordFormProps {
  onSubmit?: (emailOrUsername: string) => void;
  onBack: () => void;
  isOpen:boolean;
  loadings?: boolean;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  onBack,
  isOpen,
  loadings = false
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const { success, error } = useToast();
  const validateInput = (value: string): boolean => {
    if (value.length < 3) return false;
    
    // Vérifier si c'est un email ou un username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
    
    return emailRegex.test(value) || usernameRegex.test(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailOrUsername(value);
    
    if (value.length > 0) {
      setIsValid(validateInput(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput(emailOrUsername)) {
      error('Veuillez saisir une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(emailOrUsername);
      setStep('success');
      success(
        'Email envoyé !',
        'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe'
      );
    } catch (err: any) {
      error(
        'Erreur lors de l\'envoi',
        err.error?.message || 'Une erreur s\'est produite. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getInputType = () => {
    return emailOrUsername.includes('@') ? 'email' : 'text';
  };
  const handleClose = () => {
    setEmailOrUsername('');
    setIsValid(null);
    setStep('form');
    onBack();
  };

  const getPlaceholder = () => {
    return 'Email ou nom d\'utilisateur';
  };

  const getValidationClass = (): string => {
    if (isValid === null) return '';
    return isValid ? styles.inputValid : styles.inputError;
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <div className={styles.iconContainer}>
          <svg className={styles.lockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a3 3 0 10-6 0v2M9 21h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        <h2 className={styles.formTitle}>Mot de passe oublié ?</h2>
        <p className={styles.formSubtitle}>
          Pas de souci ! Saisissez votre adresse email ou votre nom d'utilisateur 
          et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form className={styles.forgotForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="emailOrUsername">
            Email ou nom d'utilisateur
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={getInputType()}
              id="emailOrUsername"
              className={`${styles.formInput} ${getValidationClass()}`}
              placeholder={getPlaceholder()}
              value={emailOrUsername}
              onChange={handleInputChange}
              required
              disabled={loading}
              autoComplete="email username"
            />
            <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {emailOrUsername.includes('@') ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              )}
            </svg>
            {isValid === true && (
              <svg className={styles.validationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onBack}
            className={styles.secondaryButton}
            disabled={loading}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour
          </button>

          <button
            type="submit"
            className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
            disabled={loading || !validateInput(emailOrUsername)}
          >
            {loading ? (
              <>
                <div className={styles.spinner} />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <span>Envoyer le lien</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </>
            )}
          </button>
        </div>

        <div className={styles.helpText}>
          <div className={styles.infoBox}>
            <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className={styles.infoContent}>
              <p className={styles.infoTitle}>Vous ne recevez pas d'email ?</p>
              <p className={styles.infoDescription}>
                Vérifiez votre dossier spam ou contactez le support si le problème persiste.
              </p>
            </div>
          </div>
        </div>
      </form>
      
    </div>
  );
};

export default ForgotPasswordForm;