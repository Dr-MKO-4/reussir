import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Lock, 
  Tag, AlertCircle, CheckCircle, X, Menu,
  Facebook, Twitter, Linkedin, Instagram, Shield, Award
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import cartService from '../services/cartService';
import styles from './CartPage.module.css';
import { useCartContext } from '../contexts/CartContext';

interface PromoCode {
  code: string;
  isValid: boolean;
  discount: number;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeItem, updateQuantity, clearCart, isLoading, error: cartError } = useCartContext();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<PromoCode>({
    code: '',
    isValid: false,
    discount: 0,
  });
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Afficher l'erreur une seule fois quand elle change
  useEffect(() => {
    if (cartError) {
      setLocalError(cartError);
      showError(cartError);
    }
  }, [cartError]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateQuantity(itemId, newQuantity);
      showSuccess('Quantité mise à jour');
    } catch (err: any) {
      showError(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
      showSuccess('Article retiré du panier');
    } catch (err: any) {
      showError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
      return;
    }

    try {
      await clearCart();
      showSuccess('Panier vidé avec succès');
    } catch (err: any) {
      showError(err.message || 'Erreur lors du vidage du panier');
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.code.trim()) {
      showError('Veuillez entrer un code promo');
      return;
    }

    try {
      setIsApplyingPromo(true);
      const result = await cartService.applyPromoCode(promoCode.code);
      
      if (result.success) {
        setPromoCode({
          code: promoCode.code,
          isValid: true,
          discount: result.discount,
        });
        showSuccess(result.message);
      } else {
        setPromoCode({ ...promoCode, isValid: false, discount: 0 });
        showError(result.message);
      }
    } catch (err: any) {
      showError(err.message || 'Erreur lors de l\'application du code promo');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromoCode = async () => {
    try {
      await cartService.removePromoCode();
      setPromoCode({ code: '', isValid: false, discount: 0 });
      showInfo('Code promo supprimé');
    } catch (err: any) {
      showError(err.message || 'Erreur');
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      showInfo('Veuillez vous connecter pour continuer');
      return;
    }

    const validation = cartService.validateCheckout(cart.items);
    if (!validation.valid) {
      validation.errors.forEach((error) => showError(error));
      return;
    }

    try {
      navigate('/checkout', {
        state: {
          items: cart.items,
          subtotal: cart.subtotal,
          discount: promoCode.discount,
          tax: cart.tax,
          total: finalTotal,
          promoCode: promoCode.code,
        },
      });
    } catch (err: any) {
      showError('Erreur lors de la procédure de paiement');
    }
  };

  const subtotal = cart.subtotal;
  const tax = cart.tax;
  const finalTotal = subtotal - promoCode.discount + tax;

  const scrollToSection = (id: string) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <div className={styles.logo} onClick={() => navigate('/')}>
                <div className={styles.logoIcon}>
                  <img src="/logo1.png" alt="Win+" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <div className={styles.logo} onClick={() => navigate('/')}>
                <div className={styles.logoIcon}>
                  <img src="/logo1.png" alt="Win+" />
                </div>
              </div>

              <nav className={styles.nav}>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a>
                <a href="#catalog" onClick={(e) => { e.preventDefault(); scrollToSection('catalog'); }}>Catalogue</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Plans</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À propos</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
              </nav>

              <div className={styles.headerActions}>
                <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
                  Connexion
                </button>
                <button className={styles.btnSecondary} onClick={() => navigate('/signup')}>
                  Inscription
                </button>

                <button 
                  className={styles.mobileToggle}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a>
              <a href="#catalog" onClick={(e) => { e.preventDefault(); scrollToSection('catalog'); }}>Catalogue</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Plans</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À propos</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
              <div className={styles.mobileActions}>
                <button className={styles.btnPrimary} onClick={() => navigate('/login')}>Connexion</button>
                <button className={styles.btnSecondary} onClick={() => navigate('/signup')}>Inscription</button>
              </div>
            </div>
          )}
        </header>

        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIcon}>
            <ShoppingCart size={80} />
          </div>
          <h2 className={styles.emptyCartTitle}>Votre panier est vide</h2>
          <p className={styles.emptyCartText}>
            Découvrez nos sujets d'examen et commencez à réviser.
          </p>
          <button className={styles.btnLarge} onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Continuer les achats
          </button>
        </div>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerContent}>
              <div className={styles.footerSection}>
                <div className={styles.footerLogo}>
                  <div className={styles.logoIcon}>
                    <img src="/logo1.png" alt="Win+" />
                  </div>
                </div>
                <p className={styles.footerText}>
                  Autonomiser les éducateurs pour améliorer notre monde
                </p>
                <div className={styles.socialIcons}>
                  <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
                  <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
                  <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
                  <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
                </div>
              </div>
              <div className={styles.footerSection}>
                <h4 className={styles.footerHeading}>Légal</h4>
                <a href="/privacy" className={styles.footerLink}>Confidentialité</a>
                <a href="/terms" className={styles.footerLink}>Conditions</a>
              </div>
              <div className={styles.footerSection}>
                <h4 className={styles.footerHeading}>Support</h4>
                <a href="#" className={styles.footerLink}>Documentation</a>
                <a href="#" className={styles.footerLink}>Forums</a>
              </div>
              <div className={styles.footerSection}>
                <h4 className={styles.footerHeading}>S'impliquer</h4>
                <a href="#" className={styles.footerLink}>Développement</a>
                <a href="#" className={styles.footerLink}>Traduction</a>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <p className={styles.footerCopyright}>© 2024 Win+. Tous droits réservés.</p>
              <div className={styles.footerBadges}>
                <span className={styles.footerBadge}><Shield size={16} /> Sécurisé</span>
                <span className={styles.footerBadge}><Award size={16} /> Certifié</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logo} onClick={() => navigate('/')}>
              <div className={styles.logoIcon}>
                <img src="/logo1.png" alt="Win+" />
              </div>
            </div>

            <nav className={styles.nav}>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a>
              <a href="#catalog" onClick={(e) => { e.preventDefault(); scrollToSection('catalog'); }}>Catalogue</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Plans</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À propos</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </nav>

            <div className={styles.headerActions}>
              <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
                Connexion
              </button>
              <button className={styles.btnSecondary} onClick={() => navigate('/signup')}>
                Inscription
              </button>

              <button 
                className={styles.mobileToggle}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a>
            <a href="#catalog" onClick={(e) => { e.preventDefault(); scrollToSection('catalog'); }}>Catalogue</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Plans</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À propos</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            <div className={styles.mobileActions}>
              <button className={styles.btnPrimary} onClick={() => navigate('/login')}>Connexion</button>
              <button className={styles.btnSecondary} onClick={() => navigate('/signup')}>Inscription</button>
            </div>
          </div>
        )}
      </header>

      <div className={styles.cartPage}>
        <div className={styles.container}>
          <div className={styles.cartHeader}>
            <button className={styles.backBtn} onClick={() => navigate('/')}>
              <ArrowLeft size={20} /> Retour
            </button>
            <div>
              <h1 className={styles.cartTitle}>Votre Panier</h1>
              <p className={styles.cartSubtitle}>{cart.items.length} article(s)</p>
            </div>
          </div>

          {localError && (
            <div className={styles.alert}>
              <AlertCircle size={20} />
              <span>{localError}</span>
              <button onClick={() => setLocalError(null)}><X size={16} /></button>
            </div>
          )}

          <div className={styles.cartLayout}>
            <div className={styles.cartMain}>
              <div className={styles.cartItems}>
                {cart.items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      {item.subject.image ? (
                        <img src={item.subject.image} alt={item.subject.title} />
                      ) : (
                        <div className={styles.cartItemPlaceholder}>
                          <ShoppingCart size={40} />
                        </div>
                      )}
                    </div>

                    <div className={styles.cartItemDetails}>
                      <h3 className={styles.cartItemTitle}>{item.subject.title}</h3>
                      <p className={styles.cartItemDescription}>{item.subject.description}</p>
                      <div className={styles.cartItemPrice}>{item.price.toFixed(0)} FCFA</div>
                    </div>

                    <div className={styles.cartItemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className={styles.qtyBtn}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className={styles.qtyInput}
                        />
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className={styles.qtyBtn}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className={styles.cartItemSubtotal}>
                        {(item.price * item.quantity).toFixed(0)} FCFA
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className={styles.removeBtn}
                        title="Retirer"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cartFooterActions}>
                <button className={styles.btnClear} onClick={handleClearCart}>
                  <Trash2 size={18} /> Vider le panier
                </button>
                <button className={styles.btnContinue} onClick={() => navigate('/')}>
                  <ArrowLeft size={18} /> Continuer les achats
                </button>
              </div>
            </div>

            <aside className={styles.cartSidebar}>
              <div className={styles.cartSummary}>
                <h2 className={styles.summaryTitle}>Résumé de la commande</h2>

                <div className={styles.promoSection}>
                  <label className={styles.promoLabel}>
                    <Tag size={16} /> Code promo
                  </label>
                  {promoCode.isValid ? (
                    <div className={styles.promoApplied}>
                      <div className={styles.promoSuccess}>
                        <CheckCircle size={16} />
                        <span>Code: {promoCode.code}</span>
                      </div>
                      <button onClick={handleRemovePromoCode} className={styles.promoRemove}>
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <div className={styles.promoInputGroup}>
                      <input
                        type="text"
                        placeholder="Entrer le code"
                        value={promoCode.code}
                        onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                        className={styles.promoInput}
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        disabled={isApplyingPromo}
                        className={styles.promoBtn}
                      >
                        {isApplyingPromo ? '...' : 'Appliquer'}
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.priceDetails}>
                  <div className={styles.priceRow}>
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(0)} FCFA</span>
                  </div>

                  {promoCode.discount > 0 && (
                    <div className={`${styles.priceRow} ${styles.priceDiscount}`}>
                      <span>Réduction</span>
                      <span>-{promoCode.discount.toFixed(0)} FCFA</span>
                    </div>
                  )}

                  <div className={styles.priceRow}>
                    <span>TVA (20%)</span>
                    <span>{tax.toFixed(0)} FCFA</span>
                  </div>

                  <div className={styles.priceDivider}></div>

                  <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                    <span>Total</span>
                    <span>{finalTotal.toFixed(0)} FCFA</span>
                  </div>
                </div>

                <button className={styles.btnCheckout} onClick={handleCheckout}>
                  <Lock size={18} /> Procéder au paiement
                </button>

                {!isAuthenticated && (
                  <div className={styles.authNotice}>
                    <AlertCircle size={16} />
                    <span>Connectez-vous pour finaliser</span>
                  </div>
                )}

                <div className={styles.securityInfo}>
                  <Lock size={16} className={styles.securityIcon} />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <div className={styles.logoIcon}>
                  <img src="/logo1.png" alt="Win+" />
                </div>
              </div>
              <p className={styles.footerText}>
                Autonomiser les éducateurs pour améliorer notre monde
              </p>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
                <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
                <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
                <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
              </div>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Légal</h4>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className={styles.footerLink}>Confidentialité</a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className={styles.footerLink}>Conditions</a>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Support</h4>
              <a href="#" className={styles.footerLink}>Documentation</a>
              <a href="#" className={styles.footerLink}>Forums</a>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>S'impliquer</h4>
              <a href="#" className={styles.footerLink}>Développement</a>
              <a href="#" className={styles.footerLink}>Traduction</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div>
              <p className={styles.footerCopyright}>© 2024 Win+. Tous droits réservés.</p>
              <div style={{ marginTop: '8px', fontSize: '13px' }}>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '16px', textDecoration: 'none' }}>
                  Politique de confidentialité
                </a>
                <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                  Conditions d'utilisation
                </a>
              </div>
            </div>
            <div className={styles.footerBadges}>
              <span className={styles.footerBadge}><Shield size={16} /> Sécurisé</span>
              <span className={styles.footerBadge}><Award size={16} /> Certifié</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;