// src/components/ui/Toast.tsx - Version Ultra-Optimisée avec Positionnement Intelligent
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'smart' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center-viewport';
export type ToastVariant = 'default' | 'critical';

interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isVisible: boolean;
  onClose: (id: string) => void;
  position?: ToastPosition;
  showProgress?: boolean;
  isDismissible?: boolean;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: ToastVariant;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  autoFocus?: boolean;
  onMount?: () => void;
  onUnmount?: () => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  isVisible,
  onClose,
  position = 'smart',
  showProgress = true,
  isDismissible = true,
  icon,
  action,
  variant = 'default',
  priority = 'normal',
  autoFocus = false,
  onMount,
  onUnmount,
  className = ''
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);
  const toastRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  // Gestion intelligente des timers
  useEffect(() => {
    if (!isVisible || duration <= 0) return;

    const startTimer = () => {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, remainingTime);

      // Mise à jour de la progression
      if (showProgress) {
        intervalRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, remainingTime - elapsed);
            setRemainingTime(remaining);
            
            if (remaining === 0) {
              clearInterval(intervalRef.current);
            }
          }
        }, 50);
      }
    };

    const pauseTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        setRemainingTime(prev => Math.max(0, prev - elapsed));
      }
    };

    if (isPaused) {
      pauseTimer();
    } else {
      startTimer();
    }

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [id, isVisible, duration, remainingTime, isPaused, showProgress]);

  // Callback de montage/démontage
  useEffect(() => {
    if (isVisible) {
      onMount?.();
      
      // Auto-focus pour les toasts critiques
      if (autoFocus || priority === 'critical') {
        setTimeout(() => {
          toastRef.current?.focus();
        }, 100);
      }
    }
    
    return () => {
      onUnmount?.();
    };
  }, [isVisible, onMount, onUnmount, autoFocus, priority]);

  const handleClose = useCallback(() => {
    if (!isDismissible && priority !== 'critical') return;
    
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 400);
  }, [id, onClose, isDismissible, priority]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isDismissible) {
      event.preventDefault();
      handleClose();
    }
    if (event.key === 'Enter' && action) {
      event.preventDefault();
      action.onClick();
    }
  }, [handleClose, isDismissible, action]);

  if (!isVisible && !isExiting) return null;

  const getDefaultIcon = () => {
    if (icon) return icon;
    
    const iconProps = {
      width: 22,
      height: 22,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const
    };

    switch (type) {
      case 'success':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
        );
      case 'error':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        );
      case 'warning':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="m12 17 .01 0"/>
          </svg>
        );
      case 'info':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 16v-4"/>
            <path d="m12 8 .01 0"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getToastClasses = () => {
    const classes = [
      styles.toast,
      styles[type]
    ];
    
    if (isVisible && !isExiting) classes.push(styles.visible);
    if (isExiting) classes.push(styles.exiting);
    if (variant === 'critical') classes.push(styles.critical);
    if (className) classes.push(className);
    
    return classes.join(' ');
  };

  const progressPercentage = duration > 0 ? (remainingTime / duration) * 100 : 0;

  const toastContent = (
    <div 
      ref={toastRef}
      className={getToastClasses()}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      role="alert"
      aria-live={priority === 'critical' ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-describedby={`toast-${id}-message`}
      aria-labelledby={title ? `toast-${id}-title` : undefined}
      tabIndex={0}
      data-toast-id={id}
      data-toast-type={type}
      data-toast-priority={priority}
    >
      {/* Effet de lueur */}
      <div className={styles.glowEffect} aria-hidden="true"></div>
      
      {/* Contenu principal */}
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <div className={styles.iconWrapper} aria-hidden="true">
            {getDefaultIcon()}
          </div>
          <div className={styles.iconRipple} aria-hidden="true"></div>
        </div>
        
        <div className={styles.textContent}>
          {title && (
            <div 
              id={`toast-${id}-title`}
              className={styles.title}
            >
              {title}
            </div>
          )}
          <div 
            id={`toast-${id}-message`}
            className={styles.message}
          >
            {message}
          </div>
          
          {action && (
            <button
              type="button"
              className={styles.actionButton}
              onClick={action.onClick}
              aria-describedby={`toast-${id}-message`}
            >
              {action.label}
            </button>
          )}
        </div>

        {isDismissible && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Fermer la notification"
            title="Fermer (Échap)"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Barre de progression */}
      {showProgress && duration > 0 && (
        <div className={styles.progressContainer} aria-hidden="true">
          <div 
            className={styles.progressBar}
            style={{ 
              width: `${progressPercentage}%`,
              animationDuration: `${duration}ms`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          />
        </div>
      )}

      {/* Élément décoratif */}
      <div className={styles.decorativeElement} aria-hidden="true"></div>
    </div>
  );

  return createPortal(toastContent, document.body);
};

// Hook ultra-intelligent pour gérer les toasts avec positionnement dynamique
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    isVisible: boolean;
    position?: ToastPosition;
    showProgress?: boolean;
    isDismissible?: boolean;
    icon?: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
    variant?: ToastVariant;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    autoFocus?: boolean;
    className?: string;
  }>>([]);

  // Système intelligent de gestion des positions et priorités
  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'isVisible' | 'onClose'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newToast = {
      ...toast,
      id,
      isVisible: true,
      priority: toast.priority || (toast.type === 'error' ? 'high' : 'normal'),
      position: toast.position || 'smart',
      duration: toast.duration ?? (
        toast.type === 'error' ? 8000 : 
        toast.type === 'warning' ? 6000 : 
        5000
      )
    };

    setToasts(prev => {
      // Si c'est un toast critique, le placer en premier
      if (newToast.priority === 'critical') {
        return [newToast, ...prev];
      }
      
      // Sinon, l'ajouter normalement
      return [...prev, newToast];
    });

    // Annonce vocale pour l'accessibilité
    const announcement = `${toast.type === 'error' ? 'Erreur' : 
                         toast.type === 'success' ? 'Succès' : 
                         toast.type === 'warning' ? 'Attention' : 'Information'}: ${toast.message}`;
    
    // Créer un élément temporaire pour l'annonce vocale
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', toast.priority === 'critical' ? 'assertive' : 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Méthodes spécialisées avec paramètres optimisés
  const showSuccess = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ 
      type: 'success', 
      message,
      title: options?.title || 'Succès',
      duration: 4000,
      showProgress: true,
      ...options 
    });
  }, [addToast]);

  const showError = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ 
      type: 'error', 
      message,
      title: options?.title || 'Erreur',
      duration: 8000,
      priority: 'high',
      showProgress: true,
      isDismissible: true,
      ...options 
    });
  }, [addToast]);

  const showWarning = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ 
      type: 'warning', 
      message,
      title: options?.title || 'Attention',
      duration: 6000,
      showProgress: true,
      ...options 
    });
  }, [addToast]);

  const showInfo = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ 
      type: 'info', 
      message,
      title: options?.title || 'Information',
      duration: 5000,
      showProgress: true,
      ...options 
    });
  }, [addToast]);

  // Méthode pour les toasts critiques
  const showCritical = useCallback((message: string, options?: Partial<ToastProps>) => {
    return addToast({ 
      type: 'error', 
      message,
      title: options?.title || 'Action requise',
      variant: 'critical',
      priority: 'critical',
      position: 'center-viewport',
      duration: 0, // Pas d'auto-dismiss
      isDismissible: true,
      autoFocus: true,
      showProgress: false,
      ...options 
    });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCritical
  };
};

// Container ultra-intelligent avec positionnement dynamique
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    isVisible: boolean;
    position?: ToastPosition;
    showProgress?: boolean;
    isDismissible?: boolean;
    icon?: React.ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
    variant?: ToastVariant;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    autoFocus?: boolean;
    className?: string;
  }>;
  onClose: (id: string) => void;
  maxToasts?: number;
  smartPositioning?: boolean;
  globalPosition?: ToastPosition;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  maxToasts = 5,
  smartPositioning = true,
  globalPosition = 'smart'
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [userPosition, setUserPosition] = useState<'top' | 'middle' | 'bottom'>('top');
  
  // Détection intelligente de la position de l'utilisateur
  useEffect(() => {
    const updateScrollInfo = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      setScrollPosition(scrollY);
      setViewportHeight(windowHeight);
      
      // Détermine la position relative de l'utilisateur
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      
      if (scrollPercentage < 0.1) {
        setUserPosition('top');
      } else if (scrollPercentage > 0.8) {
        setUserPosition('bottom');
      } else {
        setUserPosition('middle');
      }
    };

    updateScrollInfo();
    
    const throttledUpdate = throttle(updateScrollInfo, 100);
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    };
  }, []);

  // Fonction throttle pour optimiser les performances
  function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Calcule la position optimale pour chaque toast
  const getOptimalPosition = (toast: typeof toasts[0]): ToastPosition => {
    if (!smartPositioning || toast.position !== 'smart') {
      return toast.position || globalPosition || 'top-right';
    }

    // Logique de positionnement intelligent
    if (toast.priority === 'critical') {
      return 'center-viewport';
    }

    // Basé sur la position de scroll
    switch (userPosition) {
      case 'top':
        return 'top-right';
      case 'bottom':
        return 'bottom-right';
      case 'middle':
        return scrollPosition < viewportHeight ? 'top-right' : 'bottom-right';
      default:
        return 'top-right';
    }
  };

  // Trier les toasts par priorité
  const sortedToasts = [...toasts].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
    return priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal'];
  });

  // Grouper les toasts par position
  const toastGroups = sortedToasts.reduce((groups, toast) => {
    const position = getOptimalPosition(toast);
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(toast);
    return groups;
  }, {} as Record<string, typeof sortedToasts>);

  // Limiter le nombre de toasts visibles
  Object.keys(toastGroups).forEach(position => {
    if (toastGroups[position].length > maxToasts) {
      toastGroups[position] = toastGroups[position].slice(0, maxToasts);
    }
  });

  const getContainerClass = (position: ToastPosition) => {
    const baseClass = styles.toastContainer;
    
    if (smartPositioning && position === 'smart') {
      return `${baseClass} ${styles['container-smart-top']} ${styles.smartPosition} ${styles[`user-at-${userPosition}`]}`;
    }
    
    return `${baseClass} ${styles[`container-${position}`]}`;
  };

  if (sortedToasts.length === 0) return null;

  return (
    <>
      {Object.entries(toastGroups).map(([position, positionToasts]) => {
        if (positionToasts.length === 0) return null;
        
        return createPortal(
          <div 
            key={position}
            className={getContainerClass(position as ToastPosition)}
            style={{
              '--scroll-y': scrollPosition,
              '--viewport-height': `${viewportHeight}px`
            } as React.CSSProperties}
            role="region"
            aria-label="Notifications"
            aria-live="polite"
          >
            {positionToasts.map((toast, index) => (
              <Toast
                key={toast.id}
                {...toast}
                position={position as ToastPosition}
                onClose={onClose}
                onMount={() => {
                  // Analytics ou logging si nécessaire
                  console.log(`Toast affiché: ${toast.type} - ${toast.message}`);
                }}
              />
            ))}
            
            {/* Indicateur de toasts supplémentaires */}
            {toasts.length > maxToasts && position === getOptimalPosition(toasts[0]) && (
              <div 
                className={styles.moreIndicator}
                onClick={() => {
                  // Possibilité d'afficher plus de toasts ou d'ouvrir un panneau
                  console.log('Afficher plus de notifications');
                }}
                role="button"
                tabIndex={0}
                aria-label={`${toasts.length - maxToasts} notifications supplémentaires`}
              >
                +{toasts.length - maxToasts} autres notifications
              </div>
            )}
          </div>,
          document.body
        );
      })}
    </>
  );
};

// Context Provider pour une utilisation globale
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastSystem = useToast();

  return (
    <>
      {children}
      <ToastContainer
        toasts={toastSystem.toasts}
        onClose={toastSystem.removeToast}
        smartPositioning={true}
        maxToasts={5}
      />
    </>
  );
};

// Hook pour utiliser le système de toast dans les composants
export const useToastContext = () => {
  // Cette implémentation nécessiterait un Context React
  // Pour l'instant, on retourne une nouvelle instance
  return useToast();
};

// Utilitaires pour les développeurs
export const ToastUtils = {
  // Préconfigurations courantes
  networkError: (message = "Erreur de connexion réseau") => ({
    type: 'error' as ToastType,
    message,
    title: 'Erreur réseau',
    duration: 8000,
    action: {
      label: 'Réessayer',
      onClick: () => window.location.reload()
    }
  }),
  
  saveSuccess: (message = "Modifications enregistrées") => ({
    type: 'success' as ToastType,
    message,
    title: 'Enregistré',
    duration: 3000
  }),
  
  formError: (message: string) => ({
    type: 'error' as ToastType,
    message,
    title: 'Erreur de validation',
    duration: 6000,
    showProgress: true
  }),
  
  maintenanceWarning: (message: string) => ({
    type: 'warning' as ToastType,
    message,
    title: 'Maintenance programmée',
    duration: 10000,
    priority: 'high' as const,
    position: 'top-center' as ToastPosition
  })
};

export default Toast;