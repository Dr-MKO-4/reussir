// src/components/dashboard/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import {apiClient} from '../../services/api';
import { User, UserRole, AuditLog, SecurityLog, DashboardStats } from '../../types/auth';
import styles from './Dashboard.module.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  // États pour les données
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  
  // États UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'security'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Pagination
  const [userPage, setUserPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const usersPerPage = 10;
  const logsPerPage = 20;

  // Charger les données initiales
  useEffect(() => {
    loadDashboardData();
  }, []);

const loadDashboardData = async () => {
  try {
    setLoading(true);

    // Charger les statistiques
    const statsResponse = await apiClient.get<DashboardStats>('/admin/stats');
    const fetchedStats = statsResponse.data?.data ?? null;
    setStats(fetchedStats);

    // Charger les utilisateurs récents
    const usersResponse = await apiClient.get<User[]>('/admin/users', {
      params: { page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }
    });
    const fetchedUsers = usersResponse.data?.data ?? [];
    setUsers(fetchedUsers);

    // Charger les logs récents (audit + security)
    const [auditResponse, securityResponse] = await Promise.all([
      apiClient.get<AuditLog[]>('/admin/audit-logs', { params: { page: 1, limit: 50 } }),
      apiClient.get<SecurityLog[]>('/admin/security-logs', { params: { page: 1, limit: 50 } })
    ]);

    const fetchedAuditLogs = auditResponse.data?.data ?? [];
    const fetchedSecurityLogs = securityResponse.data?.data ?? [];

    setAuditLogs(fetchedAuditLogs);
    setSecurityLogs(fetchedSecurityLogs);

  } catch (error: any) {
    showError('Erreur de chargement', 'Impossible de charger les données du dashboard');
    console.error('Dashboard loading error:', error);
  } finally {
    setLoading(false);
  }
};

  // Gérer la suppression d'un utilisateur
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      success('Utilisateur supprimé', 'L\'utilisateur a été supprimé avec succès');
    } catch (error: any) {
      showError('Erreur', error?.error?.message || 'Impossible de supprimer l\'utilisateur');
    }
  };

  // Gérer la suspension d'un utilisateur
  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { 
        isActive: !suspend 
      });
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !suspend } : u
      ));
      
      success(
        suspend ? 'Utilisateur suspendu' : 'Utilisateur réactivé',
        `L'utilisateur a été ${suspend ? 'suspendu' : 'réactivé'} avec succès`
      );
    } catch (error: any) {
      showError('Erreur', error?.error?.message || 'Impossible de modifier le statut');
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination des utilisateurs
  const paginatedUsers = filteredUsers.slice(
    (userPage - 1) * usersPerPage,
    userPage * usersPerPage
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Chargement du dashboard...</span>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <h1>Dashboard Administrateur</h1>
            <p>Bienvenue, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.refreshButton}
              onClick={loadDashboardData}
              title="Actualiser"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            <button className={styles.logoutButton} onClick={onLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          Aperçu
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
          </svg>
          Utilisateurs ({users.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'logs' ? styles.active : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Logs d'audit
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'security' ? styles.active : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Sécurité
        </button>
      </nav>

      {/* Contenu principal */}
      <main className={styles.dashboardContent}>
        {/* Onglet Aperçu */}
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            {/* Statistiques */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats?.totalUsers || 0}</div>
                  <div className={styles.statLabel}>Utilisateurs total</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats?.activeUsers || 0}</div>
                  <div className={styles.statLabel}>Utilisateurs actifs</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats?.newUsersToday || 0}</div>
                  <div className={styles.statLabel}>Nouveaux aujourd'hui</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{stats?.failedLoginsToday || 0}</div>
                  <div className={styles.statLabel}>Échecs de connexion</div>
                </div>
              </div>
            </div>

            {/* Graphiques et activité récente */}
            <div className={styles.overviewGrid}>
              <div className={styles.chartCard}>
                <h3>Activité récente</h3>
                <div className={styles.activityList}>
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityAction}>{log.action}</div>
                        <div className={styles.activityTime}>
                          {new Date(log.createdAt).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3>Alertes de sécurité</h3>
                <div className={styles.securityAlerts}>
                  {securityLogs
                    .filter(log => log.severity === 'ERROR' || log.severity === 'WARN')
                    .slice(0, 5)
                    .map((log) => (
                    <div key={log.id} className={`${styles.alertItem} ${styles[log.severity.toLowerCase()]}`}>
                      <div className={styles.alertIcon}>
                        {log.severity === 'ERROR' ? (
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                          </svg>
                        )}
                      </div>
                      <div className={styles.alertContent}>
                        <div className={styles.alertDescription}>{log.description}</div>
                        <div className={styles.alertTime}>
                          {new Date(log.createdAt).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Utilisateurs */}
        {activeTab === 'users' && (
          <div className={styles.usersTab}>
            {/* Barre de recherche */}
            <div className={styles.searchBar}>
              <div className={styles.searchInput}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher des utilisateurs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table des utilisateurs */}
            <div className={styles.tableContainer}>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} />
                            ) : (
                              <span>{user.firstName[0]}{user.lastName[0]}</span>
                            )}
                          </div>
                          <div className={styles.userDetails}>
                            <div className={styles.userName}>
                              {user.firstName} {user.lastName}
                            </div>
                            <div className={styles.userUsername}>@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`${styles.roleTag} ${styles[user.role.toLowerCase()]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusTag} ${user.isActive ? styles.active : styles.inactive}`}>
                          {user.isActive ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.actionButton}
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            title="Voir détails"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          
                          {user.role !== UserRole.SUPER_ADMIN && (
                            <>
                              <button
                                className={`${styles.actionButton} ${user.isActive ? styles.suspend : styles.activate}`}
                                onClick={() => handleSuspendUser(user.id, user.isActive)}
                                title={user.isActive ? 'Suspendre' : 'Réactiver'}
                              >
                                {user.isActive ? (
                                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"/>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                )}
                              </button>
                              
                              <button
                                className={`${styles.actionButton} ${styles.delete}`}
                                onClick={() => handleDeleteUser(user.id)}
                                title="Supprimer"
                              >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
              <div className={styles.pagination}>
                <button
                  disabled={userPage === 1}
                  onClick={() => setUserPage(userPage - 1)}
                  className={styles.paginationButton}
                >
                  Précédent
                </button>
                <span className={styles.paginationInfo}>
                  Page {userPage} sur {Math.ceil(filteredUsers.length / usersPerPage)}
                </span>
                <button
                  disabled={userPage >= Math.ceil(filteredUsers.length / usersPerPage)}
                  onClick={() => setUserPage(userPage + 1)}
                  className={styles.paginationButton}
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}

        {/* Onglet Logs d'audit */}
        {activeTab === 'logs' && (
          <div className={styles.logsTab}>
            <div className={styles.tableContainer}>
              <table className={styles.logsTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Utilisateur</th>
                    <th>Action</th>
                    <th>Entité</th>
                    <th>IP</th>
                    <th>Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.slice(0, logsPerPage).map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                      <td>{log.userId || 'Système'}</td>
                      <td>
                        <span className={styles.actionTag}>
                          {log.action}
                        </span>
                      </td>
                      <td>{log.entity || '-'}</td>
                      <td>{log.ipAddress || '-'}</td>
                      <td>
                        {log.metadata && (
                          <button
                            className={styles.detailsButton}
                            onClick={() => alert(JSON.stringify(log.metadata, null, 2))}
                          >
                            Voir
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 'security' && (
          <div className={styles.securityTab}>
            <div className={styles.tableContainer}>
              <table className={styles.securityTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Événement</th>
                    <th>Utilisateur</th>
                    <th>Sévérité</th>
                    <th>IP</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {securityLogs.slice(0, logsPerPage).map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                      <td>
                        <span className={styles.eventTag}>
                          {log.event}
                        </span>
                      </td>
                      <td>{log.userId || 'Anonyme'}</td>
                      <td>
                        <span className={`${styles.severityTag} ${styles[log.severity.toLowerCase()]}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td>{log.ipAddress || '-'}</td>
                      <td>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal détails utilisateur */}
      {showUserModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Détails utilisateur</h3>
              <button
                className={styles.modalClose}
                onClick={() => setShowUserModal(false)}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.userDetailGrid}>
                <div className={styles.userDetailItem}>
                  <label>Nom complet:</label>
                  <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>Nom d'utilisateur:</label>
                  <span>{selectedUser.username}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>Rôle:</label>
                  <span>{selectedUser.role}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>Email vérifié:</label>
                  <span>{selectedUser.isEmailVerified ? 'Oui' : 'Non'}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>2FA activé:</label>
                  <span>{selectedUser.twoFactorEnabled ? 'Oui' : 'Non'}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>Inscription:</label>
                  <span>{new Date(selectedUser.createdAt).toLocaleString('fr-FR')}</span>
                </div>
                <div className={styles.userDetailItem}>
                  <label>Dernière connexion:</label>
                  <span>
                    {selectedUser.lastLoginAt 
                      ? new Date(selectedUser.lastLoginAt).toLocaleString('fr-FR')
                      : 'Jamais'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;