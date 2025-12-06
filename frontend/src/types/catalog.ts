/**
 * Types pour le module Catalogue
 */

/**
 * Niveaux de difficulté
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Types de sujets
 */
export type SubjectType = 'exam' | 'exercise' | 'correction' | 'course';

/**
 * Statuts de sujet
 */
export type SubjectStatus = 'draft' | 'published' | 'archived';

/**
 * Interface principale pour un sujet d'examen
 */
export interface Subject {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  
  // Médias
  imageUrl?: string;
  thumbnailUrl?: string;
  previewImages?: string[];
  pdfUrl?: string;
  
  // Informations académiques
  exam: string;           // Nom du concours (ex: "Baccalauréat")
  subject: string;        // Matière (ex: "Mathématiques")
  year: number;           // Année de l'examen
  session?: string;       // Session (ex: "Normale", "Remplacement")
  level?: string;         // Niveau (ex: "Terminale", "Première")
  
  // Métadonnées
  difficulty: DifficultyLevel;
  duration: number;       // Durée en minutes
  coefficient?: number;   // Coefficient de l'épreuve
  type: SubjectType;
  status: SubjectStatus;
  
  // Tags et catégories
  tags: string[];
  categories: string[];
  topics?: string[];      // Chapitres/thèmes couverts
  
  // Pricing
  price: number;
  originalPrice?: number; // Prix avant réduction
  currency: string;       // Code devise (ex: "XAF", "EUR")
  isFree: boolean;
  isPremium: boolean;
  
  // Statistiques
  views: number;
  downloads: number;
  favorites: number;
  rating?: number;        // Note moyenne (0-5)
  ratingsCount?: number;  // Nombre de notes
  
  // Contenu lié
  hasCorrection: boolean;
  correctionId?: string;
  relatedSubjects?: string[]; // IDs des sujets similaires
  prerequisites?: string[];   // Prérequis suggérés
  
  // Métadonnées système
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy?: string;     // ID de l'auteur
  
  // Flags
  isNew?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
}

/**
 * Version simplifiée pour les listes/cards
 */
export interface SubjectCardData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  exam: string;
  subject: string;
  year: number;
  difficulty: DifficultyLevel;
  price: number;
  isFree: boolean;
  isPremium: boolean;
  tags: string[];
  rating?: number;
  isNew?: boolean;
  isFeatured?: boolean;
}

/**
 * Filtres de recherche
 */
export interface SearchFilters {
  // Recherche textuelle
  query?: string;
  
  // Filtres académiques
  exam?: string | string[];
  subject?: string | string[];
  year?: number | number[];
  session?: string | string[];
  level?: string | string[];
  
  // Filtres de contenu
  difficulty?: DifficultyLevel | DifficultyLevel[];
  type?: SubjectType | SubjectType[];
  topics?: string | string[];
  tags?: string | string[];
  
  // Filtres de prix
  priceRange?: {
    min: number;
    max: number;
  };
  isFree?: boolean;
  isPremium?: boolean;
  
  // Filtres de popularité
  minRating?: number;
  minDownloads?: number;
  
  // Filtres de dates
  yearRange?: {
    from: number;
    to: number;
  };
  publishedAfter?: string;
  publishedBefore?: string;
  
  // Flags
  hasCorrection?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
}

/**
 * Options de tri
 */
export type SortField = 
  | 'relevance'
  | 'price'
  | 'date'
  | 'popularity'
  | 'difficulty'
  | 'rating'
  | 'title'
  | 'downloads'
  | 'year';

export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

/**
 * Paramètres de recherche complets
 */
export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

/**
 * Résultats de recherche paginés
 */
export interface SearchResults {
  subjects: Subject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  aggregations?: SearchAggregations;
}

/**
 * Agrégations pour les filtres
 */
export interface SearchAggregations {
  exams: AggregationBucket[];
  subjects: AggregationBucket[];
  years: AggregationBucket[];
  difficulties: AggregationBucket[];
  priceRanges: AggregationBucket[];
}

export interface AggregationBucket {
  key: string;
  count: number;
}

/**
 * Catégorie de sujets
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  parentId?: string;
  subjectCount: number;
  order: number;
}

/**
 * Tag
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  color?: string;
}

/**
 * Métadonnées d'un sujet (pour la page détails)
 */
export interface SubjectMetadata {
  subject: Subject;
  similarSubjects: SubjectCardData[];
  relatedTopics: string[];
  prerequisites: string[];
  stats: SubjectStats;
}

/**
 * Statistiques détaillées d'un sujet
 */
export interface SubjectStats {
  views: number;
  downloads: number;
  favorites: number;
  shares: number;
  averageRating: number;
  ratingsCount: number;
  completionRate?: number;
  averageScore?: number;
}

/**
 * Avis/Évaluation d'un sujet
 */
export interface SubjectReview {
  id: string;
  subjectId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Historique de consultation
 */
export interface ViewHistory {
  id: string;
  subjectId: string;
  subject: SubjectCardData;
  viewedAt: string;
  duration?: number; // Temps passé en secondes
}

/**
 * Item favori
 */
export interface FavoriteItem {
  id: string;
  subjectId: string;
  subject: SubjectCardData;
  folderId?: string;
  notes?: string;
  addedAt: string;
}

/**
 * Dossier de favoris
 */
export interface FavoriteFolder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Suggestion de recherche
 */
export interface SearchSuggestion {
  text: string;
  type: 'query' | 'subject' | 'exam' | 'tag';
  count?: number;
  highlight?: string;
}

/**
 * Options d'affichage
 */
export type ViewMode = 'grid' | 'list';

/**
 * Configuration des colonnes de grille
 */
export interface GridColumns {
  mobile: number;
  tablet: number;
  desktop: number;
}

/**
 * État de chargement pour les listes
 */
export interface LoadingState {
  isLoading: boolean;
  isLoadingMore?: boolean;
  error?: string | null;
}

/**
 * Contexte de recherche (pour analytics)
 */
export interface SearchContext {
  query?: string;
  filters: SearchFilters;
  sort: SortOption;
  resultsCount: number;
  timestamp: string;
}

/**
 * Événement de téléchargement
 */
export interface DownloadEvent {
  subjectId: string;
  subject: SubjectCardData;
  downloadedAt: string;
  source: 'detail' | 'card' | 'search';
}

/**
 * Bundle/Pack de sujets
 */
export interface SubjectBundle {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  subjects: SubjectCardData[];
  originalPrice: number;
  bundlePrice: number;
  discount: number;
  savings: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

/**
 * Prédiction de réussite (IA)
 */
export interface SuccessPrediction {
  subjectId: string;
  subject: SubjectCardData;
  probability: number; // 0-1
  confidence: number;  // 0-1
  factors: PredictionFactor[];
  recommendations: string[];
  estimatedScore?: number;
  estimatedTime?: number; // minutes
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

/**
 * Options d'export
 */
export type ExportFormat = 'csv' | 'pdf' | 'json' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  includeStats?: boolean;
  fields?: string[];
}

/**
 * Configuration de la pagination
 */
export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default Subject;