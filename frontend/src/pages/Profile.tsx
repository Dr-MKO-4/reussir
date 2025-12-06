// src/pages/Profile.tsx
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.profile?.bio || '',
    website: user?.profile?.website || '',
    location: user?.profile?.location || '',
    company: user?.profile?.company || '',
    jobTitle: user?.profile?.jobTitle || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      setEditing(false);
      success('Profil mis à jour', 'Vos informations ont été sauvegardées avec succès');
    } catch (error: any) {
      showError('Erreur', error?.error?.message || 'Impossible de mettre à jour le profil');
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

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Mon Profil</h1>
            <div className={styles.headerActions}>
              <button
                className={styles.dashboardButton}
                onClick={() => navigate('/dashboard')}
              >
                Retour au Dashboard
              </button>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span>{user?.firstName[0]}{user?.lastName[0]}</span>
                )}
              </div>
              <div className={styles.userInfo}>
                <h2>{user?.firstName} {user?.lastName}</h2>
                <p>@{user?.username}</p>
                <p>{user?.email}</p>
              </div>
              <button
                className={styles.editButton}
                onClick={() => setEditing(!editing)}
                disabled={loading}
              >
                {editing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            <div className={styles.profileBody}>
              {editing ? (
                <form onSubmit={handleSubmit} className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">Prénom</label>
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
                      <label htmlFor="lastName">Nom</label>
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
                    <button
                      type="submit"
                      className={styles.saveButton}
                      disabled={loading}
                    >
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setEditing(false)}
                      disabled={loading}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.profileDisplay}>
                  <div className={styles.displayGrid}>
                    <div className={styles.displayItem}>
                      <label>Entreprise</label>
                      <span>{user?.profile?.company || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.displayItem}>
                      <label>Poste</label>
                      <span>{user?.profile?.jobTitle || 'Non renseigné'}</span>
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
                    <div className={styles.displayItem}>
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
        </div>
      </div>
    </div>
  );
};

export default Profile;