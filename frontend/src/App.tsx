// src/App.tsx - Flux de redirection corrigé avec LoadingSpinner centré
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute'
import { UserRole } from './types/auth';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner, { FullPageSpinner } from './components/ui/LoadingSpinner'
// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile'
import HomePage from './pages/HomePage';
import EmailVerification from './pages/EmailVerification';
import ResetPassword from './pages/ResetPassword';
import Student from './pages/Student'
import ParentDashboard from './pages/Parent'
import TeacherDashboard from './pages/professeur'
// Styles globaux
import './styles/globals.css';
import './styles/theme.css';
import './styles/variables.css';

// Route de protection pour rediriger les utilisateurs connectés
const UnauthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // CORRECTION: Utiliser le FullPageSpinner pour un centrage parfait
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
    // Si l'utilisateur est connecté, vérifier où le rediriger
    const shouldCompleteProfile = localStorage.getItem('shouldCompleteProfile') === 'true' ||
                                 !user.username || 
                                 !user.institution || 
                                 !user.currentLevel;

    if (shouldCompleteProfile) {
      return <Navigate to="/complete-profile" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Route de protection pour la complétion de profil
const CompleteProfileRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // CORRECTION: Utiliser le FullPageSpinner avec message adapté
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

  // Vérifier si le profil doit vraiment être complété
  const shouldCompleteProfile = localStorage.getItem('shouldCompleteProfile') === 'true' ||
                               !user?.username || 
                               !user?.institution || 
                               !user?.currentLevel;

  if (!shouldCompleteProfile) {
    // Le profil est déjà complet, rediriger vers le dashboard
    localStorage.removeItem('shouldCompleteProfile');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route protégée normale (pour le dashboard)
const DashboardRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // CORRECTION: Utiliser le FullPageSpinner avec message dashboard
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

  // Vérifier si le profil doit être complété avant d'accéder au dashboard
  const shouldCompleteProfile = localStorage.getItem('shouldCompleteProfile') === 'true' ||
                               !user?.username || 
                               !user?.institution || 
                               !user?.currentLevel;

  if (shouldCompleteProfile) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
};

// Composant de chargement global pour l'app
const AppLoadingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider position="top-right">
          <Router>
            <div className="app">
              <AppLoadingWrapper>
                <Routes>
                  {/* Route d'accueil - HomePage accessible à tous */}
                  <Route path="/" element={<HomePage />} />
                  <Route path='student' element ={<Student/>}/>
                  <Route path='parent' element ={<ParentDashboard/>}/>
                  <Route path = 'professeur' element = {<TeacherDashboard/>}/>

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
                    element={<EmailVerification/>}
                  />
                  <Route
                    path="/verify-email"
                    element={<EmailVerification/>}
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

                  {/* Route profil - accessible aux utilisateurs avec profil complet */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile/>
                      </ProtectedRoute>
                    }
                  />

                  {/* Route 404 avec style amélioré */}
                  <Route
                    path="*"
                    element={
                      <div className="error-page" style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--color-neutral-light)',
                        fontFamily: 'var(--font-primary)'
                      }}>
                        <div className="error-container" style={{
                          textAlign: 'center',
                          padding: '2rem',
                          background: 'var(--color-white)',
                          borderRadius: 'var(--radius-2xl)',
                          boxShadow: 'var(--shadow-2xl)',
                          maxWidth: '400px'
                        }}>
                          <h1 style={{
                            fontSize: '4rem',
                            fontWeight: '700',
                            color: 'var(--color-primary)',
                            margin: '0 0 1rem 0'
                          }}>404</h1>
                          <p style={{
                            fontSize: '1.2rem',
                            color: 'var(--color-neutral-dark)',
                            margin: '0 0 2rem 0'
                          }}>Page non trouvée</p>
                          <a 
                            href="/" 
                            style={{
                              display: 'inline-block',
                              padding: '0.75rem 1.5rem',
                              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: 'var(--radius-lg)',
                              fontWeight: '600',
                              transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.target as HTMLElement;
                              target.style.transform = 'translateY(0)';
                            }}
                          >
                            Retour à l'accueil
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </AppLoadingWrapper>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;