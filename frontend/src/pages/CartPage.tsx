import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import './CartPage.css';
import SubjectFilters, { FilterOptions } from '../components/catalog/SubjectFilters';
import SearchBar from '../components/common/SearchBar';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import PromoCodeInput from '../components/cart/PromoCodeInput';
import BundleSuggestions from '../components/cart/BundleSuggestions';
import CartEmpty from '../components/cart/CartEmpty';
import catalogService from '../services/catalogService';
import { CartItem as CartItemType } from '../types/cart';

/**
 * Page du panier d'achat
 */
export const CartPage: React.FC = () => {
  // État pour la recherche et les filtres avancés
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Callback pour la SearchBar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Lancer la recherche avancée ou filtrer les items du panier
  };

  // Callback pour les filtres
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // TODO: Appliquer les filtres sur les items du panier
  };
  const navigate = useNavigate();
  const cart = useCart();
  const items: CartItemType[] = cart.cart?.items || [];
  const { removeItem, updateQuantity, getTotal, getSubtotal, getDiscount, clearCart } = cart;
  const { isAuthenticated, user } = useAuth();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal ? getSubtotal() : 0;
  const discount = promoApplied ? promoDiscount : getDiscount ? getDiscount() : 0;
  const total = subtotal - discount;

  /**
   * Appliquer un code promo
   */
  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;

    // Simulation de validation de code promo
    const validCodes: Record<string, number> = {
      'REUSSIR10': 0.1,  // 10% de réduction
      'REUSSIR20': 0.2,  // 20% de réduction
      'WELCOME': 1000,   // 1000 FCFA de réduction
    };

    const code = promoCode.toUpperCase();
    if (validCodes[code]) {
      const discountValue = validCodes[code];
      const calculatedDiscount = discountValue < 1 
        ? subtotal * discountValue 
        : discountValue;
      
      setPromoDiscount(calculatedDiscount);
      setPromoApplied(true);
    } else {
      alert('Code promo invalide');
    }
  };

  /**
   * Retirer le code promo
   */
  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
  };

  /**
   * Procéder au paiement
   */
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsProcessing(true);
    
    // Simulation du processus de paiement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Intégrer le vrai système de paiement
    navigate('/checkout');
    setIsProcessing(false);
  };

  /**
   * Vider le panier
   */
  const handleClearCart = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      clearCart();
    }
  };

  // État vide du panier
  if (!items || items.length === 0) {
    return (
      <MainLayout>
        <CartEmpty onExplore={() => navigate('/discover')} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cart-page">
        {/* Barre de recherche avancée */}
        <div className="cart-searchbar">
          <SearchBar
            placeholder="Rechercher dans le panier..."
            value={searchQuery}
            onSearch={handleSearch}
            onChange={setSearchQuery}
            size="md"
            fullWidth
          />
        </div>

        {/* Sidebar de filtres avancés */}
        <div className="cart-filters">
          <SubjectFilters onFiltersChange={handleFiltersChange} />
        </div>
        <div className="cart-header">
          <h1 className="cart-title">Mon Panier ({items.length})</h1>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearCart}
          >
            Vider le panier
          </Button>
        </div>

        <div className="cart-layout">
          {/* Liste des items */}
          <div className="cart-items">
            {items.map((item: CartItemType) => (
              <CartItem
                key={item.id}
                item={item.subject}
                onRemove={() => removeItem(item.id)}
                // TODO: Ajouter gestion favoris ici (voir ci-dessous)
              />
            ))}
            {/* Suggestions IA (bundles) - à brancher sur l'API IA plus tard */}
            <BundleSuggestions
              bundles={[]}
              onAdd={(bundleId) => {}}
            />
          </div>

          {/* Résumé */}
          <aside className="cart-sidebar">
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              total={total}
              itemCount={items.length}
            />
            <PromoCodeInput
              value={promoCode}
              onChange={setPromoCode}
              onApply={handleApplyPromo}
              onRemove={handleRemovePromo}
              isApplied={promoApplied}
              isLoading={isProcessing}
            />
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCheckout}
              isLoading={isProcessing}
              leftIcon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              }
            >
              Procéder au paiement
            </Button>
            <div className="security-info">
              <svg className="security-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Paiement 100% sécurisé</span>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;