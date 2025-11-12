import React, { useState } from 'react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Composant d'actions rapides pour un sujet
 */
export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  className = '',
  orientation = 'horizontal',
}) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className={`quick-actions quick-actions-${orientation} ${className}`}>
      {actions.map((action) => (
        <button
          key={action.id}
          className={`quick-action quick-action-${action.variant || 'secondary'}`}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
        >
          {action.loading ? (
            <div className="quick-action-spinner" />
          ) : (
            <div className="quick-action-icon">{action.icon}</div>
          )}
          <span className="quick-action-label">{action.label}</span>
        </button>
      ))}
      
      <style>{`
        .quick-actions {
          display: flex;
          gap: 0.75rem;
        }

        .quick-actions-horizontal {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .quick-actions-vertical {
          flex-direction: column;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 0.5rem;
          background: white;
          color: var(--text-primary, #111827);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: fit-content;
        }

        .quick-action:hover:not(:disabled) {
          background: var(--background-secondary, #f9fafb);
          border-color: var(--primary-color, #3b82f6);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .quick-action:active:not(:disabled) {
          transform: translateY(0);
        }

        .quick-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Variants */
        .quick-action-primary {
          background: var(--primary-color, #3b82f6);
          color: white;
          border-color: var(--primary-color, #3b82f6);
        }

        .quick-action-primary:hover:not(:disabled) {
          background: var(--primary-hover, #2563eb);
          border-color: var(--primary-hover, #2563eb);
        }

        .quick-action-success {
          background: var(--success-color, #10b981);
          color: white;
          border-color: var(--success-color, #10b981);
        }

        .quick-action-success:hover:not(:disabled) {
          background: #059669;
          border-color: #059669;
        }

        .quick-action-danger {
          background: var(--error-color, #ef4444);
          color: white;
          border-color: var(--error-color, #ef4444);
        }

        .quick-action-danger:hover:not(:disabled) {
          background: #dc2626;
          border-color: #dc2626;
        }

        .quick-action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-action-icon svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .quick-action-label {
          white-space: nowrap;
        }

        .quick-action-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .quick-actions-horizontal {
            flex-direction: column;
          }

          .quick-action {
            width: 100%;
            justify-content: center;
          }
        }

        /* Dark Mode */
        [data-theme="dark"] .quick-action {
          background: var(--background-secondary-dark, #1f2937);
          color: var(--text-primary-dark, #f9fafb);
          border-color: var(--border-color-dark, #374151);
        }

        [data-theme="dark"] .quick-action:hover:not(:disabled) {
          background: var(--background-tertiary-dark, #374151);
        }
      `}</style>
    </div>
  );
};

// Exemple d'utilisation avec des données mockées
export const QuickActionsExample: React.FC = () => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(false);

  const handleAction = async (actionId: string) => {
    setLoadingAction(actionId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (actionId === 'favorite') {
      setFavorited(!favorited);
    }
    
    setLoadingAction(null);
    alert(`Action ${actionId} exécutée !`);
  };

  const actions: QuickAction[] = [
    {
      id: 'favorite',
      label: favorited ? 'Retirer des favoris' : 'Ajouter aux favoris',
      variant: 'secondary',
      loading: loadingAction === 'favorite',
      icon: (
        <svg fill={favorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      onClick: () => handleAction('favorite'),
    },
    {
      id: 'share',
      label: 'Partager',
      variant: 'secondary',
      loading: loadingAction === 'share',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
      onClick: () => handleAction('share'),
    },
    {
      id: 'print',
      label: 'Imprimer',
      variant: 'secondary',
      loading: loadingAction === 'print',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      ),
      onClick: () => handleAction('print'),
    },
    {
      id: 'report',
      label: 'Signaler',
      variant: 'danger',
      loading: loadingAction === 'report',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      onClick: () => handleAction('report'),
    },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Actions Rapides - Horizontal
      </h2>
      <QuickActions actions={actions} orientation="horizontal" />

      <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Actions Rapides - Vertical
      </h2>
      <QuickActions actions={actions} orientation="vertical" />
    </div>
  );
};

export default QuickActionsExample;