import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { SubjectCardData } from '../../../types/catalog';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: SubjectCardData;
  onRemove: (id: string) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
  className?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onQuantityChange,
  className = '',
}) => {
  return (
    <div className={`${styles['cart-item']} ${className}`}>
      <div className={styles['cart-item-image']}>
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} />
        ) : (
          <div className={styles['cart-item-placeholder']}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className={styles['cart-item-details']}>
        <h3 className={styles['cart-item-title']}>{item.title}</h3>
        <p className={styles['cart-item-description']}>{item.description}</p>
        <div className={styles['cart-item-meta']}>
          <span>{item.exam}</span>
          <span>•</span>
          <span>{item.year}</span>
        </div>
        <div className={styles['cart-item-badges']}>
          {item.isPremium && <Badge variant="warning">Premium</Badge>}
          {item.isNew && <Badge variant="primary">Nouveau</Badge>}
        </div>
      </div>

      <div className={styles['cart-item-actions']}>
        <div className={styles['cart-item-price']}>{item.price} FCFA</div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(item.id)}
          leftIcon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        >
          Retirer
        </Button>
      </div>
    </div>
  );
};

export default CartItem;