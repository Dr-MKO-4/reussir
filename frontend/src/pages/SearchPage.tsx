import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import { Pagination } from '../components/common/Pagination';
import { Spinner } from '../components/common/Spinner';
import { SubjectCardData, SearchFilters, SortOption } from '../types/catalog';
import './SearchPage.css';

/**
 * Options de tri
 */
const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'date-desc', label: 'Plus récent' },
  { value: 'date-asc', label: 'Plus ancien' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'popularity', label: 'Popularité' },
];

/**
 * Options d'examens
 */
const examOptions = [
  { value: 'baccalaureat', label: 'Baccalauréat' },
  { value: 'probatoire', label: 'Probatoire' },
  { value: 'bepc', label: 'BEPC' },
  { value: 'concours', label: 'Concours' },
];

/**
 * Options de matières
 */
const subjectOptions = [
  { value: 'mathematiques', label: 'Mathématiques' },
  { value: 'physique', label: 'Physique-Chimie' },
  { value: 'francais', label: 'Français' },
  { value: 'anglais', label: 'Anglais' },
  { value: 'philosophie', label: 'Philosophie' },
  { value: 'histoire', label: 'Histoire-Géographie' },
  { value: 'svt', label: 'SVT' },
];

/**
 * Page de recherche et découverte
 */
export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectCardData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtres
  const [filters, setFilters] = useState<SearchFilters>({
    exam: searchParams.get('exam') || undefined,
    subject: searchParams.get('subject') || undefined,
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    isFree: searchParams.get('free') === 'true' ? true : undefined,
  });
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');

  /**
   * Charger les résultats
   */
  useEffect(() => {
    loadResults();
  }, [query, filters, sortBy, currentPage]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Remplacer par de vrais appels API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Données mockées
      const mockSubjects: SubjectCardData[] = [
        {
          id: '1',
          title: 'Mathématiques - Baccalauréat 2024',
          description: 'Épreuve de mathématiques série C',
          exam: 'Baccalauréat',
          subject: 'Mathématiques',
          year: 2024,
          difficulty: 4,
          price: 1000,
          isFree: false,
          isPremium: true,
          tags: ['Série C', 'Trigonométrie'],
          rating: 4.5,
          isNew: true,
        },
        {
          id: '2',
          title: 'Physique-Chimie - Probatoire 2024',
          description: 'Épreuve de physique-chimie série D',
          exam: 'Probatoire',
          subject: 'Physique-Chimie',
          year: 2024,
          difficulty: 3,
          price: 0,
          isFree: true,
          isPremium: false,
          tags: ['Série D', 'Mécanique'],
          rating: 4.2,
        },
        {
          id: '3',
          title: 'Philosophie - Baccalauréat 2023',
          description: 'Épreuve de philosophie série A',
          exam: 'Baccalauréat',
          subject: 'Philosophie',
          year: 2023,
          difficulty: 5,
          price: 500,
          isFree: false,
          isPremium: false,
          tags: ['Série A', 'Dissertation'],
          rating: 4.8,
        },
        {
          id: '4',
          title: 'Français - BEPC 2024',
          description: 'Épreuve de français',
          exam: 'BEPC',
          subject: 'Français',
          year: 2024,
          difficulty: 2,
          price: 0,
          isFree: true,
          isPremium: false,
          tags: ['Rédaction', 'Grammaire'],
          rating: 4.0,
        },
        {
          id: '5',
          title: 'Anglais - Baccalauréat 2024',
          description: 'Épreuve d\'anglais toutes séries',
          exam: 'Baccalauréat',
          subject: 'Anglais',
          year: 2024,
          difficulty: 3,
          price: 750,
          isFree: false,
          isPremium: false,
          tags: ['Compréhension', 'Expression'],
          rating: 4.3,
        },
        {
          id: '6',
          title: 'SVT - Probatoire 2023',
          description: 'Épreuve de Sciences de la Vie et de la Terre',
          exam: 'Probatoire',
          subject: 'SVT',
          year: 2023,
          difficulty: 4,
          price: 800,
          isFree: false,
          isPremium: true,
          tags: ['Série D', 'Biologie'],
          rating: 4.6,
        },
      ];

      setSubjects(mockSubjects);
      setTotalResults(mockSubjects.length);
      setTotalPages(Math.ceil(mockSubjects.length / 6));

    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gérer la recherche
   */
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
    updateSearchParams({ q: newQuery });
  };

  /**
   * Gérer le changement de filtre
   */
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    updateSearchParams({ [key]: value });
  };

  /**
   * Réinitialiser les filtres
   */
  const handleResetFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  /**
   * Mettre à jour les paramètres URL
   */
  const updateSearchParams = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value));
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  /**
   * Gérer le changement de page
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Compter les filtres actifs
   */
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <MainLayout showSearch={false}>
      <div className="search-page">
        {/* Search Header */}
        <div className="search-header">
          <SearchBar
            value={query}
            placeholder="Rechercher des sujets..."
            onSearch={handleSearch}
            size="lg"
            fullWidth
          />
        </div>

        <div className="search-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h2 className="filters-title">Filtres</h2>
              {activeFiltersCount > 0 && (
                <button className="filters-reset" onClick={handleResetFilters}>
                  Réinitialiser ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="filters-content">
              {/* Examen */}
              <div className="filter-group">
                <label className="filter-label">Examen</label>
                <Select
                  options={examOptions}
                  value={filters.exam}
                  onChange={(value) => handleFilterChange('exam', value)}
                  placeholder="Tous les examens"
                />
              </div>

              {/* Matière */}
              <div className="filter-group">
                <label className="filter-label">Matière</label>
                <Select
                  options={subjectOptions}
                  value={filters.subject}
                  onChange={(value) => handleFilterChange('subject', value)}
                  placeholder="Toutes les matières"
                />
              </div>

              {/* Année */}
              <div className="filter-group">
                <label className="filter-label">Année</label>
                <div className="year-filters">
                  {[2024, 2023, 2022, 2021].map((year) => (
                    <button
                      key={year}
                      className={`year-button ${filters.year === year ? 'year-button-active' : ''}`}
                      onClick={() => handleFilterChange('year', filters.year === year ? undefined : year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gratuit */}
              <div className="filter-group">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.isFree || false}
                    onChange={(e) => handleFilterChange('isFree', e.target.checked || undefined)}
                  />
                  <span>Sujets gratuits uniquement</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Results Content */}
          <div className="results-content">
            {/* Results Header */}
            <div className="results-header">
              <div className="results-info">
                <h1 className="results-title">
                  {query ? `Résultats pour "${query}"` : 'Tous les sujets'}
                </h1>
                <p className="results-count">{totalResults} sujet(s) trouvé(s)</p>
              </div>

              <div className="results-controls">
                {/* Sort */}
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    updateSearchParams({ sort: value });
                  }}
                  size="sm"
                />

                {/* View Mode */}
                <div className="view-toggle">
                  <button
                    className={`view-button ${viewMode === 'grid' ? 'view-button-active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Vue grille"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    className={`view-button ${viewMode === 'list' ? 'view-button-active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="Vue liste"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="active-filters">
                {filters.exam && (
                  <Badge variant="primary">
                    Examen: {filters.exam}
                  </Badge>
                )}
                {filters.subject && (
                  <Badge variant="primary">
                    Matière: {filters.subject}
                  </Badge>
                )}
                {filters.year && (
                  <Badge variant="primary">
                    Année: {filters.year}
                  </Badge>
                )}
                {filters.isFree && (
                  <Badge variant="success">
                    Gratuit
                  </Badge>
                )}
              </div>
            )}

            {/* Results Grid/List */}
            {isLoading ? (
              <div className="loading-state">
                <Spinner size="lg" label="Chargement des résultats..." />
              </div>
            ) : subjects.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="empty-title">Aucun résultat trouvé</h3>
                <p className="empty-description">
                  Essayez d'ajuster vos filtres ou votre recherche
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                <div className={`results-${viewMode}`}>
                  {subjects.map((subject) => (
                    <Card
                      key={subject.id}
                      variant="outlined"
                      isHoverable
                      className={`subject-result-card ${viewMode}-card`}
                      onClick={() => navigate(`/subjects/${subject.id}`)}
                    >
                      <div className="subject-result-header">
                        <div className="subject-result-badges">
                          {subject.isNew && <Badge variant="primary" size="sm">Nouveau</Badge>}
                          {subject.isFree && <Badge variant="success" size="sm">Gratuit</Badge>}
                          {subject.isPremium && <Badge variant="warning" size="sm">Premium</Badge>}
                        </div>
                      </div>

                      <h3 className="subject-result-title">{subject.title}</h3>
                      <p className="subject-result-description">{subject.description}</p>

                      <div className="subject-result-meta">
                        <span>{subject.exam}</span>
                        <span>•</span>
                        <span>{subject.year}</span>
                        <span>•</span>
                        <span>{subject.subject}</span>
                      </div>

                      <div className="subject-result-footer">
                        <div className="subject-result-price">
                          {subject.isFree ? (
                            <span className="price-free">Gratuit</span>
                          ) : (
                            <span className="price-amount">{subject.price} FCFA</span>
                          )}
                        </div>
                        {subject.rating && (
                          <div className="subject-result-rating">
                            <svg className="rating-star" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {subject.rating}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;