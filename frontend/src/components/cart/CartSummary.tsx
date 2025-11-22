import React from 'react';
import styles from './CartSummary.module.css';

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  total: number;
  itemCount: number;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount = 0,
  total,
  itemCount,
  className = '',
}) => {
  return (
    <div className={`${styles['cart-summary']} ${className}`}>
      <h3 className={styles['cart-summary-title']}>Résumé ({itemCount} article{itemCount > 1 ? 's' : ''})</h3>
      <div className={styles['cart-summary-details']}>
        <div className={styles['summary-row']}>
          <span>Sous-total</span>
          <span>{subtotal} FCFA</span>
        </div>
        {discount > 0 && (
          <div className={`${styles['summary-row']} ${styles['summary-discount']}`}>
            <span>Réduction</span>
            <span>- {discount} FCFA</span>
          </div>
        )}
        <div className={styles['summary-divider']} />
        <div className={`${styles['summary-row']} ${styles['summary-total']}`}>
          <span>Total</span>
          <span>{total} FCFA</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;