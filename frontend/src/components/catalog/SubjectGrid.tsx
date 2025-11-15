// src/components/catalog/SubjectGrid.tsx
import React, { useState, useEffect } from 'react';
import { Subject } from '../../types/catalog';
import SubjectCard from './SubjectCard';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import Pagination from '../components/common/Pagination';
import styles from './SubjectGrid.module.css';

interface SubjectGridProps {
  subjects: Subject[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onSubjectClick?: (subject: Subject) => void;
  showActions?: boolean;
  columns?: 2 | 3 | 4 | 5;
  itemsPerPage?: number;
  showPagination?: boolean;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({
  subjects,
  loading = false,
  error = null,
  emptyMessage = 'Aucun sujet disponible',
  onSubjectClick,
  showActions = true,
  columns = 4,
  itemsPerPage = 12,
  showPagination = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Réinitialiser la page quand les sujets changent
  useEffect(() => {
    setCurrentPage(1);
  }, [subjects]);

  // Calculer la pagination
  const totalPages = Math.ceil(subjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubjects = showPagination
    ? subjects.slice(startIndex, endIndex)
    : subjects;

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll en haut de la grille
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className={styles.gridContainer}>
      {/* Info résultats */}
      <div className={styles.resultsInfo}>
        <p className={styles.resultsCount}>
          {subjects.length} {subjects.length > 1 ? 'sujets trouvés' : 'sujet trouvé'}
        </p>
        {showPagination && totalPages > 1 && (
          <p className={styles.pageInfo}>
            Page {currentPage} sur {totalPages}
          </p>
        )}
      </div>

      {/* Grille de sujets */}
      <div
        className={`${styles.grid} ${styles[`cols${columns}`]}`}
        role="grid"
        aria-label="Grille des sujets"
      >
        {currentSubjects.map((subject, index) => (
          <div
            key={subject.id}
            className={styles.gridItem}
            role="gridcell"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <SubjectCard
              subject={subject}
              onClick={() => onSubjectClick?.(subject)}
              showActions={showActions}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;