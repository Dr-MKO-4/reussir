import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import GoogleButton from '../ui/GoogleButton';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => void;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onSignup?: () => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  onSignup,
  loading = false
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
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
    return password.length >= 8;
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value.length > 0) {
      setPasswordValid(validatePassword(value));
    } else {
      setPasswordValid(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEmail(email) && validatePassword(password)) {
      onSubmit?.(email, password);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
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

      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Connexion</h2>
        <p className={styles.formSubtitle}>
          Saisissez vos identifiants pour accéder à votre espace
        </p>
      </div>

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {/* Champ Email */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">
            Adresse e-mail
          </label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              id="email"
              className={`${styles.formInput} ${getInputValidationClass(emailValid)}`}
              placeholder="exemple@domaine.com"
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
              disabled={loading}
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

        {/* Champ Mot de passe */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">
            Mot de passe
          </label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`${styles.formInput} ${getInputValidationClass(passwordValid)}`}
              placeholder="Saisissez votre mot de passe"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
              disabled={loading}
            />
            <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePassword}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              disabled={loading}
            >
              {showPassword ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="19" height="19">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="19" height="19">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </button>
            {passwordValid === true && (
              <svg className={styles.validationIconPassword} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            )}
          </div>
        </div>

        {/* Mot de passe oublié */}
        <div className={styles.formGroup}>
          <div className={styles.forgotPassword}>
            <button 
              type="button" 
              className={styles.forgotLink}
              onClick={onForgotPassword}
              disabled={loading}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
          disabled={loading || !validateEmail(email) || !validatePassword(password)}
        >
          {loading ? (
            <>
              <div className={styles.spinner} />
              <span>Connexion en cours...</span>
            </>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Séparateur */}
        <div className={styles.divider}>
          <span>ou</span>
        </div>

        {/* Bouton Google */}
        <GoogleButton 
          onClick={onGoogleLogin}
          disabled={loading}
          loading={loading}
        />

        {/* Lien d'inscription */}
        <div className={styles.signupLink}>
          Pas encore de compte ?{' '}
          <button 
            type="button" 
            className={styles.signupButton}
            onClick={onSignup}
            disabled={loading}
          >
            Inscrivez-vous
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;