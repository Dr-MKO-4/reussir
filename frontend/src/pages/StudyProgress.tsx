import React from 'react';
import Card from '../components/common/Card';
import './Dashboard.css';

interface StudyProgressProps {
  subjects: number;
  completed: number;
  className?: string;
}

/**
 * Widget de progression d'étude avec graphique circulaire animé
 */
export const StudyProgress: React.FC<StudyProgressProps> = ({
  subjects,
  completed,
  className = '',
}) => {
  const progress = subjects > 0 ? (completed / subjects) * 100 : 0;
  const remaining = subjects - completed;
  
  // Calcul pour le cercle SVG
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card variant="outlined" className={`study-progress ${className}`}>
      <div className="progress-header">
        <h3 className="progress-title">
          <svg className="progress-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Progression globale
        </h3>
      </div>

      <div className="progress-content">
        <div className="progress-circle-wrapper">
          <svg className="progress-circle" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              className="progress-circle-bg"
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              strokeWidth="12"
            />
            
            {/* Progress circle */}
            <circle
              className="progress-circle-fill"
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 80 80)"
            />
            
            {/* Center text */}
            <text x="80" y="70" className="progress-circle-percentage" textAnchor="middle">
              {Math.round(progress)}%
            </text>
            <text x="80" y="95" className="progress-circle-label" textAnchor="middle">
              Complété
            </text>
          </svg>

          <div className="progress-glow"></div>
        </div>

        <div className="progress-stats">
          <div className="progress-stat">
            <div className="stat-icon stat-icon-completed">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{completed}</div>
              <div className="stat-label">Complétés</div>
            </div>
          </div>

          <div className="progress-stat">
            <div className="stat-icon stat-icon-remaining">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{remaining}</div>
              <div className="stat-label">Restants</div>
            </div>
          </div>

          <div className="progress-stat">
            <div className="stat-icon stat-icon-total">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{subjects}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {progress >= 75 && (
          <div className="progress-milestone">
            <div className="milestone-icon">🎉</div>
            <div className="milestone-text">
              <strong>Excellent travail !</strong>
              <p>Vous êtes sur la bonne voie pour atteindre vos objectifs</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudyProgress;