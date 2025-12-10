import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, Check, AlertCircle, Loader } from 'lucide-react';
import styles from './VerifyCode.module.css';
import authService from '../services/auth';
import AnalyticsService from '../services/analyticsService';

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Récupérer l'email depuis le state de navigation ou localStorage
  useEffect(() => {
    const navigationEmail = (location.state as any)?.email;
    const storedEmail = localStorage.getItem('tempUserEmail');
    const finalEmail = navigationEmail || storedEmail;

    if (finalEmail) {
      setEmail(finalEmail);
    } else {
      // Si pas d'email, rediriger vers signup
      navigate('/signup', { replace: true });
    }
  }, [location, navigate]);

  // Gestion du countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus automatique sur le premier champ
  useEffect(() => {
    const firstInput = document.querySelector(
      `.${styles.codeInput}`
    ) as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  // Gérer la saisie du code
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Seulement les chiffres
    
    if (value.length <= 6) {
      setCode(value);
      setError(null);
    }
  };

  // Formater le code avec espaces (XXX XXX)
  const formatCode = (value: string) => {
    if (value.length <= 3) return value;
    return `${value.slice(0, 3)} ${value.slice(3)}`;
  };

  // Soumettre la vérification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Appel API pour vérifier le code via le service
      await authService.verifyEmail({
        email: email,
        code: code,
      });

      // Track successful verification
      AnalyticsService.trackEvent('email_verified', {
        email: email,
        method: 'code',
        timestamp: Date.now(),
      });

      setSuccess(true);

      // Redirection après succès
      setTimeout(() => {
        // Nettoyer localStorage
        localStorage.removeItem('tempUserEmail');
        navigate('/login', {
          state: { message: 'Email vérifié ! Vous pouvez maintenant vous connecter.' },
          replace: true,
        });
      }, 2000);
    } catch (err: any) {
      console.error('Erreur vérification code:', err);

      // Track failed verification
      AnalyticsService.trackEvent('email_verification_failed', {
        email: email,
        error: err.message,
      });

      if (err.message.includes('expiré') || err.message.includes('expired')) {
        setError('Ce code a expiré. Veuillez en demander un nouveau.');
      } else if (err.message.includes('invalide') || err.message.includes('invalid')) {
        setError('Code incorrect. Veuillez réessayer.');
      } else {
        setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Renvoyer le code
  const handleResendCode = async () => {
    if (countdown > 0 || resendLoading) return;

    setResendLoading(true);
    setError(null);

    try {
      // Appel API pour renvoyer le code via le service
      await authService.resendVerificationEmail(email);

      setCountdown(60);
      setCode('');

      AnalyticsService.trackEvent('resend_verification_code', {
        email: email,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      console.error('Erreur envoi code:', err);
      setError('Impossible de renvoyer le code. Veuillez réessayer.');
    } finally {
      setResendLoading(false);
    }
  };

  // Retour
  const handleBack = () => {
    navigate('/signup', { replace: true });
  };

  return (
    <div className={styles.verifyPage}>
      {/* Formes flottantes en arrière-plan */}
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

      <div className={styles.verifyContainer}>
        {/* Section Hero (Gauche) */}
        <div className={styles.heroSection}>
          <div className={styles.brandLogo}>
            <img src="/logo1.png" alt="Win+ Logo" />
          </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Vérifiez votre email</h1>
            <p className={styles.heroSubtitle}>
              Nous avons envoyé un code de vérification à votre adresse email. Entrez ce code pour confirmer votre compte.
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
                  id="gentle-wave-verify"
                  d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
                />
              </defs>
              <g className={styles.waves}>
                <use href="#gentle-wave-verify" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                <use href="#gentle-wave-verify" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                <use href="#gentle-wave-verify" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                <use href="#gentle-wave-verify" x="48" y="7" fill="white" />
              </g>
            </svg>
          </div>
        </div>

        {/* Section Formulaire (Droite) */}
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            {/* Header */}
            <div className={styles.formHeader}>
              <button className={styles.backButton} onClick={handleBack} title="Retour">
                <ArrowLeft size={20} />
              </button>
              <h2 className={styles.formTitle}>Vérifier le code</h2>
              <div style={{ width: '40px' }}></div>
            </div>

            {/* Message */}
            <p className={styles.formMessage}>
              Nous avons envoyé un code de 6 chiffres à{' '}
              <strong>{email}</strong>
            </p>

            {/* Formulaire */}
            <form onSubmit={handleVerify} className={styles.form}>
              {/* Affichage du succès */}
              {success && (
                <div className={styles.successBox}>
                  <Check size={24} />
                  <p>Code vérifié avec succès !</p>
                </div>
              )}

              {/* Affichage des erreurs */}
              {error && !success && (
                <div className={styles.errorBox}>
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
              )}

              {/* Input code */}
              <div className={styles.inputGroup}>
                <label htmlFor="code" className={styles.label}>
                  Code de vérification
                </label>
                <input
                  type="text"
                  id="code"
                  className={styles.codeInput}
                  placeholder="000 000"
                  value={formatCode(code)}
                  onChange={handleCodeChange}
                  disabled={loading || success}
                  maxLength={7}
                  autoComplete="off"
                />
                <p className={styles.inputHint}>
                  Entrez le code à 6 chiffres reçu par email
                </p>
              </div>

              {/* Bouton vérifier */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading || success || code.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader size={18} className={styles.spinner} />
                    Vérification en cours...
                  </>
                ) : success ? (
                  <>
                    <Check size={18} />
                    Vérifié !
                  </>
                ) : (
                  'Vérifier le code'
                )}
              </button>

              {/* Renvoyer le code */}
              <div className={styles.resendContainer}>
                <p>Vous n'avez pas reçu le code ?</p>
                <button
                  type="button"
                  className={styles.resendButton}
                  onClick={handleResendCode}
                  disabled={countdown > 0 || resendLoading || success}
                >
                  {resendLoading ? (
                    <>
                      <Loader size={16} className={styles.spinner} />
                      Envoi en cours...
                    </>
                  ) : countdown > 0 ? (
                    `Renvoyer dans ${countdown}s`
                  ) : (
                    'Renvoyer le code'
                  )}
                </button>
              </div>

              {/* Info supplémentaire */}
              <div className={styles.infoBox}>
                <Mail size={18} />
                <div>
                  <p className={styles.infoTitle}>Conseil</p>
                  <ul className={styles.infoList}>
                    <li>Vérifiez votre dossier spam/courrier indésirable</li>
                    <li>L'email peut prendre quelques minutes à arriver</li>
                    <li>Le code est valide 24 heures</li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
