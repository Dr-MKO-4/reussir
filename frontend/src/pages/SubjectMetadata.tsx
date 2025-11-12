import React from 'react';

interface MetadataItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface SubjectMetadataProps {
  metadata: MetadataItem[];
  className?: string;
}

/**
 * Affichage des métadonnées d'un sujet
 */
export const SubjectMetadata: React.FC<SubjectMetadataProps> = ({
  metadata,
  className = '',
}) => {
  if (!metadata || metadata.length === 0) {
    return null;
  }

  return (
    <div className={`subject-metadata ${className}`}>
      {metadata.map((item, index) => (
        <div key={index} className="metadata-item">
          {item.icon && <div className="metadata-icon">{item.icon}</div>}
          <div className="metadata-content">
            <span className="metadata-label">{item.label}</span>
            <span className="metadata-value">{item.value}</span>
          </div>
        </div>
      ))}
      
      <style>{`
        .subject-metadata {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding: 1.5rem;
          background: var(--background-secondary, #f9fafb);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color, #e5e7eb);
        }

        .metadata-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .metadata-icon {
          flex-shrink: 0;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-color, #3b82f6);
          color: white;
          border-radius: 0.5rem;
        }

        .metadata-icon svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .metadata-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .metadata-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary, #6b7280);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .metadata-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary, #111827);
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .subject-metadata {
            grid-template-columns: 1fr;
          }
        }

        [data-theme="dark"] .subject-metadata {
          background: var(--background-secondary-dark, #1f2937);
          border-color: var(--border-color-dark, #374151);
        }

        [data-theme="dark"] .metadata-value {
          color: var(--text-primary-dark, #f9fafb);
        }

        [data-theme="dark"] .metadata-label {
          color: var(--text-secondary-dark, #9ca3af);
        }
      `}</style>
    </div>
  );
};

// Exemple d'utilisation avec des données mockées
export const SubjectMetadataExample: React.FC = () => {
  const metadata: MetadataItem[] = [
    {
      label: 'Durée',
      value: '4 heures',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pages',
      value: '8 pages',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Coefficient',
      value: '5',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Format',
      value: 'PDF',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Taille',
      value: '2.4 MB',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
    },
    {
      label: 'Téléchargements',
      value: '1,234',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Métadonnées du sujet
      </h2>
      <SubjectMetadata metadata={metadata} />
    </div>
  );
};

export default SubjectMetadataExample;