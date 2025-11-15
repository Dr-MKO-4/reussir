import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import Card from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import './Profile.css';

interface PasswordChangeFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  className?: string;
}

/**
 * Formulaire de changement de mot de passe
 */
const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSubmit,
  className = '',
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Validation du mot de passe
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordStrength = validatePassword(newPassword);

  const getPasswordStrengthLabel = () => {
    const validCount = Object.values(passwordStrength).filter(v => v === true).length - 1;
    if (validCount <= 1) return { label: 'Très faible', color: 'danger', width: '20%' };
    if (validCount === 2) return { label: 'Faible', color: 'warning', width: '40%' };
    if (validCount === 3) return { label: 'Moyen', color: 'info', width: '60%' };
    if (validCount === 4) return { label: 'Fort', color: 'success', width: '80%' };
    return { label: 'Très fort', color: 'success', width: '100%' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Validations
    if (!currentPassword) {
      setErrorMessage('Veuillez saisir votre mot de passe actuel');
      return;
    }

    if (!passwordStrength.isValid) {
      setErrorMessage('Le nouveau mot de passe ne respecte pas les critères de sécurité');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ currentPassword, newPassword });
      setSuccessMessage('Mot de passe modifié avec succès !');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue. Veuillez réessayer.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrengthLabel();

  return (
    <Card variant="outlined" className={`password-change-form ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <h2 className="form-title">Changer le mot de passe</h2>
            <p className="form-subtitle">Assurez-vous de choisir un mot de passe sécurisé</p>
          </div>
          <div className="security-badge">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Sécurisé</span>
          </div>
        </div>

        {successMessage && (
          <Alert variant="success" title="Succès" isDismissible onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="error" title="Erreur" isDismissible onDismiss={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        )}

        <div className="form-content">
          {/* Mot de passe actuel */}
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Mot de passe actuel <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={showCurrentPassword ? 'Masquer' : 'Afficher'}
              >
                {showCurrentPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              Nouveau mot de passe <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Masquer' : 'Afficher'}
              >
                {showNewPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="password-strength-meter">
                <div className="strength-bar">
                  <div 
                    className={`strength-fill strength-fill-${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <span className={`strength-label strength-label-${strength.color}`}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="password-requirements">
              <p className="requirements-title">Votre mot de passe doit contenir :</p>
              <ul className="requirements-list">
                <li className={passwordStrength.minLength ? 'valid' : 'invalid'}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Au moins 8 caractères
                </li>
                <li className={passwordStrength.hasUpperCase ? 'valid' : 'invalid'}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Au moins une majuscule (A-Z)
                </li>
                <li className={passwordStrength.hasLowerCase ? 'valid' : 'invalid'}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Au moins une minuscule (a-z)
                </li>
                <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Au moins un chiffre (0-9)
                </li>
                <li className={passwordStrength.hasSpecialChar ? 'valid' : 'invalid'}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Au moins un caractère spécial (!@#$%...)
                </li>
              </ul>
            </div>
          )}

          {/* Confirmer le mot de passe */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmer le nouveau mot de passe <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Masquer' : 'Afficher'}
              >
                {showConfirmPassword ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <span className="form-error">Les mots de passe ne correspondent pas</span>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!passwordStrength.isValid || newPassword !== confirmPassword}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Changer le mot de passe
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;