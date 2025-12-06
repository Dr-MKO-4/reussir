import React from 'react';
import { Button } from '../components/common/Button';
import './CheckoutComponent.css';

interface OrderConfirmationProps {
  orderNumber: string;
  total: number;
  onViewOrder: () => void;
  onContinueShopping: () => void;
  className?: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  total,
  onViewOrder,
  onContinueShopping,
  className = '',
}) => {
  return (
    <div className={`order-confirmation ${className}`}>
      <div className="confirmation-icon">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="confirmation-title">Commande confirmée !</h2>
      <p className="confirmation-text">
        Merci pour votre achat. Votre commande #{orderNumber} a été confirmée.
      </p>
      <div className="confirmation-details">
        <div className="detail-row">
          <span>Numéro de commande</span>
          <span className="detail-value">{orderNumber}</span>
        </div>
        <div className="detail-row">
          <span>Montant total</span>
          <span className="detail-value">{total} FCFA</span>
        </div>
      </div>
      <div className="confirmation-actions">
        <Button variant="primary" fullWidth onClick={onViewOrder}>
          Voir ma commande
        </Button>
        <Button variant="secondary" fullWidth onClick={onContinueShopping}>
          Continuer mes achats
        </Button>
      </div>
      <p className="confirmation-note">
        Un email de confirmation a été envoyé à votre adresse
      </p>
    </div>
  );
};

export default OrderConfirmation;