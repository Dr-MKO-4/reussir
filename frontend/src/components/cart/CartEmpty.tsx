import React from 'react';
import { Button } from '../common/Button';
import styles from './CartEmpty.module.css';

interface CartEmptyProps {
  onExplore: () => void;
  className?: string;
}

const CartEmpty: React.FC<CartEmptyProps> = ({
  onExplore,
  className = '',
}) => {
  return (
    <div className={`${styles['cart-empty']} ${className}`}>
      <svg className={styles['cart-empty-icon']} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 className={styles['cart-empty-title']}>Votre panier est vide</h2>
      <p className={styles['cart-empty-text']}>
        Explorez notre catalogue et ajoutez des sujets à votre panier
      </p>
      <Button variant="primary" size="lg" onClick={onExplore}>
        Explorer le catalogue
      </Button>
    </div>
  );
};

export default CartEmpty;