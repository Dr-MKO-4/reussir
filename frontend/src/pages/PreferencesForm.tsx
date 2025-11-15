// ==================== PreferencesForm.tsx ====================
import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import Card from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import './Profile.css';


interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  emailFrequency: 'realtime' | 'daily' | 'weekly' | 'never';
  defaultExam: string;
  autoPlay: boolean;
  soundEffects: boolean;
  animations: boolean;
}

interface PreferencesFormProps {
  initialPreferences: UserPreferences;
  onSubmit: (preferences: UserPreferences) => Promise<void>;
  className?: string;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({
  initialPreferences,
  onSubmit,
  className = '',
}) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        await onSubmit(preferences);
        setSuccessMessage('Préférences enregistrées avec succès !');
        setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
    };  // ✅ Le point-virgule DOIT être ici (ligne 51)

    return (  // ✅ Le return doit être au même niveau que handleSubmit
    <Card variant="outlined" className={`preferences-form ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <h2 className="form-title">Préférences</h2>
            <p className="form-subtitle">Personnalisez votre expérience</p>
          </div>
        </div>

        {successMessage && (
          <Alert variant="success" title="Succès" isDismissible onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        <div className="form-content">
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Région & Langue
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Langue</label>
                <select
                  className="form-select"
                  value={preferences.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fuseau horaire</label>
                <select
                  className="form-select"
                  value={preferences.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                >
                  <option value="Africa/Douala">Douala (GMT+1)</option>
                  <option value="Africa/Lagos">Lagos (GMT+1)</option>
                  <option value="Europe/Paris">Paris (GMT+1)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Apparence
            </h3>

            <div className="form-group">
              <label className="form-label">Thème</label>
              <div className="theme-selector">
                <label className={`theme-option ${preferences.theme === 'light' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={preferences.theme === 'light'}
                    onChange={(e) => handleChange('theme', e.target.value)}
                  />
                  <div className="theme-preview theme-preview-light">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span>Clair</span>
                </label>

                <label className={`theme-option ${preferences.theme === 'dark' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={preferences.theme === 'dark'}
                    onChange={(e) => handleChange('theme', e.target.value)}
                  />
                  <div className="theme-preview theme-preview-dark">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <span>Sombre</span>
                </label>

                <label className={`theme-option ${preferences.theme === 'auto' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    checked={preferences.theme === 'auto'}
                    onChange={(e) => handleChange('theme', e.target.value)}
                  />
                  <div className="theme-preview theme-preview-auto">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span>Auto</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres avancés
            </h3>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Lecture automatique</div>
                  <div className="setting-description">Lancer automatiquement les vidéos</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.autoPlay}
                    onChange={(e) => handleChange('autoPlay', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Effets sonores</div>
                  <div className="setting-description">Sons lors des interactions</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.soundEffects}
                    onChange={(e) => handleChange('soundEffects', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Animations</div>
                  <div className="setting-description">Activer les animations de l'interface</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.animations}
                    onChange={(e) => handleChange('animations', e.target.checked)}
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
            Enregistrer les préférences
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PreferencesForm;