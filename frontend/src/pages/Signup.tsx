import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Check, User, Phone } from 'lucide-react';
import styles from './Signup.module.css';
import authService, { SignupData } from '../services/auth';
import AnalyticsService from '../services/analyticsService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState({
    firstName: null as boolean | null,
    lastName: null as boolean | null,
    email: null as boolean | null,
    phone: null as boolean | null,
    password: null as boolean | null,
    confirmPassword: null as boolean | null
  });
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, label: '', color: '' });

  // Validation functions
  const validateName = (name: string) => name.length >= 2;
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{9,}$/.test(phone.replace(/\s/g, ''));
  
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    if (checks.length) strength++;
    if (checks.uppercase) strength++;
    if (checks.number) strength++;
    if (checks.special) strength++;
    
    if (strength === 4) return { level: 100, label: 'Très fort', color: '#10B981' };
    if (strength === 3) return { level: 75, label: 'Fort', color: '#3FD5B8' };
    if (strength === 2) return { level: 50, label: 'Moyen', color: '#F59E0B' };
    if (strength === 1) return { level: 25, label: 'Faible', color: '#EF4444' };
    return { level: 0, label: 'Très faible', color: '#DC2626' };
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => 
    password === confirmPassword && password.length >= 8;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);

    // Validate on change
    if (value.length > 0) {
      let isValid = false;
      switch(name) {
        case 'firstName':
        case 'lastName':
          isValid = validateName(value);
          break;
        case 'email':
          isValid = validateEmail(value);
          break;
        case 'phone':
          isValid = validatePhone(value);
          break;
        case 'password':
          isValid = validatePassword(value);
          setPasswordStrength(getPasswordStrength(value));
          // Re-validate confirm password if it exists
          if (formData.confirmPassword) {
            setValidation(prev => ({
              ...prev,
              confirmPassword: validateConfirmPassword(value, formData.confirmPassword)
            }));
          }
          break;
        case 'confirmPassword':
          isValid = validateConfirmPassword(formData.password, value);
          break;
        default:
          break;
      }
      setValidation(prev => ({ ...prev, [name]: isValid }));
    } else {
      setValidation(prev => ({ ...prev, [name]: null }));
      if (name === 'password') {
        setPasswordStrength({ level: 0, label: '', color: '' });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allValid = 
      validateName(formData.firstName) &&
      validateName(formData.lastName) &&
      validateEmail(formData.email) &&
      validatePhone(formData.phone) &&
      validatePassword(formData.password) &&
      validateConfirmPassword(formData.password, formData.confirmPassword) &&
      acceptTerms;

    if (!allValid) {
      setError('Veuillez remplir correctement tous les champs');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Track signup attempt
      AnalyticsService.trackEvent('signup_attempt', {
        method: 'email',
        timestamp: Date.now()
      });

      const signupData: SignupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'student',
        termsAccepted: acceptTerms
      };

      const response = await authService.signup(signupData);

      // Track successful signup
      AnalyticsService.trackEvent('signup_success', {
        userId: response.user.id,
        method: 'email'
      });

      // Redirect to dashboard or email verification page
      if (!response.user.isEmailVerified) {
        navigate('/verify-code', { 
          state: { email: formData.email } 
        });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      
      // Track failed signup
      AnalyticsService.trackEvent('signup_failed', {
        error: err.message || 'Unknown error',
        method: 'email'
      });

      if (err.status === 409) {
        setError('Cette adresse email est déjà utilisée');
      } else if (err.status === 400) {
        setError(err.message || 'Données invalides. Veuillez vérifier vos informations');
      } else if (err.status === 422) {
        setError('Validation échouée. Veuillez vérifier tous les champs');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer plus tard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      // Track Google signup attempt
      AnalyticsService.trackEvent('signup_attempt', {
        method: 'google',
        timestamp: Date.now()
      });

      // TODO: Implement Google OAuth flow
      // This would typically open a popup or redirect to Google OAuth
      console.log('Google signup - À implémenter avec OAuth');
      
      // For now, show a message
      setError('L\'inscription via Google sera bientôt disponible');
    } catch (err: any) {
      console.error('Erreur Google signup:', err);
      setError('Impossible de se connecter avec Google');
      
      AnalyticsService.trackEvent('signup_failed', {
        error: err.message,
        method: 'google'
      });
    } finally {
      setLoading(false);
    }
  };

  // Navigate back
  const handleBackToHome = () => {
    navigate('/');
  };

  // Navigate to login
  const handleLogin = () => {
    navigate('/login');
  };

  // Get input class based on validation
  const getInputClass = (fieldName: keyof typeof validation) => {
    const isValid = validation[fieldName];
    if (isValid === null) return styles.formInput;
    return `${styles.formInput} ${isValid ? styles.inputValid : styles.inputError}`;
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.signupContainer}>
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
            <h1 className={styles.heroTitle}>Rejoignez Win+</h1>
            <p className={styles.heroSubtitle}>
              Créez votre compte et commencez votre parcours vers la réussite. Accédez à des milliers d'épreuves et ressources éducatives.
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
            disabled={loading}
          >
            <ArrowLeft size={18} />
            Retour
          </button>

          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Inscription</h2>
            <p className={styles.formSubtitle}>
              Créez votre compte gratuitement en quelques secondes
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #EF4444',
              color: '#DC2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className={styles.signupForm} onSubmit={handleSubmit}>
            {/* Nom et Prénom */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="firstName">
                  Prénom
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={getInputClass('firstName')}
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <User size={20} className={styles.inputIcon} />
                  {validation.firstName === true && (
                    <Check size={18} className={styles.validationIcon} />
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
                    name="lastName"
                    className={getInputClass('lastName')}
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <User size={20} className={styles.inputIcon} />
                  {validation.lastName === true && (
                    <Check size={18} className={styles.validationIcon} />
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">
                Adresse e-mail
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={getInputClass('email')}
                  placeholder="exemple@domaine.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
                <Mail size={20} className={styles.inputIcon} />
                {validation.email === true && (
                  <Check size={18} className={styles.validationIcon} />
                )}
              </div>
            </div>

            {/* Téléphone */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="phone">
                Numéro de téléphone
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={getInputClass('phone')}
                  placeholder="+237 6XX XX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <Phone size={20} className={styles.inputIcon} />
                {validation.phone === true && (
                  <Check size={18} className={styles.validationIcon} />
                )}
              </div>
            </div>

            {/* Mot de passe et confirmation */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="password">
                  Mot de passe
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={getInputClass('password')}
                    placeholder="Min. 8 caractères"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <Lock size={20} className={styles.inputIcon} />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {validation.password === true && (
                    <Check size={18} className={styles.validationIcon} />
                  )}
                </div>
                
                {/* Indicateur de force du mot de passe */}
                {formData.password && (
                  <div className={styles.passwordStrengthContainer}>
                    <div className={styles.passwordStrengthBar}>
                      <div 
                        className={styles.passwordStrengthFill}
                        style={{ 
                          width: `${passwordStrength.level}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      />
                    </div>
                    <span 
                      className={styles.passwordStrengthLabel}
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
                
                {/* Exigences du mot de passe */}
                {formData.password && (
                  <div className={styles.passwordRequirements}>
                    <div className={formData.password.length >= 8 ? styles.requirementMet : styles.requirementUnmet}>
                      {formData.password.length >= 8 ? '✓' : '○'} Au moins 8 caractères
                    </div>
                    <div className={/[A-Z]/.test(formData.password) ? styles.requirementMet : styles.requirementUnmet}>
                      {/[A-Z]/.test(formData.password) ? '✓' : '○'} Une lettre majuscule
                    </div>
                    <div className={/[0-9]/.test(formData.password) ? styles.requirementMet : styles.requirementUnmet}>
                      {/[0-9]/.test(formData.password) ? '✓' : '○'} Un chiffre
                    </div>
                    <div className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? styles.requirementMet : styles.requirementUnmet}>
                      {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? '✓' : '○'} Un caractère spécial
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="confirmPassword">
                  Confirmer
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={getInputClass('confirmPassword')}
                    placeholder="Confirmez"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <Lock size={20} className={styles.inputIcon} />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {validation.confirmPassword === true && (
                    <Check size={18} className={styles.validationIcon} />
                  )}
                </div>
              </div>
            </div>

            {/* Checkbox conditions */}
            <div className={styles.termsCheckbox}>
              <input
                type="checkbox"
                id="terms"
                className={styles.checkbox}
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="terms" className={styles.termsText}>
                J'accepte les{' '}
                <a href="/terms" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
                  conditions d'utilisation
                </a>
                {' '}et la{' '}
                <a href="/privacy" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
                  politique de confidentialité
                </a>
              </label>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              className={`${styles.primaryButton} ${loading ? styles.loading : ''}`}
              disabled={loading || !acceptTerms}
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

            {/* Séparateur */}
            <div className={styles.divider}>
              <span>ou s'inscrire avec</span>
            </div>

            {/* Bouton Google */}
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleSignup}
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

            {/* Lien de connexion */}
            <div className={styles.loginLink}>
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                className={styles.loginButton}
                onClick={handleLogin}
                disabled={loading}
              >
                Connectez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;