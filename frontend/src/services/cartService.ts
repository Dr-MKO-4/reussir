import { api } from './api';

/**
 * Service de gestion du panier avec backend
 */

// ==================== TYPES ====================

export interface CartItem {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  quantity: number;
  subtotal: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  promoCode: string | null;
}

export interface CartServiceError {
  code: 'INVALID_QTY' | 'ITEM_NOT_FOUND' | 'INVALID_PROMO' | 'PROMO_EXPIRED' | 'UNKNOWN';
  message: string;
}

// ==================== SERVICE ====================

class CartService {
  /**
   * Obtenir le panier actuel
   */
  async getCart(): Promise<Cart> {
    try {
      const response = await api.get<Cart>('/api/cart');
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return this.getEmptyCart();
    }
  }

  /**
   * Ajouter un sujet au panier
   */
  async addToCart(subjectId: string, quantity: number = 1): Promise<Cart> {
    try {
      if (quantity < 1 || !Number.isInteger(quantity)) {
        throw {
          code: 'INVALID_QTY',
          message: 'La quantité doit être un entier positif',
        } as CartServiceError;
      }

      const response = await api.post<Cart>('/api/cart/add', {
        subjectId,
        quantity,
      });

      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  /**
   * Retirer un article du panier
   */
  async removeFromCart(cartItemId: string): Promise<Cart> {
    try {
      if (!cartItemId) {
        throw {
          code: 'ITEM_NOT_FOUND',
          message: 'ID article invalide',
        } as CartServiceError;
      }

      const response = await api.delete<Cart>(`/api/cart/remove/${cartItemId}`);
      return response;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour la quantité d'un article
   */
  async updateQuantity(cartItemId: string, quantity: number): Promise<Cart> {
    try {
      if (!cartItemId) {
        throw {
          code: 'ITEM_NOT_FOUND',
          message: 'Article non trouvé',
        } as CartServiceError;
      }

      if (quantity < 0 || !Number.isInteger(quantity)) {
        throw {
          code: 'INVALID_QTY',
          message: 'La quantité doit être un entier positif ou zéro',
        } as CartServiceError;
      }

      if (quantity === 0) {
        return await this.removeFromCart(cartItemId);
      }

      const response = await api.put<Cart>(`/api/cart/update/${cartItemId}`, {
        quantity,
      });

      return response;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  /**
   * Vider complètement le panier
   */
  async clearCart(): Promise<void> {
    try {
      await api.post('/cart/clear');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  /**
   * Appliquer un code promo
   */
  async applyPromoCode(code: string): Promise<{
    success: boolean;
    discount: number;
    message: string;
    cart: Cart;
  }> {
    try {
      if (!code || code.trim().length === 0) {
        return {
          success: false,
          discount: 0,
          message: 'Code promo invalide',
          cart: await this.getCart(),
        };
      }

      const response = await api.post<{
        success: boolean;
        discount: number;
        message: string;
        cart: Cart;
      }>('/api/cart/promo', {
        promoCode: code,
      });

      return response;
    } catch (error: any) {
      console.error('Error applying promo code:', error);
      return {
        success: false,
        discount: 0,
        message: error.message || 'Erreur lors de l\'application du code promo',
        cart: await this.getCart(),
      };
    }
  }

  /**
   * Retirer le code promo
   */
  async removePromoCode(): Promise<Cart> {
    try {
      const response = await api.delete<Cart>('/api/cart/promo');
      return response;
    } catch (error) {
      console.error('Error removing promo code:', error);
      throw error;
    }
  }

  /**
   * Calculer le total du panier (côté client pour affichage)
   */
  calculateTotal(
    items: CartItem[],
    taxRate: number = 0.2,
    discountAmount: number = 0
  ): {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  } {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(taxableAmount * taxRate * 100) / 100;
    const total = subtotal - discountAmount + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      discount: Math.round(discountAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Valider avant checkout
   */
  validateCheckout(items: CartItem[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (items.length === 0) {
      errors.push('Le panier est vide');
    }

    items.forEach((item) => {
      if (item.quantity < 1) {
        errors.push(`Quantité invalide pour "${item.title}"`);
      }
      if (item.price <= 0) {
        errors.push(`Prix invalide pour "${item.title}"`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Synchroniser le panier local avec le serveur
   */
  async syncCart(localItems: CartItem[]): Promise<Cart> {
    try {
      const response = await api.post<Cart>('/api/cart/sync', {
        items: localItems,
      });
      return response;
    } catch (error) {
      console.error('Error syncing cart:', error);
      return this.getEmptyCart();
    }
  }

  /**
   * Obtenir un panier vide
   */
  private getEmptyCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      promoCode: null,
    };
  }

  /**
   * Calculer les frais d'expédition
   */
  calculateShippingCost(subtotal: number, region: string = 'FR'): number {
    if (subtotal >= 50) return 0;

    const shippingRates: Record<string, number> = {
      FR: 4.99,
      EU: 9.99,
      WORLD: 19.99,
    };

    return shippingRates[region] || shippingRates.FR;
  }

  /**
   * Calculer les économies si achat d'un bundle
   */
  calculateBundleSavings(
    bundlePrice: number,
    individualTotal: number
  ): {
    savings: number;
    percentage: number;
  } {
    const savings = Math.max(0, individualTotal - bundlePrice);
    const percentage = individualTotal > 0 ? (savings / individualTotal) * 100 : 0;

    return {
      savings: Math.round(savings * 100) / 100,
      percentage: Math.round(percentage),
    };
  }
}

export default new CartService();