// src/components/dashboard/UserDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { apiService } from '../../services/api';
import { User, UserStats, SessionInfo } from '../../types/auth';
import styles from './Dashboard.module.css';

interface UserDashboardProps {
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout }) => {
  const { user, updateProfile } = useAuth();
  const { success, error: showError } = useToast();

  // États pour les données
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  
  // États UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'security' | 'preferences'>('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  
  // États du formulaire de profil
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.profile?.bio || '',
    website: user?.profile?.website || '',
    location: user?.profile?.location || '',
    company: user?.profile?.company || '',
    jobTitle: user?.profile?.jobTitle || ''
  });
// En haut du fichier, si tu veux tu peux importer les enums existants,
// mais ici on utilise des string unions simples pour rester flexible.

/* -------------------------
   Typage explicite pour preferences
   ------------------------- */
type PreferencesState = {
  theme: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  profileVisibility: string;
  showEmail: boolean;
  showLastSeen: boolean;
};

const [preferences, setPreferences] = useState<PreferencesState>({
  theme: user?.preferences?.theme ?? 'LIGHT',
  language: user?.preferences?.language ?? 'fr',
  // Utiliser nullish coalescing ?? pour garder false si l'API renvoie false
  emailNotifications: user?.preferences?.emailNotifications ?? true,
  pushNotifications: user?.preferences?.pushNotifications ?? true,
  marketingEmails: user?.preferences?.marketingEmails ?? false,
  weeklyDigest: user?.preferences?.weeklyDigest ?? true,
  profileVisibility: user?.preferences?.profileVisibility ?? 'PUBLIC',
  showEmail: user?.preferences?.showEmail ?? false,
  showLastSeen: user?.preferences?.showLastSeen ?? true,
});


  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
  try {
    setLoading(true);
    
    // Charger les statistiques utilisateur
    const statsResponse = await apiService.get<UserStats>('/users/me/stats');
    // statsResponse.data === ApiResponse<UserStats>
    const stats = statsResponse.data?.data ?? null;
    setUserStats(stats);

    // Charger les sessions actives
    const sessionsResponse = await apiService.get<SessionInfo[]>('/auth/sessions');
    // sessionsResponse.data === ApiResponse<SessionInfo[]>
    const fetchedSessions = sessionsResponse.data?.data ?? [];
    setSessions(fetchedSessions);
    
  } catch (error: any) {
    showError('Erreur de chargement', 'Impossible de charger vos données');
    console.error('User data loading error:', error);
  } finally {
    setLoading(false);
  }
};


  // Mettre à jour le profil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedUser = await updateProfile(profileData);
      setEditingProfile(false);
      success('Profil mis à jour', 'Vos informations ont été sauvegardées avec succès');
    } catch (error: any) {
      showError('Erreur', error?.error?.message || 'Impossible de mettre à jour le profil');
    }
  };

  // Mettre à jour les préférences
  const handleUpdatePreferences = async () => {
    try {
      await apiService.put('/users/me/preferences', preferences);
      success('Préférences mises à jour', 'Vos préférences ont été sauvegardées');
    } catch (error: any) {
      showError('Erreur', error?.error?.message || 'Impossible de mettre à jour les préférences');
    }
  };

  // Terminer une session
  const handleTerminateSession = async (sessionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir terminer cette session ?')) {
      return;
    }

    try {
      await apiService.delete(`/auth/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      success('Session terminée', 'La session a été terminée avec succès');
    } catch (error: any) {
      showError('Erreur', 'Impossible de terminer la session');
    }
  };

  // Terminer toutes les autres sessions
  const handleTerminateAllOtherSessions = async () => {
    if (!confirm('Êtes-vous sûr de vouloir terminer toutes les autres sessions ?')) {
      return;
    }

    try {
      await apiService.delete('/auth/sessions/others');
      setSessions(sessions.filter(s => s.isCurrent));
      success('Sessions terminées', 'Toutes les autres sessions ont été terminées');
    } catch (error: any) {
      showError('Erreur', 'Impossible de terminer les sessions');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Chargement de votre dashboard...</span>
      </div>
    );
  }

  return (
    <div className={styles.userDashboard}>
      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <h1>Mon Dashboard</h1>
            <p>Bienvenue, {user?.firstName} {user?.lastName}</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span>{user?.firstName[0]}{user?.lastName[0]}</span>
                )}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user?.firstName} {user?.lastName}</div>
                <div className={styles.userRole}>{user?.role}</div>
              </div>
            </div>
            <button
              className={styles.refreshButton}
              onClick={loadUserData}
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
          className={`${styles.tabButton} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Profil
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
        <button
          className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.active : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Préférences
        </button>
      </nav>

      {/* Contenu principal */}
      <main className={styles.dashboardContent}>
        {/* Onglet Aperçu */}
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            {/* Statistiques utilisateur */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{userStats?.totalSessions || 0}</div>
                  <div className={styles.statLabel}>Sessions total</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>{userStats?.loginCount || 0}</div>
                  <div className={styles.statLabel}>Connexions</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m6-6h-2a2 2 0 00-2 2v6a2 2 0 002 2h2V7a2 2 0 00-2-2z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>
                    {userStats?.profileCompleteness || 0}%
                  </div>
                  <div className={styles.statLabel}>Profil complété</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statNumber}>
                    {userStats?.accountCreatedAt 
                      ? Math.floor((Date.now() - new Date(userStats.accountCreatedAt).getTime()) / (1000 * 60 * 60 * 24))
                      : 0
                    }
                  </div>
                  <div className={styles.statLabel}>Jours depuis inscription</div>
                </div>
              </div>
            </div>

            {/* Informations de compte */}
            <div className={styles.overviewGrid}>
              <div className={styles.chartCard}>
                <h3>Informations du compte</h3>
                <div className={styles.accountInfo}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>Email</div>
                      <div className={styles.infoValue}>{user?.email}</div>
                      <div className={styles.infoStatus}>
                        {user?.isEmailVerified ? (
                          <span className={styles.verified}>✓ Vérifié</span>
                        ) : (
                          <span className={styles.unverified}>⚠ Non vérifié</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>Authentification 2FA</div>
                      <div className={styles.infoValue}>
                        {user?.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                      </div>
                      <div className={styles.infoStatus}>
                        {user?.twoFactorEnabled ? (
                          <span className={styles.verified}>✓ Sécurisé</span>
                        ) : (
                          <span className={styles.warning}>⚠ Recommandé</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>Dernière connexion</div>
                      <div className={styles.infoValue}>
                        {userStats?.lastLoginAt 
                          ? new Date(userStats.lastLoginAt).toLocaleString('fr-FR')
                          : 'Jamais'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3>Conseils de sécurité</h3>
                <div className={styles.securityTips}>
                  {!user?.isEmailVerified && (
                    <div className={styles.tipItem}>
                      <div className={styles.tipIcon}>⚠</div>
                      <div className={styles.tipContent}>
                        <div className={styles.tipTitle}>Vérifiez votre email</div>
                        <div className={styles.tipDescription}>
                          Vérifiez votre adresse email pour sécuriser votre compte
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!user?.twoFactorEnabled && (
                    <div className={styles.tipItem}>
                      <div className={styles.tipIcon}>🛡</div>
                      <div className={styles.tipContent}>
                        <div className={styles.tipTitle}>Activez l'authentification 2FA</div>
                        <div className={styles.tipDescription}>
                          Ajoutez une couche de sécurité supplémentaire à votre compte
                        </div>
                      </div>
                    </div>
                  )}

                  <div className={styles.tipItem}>
                    <div className={styles.tipIcon}>🔐</div>
                    <div className={styles.tipContent}>
                      <div className={styles.tipTitle}>Mot de passe fort</div>
                      <div className={styles.tipDescription}>
                        Utilisez un mot de passe unique et complexe
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Profil */}
        {activeTab === 'profile' && (
          <div className={styles.profileTab}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <h3>Informations personnelles</h3>
                <button
                  className={styles.editButton}
                  onClick={() => setEditingProfile(!editingProfile)}
                >
                  {editingProfile ? 'Annuler' : 'Modifier'}
                </button>
              </div>

              {editingProfile ? (
                <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Prénom</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Nom</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Entreprise</label>
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        placeholder="Votre entreprise"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Poste</label>
                      <input
                        type="text"
                        value={profileData.jobTitle}
                        onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                        placeholder="Votre poste"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Site web</label>
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        placeholder="https://exemple.com"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Localisation</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        placeholder="Ville, Pays"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Biographie</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      placeholder="Parlez-nous de vous..."
                      rows={4}
                    />
                  </div>

                  <div className={styles.formActions}>
                    <button type="submit" className={styles.saveButton}>
                      Sauvegarder
                    </button>
                    <button 
                      type="button" 
                      className={styles.cancelButton}
                      onClick={() => setEditingProfile(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.profileDisplay}>
                  <div className={styles.profileGrid}>
                    <div className={styles.profileItem}>
                      <label>Prénom</label>
                      <span>{user?.firstName || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Nom</label>
                      <span>{user?.lastName || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Nom d'utilisateur</label>
                      <span>@{user?.username}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Email</label>
                      <span>{user?.email}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Entreprise</label>
                      <span>{user?.profile?.company || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Poste</label>
                      <span>{user?.profile?.jobTitle || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Site web</label>
                      <span>
                        {user?.profile?.website ? (
                          <a href={user.profile.website} target="_blank" rel="noopener noreferrer">
                            {user.profile.website}
                          </a>
                        ) : (
                          'Non renseigné'
                        )}
                      </span>
                    </div>
                    <div className={styles.profileItem}>
                      <label>Localisation</label>
                      <span>{user?.profile?.location || 'Non renseigné'}</span>
                    </div>
                  </div>
                  
                  {user?.profile?.bio && (
                    <div className={styles.bioSection}>
                      <label>Biographie</label>
                      <p>{user.profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Sécurité */}
        {activeTab === 'security' && (
          <div className={styles.securityTab}>
            <div className={styles.securityCard}>
              <h3>Sessions actives</h3>
              <div className={styles.sessionsList}>
                {sessions.map((session) => (
                  <div key={session.id} className={styles.sessionItem}>
                    <div className={styles.sessionIcon}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div className={styles.sessionInfo}>
                      <div className={styles.sessionDevice}>
                        {session.deviceInfo || 'Appareil inconnu'}
                        {session.isCurrent && (
                          <span className={styles.currentSession}>Session actuelle</span>
                        )}
                      </div>
                      <div className={styles.sessionDetails}>
                        <span>IP: {session.ipAddress || 'Inconnue'}</span>
                        <span>•</span>
                        <span>
                          Dernière activité: {new Date(session.lastActivity).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        className={styles.terminateButton}
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        Terminer
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {sessions.filter(s => !s.isCurrent).length > 0 && (
                <button
                  className={styles.terminateAllButton}
                  onClick={handleTerminateAllOtherSessions}
                >
                  Terminer toutes les autres sessions
                </button>
              )}
            </div>
          </div>
        )}

        {/* Onglet Préférences */}
        {activeTab === 'preferences' && (
          <div className={styles.preferencesTab}>
            <div className={styles.preferencesCard}>
              <h3>Préférences</h3>
              <div className={styles.preferencesForm}>
                <div className={styles.preferenceGroup}>
                  <h4>Apparence</h4>
                  <div className={styles.preferenceItem}>
                    <label>Thème</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                    >
                      <option value="LIGHT">Clair</option>
                      <option value="DARK">Sombre</option>
                      <option value="AUTO">Automatique</option>
                    </select>
                  </div>
                  <div className={styles.preferenceItem}>
                    <label>Langue</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>

                <div className={styles.preferenceGroup}>
                  <h4>Notifications</h4>
                  <div className={styles.preferenceItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                      />
                      <span>Notifications par email</span>
                    </label>
                  </div>
                  <div className={styles.preferenceItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
                      />
                      <span>Notifications push</span>
                    </label>
                  </div>
                  <div className={styles.preferenceItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferences.marketingEmails}
                        onChange={(e) => setPreferences({...preferences, marketingEmails: e.target.checked})}
                      />
                      <span>Emails marketing</span>
                    </label>
                  </div>
                  <div className={styles.preferenceItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferences.weeklyDigest}
                        onChange={(e) => setPreferences({...preferences, weeklyDigest: e.target.checked})}
                      />
                      <span>Résumé hebdomadaire</span>
                    </label>
                  </div>
                </div>

                <div className={styles.preferenceGroup}>
                  <h4>Confidentialité</h4>
                  <div className={styles.preferenceItem}>
                    <label>Visibilité du profil</label>
                    <select
                      value={preferences.profileVisibility}
                      onChange={(e) => setPreferences({...preferences, profileVisibility: e.target.value})}
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Privé</option>
                      <option value="FRIENDS_ONLY">Amis seulement</option>
                    </select>
                  </div>
                  <div className={styles.preferenceItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferences.showEmail}
                        onChange={(e) => setPreferences({...preferences, showEmail: e.target.checked})}
                      />
                      <span>Afficher mon email publiquement</span>
                    </label>
                  </div>
                  <div className={styles.preferenceItem}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={preferences.showLastSeen}
                        onChange={(e) => setPreferences({...preferences, showLastSeen: e.target.checked})}
                      />
                      <span>Afficher ma dernière connexion</span>
                    </label>
                  </div>
                </div>

                <button
                  className={styles.savePreferencesButton}
                  onClick={handleUpdatePreferences}
                >
                  Sauvegarder les préférences
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;