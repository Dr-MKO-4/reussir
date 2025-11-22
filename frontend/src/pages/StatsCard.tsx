import React, { ReactNode } from 'react';
import './Dashboard.css';

interface StatsCardProps {
  icon: ReactNode;  // ✅ Changé de string à ReactNode
  label: string;
  value: string | number;
  trend?: number;
  progress?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  trend,
  progress,
  color = 'primary',
  className = '',
}) => {
  return (
    <div className={`stats-card stats-card-${color} ${className}`}>
      <div className="stats-card-background">
        <div className="stats-card-shape stats-card-shape-1"></div>
        <div className="stats-card-shape stats-card-shape-2"></div>
      </div>
      
      <div className="stats-card-content">
        <div className="stats-card-header">
          <div className="stats-icon">{icon}</div>
          {trend !== undefined && (
            <div className={`stats-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {trend >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className="stats-card-body">
          <div className="stats-value">{value}</div>
          <div className="stats-label">{label}</div>
        </div>

        {progress !== undefined && (
          <div className="stats-progress">
            <div className="stats-progress-bar">
              <div 
                className="stats-progress-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="stats-progress-text">{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      <div className="stats-card-glow"></div>
    </div>
  );
};

export default StatsCard;