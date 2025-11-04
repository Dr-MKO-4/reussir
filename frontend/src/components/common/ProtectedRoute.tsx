import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

/**
 * Composant de route protégée avancé
 * - Redirige vers /login si l'utilisateur n'est pas authentifié
 * - Affiche un loader pendant la vérification
 * - Gère les rôles autorisés et la vérification d'email
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireEmailVerification = false
}) => {
  const { isAuthenticated, loading, user } = useAuth();
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification des rôles autorisés
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="access-denied">
        <div className="access-denied-container">
          <div className="access-denied-icon">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <div className="access-denied-title">Accès refusé</div>
          <div className="access-denied-message">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </div>
          <button
            onClick={() => window.history.back()}
            className="back-button"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Vérification de l'email si requis
  if (requireEmailVerification && user && !user.isEmailVerified) {
    return (
      <div className="email-verification-required">
        <div className="verification-container">
          <div className="verification-icon">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div className="verification-title">Vérification d'email requise</div>
          <div className="verification-message">
            Veuillez vérifier votre adresse email pour accéder à cette fonctionnalité.
          </div>
          <div className="verification-actions">
            <button className="primary-button">
              Renvoyer l'email de vérification
            </button>
            <button
              onClick={() => window.history.back()}
              className="secondary-button"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le composant enfant si authentifié et autorisé
  return <>{children}</>;
};

export default ProtectedRoute;