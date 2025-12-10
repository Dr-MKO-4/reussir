// src/services/cartService.ts
import api from './api';

interface Subject {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  level?: string;
  difficulty?: string;
  rating?: number;
  studentsCount?: number;
}

interface CartItem {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  quantity: number;
  addedAt: Date;
}

interface BackendCart {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

const CART_STORAGE_KEY = 'winplus_cart';

class CartService {
  // ✅ Méthodes localStorage
  getLocalCart(): BackendCart {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convertir les dates
        parsed.items = parsed.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        return parsed;
      }
    } catch (error) {
      console.error('Error reading local cart:', error);
    }
    return { 
      items: [], 
      itemsCount: 0, 
      subtotal: 0, 
      discount: 0, 
      tax: 0, 
      total: 0 
    };
  }

  saveLocalCart(cart: BackendCart): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }

  clearLocalCart(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing local cart:', error);
    }
  }

  // ✅ Calculer les totaux
  private calculateTotals(items: CartItem[]): BackendCart {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.2; // 20%
    const total = subtotal + tax;
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      itemsCount,
      subtotal,
      discount: 0,
      tax,
      total,
    };
  }

  // ✅ Récupérer le panier (serveur avec fallback local)
  async getCart(): Promise<BackendCart> {
    try {
      const response = await api.get<BackendCart>('/cart');
      
      // Sauvegarder dans le cache local
      this.saveLocalCart(response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      
      // ✅ En cas d'erreur réseau, retourner le panier local
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        console.log('Using local cart due to network error');
        return this.getLocalCart();
      }
      
      throw error;
    }
  }

  // ✅ Ajouter un article (avec alias addToCart)
  async addToCart(subjectId: string, quantity: number = 1): Promise<BackendCart> {
    try {
      const response = await api.post<BackendCart>('/cart/items', {
        subjectId,
        quantity,
      });
      
      this.saveLocalCart(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error adding item:', error);
      
      // ✅ Ajouter localement en cas d'erreur réseau
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        const localCart = this.getLocalCart();
        const existingItem = localCart.items.find(item => item.subjectId === subjectId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          // Note: En mode hors ligne, on ne peut pas obtenir les détails du sujet
          // Il faudrait les passer en paramètre ou les avoir en cache
          console.warn('Cannot add new item in offline mode without subject details');
          throw new Error('Impossible d\'ajouter un nouvel article en mode hors ligne');
        }
        
        const updatedCart = this.calculateTotals(localCart.items);
        this.saveLocalCart(updatedCart);
        return updatedCart;
      }
      
      throw error;
    }
  }

  // ✅ Supprimer un article (avec alias removeFromCart)
  async removeFromCart(itemId: string): Promise<BackendCart> {
    try {
      const response = await api.delete<BackendCart>(`/cart/items/${itemId}`);
      
      this.saveLocalCart(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error removing item:', error);
      
      // ✅ Supprimer localement en cas d'erreur réseau
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        const localCart = this.getLocalCart();
        localCart.items = localCart.items.filter(item => item.id !== itemId);
        const updatedCart = this.calculateTotals(localCart.items);
        this.saveLocalCart(updatedCart);
        return updatedCart;
      }
      
      throw error;
    }
  }

  // ✅ Mettre à jour la quantité
  async updateQuantity(itemId: string, quantity: number): Promise<BackendCart> {
    try {
      const response = await api.patch<BackendCart>(`/cart/items/${itemId}`, {
        quantity,
      });
      
      this.saveLocalCart(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      
      // ✅ Mettre à jour localement en cas d'erreur réseau
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        const localCart = this.getLocalCart();
        const item = localCart.items.find(item => item.id === itemId);
        
        if (item) {
          item.quantity = quantity;
        }
        
        const updatedCart = this.calculateTotals(localCart.items);
        this.saveLocalCart(updatedCart);
        return updatedCart;
      }
      
      throw error;
    }
  }

  // ✅ Vider le panier
  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart');
      this.clearLocalCart();
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      
      // ✅ Vider localement en cas d'erreur réseau
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        this.clearLocalCart();
        return;
      }
      
      throw error;
    }
  }

  // ✅ Appliquer un code promo
  async applyPromoCode(code: string): Promise<{ success: boolean; message: string; discount: number }> {
    try {
      const response = await api.post<{ success: boolean; message: string; discount: number }>(
        '/cart/promo',
        { code }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error applying promo code:', error);
      
      // ✅ Mode hors ligne : codes promo simulés
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        // Codes promo locaux pour le mode hors ligne
        const localPromoCodes: Record<string, number> = {
          'PROMO10': 0.10,
          'PROMO20': 0.20,
          'BIENVENUE': 0.15,
        };
        
        const discountPercent = localPromoCodes[code.toUpperCase()];
        
        if (discountPercent) {
          const localCart = this.getLocalCart();
          const discount = localCart.subtotal * discountPercent;
          
          return {
            success: true,
            message: `Code promo appliqué : -${(discountPercent * 100).toFixed(0)}% (mode hors ligne)`,
            discount,
          };
        } else {
          return {
            success: false,
            message: 'Code promo invalide',
            discount: 0,
          };
        }
      }
      
      throw error;
    }
  }

  // ✅ Supprimer un code promo
  async removePromoCode(): Promise<void> {
    try {
      await api.delete('/cart/promo');
    } catch (error: any) {
      console.error('Error removing promo code:', error);
      
      // En mode hors ligne, on ne fait rien
      if (error.code === 'ERR_NETWORK' || error.message?.includes('connexion')) {
        return;
      }
      
      throw error;
    }
  }

  // ✅ Valider avant le checkout
  validateCheckout(items: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (items.length === 0) {
      errors.push('Votre panier est vide');
    }

    items.forEach((item) => {
      if (item.quantity < 1) {
        errors.push(`Quantité invalide pour ${item.subject?.title || 'cet article'}`);
      }
      if (item.price <= 0) {
        errors.push(`Prix invalide pour ${item.subject?.title || 'cet article'}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ✅ Synchroniser le panier local avec le serveur
  async syncCart(): Promise<void> {
    try {
      const localCart = this.getLocalCart();
      
      if (localCart.items.length > 0) {
        // Envoyer le panier local au serveur
        await api.post('/cart/sync', localCart);
        console.log('Cart synchronized with server');
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }
}

export default new CartService();