import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useReducer } from 'react';
import { SubjectCardData } from '../types/catalog';
import {
  Cart,
  CartItem,
  CartSummary,
  AppliedPromoCode,
  PromoCodeValidation,
  CartContextValue,
  CartAction,
  CreateOrderData,
  CreateOrderResult,
  PaymentData,
  PaymentResult,
} from '../types/cart';
import { localStore as storage } from '../services/storage';

/**
 * Configuration du panier
 */
const CART_CONFIG = {
  STORAGE_KEY: 'shopping_cart',
  TAX_RATE: 0, // 0% (à ajuster selon les besoins)
  CURRENCY: 'XAF',
  MAX_QUANTITY_PER_ITEM: 10,
  SYNC_WITH_BACKEND: false, // Activer quand l'API est prête
};

/**
 * État initial du panier
 */
const initialCart: Cart = {
  items: [],
  itemsCount: 0,
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0,
  currency: CART_CONFIG.CURRENCY,
  updatedAt: new Date().toISOString(),
};

/**
 * Reducer pour gérer l'état du panier
 */
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { subject, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.subject.id === subject.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Item existe déjà, augmenter la quantité
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = Math.min(
              item.quantity + quantity,
              CART_CONFIG.MAX_QUANTITY_PER_ITEM
            );
            return { ...item, quantity: newQuantity, updatedAt: new Date().toISOString() };
          }
          return item;
        });
      } else {
        // Nouvel item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${subject.id}`,
          subject,
          quantity,
          price: subject.price,
          originalPrice: subject.price,
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        newItems = [...state.items, newItem];
      }

      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'REMOVE_ITEM': {
      const { itemId } = action.payload;
      const newItems = state.items.filter((item) => item.id !== itemId);
      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Si quantité <= 0, supprimer l'item
        const newItems = state.items.filter((item) => item.id !== itemId);
        return calculateCartTotals({ ...state, items: newItems });
      }

      const newItems = state.items.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.min(quantity, CART_CONFIG.MAX_QUANTITY_PER_ITEM);
          return { ...item, quantity: newQuantity, updatedAt: new Date().toISOString() };
        }
        return item;
      });

      return calculateCartTotals({ ...state, items: newItems });
    }

    case 'APPLY_PROMO': {
      const { promoCode } = action.payload;
      return calculateCartTotals({ ...state, promoCode });
    }

    case 'REMOVE_PROMO': {
      return calculateCartTotals({ ...state, promoCode: undefined });
    }

    case 'CLEAR_CART': {
      return { ...initialCart };
    }

    case 'LOAD_CART': {
      return action.payload.cart;
    }

    case 'SYNC_CART': {
      const { items } = action.payload;
      return calculateCartTotals({ ...state, items });
    }

    default:
      return state;
  }
}

/**
 * Calculer les totaux du panier
 */
function calculateCartTotals(cart: Cart): Cart {
  // Calculer le sous-total
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculer la réduction
  let discount = 0;
  if (cart.promoCode) {
    if (cart.promoCode.type === 'percentage') {
      discount = (subtotal * cart.promoCode.value) / 100;
    } else if (cart.promoCode.type === 'fixed') {
      discount = cart.promoCode.value;
    }
  }

  // Calculer la taxe (sur le montant après réduction)
  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * CART_CONFIG.TAX_RATE;

  // Calculer le total
  const total = taxableAmount + tax;

  // Compter les items
  const itemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    itemsCount,
    subtotal: Math.max(0, subtotal),
    discount: Math.max(0, discount),
    tax: Math.max(0, tax),
    total: Math.max(0, total),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Contexte du panier
 */
const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * Props du Provider
 */
interface CartProviderProps {
  children: ReactNode;
}

/**
 * Provider du contexte du panier
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charger le panier depuis le localStorage au montage
   */
  useEffect(() => {
    loadCart();
  }, []);

  /**
   * Sauvegarder le panier dans le localStorage à chaque changement
   */
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  /**
   * Charger le panier depuis le storage
   */
  const loadCart = () => {
    try {
      const savedCart = storage.get<Cart>(CART_CONFIG.STORAGE_KEY);
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: { cart: savedCart } });
      }
    } catch (err) {
      console.error('[CartContext] Error loading cart:', err);
    }
  };

  /**
   * Sauvegarder le panier dans le storage
   */
  const saveCart = (cartToSave: Cart) => {
    try {
      storage.set(CART_CONFIG.STORAGE_KEY, cartToSave);
    } catch (err) {
      console.error('[CartContext] Error saving cart:', err);
    }
  };

  /**
   * Ajouter un item au panier
   */
  const addItem = useCallback(async (subject: SubjectCardData, quantity: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      dispatch({
        type: 'ADD_ITEM',
        payload: { subject, quantity },
      });

      // TODO: Sync avec backend si nécessaire
      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        // await api.post('/cart/items', { subjectId: subject.id, quantity });
      }
    } catch (err: any) {
      console.error('[CartContext] Add item error:', err);
      setError(err.message || 'Erreur lors de l\'ajout au panier');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Supprimer un item du panier
   */
  const removeItem = useCallback(async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      dispatch({
        type: 'REMOVE_ITEM',
        payload: { itemId },
      });

      // TODO: Sync avec backend si nécessaire
      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        // await api.delete(`/cart/items/${itemId}`);
      }
    } catch (err: any) {
      console.error('[CartContext] Remove item error:', err);
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mettre à jour la quantité d'un item
   */
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      setError(null);

      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { itemId, quantity },
      });

      // TODO: Sync avec backend si nécessaire
      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        // await api.patch(`/cart/items/${itemId}`, { quantity });
      }
    } catch (err: any) {
      console.error('[CartContext] Update quantity error:', err);
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Vider le panier
   */
  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      dispatch({ type: 'CLEAR_CART' });

      // TODO: Sync avec backend si nécessaire
      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        // await api.delete('/cart');
      }
    } catch (err: any) {
      console.error('[CartContext] Clear cart error:', err);
      setError(err.message || 'Erreur lors du vidage du panier');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Valider un code promo
   */
  const validatePromoCode = useCallback(async (code: string): Promise<PromoCodeValidation> => {
    try {
      setError(null);

      // TODO: Appeler l'API pour valider le code
      // const result = await api.post('/promo-codes/validate', { code, cartTotal: cart.subtotal });
      
      // Simulation pour le moment
      const mockValidation: PromoCodeValidation = {
        isValid: code.toUpperCase() === 'PROMO10',
        code,
        discountAmount: code.toUpperCase() === 'PROMO10' ? cart.subtotal * 0.1 : 0,
        message: code.toUpperCase() === 'PROMO10' 
          ? 'Code promo appliqué avec succès !'
          : 'Code promo invalide',
      };

      return mockValidation;
    } catch (err: any) {
      console.error('[CartContext] Validate promo code error:', err);
      return {
        isValid: false,
        code,
        discountAmount: 0,
        error: err.message || 'Erreur lors de la validation du code promo',
      };
    }
  }, [cart.subtotal]);

  /**
   * Appliquer un code promo
   */
  const applyPromoCode = useCallback(async (code: string): Promise<PromoCodeValidation> => {
    try {
      setIsLoading(true);
      setError(null);

      const validation = await validatePromoCode(code);

      if (validation.isValid) {
        const appliedPromo: AppliedPromoCode = {
          code: validation.code,
          type: 'percentage', // TODO: Récupérer le vrai type depuis l'API
          value: 10, // TODO: Récupérer la vraie valeur depuis l'API
          discountAmount: validation.discountAmount,
          appliedAt: new Date().toISOString(),
        };

        dispatch({
          type: 'APPLY_PROMO',
          payload: { promoCode: appliedPromo },
        });
      } else {
        setError(validation.error || 'Code promo invalide');
      }

      return validation;
    } catch (err: any) {
      console.error('[CartContext] Apply promo code error:', err);
      const errorMessage = err.message || 'Erreur lors de l\'application du code promo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [validatePromoCode]);

  /**
   * Supprimer le code promo
   */
  const removePromoCode = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      dispatch({ type: 'REMOVE_PROMO' });
    } catch (err: any) {
      console.error('[CartContext] Remove promo code error:', err);
      setError(err.message || 'Erreur lors de la suppression du code promo');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Récupérer un item par son subjectId
   */
  const getItem = useCallback((subjectId: string): CartItem | undefined => {
    return cart.items.find((item) => item.subject.id === subjectId);
  }, [cart.items]);

  /**
   * Vérifier si un sujet est dans le panier
   */
  const hasItem = useCallback((subjectId: string): boolean => {
    return cart.items.some((item) => item.subject.id === subjectId);
  }, [cart.items]);

  /**
   * Obtenir le résumé du panier
   */
  const getCartSummary = useCallback((): CartSummary => {
    return {
      subtotal: cart.subtotal,
      discount: cart.discount,
      discountPercentage: cart.subtotal > 0 ? (cart.discount / cart.subtotal) * 100 : 0,
      tax: cart.tax,
      taxRate: CART_CONFIG.TAX_RATE,
      total: cart.total,
      itemsCount: cart.itemsCount,
      savings: cart.discount,
      currency: cart.currency,
    };
  }, [cart]);

  /**
   * Créer une commande
   */
  const createOrder = useCallback(async (data: CreateOrderData): Promise<CreateOrderResult> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Appeler l'API pour créer la commande
      // const result = await api.post('/orders', data);
      
      // Simulation pour le moment
      throw new Error('createOrder not implemented yet');
    } catch (err: any) {
      console.error('[CartContext] Create order error:', err);
      const errorMessage = err.message || 'Erreur lors de la création de la commande';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Traiter le paiement
   */
  const processPayment = useCallback(async (data: PaymentData): Promise<PaymentResult> => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Appeler l'API pour traiter le paiement
      // const result = await api.post('/payments', data);
      
      // Simulation pour le moment
      throw new Error('processPayment not implemented yet');
    } catch (err: any) {
      console.error('[CartContext] Process payment error:', err);
      const errorMessage = err.message || 'Erreur lors du traitement du paiement';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Valeur du contexte
   */
  const value: CartContextValue = {
    cart,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    validatePromoCode,
    getItem,
    hasItem,
    getCartSummary,
    createOrder,
    processPayment,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte du panier
 */
export const useCartContext = (): CartContextValue => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;