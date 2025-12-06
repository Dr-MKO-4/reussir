import React from 'react';
import Card from '../components/common/Card';
import './Dashboard.css';

interface Activity {
  id: string;
  type: 'study' | 'purchase' | 'achievement' | 'exam';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

/**
 * Widget d'activités récentes avec timeline
 */
const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  className = '',
}) => {
  const getTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return activityTime.toLocaleDateString('fr-FR');
  };

  const getActivityColor = (type: Activity['type']): string => {
    const colors = {
      study: 'primary',
      purchase: 'success',
      achievement: 'warning',
      exam: 'info',
    };
    return colors[type] || 'primary';
  };

  return (
    <Card variant="outlined" className={`recent-activity ${className}`}>
      <div className="activity-header">
        <h3 className="activity-title">
          <svg className="activity-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activité récente
        </h3>
        <button className="activity-view-all">
          Tout voir
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="activity-timeline">
        {activities.map((activity, index) => (
          <div key={activity.id} className="activity-item">
            <div className={`activity-marker activity-marker-${getActivityColor(activity.type)}`}>
              {activity.icon ? (
                <span className="activity-emoji">{activity.icon}</span>
              ) : (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            {index < activities.length - 1 && <div className="activity-line" />}

            <div className="activity-content">
              <div className="activity-main">
                <h4 className="activity-item-title">{activity.title}</h4>
                <p className="activity-item-description">{activity.description}</p>
              </div>
              <span className="activity-time">{getTimeAgo(activity.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="activity-empty">
          <svg className="activity-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Aucune activité récente</p>
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;