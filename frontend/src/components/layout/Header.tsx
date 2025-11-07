import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import './Header.css';

/**
 * Props du composant Header
 */
export interface HeaderProps {
  onSearchSubmit?: (query: string) => void;
  showSearch?: boolean;
  sticky?: boolean;
  className?: string;
}

/**
 * Composant Header avec navigation, recherche, panier et menu utilisateur
 */
export const Header: React.FC<HeaderProps> = ({
  onSearchSubmit,
  showSearch = true,
  sticky = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemsCount } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartItemsCount = getItemsCount();

  /**
   * Gérer la soumission de recherche
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit?.(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  /**
   * Gérer la déconnexion
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Toggle menu mobile
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Toggle menu utilisateur
   */
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const headerClasses = [
    'header',
    sticky ? 'header-sticky' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClasses}>
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="logo-text">Réussir</span>
          </Link>
        </div>

        {/* Navigation principale (Desktop) */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Accueil
          </Link>
          <Link to="/discover" className="nav-link">
            Découvrir
          </Link>
          <Link to="/catalog" className="nav-link">
            Catalogue
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="nav-link">
              Tableau de bord
            </Link>
          )}
        </nav>

        {/* Barre de recherche */}
        {showSearch && (
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              className="search-input"
              placeholder="Rechercher des sujets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher"
            />
            <button type="submit" className="search-button" aria-label="Rechercher">
              <svg
                className="search-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        )}

        {/* Actions */}
        <div className="header-actions">
          {/* Panier */}
          <Link to="/cart" className="header-action header-cart">
            <svg
              className="action-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {/* Menu utilisateur ou connexion */}
          {isAuthenticated && user ? (
            <div className="header-user">
              <button
                className="user-button"
                onClick={toggleUserMenu}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar user-avatar-placeholder">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                )}
                <svg
                  className="user-chevron"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu utilisateur */}
              {isUserMenuOpen && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-menu-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="user-menu-email">{user.email}</div>
                  </div>
                  
                  <div className="user-menu-divider" />
                  
                  <Link to="/profile" className="user-menu-item">
                    <svg
                      className="menu-item-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profil
                  </Link>
                  
                  <Link to="/dashboard" className="user-menu-item">
                    <svg
                      className="menu-item-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                    Tableau de bord
                  </Link>
                  
                  <Link to="/favorites" className="user-menu-item">
                    <svg
                      className="menu-item-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Favoris
                  </Link>
                  
                  <div className="user-menu-divider" />
                  
                  <button
                    className="user-menu-item user-menu-logout"
                    onClick={handleLogout}
                  >
                    <svg
                      className="menu-item-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth">
              <Link to="/login" className="auth-link">
                Connexion
              </Link>
              <Link to="/signup" className="auth-link auth-signup">
                Inscription
              </Link>
            </div>
          )}

          {/* Hamburger menu (Mobile) */}
          <button
            className="header-hamburger"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="hamburger-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="hamburger-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="mobile-nav">
            <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Accueil
            </Link>
            <Link to="/discover" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Découvrir
            </Link>
            <Link to="/catalog" className="mobile-nav-link" onClick={toggleMobileMenu}>
              Catalogue
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="mobile-nav-link" onClick={toggleMobileMenu}>
                  Tableau de bord
                </Link>
                <Link to="/favorites" className="mobile-nav-link" onClick={toggleMobileMenu}>
                  Favoris
                </Link>
                <Link to="/profile" className="mobile-nav-link" onClick={toggleMobileMenu}>
                  Profil
                </Link>
              </>
            )}
          </nav>
          
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="mobile-auth-link" onClick={toggleMobileMenu}>
                Connexion
              </Link>
              <Link to="/signup" className="mobile-auth-link mobile-auth-signup" onClick={toggleMobileMenu}>
                Inscription
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

Header.displayName = 'Header';

export default Header;