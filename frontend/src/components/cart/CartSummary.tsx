
import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, discount, total }) => {
  return (
    <div className="cart-summary">
      <h3>Résumé de la commande</h3>
      <div className="summary-row">
        <span>Sous-total</span>
        <span>{subtotal} FCFA</span>
      </div>
      {discount > 0 && (
        <div className="summary-row summary-discount">
          <span>Réduction</span>
          <span>-{discount} FCFA</span>
        </div>
      )}
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>{total} FCFA</span>
      </div>
    </div>
  );
};

export default CartSummary;
