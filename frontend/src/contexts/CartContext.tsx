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
import paymentService from '../services/paymentService';
import cartService from '../services/cartService';

/**
 * Configuration du panier
 */
const CART_CONFIG = {
  STORAGE_KEY: 'shopping_cart',
  TAX_RATE: 0.2, // 20%
  CURRENCY: 'XAF',
  MAX_QUANTITY_PER_ITEM: 10,
  SYNC_WITH_BACKEND: true,
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
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discount = 0;
  if (cart.promoCode) {
    if (cart.promoCode.type === 'percentage') {
      discount = (subtotal * cart.promoCode.value) / 100;
    } else if (cart.promoCode.type === 'fixed') {
      discount = cart.promoCode.value;
    }
  }

  const taxableAmount = subtotal - discount;
  const tax = taxableAmount * CART_CONFIG.TAX_RATE;
  const total = taxableAmount + tax;
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
  const loadCart = async () => {
    try {
      setIsLoading(true);
      
      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        const backendCart = await cartService.getCart();
        
        const items: CartItem[] = backendCart.items.map(item => ({
          id: item.id,
          subject: {
            id: item.subjectId,
            title: item.title,
            description: item.description || '',
            price: item.price,
            image: item.image,
            category: '',
            level: '',
            difficulty: '',
            rating: 0,
            studentsCount: 0,
          },
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.price,
          addedAt: item.addedAt.toString(),
          updatedAt: new Date().toISOString(),
        }));

        dispatch({
          type: 'LOAD_CART',
          payload: {
            cart: {
              items,
              itemsCount: backendCart.items.length,
              subtotal: backendCart.subtotal,
              discount: backendCart.discount,
              tax: backendCart.tax,
              total: backendCart.total,
              currency: CART_CONFIG.CURRENCY,
              updatedAt: new Date().toISOString(),
            }
          }
        });
      } else {
        const savedCart = storage.get<Cart>(CART_CONFIG.STORAGE_KEY);
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: { cart: savedCart } });
        }
      }
    } catch (err: any) {
      console.error('[CartContext] Error loading cart:', err);
      setError(err.message || 'Erreur lors du chargement du panier');
    } finally {
      setIsLoading(false);
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

      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        await cartService.addToCart(subject.id, quantity);
        await loadCart();
      } else {
        dispatch({
          type: 'ADD_ITEM',
          payload: { subject, quantity },
        });
      }
    } catch (err: any) {
      console.error('[CartContext] Add item error:', err);
      const errorMsg = err.message || 'Erreur lors de l\'ajout au panier';
      setError(errorMsg);
      throw new Error(errorMsg);
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

      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        await cartService.removeFromCart(itemId);
        await loadCart();
      } else {
        dispatch({
          type: 'REMOVE_ITEM',
          payload: { itemId },
        });
      }
    } catch (err: any) {
      console.error('[CartContext] Remove item error:', err);
      const errorMsg = err.message || 'Erreur lors de la suppression';
      setError(errorMsg);
      throw new Error(errorMsg);
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

      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        await cartService.updateQuantity(itemId, quantity);
        await loadCart();
      } else {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { itemId, quantity },
        });
      }
    } catch (err: any) {
      console.error('[CartContext] Update quantity error:', err);
      const errorMsg = err.message || 'Erreur lors de la mise à jour';
      setError(errorMsg);
      throw new Error(errorMsg);
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

      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        await cartService.clearCart();
      }
      
      dispatch({ type: 'CLEAR_CART' });
    } catch (err: any) {
      console.error('[CartContext] Clear cart error:', err);
      const errorMsg = err.message || 'Erreur lors du vidage du panier';
      setError(errorMsg);
      throw new Error(errorMsg);
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

      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        const result = await cartService.applyPromoCode(code);
        
        return {
          isValid: result.success,
          code,
          discountAmount: result.discount,
          message: result.message,
        };
      }
      
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
          type: 'percentage',
          value: 10,
          discountAmount: validation.discountAmount,
          appliedAt: new Date().toISOString(),
        };

        dispatch({
          type: 'APPLY_PROMO',
          payload: { promoCode: appliedPromo },
        });
        
        if (CART_CONFIG.SYNC_WITH_BACKEND) {
          await loadCart();
        }
      } else {
        const errorMsg = validation.error || 'Code promo invalide';
        setError(errorMsg);
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

      if (CART_CONFIG.SYNC_WITH_BACKEND) {
        await cartService.removePromoCode();
      }
      
      dispatch({ type: 'REMOVE_PROMO' });
    } catch (err: any) {
      console.error('[CartContext] Remove promo code error:', err);
      const errorMsg = err.message || 'Erreur lors de la suppression du code promo';
      setError(errorMsg);
      throw new Error(errorMsg);
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

      // TODO: Implémenter la création de commande
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

      if (!data.paymentMethodId) {
        throw new Error('Méthode de paiement manquante');
      }

      if (!data.amount || data.amount <= 0) {
        throw new Error('Montant invalide');
      }

      console.log('[CartContext] Initializing payment...');
      const cartData = {
        items: cart.items.map(item => ({
          id: item.subject.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: cart.total,
        currency: cart.currency || 'XAF',
      };

      const paymentIntent = await paymentService.initializePayment(cartData);
      console.log('[CartContext] Payment intent created:', paymentIntent);

      console.log('[CartContext] Processing payment...');
      const receipt = await paymentService.processPayment(
        paymentIntent.id,
        data.paymentMethodId,
        data.amount
      );
      console.log('[CartContext] Payment processed:', receipt);

      await clearCart();

      return {
        success: true,
        transactionId: receipt.id,
        orderId: receipt.orderId,
        amount: receipt.amount,
        currency: receipt.currency,
        status: receipt.status,
        reference: receipt.reference,
        paymentDate: receipt.paymentDate,
      };
    } catch (err: any) {
      console.error('[CartContext] Process payment error:', err);
      const errorMessage = err.message || 'Erreur lors du traitement du paiement';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [cart, clearCart]);

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