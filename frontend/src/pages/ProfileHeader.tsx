import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import './Profile.css';

interface ProfileHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin';
    joinedDate: string;
    bio?: string;
    level?: string;
    school?: string;
    location?: string;
  };
  stats: {
    subjects: number;
    hours: number;
    rank: number;
    streak: number;
  };
  onEditProfile: () => void;
  onUploadAvatar: (file: File) => void;
  className?: string;
}

/**
 * En-tête de profil utilisateur avec avatar et statistiques
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  stats,
  onEditProfile,
  onUploadAvatar,
  className = '',
}) => {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadAvatar(file);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      student: 'Étudiant',
      teacher: 'Enseignant',
      admin: 'Administrateur',
    };
    return labels[role as keyof typeof labels] || 'Utilisateur';
  };

  const getRoleBadgeVariant = (role: string) => {
    const variants = {
      student: 'primary' as const,
      teacher: 'success' as const,
      admin: 'danger' as const,
    };
    return variants[role as keyof typeof variants] || 'neutral' as const;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={`profile-header ${className}`}>
      <div className="profile-header-background">
        <div className="header-gradient"></div>
        <div className="header-pattern"></div>
      </div>

      <div className="profile-header-content">
        <div className="profile-main-info">
          {/* Avatar Section */}
          <div 
            className="profile-avatar-wrapper"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <div className="profile-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
              ) : (
                <div className="profile-avatar-placeholder">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
              
              {isHoveringAvatar && (
                <label className="avatar-upload-overlay">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Changer</span>
                </label>
              )}
            </div>

            <div className="profile-status-badge">
              <div className="status-dot"></div>
              <span>En ligne</span>
            </div>
          </div>

          {/* User Info */}
          <div className="profile-user-info">
            <div className="profile-name-row">
              <h1 className="profile-name">
                {user.firstName} {user.lastName}
              </h1>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>

            <div className="profile-meta">
              <div className="profile-meta-item">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{user.email}</span>
              </div>

              {user.school && (
                <div className="profile-meta-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{user.school}</span>
                </div>
              )}

              {user.location && (
                <div className="profile-meta-item">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{user.location}</span>
                </div>
              )}

              <div className="profile-meta-item">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Membre depuis {formatDate(user.joinedDate)}</span>
              </div>
            </div>

            {user.bio && (
              <p className="profile-bio">{user.bio}</p>
            )}

            <Button variant="primary" onClick={onEditProfile} className="edit-profile-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier le profil
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="stat-icon stat-icon-primary">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.subjects}</div>
              <div className="stat-label">Sujets étudiés</div>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon stat-icon-success">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.hours}h</div>
              <div className="stat-label">Temps d'étude</div>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon stat-icon-warning">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">#{stats.rank}</div>
              <div className="stat-label">Classement</div>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon stat-icon-danger">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.streak}</div>
              <div className="stat-label">Jours de série</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;