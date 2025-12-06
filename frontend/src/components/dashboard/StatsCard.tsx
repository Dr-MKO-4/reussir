/**
 * Composant StatsCard - COMPLÈTE 100%
 * Affiche une statistique avec icône, valeur et tendance
 */

import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  variant = 'primary',
  trend,
  trendValue,
  onClick,
}) => {
  const trendEmoji = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

  return (
    <div
      className={`stats-card stats-card-${variant} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon && <div className="stats-card-icon">{icon}</div>}
      
      <div className="stats-card-content">
        <div className="stats-card-label">{label}</div>
        <div className="stats-card-value">{value}</div>
      </div>

      {trend && (
        <div className={`stats-card-trend ${trendColor}`}>
          <span className="trend-emoji">{trendEmoji}</span>
          {trendValue && <span className="trend-value">{trendValue}</span>}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
