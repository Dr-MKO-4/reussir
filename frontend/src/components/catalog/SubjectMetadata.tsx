// src/components/catalog/SubjectMetadata.tsx
import React from 'react';
import { Subject } from '../../types/catalog';
import styles from './SubjectMetadata.module.css';

interface SubjectMetadataProps {
  subject: Subject;
  variant?: 'default' | 'compact';
}

interface MetadataItem {
  icon: string;
  label: string;
  value: string | number | React.ReactNode;
  color?: string;
}

const SubjectMetadata: React.FC<SubjectMetadataProps> = ({
  subject,
  variant = 'default',
}) => {
  // Construire les métadonnées
  const metadata: MetadataItem[] = [
    {
      icon: '📚',
      label: 'Catégorie',
      value: subject.category || 'Non spécifié',
      color: '#3B82F6',
    },
    {
      icon: '🎓',
      label: 'Niveau',
      value: subject.level || 'Tous niveaux',
      color: '#10B981',
    },
    {
      icon: '📝',
      label: 'Type d\'examen',
      value: subject.examType || 'Général',
      color: '#F59E0B',
    },
    {
      icon: '⏱️',
      label: 'Durée estimée',
      value: subject.duration ? `${subject.duration} min` : 'Variable',
      color: '#8B5CF6',
    },
    {
      icon: '📊',
      label: 'Difficulté',
      value: subject.difficulty ? (
        <span className={`${styles.difficulty} ${styles[subject.difficulty]}`}>
          {subject.difficulty === 'facile' && '⭐ Facile'}
          {subject.difficulty === 'moyen' && '⭐⭐ Moyen'}
          {subject.difficulty === 'difficile' && '⭐⭐⭐ Difficile'}
        </span>
      ) : (
        'Non évalué'
      ),
      color: '#EC4899',
    },
    {
      icon: '📄',
      label: 'Pages',
      value: subject.pages || 'N/A',
      color: '#14B8A6',
    },
    {
      icon: '🗓️',
      label: 'Année',
      value: subject.year || 'Actuelle',
      color: '#F97316',
    },
    {
      icon: '👥',
      label: 'Vues',
      value: subject.views ? subject.views.toLocaleString() : '0',
      color: '#6366F1',
    },
  ];

  // Filtrer les métadonnées nulles ou vides
  const displayedMetadata = metadata.filter((item) => item.value);

  // Calculer la date de publication
  const getPublicationInfo = (): string => {
    if (!subject.createdAt) return 'Date non disponible';

    const date = new Date(subject.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  return (
    <div className={`${styles.metadataContainer} ${styles[variant]}`}>
      {/* Titre */}
      <h3 className={styles.title}>
        {variant === 'compact' ? 'Informations' : 'Détails du sujet'}
      </h3>

      {/* Grille de métadonnées */}
      <div className={styles.metadataGrid}>
        {displayedMetadata.map((item, index) => (
          <div key={index} className={styles.metadataItem}>
            <div className={styles.itemHeader}>
              <span
                className={styles.icon}
                style={{ color: item.color }}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className={styles.label}>{item.label}</span>
            </div>
            <div className={styles.value}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Informations supplémentaires */}
      <div className={styles.additionalInfo}>
        {/* Date de publication */}
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>📅</span>
          <span className={styles.infoText}>
            Publié {getPublicationInfo()}
          </span>
        </div>

        {/* Dernière mise à jour */}
        {subject.updatedAt && subject.updatedAt !== subject.createdAt && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🔄</span>
            <span className={styles.infoText}>
              Mis à jour le{' '}
              {new Date(subject.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        )}

        {/* Téléchargements */}
        {subject.downloads && subject.downloads > 0 && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>⬇️</span>
            <span className={styles.infoText}>
              {subject.downloads.toLocaleString()} téléchargements
            </span>
          </div>
        )}

        {/* Langue */}
        {subject.language && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🌐</span>
            <span className={styles.infoText}>
              Langue : {subject.language === 'fr' ? 'Français' : subject.language}
            </span>
          </div>
        )}

        {/* Format */}
        {subject.format && (
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📋</span>
            <span className={styles.infoText}>
              Format : {subject.format.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Badge de qualité */}
      {subject.verified && (
        <div className={styles.qualityBadge}>
          <span className={styles.badgeIcon}>✓</span>
          <span className={styles.badgeText}>Vérifié par nos experts</span>
        </div>
      )}
    </div>
  );
};

export default SubjectMetadata;