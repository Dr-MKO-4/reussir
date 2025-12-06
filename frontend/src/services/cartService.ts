/**
 * Service de gestion du panier
 * Logique métier pour les opérations sur le panier
 */

import { Subject, CartItem, Cart, PromoCode } from '@/types';

// ==================== TYPES ====================

export interface CartServiceError {
  code: 'INVALID_QTY' | 'ITEM_NOT_FOUND' | 'INVALID_PROMO' | 'PROMO_EXPIRED' | 'UNKNOWN';
  message: string;
}

// ==================== ÉTAT INITIAL ====================

const INITIAL_STATE: Cart = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  promoCode: null,
};

// ==================== SERVICE ====================

class CartService {
  /**
   * Ajouter un sujet au panier
   * @param subject - Sujet à ajouter
   * @param quantity - Quantité (défaut: 1)
   */
  addToCart(subject: Subject, quantity: number = 1): CartItem {
    // Validation
    if (quantity < 1 || !Number.isInteger(quantity)) {
      throw {
        code: 'INVALID_QTY',
        message: 'La quantité doit être un entier positif',
      } as CartServiceError;
    }

    return {
      id: subject.id,
      subjectId: subject.id,
      title: subject.title,
      description: subject.description,
      price: subject.price,
      image: subject.image,
      quantity,
      subtotal: subject.price * quantity,
      addedAt: new Date(),
    };
  }

  /**
   * Retirer un article du panier
   * @param cartItemId - ID de l'article du panier
   */
  removeFromCart(cartItemId: string): boolean {
    if (!cartItemId) {
      throw {
        code: 'ITEM_NOT_FOUND',
        message: 'ID article invalide',
      } as CartServiceError;
    }
    return true; // Logique de suppression gérée par le context
  }

  /**
   * Mettre à jour la quantité d'un article
   * @param cartItemId - ID de l'article
   * @param quantity - Nouvelle quantité
   */
  updateQuantity(cartItemId: string, quantity: number): void {
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
  }

  /**
   * Vider complètement le panier
   */
  clearCart(): void {
    // Logique de suppression complète
  }

  /**
   * Calculer le total du panier
   * @param items - Articles du panier
   * @param taxRate - Taux de TVA (défaut: 0.20 = 20%)
   * @param discountAmount - Réduction appliquée
   */
  calculateTotal(
    items: CartItem[],
    taxRate: number = 0.2,
    discountAmount: number = 0,
  ): {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  } {
    // Calculer sous-total
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculer TVA
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(taxableAmount * taxRate * 100) / 100;

    // Total final
    const total = subtotal - discountAmount + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      discount: Math.round(discountAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Valider et appliquer un code promo
   * @param code - Code promo saisi
   * @param subtotal - Sous-total du panier
   */
  applyPromoCode(
    code: string,
    subtotal: number,
  ): { success: boolean; discount: number; message: string } {
    // Validation format
    if (!code || code.trim().length === 0) {
      return {
        success: false,
        discount: 0,
        message: 'Code promo invalide',
      };
    }

    // Liste des codes promo valides (en production: appel API)
    const VALID_PROMO_CODES: Record<string, { discount: number; type: 'percentage' | 'fixed' }> =
      {
        WELCOME10: { discount: 10, type: 'percentage' },
        WELCOME20: { discount: 20, type: 'percentage' },
        SUMMER50: { discount: 50, type: 'fixed' },
        FIRST_BUY: { discount: 15, type: 'percentage' },
        TEACHER15: { discount: 15, type: 'percentage' },
      };

    const promoData = VALID_PROMO_CODES[code.toUpperCase()];

    if (!promoData) {
      return {
        success: false,
        discount: 0,
        message: 'Code promo non valide',
      };
    }

    // Calculer la réduction
    let discountAmount = 0;
    if (promoData.type === 'percentage') {
      discountAmount = (subtotal * promoData.discount) / 100;
    } else {
      discountAmount = Math.min(promoData.discount, subtotal);
    }

    return {
      success: true,
      discount: Math.round(discountAmount * 100) / 100,
      message: `Code promo "${code}" appliqué avec succès`,
    };
  }

  /**
   * Vérifier si un code promo est valide
   * @param code - Code promo à vérifier
   */
  validatePromoCode(code: string): boolean {
    const VALID_CODES = ['WELCOME10', 'WELCOME20', 'SUMMER50', 'FIRST_BUY', 'TEACHER15'];
    return VALID_CODES.includes(code.toUpperCase());
  }

  /**
   * Obtenir les articles du panier
   * (Logique de récupération depuis le context)
   */
  getCart(): Cart {
    return INITIAL_STATE;
  }

  /**
   * Calculer les frais d'expédition
   * @param subtotal - Sous-total
   * @param region - Région de livraison
   */
  calculateShippingCost(subtotal: number, region: string = 'FR'): number {
    // Expédition gratuite à partir de 50€
    if (subtotal >= 50) return 0;

    // Tarifs par région
    const shippingRates: Record<string, number> = {
      FR: 4.99,
      EU: 9.99,
      WORLD: 19.99,
    };

    return shippingRates[region] || shippingRates.FR;
  }

  /**
   * Valider avant checkout
   * @param items - Articles du panier
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
   * Obtenir les suggestions de bundle
   * @param currentItems - Articles actuels du panier
   */
  getBundleSuggestions(currentItems: CartItem[]): Subject[] {
    // En production: appel API pour suggestions personnalisées
    // Pour MVP: retourner des suggestions basiques
    return [];
  }

  /**
   * Calculer les économies si achat d'un bundle
   * @param bundlePrice - Prix du bundle
   * @param individualTotal - Somme des prix individuels
   */
  calculateBundleSavings(bundlePrice: number, individualTotal: number): {
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

// ==================== EXPORT ====================

export default new CartService();
