import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import './Button.css';

/**
 * Variantes du bouton
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'ghost' 
  | 'link';

/**
 * Tailles du bouton
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant Button
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Composant Button réutilisable
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  as = 'button',
  href,
  target,
  rel,
  type = 'button',
  onClick,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    isLoading ? 'btn-loading' : '',
    isDisabled ? 'btn-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const disabled = isDisabled || isLoading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const content = (
    <>
      {isLoading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg className="btn-spinner-icon" viewBox="0 0 24 24">
            <circle
              className="btn-spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}
      
      {!isLoading && leftIcon && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span className={`btn-content ${isLoading ? 'btn-content-loading' : ''}`}>
        {children}
      </span>
      
      {!isLoading && rightIcon && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  if (as === 'a' && href) {
    return (
      <a
        href={disabled ? undefined : href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={classes}
        aria-disabled={disabled}
        onClick={(e) => disabled && e.preventDefault()}
        {...(rest as any)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      aria-busy={isLoading}
      {...rest}
    >
      {content}
    </button>
  );
};

export default Button;