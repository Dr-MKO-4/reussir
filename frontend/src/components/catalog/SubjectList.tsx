// src/components/catalog/SubjectList.tsx
import React from 'react';
import { Subject } from '../../types/catalog';
import SubjectCard from './SubjectCard';
import EmptyState from '../common/EmptyState';
import Spinner from '../common/Spinner';
import styles from './SubjectList.module.css';

interface SubjectListProps {
  subjects: Subject[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onSubjectClick?: (subject: Subject) => void;
  layout?: 'list' | 'grid';
  showActions?: boolean;
}

const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  loading = false,
  error = null,
  emptyMessage = 'Aucun sujet trouvé',
  onSubjectClick,
  layout = 'grid',
  showActions = true,
}) => {
  // État de chargement
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" />
        <p className={styles.loadingText}>Chargement des sujets...</p>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Erreur de chargement"
        message={error}
        action={{
          label: 'Réessayer',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  // État vide
  if (!subjects || subjects.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Aucun résultat"
        message={emptyMessage}
      />
    );
  }

  // Rendu de la liste
  return (
    <div
      className={`${styles.subjectList} ${
        layout === 'grid' ? styles.gridLayout : styles.listLayout
      }`}
      role="list"
      aria-label="Liste des sujets"
    >
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className={styles.subjectItem}
          role="listitem"
        >
          <SubjectCard
            subject={subject}
            onClick={() => onSubjectClick?.(subject)}
            showActions={showActions}
          />
        </div>
      ))}
    </div>
  );
};

export default SubjectList;