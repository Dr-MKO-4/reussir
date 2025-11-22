import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import './MainLayout.css';

/**
 * Props du composant MainLayout
 */
export interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showSearch?: boolean;
  stickyHeader?: boolean;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

/**
 * Composant MainLayout - Layout principal de l'application
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  showSearch = true,
  stickyHeader = true,
  className = '',
  maxWidth = '2xl',
  padding = true,
}) => {
  const containerClasses = [
    'main-layout-content',
    `main-layout-max-width-${maxWidth}`,
    padding ? 'main-layout-padding' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="main-layout">
      {/* Header */}
      {showHeader && (
        <Header showSearch={showSearch} sticky={stickyHeader} />
      )}

      {/* Main Content */}
      <main className="main-layout-main">
        <div className={containerClasses}>{children}</div>
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

MainLayout.displayName = 'MainLayout';

export default MainLayout;