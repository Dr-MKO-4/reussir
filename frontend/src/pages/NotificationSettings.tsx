import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import Card from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import './Profile.css';


interface NotificationPreferences {
  email: {
    newSubjects: boolean;
    promotions: boolean;
    studyReminders: boolean;
    examAlerts: boolean;
    achievements: boolean;
    newsletter: boolean;
  };
  push: {
    studyReminders: boolean;
    examAlerts: boolean;
    achievements: boolean;
    messages: boolean;
  };
  sms: {
    examAlerts: boolean;
    importantUpdates: boolean;
  };
}

interface NotificationSettingsProps {
  initialPreferences: NotificationPreferences;
  onSubmit: (preferences: NotificationPreferences) => Promise<void>;
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  initialPreferences,
  onSubmit,
  className = '',
}) => {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = (category: keyof NotificationPreferences, key: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key as keyof typeof prev[typeof category]],
      }
    }));
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
  };

  return (
    <Card variant="outlined" className={`notification-settings ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <h2 className="form-title">Notifications</h2>
            <p className="form-subtitle">Gérez vos préférences de notification</p>
          </div>
        </div>

        {successMessage && (
          <Alert variant="success" title="Succès" isDismissible onDismiss={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        <div className="form-content">
          {/* Email Notifications */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Notifications par email
            </h3>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Nouveaux sujets</div>
                  <div className="setting-description">Recevez des alertes sur les nouveaux sujets disponibles</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.email.newSubjects}
                    onChange={() => handleToggle('email', 'newSubjects')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Promotions et offres</div>
                  <div className="setting-description">Soyez informé des promotions et réductions</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.email.promotions}
                    onChange={() => handleToggle('email', 'promotions')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Rappels d'étude</div>
                  <div className="setting-description">Recevez des rappels pour maintenir votre rythme d'étude</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.email.studyReminders}
                    onChange={() => handleToggle('email', 'studyReminders')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Alertes d'examens</div>
                  <div className="setting-description">Notifications importantes sur vos examens à venir</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.email.examAlerts}
                    onChange={() => handleToggle('email', 'examAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Achievements</div>
                  <div className="setting-description">Célébrez vos réussites et nouveaux badges</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.email.achievements}
                    onChange={() => handleToggle('email', 'achievements')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Newsletter</div>
                  <div className="setting-description">Actualités et conseils d'apprentissage hebdomadaires</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.email.newsletter}
                    onChange={() => handleToggle('email', 'newsletter')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications push
            </h3>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Rappels d'étude</div>
                  <div className="setting-description">Notifications push pour vos sessions d'étude</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.push.studyReminders}
                    onChange={() => handleToggle('push', 'studyReminders')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Alertes d'examens</div>
                  <div className="setting-description">Rappels importants avant vos examens</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.push.examAlerts}
                    onChange={() => handleToggle('push', 'examAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Achievements</div>
                  <div className="setting-description">Notifications instantanées de vos réussites</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.push.achievements}
                    onChange={() => handleToggle('push', 'achievements')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Messages</div>
                  <div className="setting-description">Nouveaux messages et réponses</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.push.messages}
                    onChange={() => handleToggle('push', 'messages')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="form-section">
            <h3 className="section-title">
              <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Notifications SMS
            </h3>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Alertes d'examens</div>
                  <div className="setting-description">SMS de rappel avant vos examens importants</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.sms.examAlerts}
                    onChange={() => handleToggle('sms', 'examAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-name">Mises à jour importantes</div>
                  <div className="setting-description">Informations critiques sur votre compte</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.sms.importantUpdates}
                    onChange={() => handleToggle('sms', 'importantUpdates')}
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

export default NotificationSettings;