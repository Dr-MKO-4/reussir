import React, { ReactNode } from 'react';
import './Badge.css';

/**
 * Variantes du badge
 */
export type BadgeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'neutral';

/**
 * Tailles du badge
 */
export type BadgeSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant Badge
 */
export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  isRounded?: boolean;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Composant Badge pour afficher des étiquettes
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  isRounded = false,
  dot = false,
  icon,
  className = '',
  onClick,
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    isRounded ? 'badge-rounded' : '',
    onClick ? 'badge-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <span
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {icon && <span className="badge-icon" aria-hidden="true">{icon}</span>}
      <span className="badge-content">{children}</span>
    </span>
  );
};

/**
 * Sous-composant BadgeGroup pour grouper plusieurs badges
 */
export const BadgeGroup: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`badge-group ${className}`}>
      {children}
    </div>
  );
};

Badge.displayName = 'Badge';
BadgeGroup.displayName = 'BadgeGroup';

export default Badge;