import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

/**
 * Composant de route protégée
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="spinner-ring"></div>
          <p className="loading-text">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    // Sauvegarder la location actuelle pour rediriger après login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Afficher le composant enfant si authentifié
  return children;
};

export default ProtectedRoute;