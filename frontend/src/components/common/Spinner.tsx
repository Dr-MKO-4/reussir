import React from 'react';
import './Spinner.css';

/**
 * Tailles du spinner
 */
export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Variantes du spinner
 */
export type SpinnerVariant = 'ring' | 'dots' | 'pulse' | 'bars';

/**
 * Props du composant Spinner
 */
export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: string;
  label?: string;
  centered?: boolean;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Composant Spinner pour les états de chargement
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'ring',
  color,
  label,
  centered = false,
  fullScreen = false,
  className = '',
}) => {
  const spinnerClasses = [
    'spinner',
    `spinner-${size}`,
    `spinner-${variant}`,
    centered ? 'spinner-centered' : '',
    fullScreen ? 'spinner-fullscreen' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = color ? { color } : undefined;

  const renderSpinner = () => {
    switch (variant) {
      case 'ring':
        return (
          <svg className="spinner-ring" viewBox="0 0 50 50" style={style}>
            <circle
              className="spinner-ring-circle"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        );

      case 'dots':
        return (
          <div className="spinner-dots" style={style}>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
            <div className="spinner-dot"></div>
          </div>
        );

      case 'pulse':
        return (
          <div className="spinner-pulse" style={style}>
            <div className="spinner-pulse-ring"></div>
            <div className="spinner-pulse-ring"></div>
          </div>
        );

      case 'bars':
        return (
          <div className="spinner-bars" style={style}>
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
            <div className="spinner-bar"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={spinnerClasses} role="status" aria-live="polite">
      {renderSpinner()}
      {label && <span className="spinner-label">{label}</span>}
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

/**
 * Composant SpinnerOverlay pour les chargements en plein écran
 */
export const SpinnerOverlay: React.FC<Omit<SpinnerProps, 'fullScreen'>> = (props) => {
  return (
    <div className="spinner-overlay">
      <Spinner {...props} centered />
    </div>
  );
};

Spinner.displayName = 'Spinner';
SpinnerOverlay.displayName = 'SpinnerOverlay';

export default Spinner;