import React, { ReactNode, HTMLAttributes } from 'react';
import './Card.css';

/**
 * Variantes de la carte
 */
export type CardVariant = 'elevated' | 'outlined' | 'filled';

/**
 * Props du composant Card
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  isHoverable?: boolean;
  isPressable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

/**
 * Props pour CardHeader
 */
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  actions?: ReactNode;
}

/**
 * Props pour CardBody
 */
export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Props pour CardFooter
 */
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  bordered?: boolean;
}

/**
 * Composant Card principal
 */
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  isHoverable = false,
  isPressable = false,
  header,
  footer,
  children,
  padding = 'md',
  as: Component = 'div',
  className = '',
  onClick,
  ...rest
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    isHoverable ? 'card-hoverable' : '',
    isPressable ? 'card-pressable' : '',
    onClick ? 'card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={classes}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e as any);
              }
            }
          : undefined
      }
      {...rest}
    >
      {header && <div className="card-header-wrapper">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer-wrapper">{footer}</div>}
    </Component>
  );
};

/**
 * Sous-composant CardHeader
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  actions,
  className = '',
  ...rest
}) => {
  return (
    <div className={`card-header ${className}`} {...rest}>
      <div className="card-header-content">{children}</div>
      {actions && <div className="card-header-actions">{actions}</div>}
    </div>
  );
};

/**
 * Sous-composant CardBody
 */
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  padding = 'md',
  className = '',
  ...rest
}) => {
  return (
    <div className={`card-body card-body-padding-${padding} ${className}`} {...rest}>
      {children}
    </div>
  );
};

/**
 * Sous-composant CardFooter
 */
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  bordered = false,
  className = '',
  ...rest
}) => {
  const classes = ['card-footer', bordered ? 'card-footer-bordered' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

// Exporter les sous-composants comme propriétés de Card
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;