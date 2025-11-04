import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import CartDropdown from './CartDropdown';
import './CartIcon.css';

const CartIcon: React.FC = () => {
  const { itemCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="cart-icon-container">
      <button
        className="cart-icon-btn"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label={`Panier (${itemCount} articles)`}
        aria-expanded={showDropdown}
      >
        <ShoppingCart size={20} />
        {itemCount > 0 && (
          <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="cart-dropdown-overlay"
            onClick={() => setShowDropdown(false)}
          />
          <CartDropdown onClose={() => setShowDropdown(false)} />
        </>
      )}
    </div>
  );
};

export default CartIcon;
