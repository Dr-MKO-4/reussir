import React from 'react';
import styles from './PromoCodeInput.module.css';

interface PromoCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove?: () => void;
  isApplied?: boolean;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  value,
  onChange,
  onApply,
  onRemove,
  isApplied = false,
  isLoading = false,
  error,
  className = '',
}) => {
  return (
    <div className={`${styles['promo-code-input']} ${className}`}>
      <label className={styles['promo-label']}>Code promo</label>
      <div className={styles['promo-input-group']}>
        <input
          type="text"
          className={styles['promo-input']}
          placeholder="WINPLUS10"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          disabled={isApplied}
        />
        {isApplied && onRemove ? (
          <button className={styles['promo-remove-btn']} type="button" onClick={onRemove}>
            Retirer
          </button>
        ) : (
          <button
            className={styles['promo-apply-btn']}
            type="button"
            onClick={onApply}
            disabled={!value.trim() || isLoading}
          >
            {isLoading ? '...' : 'Appliquer'}
          </button>
        )}
      </div>
      {error && <p className={styles['promo-error']}>{error}</p>}
      {isApplied && <p className={styles['promo-success']}>✓ Code promo appliqué</p>}
    </div>
  );
};

export default PromoCodeInput;