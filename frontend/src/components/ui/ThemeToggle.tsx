// src/components/ui/ThemeToggle.tsx

import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ui/Toast';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'icon-only';
  showLabel?: boolean;
  position?: 'static' | 'fixed';
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'default',
  showLabel = true,
  position = 'static',
  className = ''
}) => {
  const { theme, toggleTheme, isSystemTheme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    toggleTheme();
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg className={styles.themeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className={styles.themeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      default:
        return (
          <svg className={styles.themeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Mode clair';
      case 'dark':
        return 'Mode sombre';
      default:
        return 'Mode système';
    }
  };

  const getNextThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Passer au mode sombre';
      case 'dark':
        return 'Mode système';
      default:
        return 'Mode clair';
    }
  };

  // Render compact version
  if (variant === 'compact' || variant === 'icon-only') {
    return (
      <button
        onClick={handleToggle}
        className={`${styles.themeToggle} ${styles[variant]} ${isAnimating ? styles.animating : ''} ${className}`}
        title={`Basculer vers: ${getNextThemeLabel()}`}
        aria-label={`Thème actuel: ${getThemeLabel()}. Cliquer pour changer.`}
        disabled={isAnimating}
      >
        <div className={styles.iconContainer}>
          {getThemeIcon()}
        </div>
        {variant !== 'icon-only' && showLabel && (
          <span className={styles.label}>{getThemeLabel()}</span>
        )}
      </button>
    );
  }

  // Render default version with animated toggle
  return (
    <div className={`${styles.themeToggleContainer} ${position === 'fixed' ? styles.fixed : ''} ${className}`}>
      <div className={styles.toggleWrapper}>
        {showLabel && (
          <span className={styles.themeLabel}>
            {getThemeLabel()}
            {isSystemTheme && (
              <span className={styles.systemBadge}>AUTO</span>
            )}
          </span>
        )}
        
        <button
          onClick={handleToggle}
          className={`${styles.toggleButton} ${isAnimating ? styles.animating : ''}`}
          title={`Basculer vers: ${getNextThemeLabel()}`}
          aria-label={`Thème actuel: ${getThemeLabel()}. Cliquer pour changer.`}
          disabled={isAnimating}
        >
          <div className={styles.toggleTrack}>
            <div className={`${styles.toggleThumb} ${styles[theme]}`}>
              <div className={styles.thumbIcon}>
                {getThemeIcon()}
              </div>
            </div>
            
            {/* Background icons */}
            <div className={styles.trackIcons}>
              <div className={styles.lightIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              
              <div className={styles.darkIcon}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Ripple effect */}
          <div className={styles.ripple}></div>
        </button>
        
        {/* Theme options tooltip for multi-option */}
        <div className={styles.themeOptions}>
          <button
            onClick={() => setTheme?.('light')}
            className={`${styles.optionButton} ${theme === 'light' ? styles.active : ''}`}
            title="Mode clair"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => setTheme?.('dark')}
            className={`${styles.optionButton} ${theme === 'dark' ? styles.active : ''}`}
            title="Mode sombre"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          
          <button
            onClick={() => setTheme?.('auto')}
            className={`${styles.optionButton} ${theme === 'auto' ? styles.active : ''}`}
            title="Mode système"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 20 20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle; 