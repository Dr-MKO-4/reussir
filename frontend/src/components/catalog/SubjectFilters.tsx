// src/components/catalog/SubjectFilters.tsx
import React, { useState, useEffect } from 'react';
import Select from '../common/Select';
import Button from '../common/Button';
import styles from './SubjectFilters.module.css';

export interface FilterOptions {
  category?: string;
  level?: string;
  examType?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  difficulty?: string;
  duration?: string;
  language?: string;
  tags?: string[];
}

interface SubjectFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  categories?: Array<{ id: string; name: string; count?: number }>;
  showAdvanced?: boolean;
}

const SubjectFilters: React.FC<SubjectFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  categories = [],
  showAdvanced = true,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Options de filtres
  const levels = [
    { value: '', label: 'Tous les niveaux' },
    { value: '6eme', label: '6ème' },
    { value: '5eme', label: '5ème' },
    { value: '4eme', label: '4ème' },
    { value: '3eme', label: '3ème' },
    { value: 'seconde', label: 'Seconde' },
    { value: 'premiere', label: 'Première' },
    { value: 'terminale', label: 'Terminale' },
  ];

  const examTypes = [
    { value: '', label: 'Tous les examens' },
    { value: 'BEPC', label: 'BEPC' },
    { value: 'PROBATOIRE', label: 'Probatoire' },
    { value: 'BACC', label: 'Baccalauréat' },
  ];

  const difficulties = [
    { value: '', label: 'Toutes difficultés' },
    { value: 'facile', label: 'Facile' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'difficile', label: 'Difficile' },
  ];

  const durations = [
    { value: '', label: 'Toutes durées' },
    { value: '0-30', label: 'Moins de 30 min' },
    { value: '30-60', label: '30 min - 1h' },
    { value: '60-120', label: '1h - 2h' },
    { value: '120+', label: 'Plus de 2h' },
  ];

  const priceRanges = [
    { value: '', label: 'Tous les prix' },
    { value: '0-500', label: '0 - 500 FCFA' },
    { value: '500-1000', label: '500 - 1000 FCFA' },
    { value: '1000-2000', label: '1000 - 2000 FCFA' },
    { value: '2000+', label: 'Plus de 2000 FCFA' },
  ];

  // Calculer le nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.level) count++;
    if (filters.examType) count++;
    if (filters.difficulty) count++;
    if (filters.duration) count++;
    if (filters.priceRange) count++;
    if (filters.language) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Gérer le changement de filtre
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Gérer le changement de prix
  const handlePriceChange = (value: string) => {
    if (!value) {
      const newFilters = { ...filters };
      delete newFilters.priceRange;
      setFilters(newFilters);
      onFiltersChange(newFilters);
      return;
    }

    const [min, max] = value.split('-').map(Number);
    handleFilterChange('priceRange', {
      min: min || 0,
      max: max || Infinity,
    });
  };

  // Réinitialiser les filtres
  const handleReset = () => {
    const emptyFilters: FilterOptions = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className={styles.filtersContainer}>
      {/* Header avec toggle */}
      <div className={styles.filtersHeader}>
        <h3 className={styles.filtersTitle}>
          Filtres
          {activeFiltersCount > 0 && (
            <span className={styles.activeCount}>({activeFiltersCount})</span>
          )}
        </h3>
        <Button
          variant="text"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          className={styles.toggleButton}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Réduire les filtres' : 'Étendre les filtres'}
        >
          {isExpanded ? '−' : '+'}
        </Button>
      </div>

      {/* Filtres principaux (toujours visibles) */}
      <div className={styles.mainFilters}>
        <div className={styles.filterGroup}>
          <label htmlFor="category-filter" className={styles.filterLabel}>
            Catégorie
          </label>
          <Select
            id="category-filter"
            value={filters.category || ''}
            onChange={(value) => handleFilterChange('category', value)}
            options={[
              { value: '', label: 'Toutes les catégories' },
              ...categories.map((cat) => ({
                value: cat.id,
                label: `${cat.name}${cat.count ? ` (${cat.count})` : ''}`,
              })),
            ]}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="level-filter" className={styles.filterLabel}>
            Niveau
          </label>
          <Select
            id="level-filter"
            value={filters.level || ''}
            onChange={(value) => handleFilterChange('level', value)}
            options={levels}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="exam-filter" className={styles.filterLabel}>
            Type d'examen
          </label>
          <Select
            id="exam-filter"
            value={filters.examType || ''}
            onChange={(value) => handleFilterChange('examType', value)}
            options={examTypes}
          />
        </div>
      </div>

      {/* Filtres avancés (pliables) */}
      {showAdvanced && (
        <div
          className={`${styles.advancedFilters} ${
            isExpanded ? styles.expanded : styles.collapsed
          }`}
        >
          <div className={styles.filterGroup}>
            <label htmlFor="difficulty-filter" className={styles.filterLabel}>
              Difficulté
            </label>
            <Select
              id="difficulty-filter"
              value={filters.difficulty || ''}
              onChange={(value) => handleFilterChange('difficulty', value)}
              options={difficulties}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="duration-filter" className={styles.filterLabel}>
              Durée estimée
            </label>
            <Select
              id="duration-filter"
              value={filters.duration || ''}
              onChange={(value) => handleFilterChange('duration', value)}
              options={durations}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="price-filter" className={styles.filterLabel}>
              Fourchette de prix
            </label>
            <Select
              id="price-filter"
              value={
                filters.priceRange
                  ? `${filters.priceRange.min}-${filters.priceRange.max}`
                  : ''
              }
              onChange={handlePriceChange}
              options={priceRanges}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {activeFiltersCount > 0 && (
        <div className={styles.filterActions}>
          <Button
            variant="text"
            size="small"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Réinitialiser tout ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubjectFilters;