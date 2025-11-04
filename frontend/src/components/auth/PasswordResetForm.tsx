import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import styles from './PasswordResetForm.module.css';

interface PasswordResetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSuccess,
  onCancel,
  loading = false
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationState, setValidationState] = useState({
    password: null as boolean | null,
    confirmPassword: null as boolean | null,
  });
  
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setTokenValid(true);
    } else {
      setTokenValid(false);
      showError(
        'Lien invalide',
        'Le lien de réinitialisation est manquant ou invalide.'
      );
    }
  }, [searchParams, showError]);

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password);
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    return confirmPassword === formData.password && confirmPassword.length > 0;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validation en temps réel
    if (value.length > 0) {
      let isValid = false;
      switch (field) {
        case 'password':
          isValid = validatePassword(value);
          break;
        case 'confirmPassword':
          isValid = value === formData.password && value.length > 0;
          break;
      }
      setValidationState(prev => ({ ...prev, [field]: isValid }));
    } else {
      setValidationState(prev => ({ ...prev, [field]: null }));
    }

    // Revalider confirmPassword si password change
    if (field === 'password' && formData.confirmPassword) {
      const confirmValid = formData.confirmPassword === value && formData.confirmPassword.length > 0;
      setValidationState(prev => ({ ...prev, confirmPassword: confirmValid }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      showError('Erreur', 'Token de réinitialisation manquant');
      return;
    }

    if (!validatePassword(formData.password)) {
      showError('Erreur', 'Le mot de passe doit contenir au moins 8 caractères avec lettres et chiffres');
      return;
    }

    if (!validateConfirmPassword(formData.confirmPassword)) {
      showError('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    try {
      clearError();
      await resetPassword(token, formData.password,formData.confirmPassword);
      
      showSuccess(
        'Mot de passe réinitialisé !',
        'Votre mot de passe a été mis à jour avec succès.'
      );
      
      onSuccess?.();
      
      // Redirection vers login après 2 secondes
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: unknown) {
      let errorMessage = 'Une erreur s\'est produite lors de la réinitialisation.';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        errorMessage = (error as { message: string }).message;
      }
      showError('Erreur de réinitialisation', errorMessage);
    }
  };

  const getInputValidationClass = (isValid: boolean | null): string => {
    if (isValid === null) return '';
    return isValid ? styles.inputValid : styles.inputError;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Faible' };
    if (password.length < 8) return { strength: 2, label: 'Moyen' };
    if (validatePassword(password)) return { strength: 3, label: 'Fort' };
    return { strength: 2, label: 'Moyen' };
  };

  if (tokenValid === false) {
    return (
      <div className={styles.formSection}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className={styles.errorTitle}>Lien invalide</h3>
          <p className={styles.errorDescription}>
            Ce lien de réinitialisation est invalide ou a expiré. 
            Veuillez demander un nouveau lien.
          </p>
          <div className={styles.errorActions}>
            <button
              onClick={() => navigate('/login')}
              className={styles.primaryButton}
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className={styles.formSection}>
      <div className={styles.formHeader}>
        <div className={styles.iconContainer}>
          <svg className={styles.lockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a3 3 0 10-6 0v2M9 21h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className={styles.formTitle}>Nouveau mot de passe</h2>
        <p className={styles.formSubtitle}>
          Créez un mot de passe fort et sécurisé pour votre compte.
        </p>
      </div>

      <form className={styles.resetForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">
            Nouveau mot de passe
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`${styles.formInput} ${getInputValidationClass(validationState.password)}`}
              placeholder="Minimum 8 caractères avec lettres et chiffres"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              disabled={loading || isLoading}
            />
            <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading || isLoading}
            >
              {showPassword ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </button>
            {validationState.password === true && (
              <svg className={styles.validationIconPassword} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </div>
          
          {formData.password.length > 0 && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthBar}>
                <div 
                  className={`${styles.strengthFill} ${styles[`strength${passwordStrength.strength}`]}`}
                  style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                />
              </div>
              <span className={`${styles.strengthLabel} ${styles[`strength${passwordStrength.strength}Label`]}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="confirmPassword">
            Confirmer le mot de passe
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`${styles.formInput} ${getInputValidationClass(validationState.confirmPassword)}`}
              placeholder="Confirmez votre nouveau mot de passe"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              disabled={loading || isLoading}
            />
            <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading || isLoading}
            >
              {showConfirmPassword ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </button>
            {validationState.confirmPassword === true && (
              <svg className={styles.validationIconPassword} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </div>
        </div>

        <div className={styles.passwordRequirements}>
          <h4>Exigences du mot de passe :</h4>
          <ul>
            <li className={formData.password.length >= 8 ? styles.requirementMet : ''}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              Au moins 8 caractères
            </li>
            <li className={/[a-zA-Z]/.test(formData.password) ? styles.requirementMet : ''}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              Au moins une lettre
            </li>
            <li className={/\d/.test(formData.password) ? styles.requirementMet : ''}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              Au moins un chiffre
            </li>
            <li className={formData.confirmPassword === formData.password && formData.confirmPassword ? styles.requirementMet : ''}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              Les mots de passe correspondent
            </li>
          </ul>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onCancel || (() => navigate('/login'))}
            className={styles.secondaryButton}
            disabled={loading || isLoading}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Annuler
          </button>

          <button
            type="submit"
            className={`${styles.primaryButton} ${(loading || isLoading) ? styles.loading : ''}`}
            disabled={
              loading || 
              isLoading || 
              !validatePassword(formData.password) || 
              !validateConfirmPassword(formData.confirmPassword)
            }
          >
            {(loading || isLoading) ? (
              <>
                <div className={styles.spinner} />
                <span>Réinitialisation...</span>
              </>
            ) : (
              <>
                <span>Réinitialiser le mot de passe</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;