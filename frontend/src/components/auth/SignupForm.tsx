import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import GoogleButton from '../ui/GoogleButton';
import styles from './SignupForm.module.css';

interface SignupFormProps {
  onSubmit?: (data: SignupData) => void;
  onGoogleSignup?: () => void;
  onLogin?: () => void;
  loading?: boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onGoogleSignup,
  onLogin,
  loading = false
}) => {
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationState, setValidationState] = useState({
    firstName: null as boolean | null,
    lastName: null as boolean | null,
    email: null as boolean | null,
    password: null as boolean | null,
    confirmPassword: null as boolean | null,
    acceptTerms: null as boolean | null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync with global dark mode state
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

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.className = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.className = '';
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    return confirmPassword === formData.password && confirmPassword.length > 0;
  };

  const handleInputChange = (field: keyof SignupData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'acceptTerms' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validation en temps réel
    if (typeof value === 'string' && value.length > 0) {
      let isValid = false;
      switch (field) {
        case 'firstName':
        case 'lastName':
          isValid = validateName(value);
          break;
        case 'email':
          isValid = validateEmail(value);
          break;
        case 'password':
          isValid = validatePassword(value);
          break;
        case 'confirmPassword':
          isValid = validateConfirmPassword(value);
          break;
      }
      setValidationState(prev => ({ ...prev, [field]: isValid }));
    } else if (field === 'acceptTerms') {
      setValidationState(prev => ({ ...prev, [field]: value as boolean }));
    } else {
      setValidationState(prev => ({ ...prev, [field]: null }));
    }
  };

  const isStep1Valid = () => {
    return validateName(formData.firstName) && 
           validateName(formData.lastName) && 
           validateEmail(formData.email);
  };

  const isStep2Valid = () => {
    return validatePassword(formData.password) &&
           validateConfirmPassword(formData.confirmPassword) &&
           formData.acceptTerms;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep1Valid() && isStep2Valid()) {
      onSubmit?.(formData);
    }
  };

  const getInputValidationClass = (isValid: boolean | null): string => {
    if (isValid === null) return '';
    return isValid ? styles.inputValid : styles.inputError;
  };

  return (
    <div className={styles.formSection}>
      {/* Theme Toggle */}
      <div className={styles.themeToggleContainer}>
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label={isDarkMode ? 'Mode clair' : 'Mode sombre'}
          data-tooltip={isDarkMode ? 'Mode clair' : 'Mode sombre'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <span className={styles.progressText}>
          Étape {currentStep} sur {totalSteps}
        </span>
      </div>

      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Créer un compte</h2>
        <p className={styles.formSubtitle}>
          {currentStep === 1 
            ? "Commençons par vos informations personnelles"
            : "Sécurisez votre compte avec un mot de passe"
          }
        </p>
      </div>

      <form className={styles.signupForm} onSubmit={handleSubmit}>
        {/* Étape 1: Informations personnelles */}
        <div className={`${styles.stepContainer} ${currentStep === 1 ? styles.stepActive : styles.stepHidden}`}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="firstName">
                Prénom
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="firstName"
                  className={`${styles.formInput} ${getInputValidationClass(validationState.firstName)}`}
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  required
                  disabled={loading}
                />
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {validationState.firstName === true && (
                  <svg className={styles.validationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="lastName">
                Nom
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="lastName"
                  className={`${styles.formInput} ${getInputValidationClass(validationState.lastName)}`}
                  placeholder="Votre nom"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  required
                  disabled={loading}
                />
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {validationState.lastName === true && (
                  <svg className={styles.validationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Adresse e-mail
            </label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                id="email"
                className={`${styles.formInput} ${getInputValidationClass(validationState.email)}`}
                placeholder="exemple@domaine.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                autoComplete="email"
                disabled={loading}
              />
              <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {validationState.email === true && (
                <svg className={styles.validationIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className={`${styles.primaryButton} ${!isStep1Valid() ? styles.disabled : ''}`}
            disabled={!isStep1Valid() || loading}
          >
            Continuer
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Étape 2: Mot de passe et conditions */}
        <div className={`${styles.stepContainer} ${currentStep === 2 ? styles.stepActive : styles.stepHidden}`}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Mot de passe
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
                disabled={loading}
              />
              <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
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
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                required
                disabled={loading}
              />
              <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
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

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={formData.acceptTerms}
                onChange={handleInputChange('acceptTerms')}
                required
                disabled={loading}
              />
              <span className={styles.checkboxCustom}>
                <svg className={styles.checkboxIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <span className={styles.checkboxText}>
                J'accepte les{' '}
                <button type="button" className={styles.linkButton}>
                  conditions d'utilisation
                </button>
                {' '}et la{' '}
                <button type="button" className={styles.linkButton}>
                  politique de confidentialité
                </button>
              </span>
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handlePrevStep}
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
              disabled={loading || !isStep2Valid()}
            >
              {loading ? (
                <>
                  <div className={styles.spinner} />
                  <span>Création en cours...</span>
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>
        </div>

        {/* Séparateur et Google (visible uniquement à l'étape 1) */}
        {currentStep === 1 && (
          <>
            <div className={styles.divider}>
              <span>ou</span>
            </div>

            <GoogleButton 
              onClick={onGoogleSignup}
              disabled={loading}
              loading={loading}
            />
          </>
        )}

        {/* Lien de connexion */}
        <div className={styles.loginLink}>
          Déjà un compte ?{' '}
          <button 
            type="button" 
            className={styles.loginButton}
            onClick={onLogin}
            disabled={loading}
          >
            Connectez-vous
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;