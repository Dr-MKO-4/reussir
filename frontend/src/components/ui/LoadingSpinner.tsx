// src/components/ui/LoadingSpinner.tsx - Version Ultra-Optimisée
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'default' | 'pulse' | 'dots' | 'wave' | 'orbital';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
  text?: string;
  centered?: boolean;
  fullscreen?: boolean;
  centerHorizontal?: boolean;
  centerInParent?: boolean;
  centerViewport?: boolean;
  portal?: boolean;
  zIndex?: number;
  onMount?: () => void;
  onUnmount?: () => void;
  timeout?: number;
  showProgress?: boolean;
  ariaLabel?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'default',
  color = 'primary',
  className = '',
  text,
  centered = false,
  fullscreen = false,
  centerHorizontal = false,
  centerInParent = false,
  centerViewport = false,
  portal = false,
  zIndex = 2147483645,
  onMount,
  onUnmount,
  timeout,
  showProgress = false,
  ariaLabel
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Gestion du timeout automatique
  useEffect(() => {
    if (timeout && timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        onUnmount?.();
      }, timeout);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout, onUnmount]);

  // Gestion de la barre de progression
  useEffect(() => {
    if (showProgress && timeout && timeout > 0) {
      const interval = timeout / 100;
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const next = prev + 1;
          if (next >= 100) {
            clearInterval(progressIntervalRef.current);
            return 100;
          }
          return next;
        });
      }, interval);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [showProgress, timeout]);

  // Callback de montage
  useEffect(() => {
    onMount?.();
    
    return () => {
      onUnmount?.();
    };
  }, [onMount, onUnmount]);

  // Forcer le z-index si spécifié
  const customStyle: React.CSSProperties = zIndex !== 2147483645 ? { zIndex } : {};

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className={styles.pulseContainer}>
            <div className={styles.pulseRing}></div>
            <div className={styles.pulseRing}></div>
            <div className={styles.pulseRing}></div>
            <div className={styles.pulseCore}></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className={styles.dotsContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
      
      case 'wave':
        return (
          <div className={styles.waveContainer}>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
            <div className={styles.waveBar}></div>
          </div>
        );
      
      case 'orbital':
        return (
          <div className={styles.orbitalContainer}>
            <div className={styles.orbit}>
              <div className={styles.planet}></div>
            </div>
            <div className={styles.orbit}>
              <div className={styles.planet}></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.spinnerContainer}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRing}></div>
            <div className={styles.gradientOverlay}></div>
          </div>
        );
    }
  };

  const getSpinnerClasses = () => {
    const classes = [
      styles.spinner,
      styles[size],
      styles[variant],
      styles[color]
    ];
    
    // Logique de centrage intelligente
    if (centerViewport) classes.push(styles.centerViewport);
    else if (fullscreen) classes.push(styles.fullscreen);
    else if (centered) classes.push(styles.centered);
    else if (centerInParent) classes.push(styles.centerInParent);
    else if (centerHorizontal) classes.push(styles.centerHorizontal);
    
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  const spinnerContent = (
    <div 
      className={getSpinnerClasses()}
      style={customStyle}
      role="status"
      aria-label={ariaLabel || "Chargement en cours"}
      aria-live="polite"
      aria-busy="true"
      tabIndex={0}
    >
      <div className={styles.spinnerWrapper}>
        {renderSpinner()}
        
        {text && (
          <div className={styles.loadingText}>
            {text}
          </div>
        )}
        
        {showProgress && timeout && (
          <div 
            className="progress-container" 
            style={{
              marginTop: '16px',
              width: '120px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div 
              className="progress-bar"
              style={{
                height: '100%',
                background: 'var(--spinner-color)',
                width: `${progress}%`,
                transition: 'width 0.1s ease-out',
                borderRadius: '2px'
              }}
            />
          </div>
        )}
      </div>
      
      {(fullscreen || centerViewport) && (
        <div 
          className={styles.backdrop} 
          onClick={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
            }
          }}
        />
      )}
    </div>
  );

  // Si on veut utiliser un portal (recommandé pour fullscreen et centerViewport)
  if (!isVisible) return null;
  
  if (portal || fullscreen || centerViewport) {
    return createPortal(spinnerContent, document.body);
  }

  return spinnerContent;
};

// Hook personnalisé ultra-optimisé pour gérer les spinners
export const useLoadingSpinner = (options?: {
  timeout?: number;
  autoHide?: boolean;
  onTimeout?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showLoading = (id?: string) => {
    const newId = id || Date.now().toString();
    setLoadingId(newId);
    setIsLoading(true);

    // Timeout automatique
    if (options?.timeout) {
      timeoutRef.current = setTimeout(() => {
        hideLoading();
        options?.onTimeout?.();
      }, options.timeout);
    }

    return newId;
  };

  const hideLoading = (id?: string) => {
    // Si un ID est spécifié, ne masquer que si c'est le bon
    if (id && loadingId && id !== loadingId) return;
    
    setIsLoading(false);
    setLoadingId(null);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const toggleLoading = () => {
    if (isLoading) {
      hideLoading();
    } else {
      showLoading();
    }
  };

  // Nettoyage automatique
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const LoadingComponent: React.FC<Omit<LoadingSpinnerProps, 'fullscreen' | 'centerViewport'>> = (props) => {
    if (!isLoading) return null;
    
    return (
      <LoadingSpinner 
        centerViewport 
        portal
        {...props}
        onUnmount={() => {
          hideLoading();
          props.onUnmount?.();
        }}
      />
    );
  };

  return {
    isLoading,
    loadingId,
    showLoading,
    hideLoading,
    toggleLoading,
    LoadingComponent
  };
};

// Hook pour spinner dans un contexte spécifique (formulaire, modal, etc.)
export const useContextualSpinner = (containerId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (containerId) {
      containerRef.current = document.getElementById(containerId);
    }
  }, [containerId]);

  const showSpinner = () => setIsLoading(true);
  const hideSpinner = () => setIsLoading(false);

  const SpinnerComponent: React.FC<LoadingSpinnerProps> = (props) => {
    if (!isLoading) return null;

    const spinnerElement = (
      <LoadingSpinner 
        centerInParent 
        {...props}
      />
    );

    // Si on a un container spécifique, utiliser createPortal
    if (containerRef.current) {
      return createPortal(spinnerElement, containerRef.current);
    }

    return spinnerElement;
  };

  return {
    isLoading,
    showSpinner,
    hideSpinner,
    SpinnerComponent,
    containerRef
  };
};

// Composant wrapper pour centrage automatique
export const CenteredSpinner: React.FC<LoadingSpinnerProps & { 
  containerClass?: string;
  minHeight?: string | number;
}> = ({ containerClass, minHeight = '200px', ...props }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    width: '100%'
  };

  return (
    <div 
      className={`${styles['spinner-container-centered']} ${containerClass || ''}`}
      style={containerStyle}
    >
      <LoadingSpinner {...props} />
    </div>
  );
};

// Composant pour overlay de chargement sur une section
export const LoadingOverlay: React.FC<LoadingSpinnerProps & {
  isVisible: boolean;
  children?: React.ReactNode;
  overlayClassName?: string;
  backgroundBlur?: boolean;
}> = ({ 
  isVisible, 
  children, 
  overlayClassName, 
  backgroundBlur = true,
  ...spinnerProps 
}) => {
  if (!isVisible) return <>{children}</>;

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: backgroundBlur ? 'blur(8px)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  };

  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div 
        className={`loading-overlay ${overlayClassName || ''}`}
        style={overlayStyle}
      >
        <LoadingSpinner {...spinnerProps} />
      </div>
    </div>
  );
};

// Composant pour spinner de page entière avec message personnalisé
export const FullPageSpinner: React.FC<{
  message?: string;
  submessage?: string;
  variant?: LoadingSpinnerProps['variant'];
  size?: LoadingSpinnerProps['size'];
  color?: LoadingSpinnerProps['color'];
  showProgress?: boolean;
  timeout?: number;
  onTimeout?: () => void;
}> = ({ 
  message = "Chargement en cours", 
  submessage,
  variant = 'default',
  size = 'large',
  color = 'primary',
  showProgress = false,
  timeout,
  onTimeout
}) => {
  return createPortal(
    <div 
      className={styles.fullscreen}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '40px',
        textAlign: 'center'
      }}
    >
      <LoadingSpinner 
        variant={variant}
        size={size}
        color={color}
        showProgress={showProgress}
        timeout={timeout}
        onUnmount={onTimeout}
      />
      
      <div className="loading-messages">
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: 600,
          color: 'var(--color-neutral-dark, #1a202c)'
        }}>
          {message}
        </h2>
        
        {submessage && (
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: 'var(--color-neutral-medium, #64748b)',
            maxWidth: '400px'
          }}>
            {submessage}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

// Types d'export pour TypeScript
export type {
  LoadingSpinnerProps
};

export default LoadingSpinner;