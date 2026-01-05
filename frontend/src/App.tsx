// src/App.tsx - Ordre des Providers corrigé
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute'
import { UserRole, User } from './types/auth';
import useAuth from './hooks/useAuth';
import LoadingSpinner, { FullPageSpinner } from './components/ui/LoadingSpinner'

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile';
import HomePage from './pages/HomePage';
import EmailVerification from './pages/EmailVerification';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import Student from './pages/Student';
import ParentDashboard from './pages/Parent';
import TeacherDashboard from './pages/professeur';
import UserDashboard from './pages/UserDashboard';
import CartPage from './pages/CartPage';
import Favorites from './pages/Favorites';
import History from './pages/History';
import NotFound from './pages/NotFound';
import Discover from './pages/Discover';
import SearchPage from './pages/SearchPage';
import SubjectDetailsPage from './pages/SubjectDetailsPage';
import Home from './pages/Home';
import EmailVerified from './pages/EmailVerified';
import DashboardPage from './pages/DashboardPage';
import PreviewCarousel from './pages/PreviewCarousel';
import StatsCard from './pages/StatsCard';
import RecentActivity from './pages/RecentActivity';
import StudyProgress from './pages/StudyProgress';
import PerformanceChart from './pages/PerformanceChart';
import UpcomingExams from './pages/UpcomingExams';
import AchievementBadges from './pages/AchievementBadges';
import RecommendationWidget from './pages/RecommendationWidget';
import StudyStreak from './pages/StudyStreak';
import ProfileHeader from './pages/ProfileHeader';
import ProfileForm from './pages/ProfileForm';
import PasswordChangeForm from './pages/PasswordChangeForm';
import NotificationSettings from './pages/NotificationSettings';
import PrivacySettings from './pages/PrivacySettings';
import AccountDeletion from './pages/AccountDeletion';
import PreferencesForm from './pages/PreferencesForm';
import SubscriptionCard from './pages/SubscriptionCard';
import QuickActionsExample from './pages/QuickActions';
import HomeCatalog from './pages/HomeCatalog';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SubjectList from './pages/SubjectList';
import Cookies from './pages/Cookies';
import CatalogPage from './pages/CatalogPage';

// Route de protection pour rediriger les utilisateurs connectés
const UnauthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <FullPageSpinner 
        message="Vérification de l'authentification"
        submessage="Veuillez patienter pendant que nous vérifions vos informations"
        size="large"
        variant="default"
        color="primary"
      />
    );
  }

  if (isAuthenticated && user) {
    const shouldCompleteProfile = localStorage.getItem('shouldCompleteProfile') === 'true' ||
                                 !user.username || 
                                 !user.profile?.institution || 
                                 !user.profile?.currentLevel;

    if (shouldCompleteProfile) {
      return <Navigate to="/complete-profile" replace />;
    } else {
      return <Navigate to="/home" replace />; // Redirection corrigée vers /home
    }
  }

  return <>{children}</>;
};

// Route de protection pour la complétion de profil
const CompleteProfileRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <FullPageSpinner 
        message="Chargement de votre profil"
        submessage="Préparation de l'interface de complétion de profil"
        size="large"
        variant="pulse"
        color="secondary"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const shouldCompleteProfile = localStorage.getItem('shouldCompleteProfile') === 'true' ||
                               !user?.username || 
                               !user?.profile?.institution || 
                               !user?.profile?.currentLevel;

  if (!shouldCompleteProfile) {
    localStorage.removeItem('shouldCompleteProfile');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route protégée normale (pour le dashboard)
const DashboardRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <FullPageSpinner 
        message="Chargement du tableau de bord"
        submessage="Préparation de votre espace personnel"
        size="xl"
        variant="orbital"
        color="accent"
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const shouldCompleteProfile = localStorage.getItem('shouldCompleteProfile') === 'true' ||
                               !user?.username || 
                               !user?.profile?.institution || 
                               !user?.profile?.currentLevel;

  if (shouldCompleteProfile) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
};

// Composant de routage avec gestion de l'authentification
const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <FullPageSpinner 
        message="Initialisation de Réussir"
        submessage="Configuration de votre environnement d'apprentissage"
        size="xl"
        variant="default"
        color="primary"
        showProgress
        timeout={10000}
      />
    );
  }

  return (
    <Routes>
      {/* Routes publiques accessibles à tous */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/student" element={<Student />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/professeur" element={<TeacherDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/history" element={<History />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/subject/:id" element={<SubjectDetailsPage />} />
      <Route path="/subjects" element={<SubjectList />} />
      <Route path="/home" element={<Home />} />
      <Route path="/email-verified" element={<EmailVerified />} />
      <Route path="/dashboard-page" element={<DashboardPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/catalog" element={<CatalogPage />} />


      {/* Routes de test - développement uniquement */}
      {import.meta.env.DEV && (
        <>
          <Route path="/dev/quick-actions-example" element={<QuickActionsExample />} />
          <Route path="/dev/home-catalog" element={<HomeCatalog />} />
        </>
      )}

      {/* Routes publiques - accessibles seulement si non connecté */}
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <UnauthenticatedRoute>
            <Signup />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <UnauthenticatedRoute>
            <ResetPassword/>
          </UnauthenticatedRoute>
        }
      />
      
      {/* Routes de vérification email - publiques */}
      <Route
        path="/verify-email/:token"
        element={<VerifyCode/>}
      />
      <Route
        path="/verify-email"
        element={<VerifyCode/>}
      />
      <Route
        path="/verify-code"
        element={<VerifyCode/>}
      />

      {/* Route de complétion de profil avec protection spéciale */}
      <Route 
        path="/complete-profile" 
        element={
          <CompleteProfileRoute>
            <CompleteProfile />
          </CompleteProfileRoute>
        } 
      />

      {/* Route dashboard avec vérification de profil */}
      <Route
        path="/dashboard"
        element={
          <DashboardRoute>
            <Dashboard />
          </DashboardRoute>
        }
      />

      {/* AdminDashboard accessible sans authentification */}
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      {/* Route profil - accessible aux utilisateurs avec profil complet */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }
      />

      {/* Route racine pour redirection conditionnelle */}
      <Route
        path="/"
        element={<RootRoute />}
      />

      {/* Route 404 - Page non trouvée */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      {/* ✅ CORRECTION CRITIQUE : ToastProvider doit être AVANT CartProvider */}
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="app">
                <AppRoutes />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

const RootRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <FullPageSpinner 
        message="Chargement..."
        submessage="Vérification de votre statut de connexion"
        size="large"
        variant="default"
        color="primary"
      />
    );
  }

  return isAuthenticated ? <Home /> : <HomePage />;
};