import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@services/api';

export interface CartItem {
  id: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

export interface PromoCode {
  type: 'percentage' | 'fixed';
  value: number;
  [key: string]: any;
}

export interface CartContextType {
  cart: CartItem[];
  promoCode: PromoCode | null;
  loading: boolean;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; promo?: PromoCode; error?: string }>;
  removePromoCode: () => void;
  getAISuggestions: () => Promise<{ success: boolean; suggestions: any[]; error?: string }>;
  getRecommendedBundles: () => Promise<{ success: boolean; bundles: any[]; error?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error loading cart:', err);
        setCart([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      if (existingItem) {
        return prevCart.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
  };

  const applyPromoCode = async (code: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/promo/validate', { code });
      setPromoCode(response.data);
      return {
        success: true,
        promo: response.data
      };
    } catch (err: any) {
      console.error('Error applying promo code:', err);
      return {
        success: false,
        error: err.message || 'Code promo invalide'
      };
    } finally {
      setLoading(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    if (!promoCode) return 0;
    const subtotal = calculateSubtotal();
    if (promoCode.type === 'percentage') {
      return subtotal * (promoCode.value / 100);
    } else if (promoCode.type === 'fixed') {
      return Math.min(promoCode.value, subtotal);
    }
    return 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return Math.max(0, subtotal - discount);
  };

  const getAISuggestions = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/ai/cart-suggestions', {
        items: cart.map(item => item.id)
      });
      return {
        success: true,
        suggestions: response.data.suggestions || []
      };
    } catch (err: any) {
      console.error('Error getting AI suggestions:', err);
      return {
        success: false,
        error: err.message,
        suggestions: []
      };
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedBundles = async () => {
    try {
      setLoading(true);
      const response = await api.post('/api/ai/bundles', {
        items: cart.map(item => item.id)
      });
      return {
        success: true,
        bundles: response.data.bundles || []
      };
    } catch (err: any) {
      console.error('Error getting bundles:', err);
      return {
        success: false,
        error: err.message,
        bundles: []
      };
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    promoCode,
    loading,
    itemCount: cart.reduce((total, item) => total + item.quantity, 0),
    subtotal: calculateSubtotal(),
    discount: calculateDiscount(),
    total: calculateTotal(),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    getAISuggestions,
    getRecommendedBundles
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
