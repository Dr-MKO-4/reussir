// src/components/catalog/SearchResults.tsx
import React from 'react';
import { Subject } from '../../types/catalog';
import SubjectCard from './SubjectCard';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  query: string;
  results: Subject[];
  loading?: boolean;
  error?: string | null;
  onSubjectClick?: (subject: Subject) => void;
  onClearSearch?: () => void;
  highlightQuery?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  loading = false,
  error = null,
  onSubjectClick,
  onClearSearch,
  highlightQuery = true,
}) => {
  // Fonction pour mettre en évidence le texte de recherche
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!highlightQuery || !query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // État de chargement
  if (loading) {
    return (
      <div className={styles.searchResults}>
        <div className={styles.loadingContainer}>
          <Spinner size="large" />
          <p className={styles.loadingText}>Recherche en cours...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className={styles.searchResults}>
        <EmptyState
          icon="⚠️"
          title="Erreur de recherche"
          message={error}
          action={{
            label: 'Réessayer',
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  // Aucun résultat
  if (results.length === 0 && query) {
    return (
      <div className={styles.searchResults}>
        <EmptyState
          icon="🔍"
          title="Aucun résultat trouvé"
          message={`Aucun sujet ne correspond à "${query}"`}
          action={
            onClearSearch
              ? {
                  label: 'Effacer la recherche',
                  onClick: onClearSearch,
                }
              : undefined
          }
        />
        <div className={styles.suggestions}>
          <h4 className={styles.suggestionsTitle}>Suggestions :</h4>
          <ul className={styles.suggestionsList}>
            <li>Vérifiez l'orthographe</li>
            <li>Essayez des mots-clés plus généraux</li>
            <li>Utilisez des synonymes</li>
            <li>Réduisez le nombre de filtres actifs</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.searchResults}>
      {/* En-tête des résultats */}
      <div className={styles.resultsHeader}>
        <h2 className={styles.resultsTitle}>
          {results.length} résultat{results.length > 1 ? 's' : ''} pour{' '}
          <span className={styles.query}>"{query}"</span>
        </h2>
        {onClearSearch && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClearSearch}
            aria-label="Effacer la recherche"
          >
            ✕ Effacer
          </button>
        )}
      </div>

      {/* Grille de résultats */}
      <div className={styles.resultsGrid}>
        {results.map((subject, index) => (
          <div
            key={subject.id}
            className={styles.resultItem}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <SubjectCard
              subject={{
                ...subject,
                title: highlightQuery
                  ? (highlightText(subject.title, query) as any)
                  : subject.title,
                description: highlightQuery && subject.description
                  ? (highlightText(subject.description, query) as any)
                  : subject.description,
              }}
              onClick={() => onSubjectClick?.(subject)}
            />
          </div>
        ))}
      </div>

      {/* Footer avec statistiques */}
      <div className={styles.resultsFooter}>
        <p className={styles.resultsInfo}>
          Temps de recherche : <strong>~0.1s</strong>
        </p>
      </div>
    </div>
  );
};

export default SearchResults;