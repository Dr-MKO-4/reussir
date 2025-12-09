import React from 'react';
import { Link } from 'react-router-dom';
// Update the path below to the correct relative path if needed
import { useToast } from '../../components/ui/Toast';
import { X, ShoppingBag } from 'lucide-react';
import {Button} from '../common/Button';
import './CartDropdown.css';

const CartDropdown = ({ onClose }) => {
  const { cart, removeFromCart, total, itemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-dropdown">
        <div className="cart-dropdown-header">
          <h3>Panier</h3>
          <button
            className="cart-dropdown-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-dropdown-empty">
          <ShoppingBag size={48} className="empty-icon" />
          <p className="empty-text">Votre panier est vide</p>
          <Link to="/discover" onClick={onClose}>
            <Button variant="primary" size="sm">
              Découvrir les sujets
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-dropdown">
      <div className="cart-dropdown-header">
        <h3>Panier ({itemCount})</h3>
        <button
          className="cart-dropdown-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={20} />
        </button>
      </div>

      <div className="cart-dropdown-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-dropdown-item">
            <div className="cart-item-image">
              {item.image ? (
                <img src={item.image} alt={item.title} />
              ) : (
                <div className="cart-item-placeholder">
                  <ShoppingBag size={24} />
                </div>
              )}
            </div>

            <div className="cart-item-info">
              <h4 className="cart-item-title">{item.title}</h4>
              <div className="cart-item-meta">
                <span className="cart-item-quantity">Qté: {item.quantity}</span>
                <span className="cart-item-price">
                  {item.price > 0 ? `${item.price}€` : 'Gratuit'}
                </span>
              </div>
            </div>

            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.id)}
              aria-label="Retirer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-dropdown-footer">
        <div className="cart-dropdown-total">
          <span>Total</span>
          <span className="total-amount">{total.toFixed(2)}€</span>
        </div>

        <Link to="/cart" onClick={onClose} className="w-full">
          <Button variant="primary" fullWidth>
            Voir le panier
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;