// ==================== USER TYPES ====================
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'student' | 'teacher' | 'admin';
  attributes?: {
    email: string;
    name: string;
    'custom:role'?: string;
  };
}

export interface UserStats {
  totalInteractions: number;
  totalReussites: number;
  tauxReussite: number;
  avgTempsPasseSeconds: number;
  avgClics: number;
  contenusDistincts: number;
}

// ==================== SUBJECT/CONTENT TYPES ====================
export interface Subject {
  id: number;
  titre: string;
  theme: string;
  difficulte: number;
  description: string;
  concours?: string;
  matiere?: string;
  annee?: number;
  image?: string;
  prix?: number;
  gratuit?: boolean;
  dureeEstimee?: number;
  tags?: string[];
  popularite?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectDetails extends Subject {
  contenu?: string;
  corrections?: string;
  fichiers?: string[];
  statistiques?: {
    vues: number;
    achats: number;
    tauxReussite: number;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  count: number;
  description?: string;
}

// ==================== SEARCH & FILTERS ====================
export interface SearchParams {
  query?: string;
  concours?: string;
  matiere?: string;
  annee?: number;
  difficulte?: number;
  prix?: number;
  duree?: number;
  gratuit?: boolean;
  page?: number;
  limit?: number;
  sort?: 'pertinence' | 'popularite' | 'date' | 'prix' | 'difficulte';
}

export interface SearchResult {
  subjects: Subject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

export interface Filters {
  concours: FilterOption[];
  matieres: FilterOption[];
  annees: FilterOption[];
  difficultes: FilterOption[];
  prix: FilterOption[];
}

// ==================== CART TYPES ====================
export interface CartItem {
  id: number;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  subject?: Subject;
}

export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  expiresAt?: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

// ==================== AI TYPES ====================
export interface AIRecommendation {
  subjectId: number;
  score: number;
  reason: string;
  subject?: Subject;
}

export interface SuccessPrediction {
  subjectId: number;
  userId: number;
  probability: number;
  confidence: number;
  factors: {
    niveau: number;
    historique: number;
    temps: number;
  };
}

export interface StudyPlan {
  userId: number;
  objectif: string;
  duree: number;
  etapes: StudyPlanStep[];
  createdAt: string;
}

export interface StudyPlanStep {
  id: number;
  jour: number;
  titre: string;
  description: string;
  subjectId?: number;
  dureeEstimee: number;
  completed: boolean;
}

export interface AIAnalysis {
  difficultyScore: number;
  difficultyLevel: 'facile' | 'moyen' | 'difficile';
  estimatedDurationMinutes: number;
  tags: string[];
  complexityMetrics: {
    wordCount: number;
    sentenceCount: number;
    avgWordLength: number;
    avgSentenceLength: number;
  };
}

// ==================== INTERACTION TYPES ====================
export interface Interaction {
  id: number;
  userId: number;
  subjectId: number;
  clics: number;
  tempsPasseSeconds: number;
  reussite: boolean;
  timestamp: string;
  subject?: Subject;
}

export interface Favorite {
  id: number;
  userId: number;
  subjectId: number;
  createdAt: string;
  subject?: Subject;
  tags?: string[];
  notes?: string;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== FORM TYPES ====================
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  avatar?: string;
  niveau?: string;
  objectif?: string;
}

// ==================== COMPONENT PROPS TYPES ====================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// ==================== UTILITY TYPES ====================
export type SortOrder = 'asc' | 'desc';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// ==================== CONTEXT TYPES ====================
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  signOut: () => Promise<{ success: boolean }>;
  confirmSignUp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean }>;
  refreshUser: () => Promise<void>;
}

export interface CartContextType {
  cart: CartItem[];
  promoCode: PromoCode | null;
  loading: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; promo?: PromoCode; error?: string }>;
  removePromoCode: () => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  mounted: boolean;
}