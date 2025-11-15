import React from 'react';
import './AdminDashboard.css';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    totalSubjects: number;
    publishedSubjects: number;
    pendingSubjects: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    revenue: number;
    revenueGrowth: number;
    conversionRate: number;
  };
}

/**
 * AdminStats - Cartes de statistiques pour l'admin
 */
export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsCards = [
    {
      title: 'Utilisateurs',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      value: formatNumber(stats.totalUsers),
      subtitle: `${formatNumber(stats.activeUsers)} actifs`,
      badge: `+${stats.newUsersToday} aujourd'hui`,
      color: 'primary',
      trend: 'up',
    },
    {
      title: 'Sujets',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      value: formatNumber(stats.totalSubjects),
      subtitle: `${formatNumber(stats.publishedSubjects)} publiés`,
      badge: stats.pendingSubjects > 0 ? `${stats.pendingSubjects} en attente` : null,
      badgeVariant: 'warning' as const,
      color: 'success',
      trend: 'up',
    },
    {
      title: 'Commandes',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      value: formatNumber(stats.totalOrders),
      subtitle: `${formatNumber(stats.completedOrders)} complétées`,
      badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} en attente` : null,
      badgeVariant: 'info' as const,
      color: 'info',
      trend: 'up',
    },
    {
      title: 'Revenus',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: formatCurrency(stats.revenue),
      subtitle: `Taux de conversion: ${stats.conversionRate}%`,
      badge: `+${stats.revenueGrowth}%`,
      color: 'warning',
      trend: stats.revenueGrowth > 0 ? 'up' : 'down',
    },
  ];

  return (
    <div className="admin-stats-grid">
      {statsCards.map((card, index) => (
        <div key={index} className={`admin-stat-card stat-card-${card.color}`}>
          <div className="stat-card-icon">
            {card.icon}
          </div>
          <div className="stat-card-content">
            <div className="stat-card-header">
              <span className="stat-card-title">{card.title}</span>
              {card.badge && (
                <span className={`stat-badge stat-badge-${card.badgeVariant || card.color}`}>
                  {card.badge}
                </span>
              )}
            </div>
            <div className="stat-card-value">{card.value}</div>
            <div className="stat-card-footer">
              <span className="stat-card-subtitle">{card.subtitle}</span>
              {card.trend && (
                <div className={`stat-trend stat-trend-${card.trend}`}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {card.trend === 'up' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    )}
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;