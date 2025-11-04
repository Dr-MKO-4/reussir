import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div className="route-loading">
        <div className="loading-container">
          <div className="spinner-ring"></div>
          <span className="loading-text">Vérification...</span>
        </div>
      </div>
    );
  }

  // Redirection vers dashboard si déjà authentifié
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// export nommé (garde la compatibilité) + export par défaut
export { PublicRoute };
export default PublicRoute;
