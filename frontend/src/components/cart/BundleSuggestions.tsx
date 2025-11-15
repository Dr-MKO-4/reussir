import React from 'react';
import styles from './BundleSuggestions.module.css';

interface Bundle {
  id: string;
  name: string;
  description: string;
  discount: number;
  price: number;
}

interface BundleSuggestionsProps {
  bundles: Bundle[];
  onAdd: (bundleId: string) => void;
  className?: string;
}

const BundleSuggestions: React.FC<BundleSuggestionsProps> = ({
  bundles,
  onAdd,
  className = '',
}) => {
  if (bundles.length === 0) return null;

  return (
    <div className={`${styles['bundle-suggestions']} ${className}`}>
      <h3 className={styles['bundle-title']}>
        <svg className={styles['bundle-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Suggestions IA - Économisez plus !
      </h3>
      <div className={styles['bundle-list']}>
        {bundles.map((bundle) => (
          <div key={bundle.id} className={styles['bundle-card']}>
            <div className={styles['bundle-info']}>
              <h4 className={styles['bundle-name']}>{bundle.name}</h4>
              <p className={styles['bundle-description']}>{bundle.description}</p>
              <div className={styles['bundle-pricing']}>
                <span className={styles['bundle-discount']}>-{bundle.discount}%</span>
                <span className={styles['bundle-price']}>{bundle.price} FCFA</span>
              </div>
            </div>
            <button
              className={styles['bundle-add-btn']}
              type="button"
              onClick={() => onAdd(bundle.id)}
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BundleSuggestions;