// src/pages/Profile.tsx
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Tabs from '../components/common/Tabs';
import styles from './Profile.module.css';

// ==================== TYPES ====================
interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  courseCommunity: boolean;
  promotions: boolean;
  newsletters: boolean;
  learningReminders: boolean;
}

interface PrivacySettings {
  profileVisible: boolean;
  showProgressPublic: boolean;
  allowMessages: boolean;
  allowFriends: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  bio: string;
  website: string;
  location: string;
  company: string;
  jobTitle: string;
  phone: string;
}

// ==================== COMPOSANT ====================
const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [changePassword, setChangePassword] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    courseCommunity: true,
    promotions: false,
    newsletters: true,
    learningReminders: true
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisible: true,
    showProgressPublic: false,
    allowMessages: true,
    allowFriends: true
  });
  
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.profile?.bio || '',
    website: user?.profile?.website || '',
    location: user?.profile?.location || '',
    company: user?.profile?.company || '',
    jobTitle: user?.profile?.jobTitle || '',
    phone: user?.profile?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ==================== HANDLERS ====================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setEditing(false);
      success('Succès', 'Votre profil a été mis à jour');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Erreur', 'Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await updateProfile({ 
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword 
      });
      setChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      success('Succès', 'Votre mot de passe a été changé');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de changer le mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  // ==================== TAB CONTENT ====================
  const tabContent = {
    profile: (
      <div className={styles.tabContent}>
        <h3>Informations Personnelles</h3>
        {editing ? (
          <form onSubmit={handleProfileSubmit} className={styles.profileForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+33 6 12 34 56 78"
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="company">Entreprise</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Votre entreprise"
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="jobTitle">Poste</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Votre poste"
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="location">Localisation</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ville, Pays"
                  disabled={loading}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="website">Site web</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://exemple.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bio">Biographie</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Parlez-nous de vous..."
                rows={4}
                disabled={loading}
              />
            </div>

            <div className={styles.formActions}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setEditing(false)}
                disabled={loading}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.profileDisplay}>
            <div className={styles.displayGrid}>
              <div className={styles.displayItem}>
                <label>Email</label>
                <span>{user?.email}</span>
              </div>
              <div className={styles.displayItem}>
                <label>Téléphone</label>
                <span>{user?.profile?.phone || 'Non renseigné'}</span>
              </div>
              <div className={styles.displayItem}>
                <label>Entreprise</label>
                <span>{user?.profile?.company || 'Non renseigné'}</span>
              </div>
              <div className={styles.displayItem}>
                <label>Poste</label>
                <span>{user?.profile?.jobTitle || 'Non renseigné'}</span>
              </div>
              <div className={styles.displayItem}>
                <label>Localisation</label>
                <span>{user?.profile?.location || 'Non renseigné'}</span>
              </div>
              <div className={styles.displayItem}>
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
            </div>
            
            {user?.profile?.bio && (
              <div className={styles.bioSection}>
                <label>Biographie</label>
                <p>{user.profile.bio}</p>
              </div>
            )}

            <Button 
              variant="primary"
              onClick={() => setEditing(true)}
            >
              Modifier le profil
            </Button>
          </div>
        )}
      </div>
    ),

    security: (
      <div className={styles.tabContent}>
        <h3>Sécurité et Compte</h3>
        <Card>
          <div className={styles.securitySection}>
            <h4>Changer le mot de passe</h4>
            {changePassword ? (
              <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Mot de passe actuel</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Changement...' : 'Changer le mot de passe'}
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => setChangePassword(false)}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <Button 
                variant="secondary"
                onClick={() => setChangePassword(true)}
              >
                Changer le mot de passe
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <div className={styles.securitySection}>
            <h4>Authentification à deux facteurs</h4>
            <p>Renforcez la sécurité de votre compte avec l'authentification à deux facteurs</p>
            <Button variant="secondary">Configurer 2FA</Button>
          </div>
        </Card>

        <Card>
          <div className={styles.securitySection}>
            <h4>Sessions actives</h4>
            <p>Gérez vos sessions et appareils connectés</p>
            <div className={styles.deviceList}>
              <div className={styles.device}>
                <span>🖥️ Chrome sur Windows</span>
                <span>Actif maintenant</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    ),

    notifications: (
      <div className={styles.tabContent}>
        <h3>Paramètres de Notification</h3>
        <Card>
          <div className={styles.notificationSettings}>
            {[
              { key: 'emailNotifications' as const, label: 'Notifications par email' },
              { key: 'pushNotifications' as const, label: 'Notifications push' },
              { key: 'courseCommunity' as const, label: 'Activité de la communauté' },
              { key: 'promotions' as const, label: 'Promotions et offres spéciales' },
              { key: 'newsletters' as const, label: 'Infolettres' },
              { key: 'learningReminders' as const, label: 'Rappels d\'apprentissage' }
            ].map(({ key, label }) => (
              <div key={key} className={styles.notificationItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={notificationSettings[key]}
                    onChange={() => handleNotificationChange(key)}
                  />
                  {label}
                </label>
              </div>
            ))}
          </div>
          <Button variant="primary">Sauvegarder les paramètres</Button>
        </Card>
      </div>
    ),

    privacy: (
      <div className={styles.tabContent}>
        <h3>Confidentialité</h3>
        <Card>
          <div className={styles.privacySettings}>
            {[
              { key: 'profileVisible' as const, label: 'Rendre mon profil visible' },
              { key: 'showProgressPublic' as const, label: 'Afficher ma progression publiquement' },
              { key: 'allowMessages' as const, label: 'Autoriser les messages privés' },
              { key: 'allowFriends' as const, label: 'Autoriser les demandes d\'amis' }
            ].map(({ key, label }) => (
              <div key={key} className={styles.privacyItem}>
                <label>
                  <input
                    type="checkbox"
                    checked={privacySettings[key]}
                    onChange={() => handlePrivacyChange(key)}
                  />
                  {label}
                </label>
              </div>
            ))}
          </div>
          <Button variant="primary">Sauvegarder les paramètres</Button>
        </Card>
      </div>
    ),

    account: (
      <div className={styles.tabContent}>
        <h3>Gestion du Compte</h3>
        <Card>
          <div className={styles.accountInfo}>
            <p><strong>Date d'inscription :</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR')}</p>
            <p><strong>ID du compte :</strong> {user?.id}</p>
            <p><strong>Rôle :</strong> {user?.role || 'Utilisateur'}</p>
          </div>
        </Card>

        <Card>
          <div className={styles.dangerZone}>
            <h4 className={styles.dangerTitle}>Zone de danger</h4>
            <div className={styles.dangerActions}>
              <Button variant="secondary">
                📥 Télécharger mes données
              </Button>
              <Button variant="secondary">
                📤 Exporter mon historique
              </Button>
              <Button variant="danger">
                🗑️ Supprimer mon compte
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  };

  // ==================== RENDER ====================
  return (
    <MainLayout>
      <div className={styles.profilePage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.profileInfo}>
                <div className={styles.avatar}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.username} />
                  ) : (
                    <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                  )}
                </div>
                <div>
                  <h1>{user?.firstName} {user?.lastName}</h1>
                  <p>@{user?.username}</p>
                </div>
              </div>
              <div className={styles.headerActions}>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  ← Dashboard
                </Button>
                <Button 
                  variant="danger"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <Tabs
              tabs={[
                { id: 'profile', label: '👤 Profil', content: tabContent.profile },
                { id: 'security', label: '🔒 Sécurité', content: tabContent.security },
                { id: 'notifications', label: '🔔 Notifications', content: tabContent.notifications },
                { id: 'privacy', label: '👁️ Confidentialité', content: tabContent.privacy },
                { id: 'account', label: '⚙️ Compte', content: tabContent.account }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
