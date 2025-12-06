import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import cartService from '../services/cartService';
import paymentService from '../services/paymentService';
import { CartItem } from '../types';
import './CartPage.css';

interface PromoCodeState {
  code: string;
  isValid: boolean;
  discount: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState<PromoCodeState>({
    code: '',
    isValid: false,
    discount: 0,
  });
  const [bundleSuggestions, setBundleSuggestions] = useState<any[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Charger les suggestions de bundle au montage
  useEffect(() => {
    if (items.length > 0) {
      loadBundleSuggestions();
    }
  }, [items]);

  // Charger les suggestions de bundle
  const loadBundleSuggestions = () => {
    const suggestions = cartService.getBundleSuggestions(items);
    setBundleSuggestions(suggestions);
  };

  // Valider et appliquer un code promo
  const handleApplyPromoCode = () => {
    if (!promoCode.code.trim()) {
      showToast('Veuillez entrer un code promo', 'error');
      return;
    }

    const result = cartService.applyPromoCode(promoCode.code, total);
    
    if (result.success) {
      setPromoCode({
        code: promoCode.code,
        isValid: true,
        discount: result.discount,
      });
      setAppliedDiscount(result.discount);
      showToast(result.message, 'success');
    } else {
      setPromoCode({
        ...promoCode,
        isValid: false,
        discount: 0,
      });
      setAppliedDiscount(0);
      showToast(result.message, 'error');
    }
  };

  // Retirer un code promo
  const handleRemovePromoCode = () => {
    setPromoCode({ code: '', isValid: false, discount: 0 });
    setAppliedDiscount(0);
    showToast('Code promo supprimé', 'info');
  };

  // Calculer les totaux
  const subtotal = total;
  const { tax, discount } = cartService.calculateTotal(items, 0.2, appliedDiscount);
  const finalTotal = subtotal - appliedDiscount + tax;

  // Procéder au checkout
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // Valider le panier avant checkout
    const validation = cartService.validateCheckout(items);
    if (!validation.valid) {
      validation.errors.forEach((error) => showToast(error, 'error'));
      return;
    }

    try {
      setIsProcessing(true);
      navigate('/checkout', {
        state: {
          items,
          subtotal,
          discount: appliedDiscount,
          tax,
          total: finalTotal,
          promoCode: promoCode.code,
        },
      });
    } catch (error: any) {
      showToast('Erreur lors de la procédure de paiement', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Continuer les achats
  const handleContinueShopping = () => {
    navigate('/discover');
  };

  // Vider le panier
  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      clearCart();
      showToast('Panier vidé', 'success');
    }
  };

  // Affichage si panier vide
  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="cart-page">
          <div className="empty-cart">
            <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2>Votre panier est vide</h2>
            <p>Découvrez nos sujets d'examen et commencez à réviser.</p>
            <Button variant="primary" size="lg" onClick={handleContinueShopping}>
              Continuer les achats
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cart-page">
        {/* Header */}
        <div className="cart-header">
          <h1>Votre panier</h1>
          <p className="cart-subtitle">{items.length} article(s) dans votre panier</p>
        </div>

        <div className="cart-layout">
          {/* Main Content */}
          <div className="cart-main">
            {/* Cart Items */}
            <section className="cart-items-section">
              <h2>Articles du panier</h2>
              <div className="cart-items">
                {items.map((item: CartItem) => (
                  <Card key={item.id} variant="outlined" className="cart-item-card">
                    <div className="cart-item-content">
                      {item.image && (
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                      )}
                      
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.title}</h3>
                        <p className="cart-item-description">{item.description}</p>
                        <p className="cart-item-price">{item.price} FCFA</p>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-control">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="qty-btn"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="qty-input"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-subtotal">
                          {(item.price * item.quantity).toFixed(2)} FCFA
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="remove-btn"
                          title="Retirer du panier"
                        >
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Promo Code Section */}
            <section className="promo-section">
              <Card variant="outlined">
                <h3>Appliquer un code promo</h3>
                {promoCode.isValid ? (
                  <div className="promo-applied">
                    <div className="promo-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Code appliqué : {promoCode.code}
                    </div>
                    <p className="promo-discount">Réduction : -{appliedDiscount.toFixed(2)} FCFA</p>
                    <Button variant="secondary" size="sm" onClick={handleRemovePromoCode}>
                      Supprimer le code
                    </Button>
                  </div>
                ) : (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="Entrer votre code promo"
                      value={promoCode.code}
                      onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                      className="promo-input"
                    />
                    <Button
                      variant="secondary"
                      onClick={handleApplyPromoCode}
                      isLoading={false}
                    >
                      Appliquer
                    </Button>
                  </div>
                )}
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="cart-sidebar">
            <Card variant="outlined" className="order-summary">
              <h2>Résumé de la commande</h2>

              <div className="summary-row">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} FCFA</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="summary-row discount-row">
                  <span>Réduction</span>
                  <span>-{appliedDiscount.toFixed(2)} FCFA</span>
                </div>
              )}

              <div className="summary-row tax-row">
                <span>TVA (20%)</span>
                <span>{tax.toFixed(2)} FCFA</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total-row">
                <span className="total-label">Total</span>
                <span className="total-amount">{finalTotal.toFixed(2)} FCFA</span>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleCheckout}
                isLoading={isProcessing}
                disabled={isProcessing || !isAuthenticated}
              >
                <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Procéder au paiement
              </Button>

              {!isAuthenticated && (
                <Alert variant="info" title="Connexion requise">
                  Connectez-vous pour finaliser votre achat
                </Alert>
              )}

              <Button
                variant="secondary"
                fullWidth
                size="md"
                onClick={handleContinueShopping}
              >
                Continuer les achats
              </Button>

              <Button
                variant="outline"
                fullWidth
                size="sm"
                onClick={handleClearCart}
              >
                Vider le panier
              </Button>

              <div className="security-section">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Paiement 100% sécurisé</span>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;