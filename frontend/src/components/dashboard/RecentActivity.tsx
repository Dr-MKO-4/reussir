import React from 'react';

interface RecentActivityItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="recent-activity">
      <h3>Activité récente</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className={`activity-item activity-${activity.type}`}>
            <span className="activity-title">{activity.title}</span>
            <span className="activity-date">{activity.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
