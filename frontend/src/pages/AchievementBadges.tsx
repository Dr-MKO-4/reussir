import React, { useState } from 'react';
import Card from '../components/common/Card';
import './Dashboard.css';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  locked?: boolean;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
  className?: string;
}

/**
 * Widget de badges et achievements avec animations
 */
const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  achievements,
  className = '',
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card variant="outlined" className={`achievement-badges ${className}`}>
      <div className="achievements-header">
        <div>
          <h3 className="achievements-title">
            <svg className="achievements-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Achievements
          </h3>
          <p className="achievements-progress-text">
            {unlockedCount}/{totalCount} débloqués
          </p>
        </div>

        <div className="achievements-completion">
          <svg className="completion-circle" viewBox="0 0 36 36">
            <path
              className="completion-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
            />
            <path
              className="completion-fill"
              strokeDasharray={`${(unlockedCount / totalCount) * 100}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3"
            />
          </svg>
          <span className="completion-text">{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <button
            key={achievement.id}
            className={`achievement-badge ${achievement.locked ? 'locked' : ''} ${achievement.progress !== undefined ? 'in-progress' : ''}`}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <div className="badge-icon-wrapper">
              <div className="badge-icon">{achievement.icon}</div>
              {achievement.locked && (
                <div className="badge-lock">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
              {achievement.unlockedAt && (
                <div className="badge-checkmark">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {achievement.progress !== undefined && !achievement.locked && (
                <div className="badge-progress">
                  <svg className="progress-ring" viewBox="0 0 40 40">
                    <circle
                      className="progress-ring-bg"
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      strokeWidth="3"
                    />
                    <circle
                      className="progress-ring-fill"
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      strokeWidth="3"
                      strokeDasharray={`${achievement.progress * 1.13} 113`}
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                  <span className="progress-percentage">{achievement.progress}%</span>
                </div>
              )}
            </div>
            <div className="badge-title">{achievement.title}</div>
          </button>
        ))}
      </div>

      {selectedAchievement && (
        <div className="achievement-modal" onClick={() => setSelectedAchievement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAchievement(null)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={`modal-badge ${selectedAchievement.locked ? 'locked' : ''}`}>
              <div className="modal-badge-icon">{selectedAchievement.icon}</div>
              {selectedAchievement.locked && (
                <div className="modal-lock-overlay">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              )}
            </div>

            <h3 className="modal-title">{selectedAchievement.title}</h3>
            <p className="modal-description">{selectedAchievement.description}</p>

            {selectedAchievement.unlockedAt && (
              <div className="modal-unlocked">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Débloqué le {formatDate(selectedAchievement.unlockedAt)}</span>
              </div>
            )}

            {selectedAchievement.progress !== undefined && !selectedAchievement.locked && (
              <div className="modal-progress">
                <div className="modal-progress-bar">
                  <div 
                    className="modal-progress-fill"
                    style={{ width: `${selectedAchievement.progress}%` }}
                  />
                </div>
                <span className="modal-progress-text">
                  Progression: {selectedAchievement.progress}%
                </span>
              </div>
            )}

            {selectedAchievement.locked && (
              <div className="modal-locked-message">
                🔒 Continue tes efforts pour débloquer ce badge !
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AchievementBadges;