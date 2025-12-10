// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { authService } from '../../services/auth';
import styles from './ForgotPasswordForm.module.css';

interface ForgotPasswordFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const { success, error } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value.length > 0) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      error('Veuillez saisir une adresse email valide');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
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

  const handleClose = () => {
    setEmail('');
    setEmailValid(null);
    setStep('form');
    onClose();
  };

  const getInputValidationClass = (isValid: boolean | null): string => {
    if (isValid === null) return '';
    return isValid ? styles.inputValid : styles.inputError;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mot de passe oublié"
      size="small"
    >
      <div className={styles.forgotPasswordForm}>
        {step === 'form' ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.description}>
              <p>
                Saisissez votre adresse email et nous vous enverrons un lien 
                pour réinitialiser votre mot de passe.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="reset-email">
                Adresse e-mail
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="reset-email"
                  className={`${styles.formInput} ${getInputValidationClass(emailValid)}`}
                  placeholder="exemple@domaine.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  disabled={loading}
                  autoFocus
                />
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                {emailValid === true && (
                  <svg className={styles.validationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={handleClose}
                disabled={loading}
              >
                Annuler
              </button>
              
              <button
                type="submit"
                className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
                disabled={loading || !validateEmail(email)}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner} />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>Envoyer le lien</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            
            <div className={styles.successContent}>
              <h3 className={styles.successTitle}>Email envoyé !</h3>
              <p className={styles.successDescription}>
                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>. 
                Vérifiez votre boîte de réception et cliquez sur le lien pour créer un nouveau mot de passe.
              </p>
              
              <div className={styles.successTips}>
                <h4>Conseils :</h4>
                <ul>
                  <li>Vérifiez vos spams si vous ne voyez pas l'email</li>
                  <li>Le lien expire dans 1 heure</li>
                  <li>Vous pouvez fermer cette fenêtre en toute sécurité</li>
                </ul>
              </div>
            </div>

            <div className={styles.successActions}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleClose}
              >
                Compris
              </button>
              
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setStep('form')}
              >
                Renvoyer l'email
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPasswordForm;