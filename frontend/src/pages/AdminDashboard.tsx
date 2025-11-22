import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Tabs } from '../components/common/Tabs';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';
import { AdminStats } from './admin/AdminStats';
import { UserManagement } from './admin/UserManagement';
import { SubjectManagement } from './admin/SubjectManagement';
import { OrderManagement } from './admin/OrderManagement';
import { AnalyticsDashboard } from './admin/AnalyticsDashboard';
import './admin/AdminDashboard.css';

interface DashboardStats {
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
}

interface RecentActivity {
  id: string;
  type: 'user' | 'subject' | 'order' | 'system';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  serverLoad: number;
  memoryUsage: number;
  diskUsage: number;
  apiResponseTime: number;
}

/**
 * AdminDashboard - Tableau de bord administrateur complet
 */
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [notifications, setNotifications] = useState<number>(5);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Données mockées
      setStats({
        totalUsers: 12547,
        activeUsers: 8934,
        newUsersToday: 127,
        totalSubjects: 1843,
        publishedSubjects: 1687,
        pendingSubjects: 156,
        totalOrders: 45632,
        pendingOrders: 234,
        completedOrders: 45398,
        revenue: 125680000,
        revenueGrowth: 12.5,
        conversionRate: 3.8,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'user',
          title: 'Nouvel utilisateur inscrit',
          description: 'Jean Dupont vient de créer un compte',
          timestamp: new Date().toISOString(),
          severity: 'success',
        },
        {
          id: '2',
          type: 'order',
          title: 'Nouvelle commande',
          description: 'Commande #45632 - Pack Premium Bac C',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          severity: 'info',
        },
        {
          id: '3',
          type: 'subject',
          title: 'Sujet en attente de validation',
          description: 'Mathématiques Bac 2025 attend approbation',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          severity: 'warning',
        },
        {
          id: '4',
          type: 'system',
          title: 'Sauvegarde système',
          description: 'Sauvegarde automatique effectuée avec succès',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          severity: 'success',
        },
        {
          id: '5',
          type: 'system',
          title: 'Pic de charge serveur',
          description: 'Utilisation CPU à 85% - surveillance active',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          severity: 'warning',
        },
      ]);

      setSystemHealth({
        status: 'healthy',
        uptime: 99.98,
        serverLoad: 45,
        memoryUsage: 62,
        diskUsage: 38,
        apiResponseTime: 125,
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHealthStatusColor = (status: SystemHealth['status']) => {
    const colors = {
      healthy: 'success',
      warning: 'warning',
      critical: 'danger',
    };
    return colors[status] as any;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      user: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      subject: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      order: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      system: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[type];
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return time.toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard-loading">
        <Spinner size="xl" label="Chargement du tableau de bord..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <Alert variant="error" title="Erreur">
        Impossible de charger les données du tableau de bord
      </Alert>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">Administration</h1>
            <p className="admin-subtitle">Tableau de bord et gestion de la plateforme</p>
          </div>
          <div className="admin-header-actions">
            <button className="notification-button" onClick={() => navigate('/admin/notifications')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications > 0 && <span className="notification-badge">{notifications}</span>}
            </button>
            <Button variant="primary" onClick={() => navigate('/admin/settings')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      {/* System Health Banner */}
      {systemHealth && (
        <div className={`system-health-banner health-${systemHealth.status}`}>
          <div className="health-status">
            <div className="health-icon">
              {systemHealth.status === 'healthy' ? '✓' : systemHealth.status === 'warning' ? '⚠' : '✕'}
            </div>
            <div className="health-info">
              <div className="health-title">
                Système {systemHealth.status === 'healthy' ? 'opérationnel' : systemHealth.status === 'warning' ? 'sous surveillance' : 'critique'}
              </div>
              <div className="health-subtitle">
                Uptime: {systemHealth.uptime}% • Charge: {systemHealth.serverLoad}% • Réponse API: {systemHealth.apiResponseTime}ms
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/system-health')}>
            Détails système
          </Button>
        </div>
      )}

      {/* Main Stats Grid */}
      <AdminStats stats={stats} />

      {/* Main Content Tabs */}
      <div className="admin-main-content">
        <Tabs
          tabs={[
            {
              id: 'overview',
              label: 'Vue d\'ensemble',
              icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              ),
              content: (
                <div className="overview-content">
                  {/* Recent Activities */}
                  <Card variant="outlined" className="recent-activities-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Activité récente
                      </h3>
                      <Button variant="secondary" size="sm" onClick={() => navigate('/admin/activity-log')}>
                        Voir tout
                      </Button>
                    </div>
                    <div className="activities-list">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <div className={`activity-icon activity-icon-${activity.type}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="activity-content">
                            <div className="activity-header">
                              <h4 className="activity-title">{activity.title}</h4>
                              {activity.severity && (
                                <Badge variant={activity.severity === 'error' ? 'danger' : activity.severity}>
                                  {activity.severity}
                                </Badge>
                              )}
                            </div>
                            <p className="activity-description">{activity.description}</p>
                            <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card variant="outlined" className="quick-actions-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Actions rapides
                      </h3>
                    </div>
                    <div className="quick-actions-grid">
                      <button className="quick-action-btn" onClick={() => setActiveTab('users')}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>Ajouter utilisateur</span>
                      </button>

                      <button className="quick-action-btn" onClick={() => setActiveTab('subjects')}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Nouveau sujet</span>
                      </button>

                      <button className="quick-action-btn" onClick={() => navigate('/admin/reports')}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Générer rapport</span>
                      </button>

                      <button className="quick-action-btn" onClick={() => navigate('/admin/backup')}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Sauvegarder</span>
                      </button>
                    </div>
                  </Card>
                </div>
              ),
            },
            {
              id: 'users',
              label: 'Utilisateurs',
              icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              content: <UserManagement />,
            },
            {
              id: 'subjects',
              label: 'Sujets',
              icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              content: <SubjectManagement />,
            },
            {
              id: 'orders',
              label: 'Commandes',
              icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              content: <OrderManagement />,
            },
            {
              id: 'analytics',
              label: 'Analytics',
              icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              content: <AnalyticsDashboard />,
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;