import React, { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import './Profile.css';

// ==================== PrivacySettings.tsx ====================
interface PrivacyPreferences {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showProgress: boolean;
  showAchievements: boolean;
  allowMessages: 'everyone' | 'friends' | 'nobody';
  showOnlineStatus: boolean;
  dataSharing: boolean;
  analyticsTracking: boolean;
}

interface PrivacySettingsProps {
  initialPreferences: PrivacyPreferences;
  onSubmit: (preferences: PrivacyPreferences) => Promise<void>;
  className?: string;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  initialPreferences,
  onSubmit,
  className = '',
}) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = (key: keyof PrivacyPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key],
    }));
  };

  const handleSelect = (key: keyof PrivacyPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(preferences);
      setSuccessMessage('Paramètres de confidentialité enregistrés !');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="outlined" className={`privacy-settings ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <h2 className="form-title">Confidentialité</h2>
            <p className="form-subtitle">Contrôlez la visibilité de vos informations</p>
          </div>
          <div className="security-badge">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Privé</span>
          </div>
        </div>

        {successMessage && (
          <Alert variant="success" title="Succès" isDismissible onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        <div className="form-content">
          {/* Profile Visibility */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visibilité du profil
            </h3>

            <div className="radio-group">
              <label className={`radio-option ${preferences.profileVisibility === 'public' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="profileVisibility"
                  value="public"
                  checked={preferences.profileVisibility === 'public'}
                  onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Public</div>
                  <div className="radio-description">Visible par tous les utilisateurs</div>
                </div>
              </label>

              <label className={`radio-option ${preferences.profileVisibility === 'friends' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="profileVisibility"
                  value="friends"
                  checked={preferences.profileVisibility === 'friends'}
                  onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Amis uniquement</div>
                  <div className="radio-description">Visible uniquement par vos amis</div>
                </div>
              </label>

              <label className={`radio-option ${preferences.profileVisibility === 'private' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="profileVisibility"
                  value="private"
                  checked={preferences.profileVisibility === 'private'}
                  onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Privé</div>
                  <div className="radio-description">Visible uniquement par vous</div>
                </div>
              </label>
            </div>
          </div>

          {/* Information Visibility */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations visibles
            </h3>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Afficher l'email</div>
                  <div className="setting-description">Votre adresse email sera visible sur votre profil</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.showEmail}
                    onChange={() => handleToggle('showEmail')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Afficher le téléphone</div>
                  <div className="setting-description">Votre numéro de téléphone sera visible</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.showPhone}
                    onChange={() => handleToggle('showPhone')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Afficher la progression</div>
                  <div className="setting-description">Vos statistiques d'étude seront visibles</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.showProgress}
                    onChange={() => handleToggle('showProgress')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Afficher les achievements</div>
                  <div className="setting-description">Vos badges et réussites seront visibles</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.showAchievements}
                    onChange={() => handleToggle('showAchievements')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Statut en ligne</div>
                  <div className="setting-description">Les autres peuvent voir si vous êtes connecté</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.showOnlineStatus}
                    onChange={() => handleToggle('showOnlineStatus')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Messages
            </h3>

            <div className="radio-group">
              <label className={`radio-option ${preferences.allowMessages === 'everyone' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="allowMessages"
                  value="everyone"
                  checked={preferences.allowMessages === 'everyone'}
                  onChange={(e) => handleSelect('allowMessages', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Tout le monde</div>
                  <div className="radio-description">Tous les utilisateurs peuvent vous envoyer des messages</div>
                </div>
              </label>

              <label className={`radio-option ${preferences.allowMessages === 'friends' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="allowMessages"
                  value="friends"
                  checked={preferences.allowMessages === 'friends'}
                  onChange={(e) => handleSelect('allowMessages', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Amis uniquement</div>
                  <div className="radio-description">Seuls vos amis peuvent vous contacter</div>
                </div>
              </label>

              <label className={`radio-option ${preferences.allowMessages === 'nobody' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="allowMessages"
                  value="nobody"
                  checked={preferences.allowMessages === 'nobody'}
                  onChange={(e) => handleSelect('allowMessages', e.target.value)}
                />
                <div className="radio-content">
                  <div className="radio-title">Personne</div>
                  <div className="radio-description">Désactiver complètement les messages</div>
                </div>
              </label>
            </div>
          </div>

          {/* Data & Analytics */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Données et analytique
            </h3>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Partage de données</div>
                  <div className="setting-description">Aider à améliorer l'application en partageant vos données anonymisées</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.dataSharing}
                    onChange={() => handleToggle('dataSharing')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Suivi analytique</div>
                  <div className="setting-description">Permettre le suivi pour des recommandations personnalisées</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.analyticsTracking}
                    onChange={() => handleToggle('analyticsTracking')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer les paramètres
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PrivacySettings;