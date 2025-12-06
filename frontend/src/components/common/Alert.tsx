import React, { ReactNode } from 'react';
import './Alert.css';

/**
 * Variantes de l'alerte
 */
export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Props du composant Alert
 */
export interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message?: string;
  children?: ReactNode;
  isDismissible?: boolean;
  onDismiss?: () => void;
  icon?: ReactNode;
  className?: string;
}

/**
 * Composant Alert pour afficher des messages
 */
export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  children,
  isDismissible = false,
  onDismiss,
  icon,
  className = '',
}) => {
  const classes = [
    'alert',
    `alert-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const defaultIcons = {
    success: (
      <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    error: (
      <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className={classes} role="alert">
      <div className="alert-icon-wrapper">
        {icon || defaultIcons[variant]}
      </div>

      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {message && <div className="alert-message">{message}</div>}
        {children && <div className="alert-children">{children}</div>}
      </div>

      {isDismissible && onDismiss && (
        <button
          type="button"
          className="alert-close"
          onClick={onDismiss}
          aria-label="Fermer l'alerte"
        >
          <svg
            className="alert-close-icon"
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
        </button>
      )}
    </div>
  );
};

Alert.displayName = 'Alert';

export default Alert;