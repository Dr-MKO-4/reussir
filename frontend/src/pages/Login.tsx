import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation du mot de passe
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Gestion du changement d'email
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value.length > 0) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(null);
    }
  };

  // Gestion du changement de mot de passe
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (value.length > 0) {
      setPasswordValid(validatePassword(value));
    } else {
      setPasswordValid(null);
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateEmail(email) && validatePassword(password)) {
      setLoading(true);
      
      // Simulation d'une connexion (remplacer par votre logique d'authentification)
      setTimeout(() => {
        console.log('Connexion avec:', { email, password, rememberMe });
        setLoading(false);
        // navigate('/dashboard'); // Rediriger après connexion
      }, 2000);
    }
  };

  // Connexion avec Google
  const handleGoogleLogin = () => {
    console.log('Connexion avec Google');
    // Implémenter la logique de connexion Google
  };

  // Mot de passe oublié
  const handleForgotPassword = () => {
    console.log('Mot de passe oublié');
    // navigate('/forgot-password');
  };

  // Retour à l'accueil
  const handleBackToHome = () => {
    navigate('/');
  };

  // Aller à l'inscription
  const handleSignup = () => {
    navigate('/signup');
  };

  // Classe de validation des inputs
  const getInputClass = (isValid) => {
    if (isValid === null) return styles.formInput;
    return `${styles.formInput} ${isValid ? styles.inputValid : styles.inputError}`;
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        {/* Section Hero (Gauche) */}
        <div className={styles.heroSection}>
          {/* Formes géométriques flottantes */}
          <div className={styles.decorations}>
            <div className={styles.floatingElement} style={{ top: '10%', left: '10%', animationDelay: '0s' }}>
              <div className={styles.circle}></div>
            </div>
            <div className={styles.floatingElement} style={{ top: '70%', right: '15%', animationDelay: '2s' }}>
              <div className={styles.triangle}></div>
            </div>
            <div className={styles.floatingElement} style={{ bottom: '20%', left: '20%', animationDelay: '4s' }}>
              <div className={styles.square}></div>
            </div>
            <div className={styles.floatingElement} style={{ top: '30%', right: '25%', animationDelay: '1s' }}>
              <div className={styles.hexagon}></div>
            </div>
          </div>

          <div className={styles.brandLogo}>
            <img src="/logo1.png" alt="Win+ Logo" />
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Bienvenue sur Win+</h1>
            <p className={styles.heroSubtitle}>
              Connectez-vous pour accéder à votre espace personnel et découvrir toutes nos fonctionnalités pour réussir vos examens.
            </p>
          </div>

          {/* Animation des vagues en bas */}
          <div className={styles.waveEffect}>
            <svg
              className={styles.wave}
              viewBox="0 24 150 28"
              preserveAspectRatio="none"
              shapeRendering="auto"
            >
              <defs>
                <path
                  id="gentle-wave"
                  d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                />
              </defs>
              <g className={styles.waves}>
                <use href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                <use href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                <use href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                <use href="#gentle-wave" x="48" y="7" fill="white" />
              </g>
            </svg>
          </div>
        </div>

        {/* Section Formulaire (Droite) */}
        <div className={styles.formSection}>
          <button 
            className={styles.backButton}
            onClick={handleBackToHome}
            type="button"
          >
            <ArrowLeft size={18} />
            Retour
          </button>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Connexion</h2>
            <p className={styles.formSubtitle}>
              Saisissez vos identifiants pour accéder à votre compte
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
                  className={getInputClass(emailValid)}
                  placeholder="exemple@domaine.com"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
                <Mail size={20} className={styles.inputIcon} />
                {emailValid === true && (
                  <Check size={18} className={styles.validationIcon} />
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
                  className={getInputClass(passwordValid)}
                  placeholder="Saisissez votre mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <Lock size={20} className={styles.inputIcon} />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {passwordValid === true && (
                  <Check size={18} className={styles.validationIcon} />
                )}
              </div>
            </div>

            {/* Options */}
            <div className={styles.formOptions}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Se souvenir de moi
              </label>
              <button
                type="button"
                className={styles.forgotLink}
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
              disabled={loading || !emailValid || !passwordValid}
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
              <span>ou continuer avec</span>
            </div>

            {/* Bouton Google */}
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            {/* Lien d'inscription */}
            <div className={styles.signupLink}>
              Pas encore de compte ?{' '}
              <button
                type="button"
                className={styles.signupButton}
                onClick={handleSignup}
                disabled={loading}
              >
                Inscrivez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;