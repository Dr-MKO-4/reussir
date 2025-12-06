import React from 'react';
import './CheckoutComponent.css';

interface OrderItem {
  id: string;
  title: string;
  price: number;
}

interface OrderSummaryCardProps {
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  total: number;
  className?: string;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  items,
  subtotal,
  discount = 0,
  total,
  className = '',
}) => {
  return (
    <div className={`order-summary-card ${className}`}>
      <h3 className="order-summary-title">Récapitulatif de la commande</h3>
      <div className="order-items-list">
        {items.map((item) => (
          <div key={item.id} className="order-item">
            <span className="order-item-title">{item.title}</span>
            <span className="order-item-price">{item.price} FCFA</span>
          </div>
        ))}
      </div>
      <div className="order-summary-totals">
        <div className="order-row">
          <span>Sous-total</span>
          <span>{subtotal} FCFA</span>
        </div>
        {discount > 0 && (
          <div className="order-row order-discount">
            <span>Réduction</span>
            <span>- {discount} FCFA</span>
          </div>
        )}
        <div className="order-divider" />
        <div className="order-row order-total">
          <span>Total à payer</span>
          <span>{total} FCFA</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;