import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, variant = 'primary' }) => {
  return (
    <div className={`stats-card stats-card-${variant}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <div className="stats-card-label">{label}</div>
        <div className="stats-card-value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
