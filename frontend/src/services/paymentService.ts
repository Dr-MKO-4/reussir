/**
 * Service de paiement - Intégration Stripe
 * Gestion des transactions et des informations de paiement
 */

import { api } from './api';

// ==================== TYPES ====================

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'succeeded';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  last4?: string;
  brand?: string;
  isDefault?: boolean;
}

export interface PaymentReceipt {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  paymentDate: Date;
  method: PaymentMethod;
  reference: string;
}

export interface PaymentStatus {
  id: string;
  status: 'processing' | 'succeeded' | 'failed' | 'refunded';
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentError {
  code:
    | 'CARD_DECLINED'
    | 'INSUFFICIENT_FUNDS'
    | 'INVALID_CARD'
    | 'NETWORK_ERROR'
    | 'INVALID_AMOUNT'
    | 'UNKNOWN';
  message: string;
  details?: string;
}

// ==================== SERVICE ====================

class PaymentService {
  /**
   * Initialiser une intention de paiement
   * @param cartData - Données du panier
   * @param userId - ID utilisateur
   */
  async initializePayment(cartData: {
    items: Array<{ id: string; quantity: number; price: number }>;
    total: number;
    currency?: string;
  }): Promise<PaymentIntent> {
    try {
      // Validation
      if (!cartData.items || cartData.items.length === 0) {
        throw {
          code: 'INVALID_AMOUNT',
          message: 'Le panier ne peut pas être vide',
        } as PaymentError;
      }

      if (cartData.total <= 0) {
        throw {
          code: 'INVALID_AMOUNT',
          message: 'Le montant doit être supérieur à 0',
        } as PaymentError;
      }

      // Appel API backend pour créer l'intention
      const response = await api.post('/payments/intent', {
        amount: Math.round(cartData.total * 100), // Convertir en centimes
        currency: cartData.currency || 'EUR',
        items: cartData.items,
      });

      return {
        id: response.data.id,
        clientSecret: response.data.clientSecret,
        amount: cartData.total,
        currency: cartData.currency || 'EUR',
        status: response.data.status,
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'initialisation du paiement:', error);
      throw {
        code: 'UNKNOWN',
        message: error.message || 'Erreur lors de la création de l\'intention de paiement',
      } as PaymentError;
    }
  }

  /**
   * Valider les informations de paiement
   * @param method - Méthode de paiement
   */
  validatePaymentMethod(method: PaymentMethod): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!method || !method.type) {
      errors.push('Méthode de paiement invalide');
      return { valid: false, errors };
    }

    if (method.type === 'card') {
      if (!method.last4 || method.last4.length !== 4) {
        errors.push('Numéro de carte invalide');
      }
      if (!method.brand) {
        errors.push('Type de carte non détecté');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Traiter le paiement
   * @param paymentIntentId - ID de l'intention de paiement
   * @param paymentMethodId - ID de la méthode de paiement
   * @param amount - Montant à payer
   */
  async processPayment(
    paymentIntentId: string,
    paymentMethodId: string,
    amount: number,
  ): Promise<PaymentReceipt> {
    try {
      // Validation
      if (!paymentIntentId) {
        throw {
          code: 'UNKNOWN',
          message: 'ID intention de paiement manquant',
        } as PaymentError;
      }

      if (!paymentMethodId) {
        throw {
          code: 'UNKNOWN',
          message: 'Méthode de paiement manquante',
        } as PaymentError;
      }

      if (amount <= 0) {
        throw {
          code: 'INVALID_AMOUNT',
          message: 'Montant invalide',
        } as PaymentError;
      }

      // Confirmer le paiement via Stripe (backend)
      const response = await api.post('/payments/confirm', {
        paymentIntentId,
        paymentMethodId,
      });

      if (response.data.status === 'failed') {
        throw {
          code: 'CARD_DECLINED',
          message: response.data.error || 'Paiement refusé',
          details: response.data.errorCode,
        } as PaymentError;
      }

      return {
        id: response.data.id,
        orderId: response.data.orderId,
        amount,
        currency: response.data.currency || 'EUR',
        status: response.data.status,
        paymentDate: new Date(response.data.createdAt),
        method: {
          id: paymentMethodId,
          type: 'card',
          last4: response.data.cardLast4,
          brand: response.data.cardBrand,
        },
        reference: response.data.reference,
      };
    } catch (error: any) {
      console.error('Erreur paiement:', error);
      throw {
        code: error.code || 'UNKNOWN',
        message: error.message || 'Erreur lors du traitement du paiement',
      } as PaymentError;
    }
  }

  /**
   * Obtenir le statut d'un paiement
   * @param paymentId - ID du paiement
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await api.get(`/payments/${paymentId}`);

      return {
        id: response.data.id,
        status: response.data.status,
        amount: response.data.amount / 100, // Reconvertir en euros
        currency: response.data.currency || 'EUR',
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw {
        code: 'UNKNOWN',
        message: 'Impossible de récupérer le statut du paiement',
      } as PaymentError;
    }
  }

  /**
   * Réessayer un paiement échoué
   * @param paymentId - ID du paiement échoué
   */
  async retryPayment(paymentId: string): Promise<PaymentReceipt> {
    try {
      const response = await api.post(`/payments/${paymentId}/retry`);

      return {
        id: response.data.id,
        orderId: response.data.orderId,
        amount: response.data.amount / 100,
        currency: response.data.currency,
        status: response.data.status,
        paymentDate: new Date(response.data.createdAt),
        method: {
          id: response.data.paymentMethodId,
          type: 'card',
          last4: response.data.cardLast4,
        },
        reference: response.data.reference,
      };
    } catch (error: any) {
      console.error('Erreur lors du nouveau tentative:', error);
      throw {
        code: 'UNKNOWN',
        message: 'Impossible de réessayer le paiement',
      } as PaymentError;
    }
  }

  /**
   * Générer un reçu de paiement
   * @param receipt - Données du reçu
   */
  generateReceipt(receipt: PaymentReceipt): string {
    const date = receipt.paymentDate.toLocaleDateString('fr-FR');
    const time = receipt.paymentDate.toLocaleTimeString('fr-FR');

    return `
═══════════════════════════════════════════════════════════
                     REÇU DE PAIEMENT
═══════════════════════════════════════════════════════════

Numéro de commande : ${receipt.orderId}
Numéro de transaction : ${receipt.reference}
Date/Heure : ${date} à ${time}

───────────────────────────────────────────────────────────
Montant : ${receipt.amount.toFixed(2)} ${receipt.currency}
Méthode : ${receipt.method.brand || 'Carte'} se terminant par ${receipt.method.last4}
Statut : ${receipt.status === 'succeeded' ? '✓ Paiement confirmé' : 'Paiement en attente'}

───────────────────────────────────────────────────────────
Merci pour votre achat !
═══════════════════════════════════════════════════════════
    `.trim();
  }

  /**
   * Obtenir les méthodes de paiement sauvegardées
   * @param userId - ID utilisateur
   */
  async getSavedPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const response = await api.get(`/users/${userId}/payment-methods`);
      return response.data.methods || [];
    } catch (error: any) {
      console.error('Erreur lors de la récupération des méthodes:', error);
      return [];
    }
  }

  /**
   * Enregistrer une nouvelle méthode de paiement
   * @param userId - ID utilisateur
   * @param method - Nouvelle méthode
   */
  async savePaymentMethod(userId: string, method: PaymentMethod): Promise<boolean> {
    try {
      const validation = this.validatePaymentMethod(method);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      await api.post(`/users/${userId}/payment-methods`, method);
      return true;
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement de la méthode:', error);
      return false;
    }
  }

  /**
   * Supprimer une méthode de paiement
   * @param userId - ID utilisateur
   * @param methodId - ID de la méthode
   */
  async deletePaymentMethod(userId: string, methodId: string): Promise<boolean> {
    try {
      await api.delete(`/users/${userId}/payment-methods/${methodId}`);
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  /**
   * Traiter un remboursement
   * @param paymentId - ID du paiement à rembourser
   * @param amount - Montant du remboursement (optionnel, sinon remboursement complet)
   */
  async processRefund(paymentId: string, amount?: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, {
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        success: response.data.status === 'succeeded',
        message: response.data.message || 'Remboursement traité',
      };
    } catch (error: any) {
      console.error('Erreur remboursement:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du remboursement',
      };
    }
  }
}

// ==================== EXPORT ====================

export default new PaymentService();
