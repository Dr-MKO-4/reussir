import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import './CartPage.css';
import SubjectFilters, { FilterOptions } from '../components/catalog/SubjectFilters';
import SearchBar from '../components/common/SearchBar';

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
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotal();
  const discount = promoApplied ? promoDiscount : 0;
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
  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="cart-empty-title">Votre panier est vide</h1>
          <p className="cart-empty-text">
            Explorez notre catalogue et ajoutez des sujets à votre panier
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/discover')}
          >
            Explorer le catalogue
          </Button>
        </div>
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
            {items.map((item) => (
              <Card key={item.id} variant="outlined" className="cart-item">
                <div className="cart-item-content">
                  <div className="cart-item-image">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} />
                    ) : (
                      <div className="cart-item-placeholder">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-description">{item.description}</p>
                    
                    <div className="cart-item-meta">
                      <span>{item.exam}</span>
                      <span>•</span>
                      <span>{item.subject}</span>
                      <span>•</span>
                      <span>{item.year}</span>
                    </div>

                    <div className="cart-item-badges">
                      {item.isPremium && <Badge variant="warning">Premium</Badge>}
                      {item.isNew && <Badge variant="primary">Nouveau</Badge>}
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="cart-item-price">
                      {item.price} FCFA
                    </div>
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.id)}
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
              </Card>
            ))}

            {/* Suggestions de bundles */}
            <Card variant="outlined" className="cart-suggestions">
              <h3 className="suggestions-title">
                <svg className="suggestions-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Suggestions IA
              </h3>
              <p className="suggestions-text">
                Économisez 15% en ajoutant le bundle "Pack Bac C Complet 2024"
              </p>
              <Button variant="primary" size="sm">
                Voir le bundle
              </Button>
            </Card>
          </div>

          {/* Résumé */}
          <aside className="cart-sidebar">
            <Card variant="outlined" className="cart-summary">
              <h2 className="summary-title">Résumé de la commande</h2>

              {/* Code promo */}
              <div className="promo-section">
                <label className="promo-label">Code promo</label>
                <div className="promo-input-group">
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="REUSSIR10"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                  />
                  {promoApplied ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRemovePromo}
                    >
                      Retirer
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim()}
                    >
                      Appliquer
                    </Button>
                  )}
                </div>
                {promoApplied && (
                  <Alert variant="success" title="Code promo appliqué" className="promo-alert">
                    Vous économisez {promoDiscount} FCFA
                  </Alert>
                )}
              </div>

              {/* Détails du prix */}
              <div className="price-details">
                <div className="price-row">
                  <span>Sous-total</span>
                  <span>{subtotal} FCFA</span>
                </div>
                
                {discount > 0 && (
                  <div className="price-row price-discount">
                    <span>Réduction</span>
                    <span>- {discount} FCFA</span>
                  </div>
                )}

                <div className="price-divider" />

                <div className="price-row price-total">
                  <span>Total</span>
                  <span>{total} FCFA</span>
                </div>
              </div>

              {/* Bouton de paiement */}
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

              {/* Informations supplémentaires */}
              <div className="security-info">
                <svg className="security-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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