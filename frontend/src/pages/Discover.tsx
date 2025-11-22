import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import catalogService from '@services/catalogService';
import SubjectCard from '@components/catalog/SubjectCard';
import Spinner from '@components/common/Spinner';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import { Search, Filter, Grid, List, X } from 'lucide-react';
import { Subject, SearchParams, Filters } from '@/types';
import './Discover.css';

type ViewMode = 'grid' | 'list';
type SortOption = 'pertinence' | 'popularite' | 'date' | 'prix' | 'difficulte';

const Discover: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedConcours, setSelectedConcours] = useState<string | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<string | null>(null);
  const [selectedAnnee, setSelectedAnnee] = useState<number | null>(null);
  const [selectedDifficulte, setSelectedDifficulte] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('pertinence');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    searchSubjects();
  }, [searchQuery, selectedConcours, selectedMatiere, selectedAnnee, selectedDifficulte, sortBy, currentPage]);

  const loadFilters = async () => {
    try {
      const response = await catalogService.getFilters();
      if (response?.data) {
        setFilters(response.data);
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };

  const searchSubjects = async () => {
    try {
      setLoading(true);
      
      const params: SearchParams = {
        query: searchQuery,
        concours: selectedConcours || undefined,
        matiere: selectedMatiere || undefined,
        annee: selectedAnnee || undefined,
        difficulte: selectedDifficulte || undefined,
        page: currentPage,
        limit,
        sort: sortBy
      };

      const response = await catalogService.searchSubjects(params);
      
      if (response?.data) {
        setSubjects(response.data.subjects || []);
        setTotal(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error searching subjects:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams({ q: searchQuery });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedConcours(null);
    setSelectedMatiere(null);
    setSelectedAnnee(null);
    setSelectedDifficulte(null);
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleFavorite = async (subjectId: number) => {
    // Toggle favorite
    if (favorites.includes(subjectId)) {
      setFavorites(prev => prev.filter(id => id !== subjectId));
      // Call API to remove
    } else {
      setFavorites(prev => [...prev, subjectId]);
      // Call API to add
    }
  };

  const activeFiltersCount = [
    selectedConcours,
    selectedMatiere,
    selectedAnnee,
    selectedDifficulte
  ].filter(Boolean).length;

  return (
    <div className="discover-page">
      {/* Header */}
      <div className="discover-header">
        <div className="discover-header-content">
          <h1 className="discover-title">Découvrir les sujets</h1>
          <p className="discover-subtitle">
            {total > 0 ? `${total} sujets disponibles` : 'Recherchez parmi des milliers de sujets'}
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="discover-search">
          <Input
            type="text"
            placeholder="Rechercher un sujet, concours, matière..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={20} />}
            fullWidth
          />
        </form>
      </div>

      <div className="discover-content">
        {/* Sidebar Filters */}
        <aside className={`discover-sidebar ${showFilters ? 'is-visible' : ''}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </h2>
            
            <div className="sidebar-actions">
              {activeFiltersCount > 0 && (
                <button
                  className="clear-filters-btn"
                  onClick={handleClearFilters}
                >
                  Réinitialiser
                </button>
              )}
              
              <button
                className="toggle-filters-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Filter sections */}
          <div className="filter-sections">
            {/* Concours */}
            {filters?.concours && (
              <div className="filter-section">
                <h3 className="filter-section-title">Concours</h3>
                <div className="filter-options">
                  {filters.concours.map((option) => (
                    <label key={option.value} className="filter-option">
                      <input
                        type="radio"
                        name="concours"
                        checked={selectedConcours === option.value}
                        onChange={() => setSelectedConcours(option.value as string)}
                      />
                      <span>{option.label}</span>
                      {option.count && <span className="filter-count">{option.count}</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Matière */}
            {filters?.matieres && (
              <div className="filter-section">
                <h3 className="filter-section-title">Matière</h3>
                <div className="filter-options">
                  {filters.matieres.map((option) => (
                    <label key={option.value} className="filter-option">
                      <input
                        type="radio"
                        name="matiere"
                        checked={selectedMatiere === option.value}
                        onChange={() => setSelectedMatiere(option.value as string)}
                      />
                      <span>{option.label}</span>
                      {option.count && <span className="filter-count">{option.count}</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulté */}
            <div className="filter-section">
              <h3 className="filter-section-title">Difficulté</h3>
              <div className="filter-options">
                {[
                  { value: 0.3, label: 'Facile' },
                  { value: 0.6, label: 'Moyen' },
                  { value: 0.9, label: 'Difficile' }
                ].map((option) => (
                  <label key={option.value} className="filter-option">
                    <input
                      type="radio"
                      name="difficulte"
                      checked={selectedDifficulte === option.value}
                      onChange={() => setSelectedDifficulte(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="discover-main">
          {/* Toolbar */}
          <div className="discover-toolbar">
            <div className="toolbar-left">
              <button
                className="mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                <span>Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="filter-badge">{activeFiltersCount}</span>
                )}
              </button>
              
              {!loading && (
                <span className="results-count">
                  {total} résultat{total > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="toolbar-right">
              {/* Sort */}
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="pertinence">Pertinence</option>
                <option value="popularite">Popularité</option>
                <option value="date">Plus récents</option>
                <option value="prix">Prix croissant</option>
                <option value="difficulte">Difficulté</option>
              </select>

              {/* View mode */}
              <div className="view-mode-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Vue grille"
                >
                  <Grid size={20} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Vue liste"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="discover-loading">
              <Spinner size="lg" text="Chargement des sujets..." />
            </div>
          ) : subjects.length > 0 ? (
            <>
              <div className={`subjects-grid view-${viewMode}`}>
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.includes(subject.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="discover-pagination">
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Précédent
                  </Button>
                  
                  <div className="pagination-info">
                    Page {currentPage} sur {totalPages}
                  </div>
                  
                  <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="discover-empty">
              <Search size={64} className="empty-icon" />
              <h3>Aucun résultat</h3>
              <p>Essayez de modifier vos critères de recherche</p>
              <Button variant="secondary" onClick={handleClearFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Discover;