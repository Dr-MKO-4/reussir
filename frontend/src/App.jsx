import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from '@contexts/AuthContext';
import { ThemeProvider } from '@contexts/ThemeContext';
import { CartProvider } from '@contexts/CartContext';

// Layout
import MainLayout from '@components/layout/MainLayout';

// Pages
import Home from '@pages/Home';
import Discover from '@pages/Discover';
import SubjectDetails from '@pages/SubjectDetails';
import Favorites from '@pages/Favorites';
import History from '@pages/History';
import Dashboard from '@pages/Dashboard';
import Cart from '@pages/Cart';
import Login from '@pages/auth/Login';
import Signup from '@pages/auth/Signup';
import ForgotPassword from '@pages/auth/ForgotPassword';
import Profile from '@pages/Profile';
import NotFound from '@pages/NotFound';

// Components
import ProtectedRoute from '@components/common/ProtectedRoute';
import ScrollToTop from '@components/common/ScrollToTop';

// Styles
import '@styles/variables.css';
import '@styles/globals.css';
import '@styles/theme.css';
import '@styles/dark-mode.css';

// AWS Amplify Configuration
import '@services/awsConfig';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="discover" element={<Discover />} />
                <Route path="subjects/:id" element={<SubjectDetails />} />
                <Route path="cart" element={<Cart />} />
                
                {/* Routes d'authentification */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                
                {/* Routes protégées (nécessitent authentification) */}
                <Route
                  path="favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 */}
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;