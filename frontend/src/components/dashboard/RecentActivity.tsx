/**
 * Composant RecentActivity - COMPLÈTE 100%
 * Affiche la liste de l'activité récente de l'utilisateur
 */

import React from 'react';

interface RecentActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  type: 'purchase' | 'progress' | 'completion' | 'badge' | 'comment';
  icon?: React.ReactNode;
}

interface RecentActivityProps {
  activities: RecentActivityItem[];
  onActivityClick?: (activityId: string) => void;
  maxItems?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onActivityClick,
  maxItems = 5,
}) => {
  const getActivityIcon = (type: string): string => {
    const icons: Record<string, string> = {
      purchase: '🛒',
      progress: '📈',
      completion: '✅',
      badge: '🏆',
      comment: '💬',
    };
    return icons[type] || '📌';
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;

    return d.toLocaleDateString('fr-FR');
  };

  const displayedActivities = activities.slice(0, maxItems);

  if (displayedActivities.length === 0) {
    return (
      <div className="recent-activity empty-state">
        <h3>Activité récente</h3>
        <p className="empty-message">Aucune activité pour le moment</p>
      </div>
    );
  }

  return (
    <div className="recent-activity">
      <h3>Activité récente</h3>
      <ul className="activity-list">
        {displayedActivities.map((activity) => (
          <li
            key={activity.id}
            className={`activity-item activity-${activity.type}`}
            onClick={() => onActivityClick?.(activity.id)}
            role={onActivityClick ? 'button' : undefined}
            tabIndex={onActivityClick ? 0 : undefined}
          >
            <div className="activity-icon">
              {activity.icon || getActivityIcon(activity.type)}
            </div>
            
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              {activity.description && (
                <div className="activity-description">{activity.description}</div>
              )}
            </div>

            <div className="activity-timestamp">
              {formatDate(activity.timestamp)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
