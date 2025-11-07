/**
 * Types pour le module Panier & Commande
 */

import { Subject, SubjectCardData } from './catalog';

/**
 * Item dans le panier
 */
export interface CartItem {
  id: string;
  subject: SubjectCardData;
  quantity: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  addedAt: string;
  updatedAt: string;
}

/**
 * État du panier
 */
export interface Cart {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoCode?: AppliedPromoCode;
  currency: string;
  updatedAt: string;
}

/**
 * Code promo
 */
export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'bundle';
  value: number; // Pourcentage (ex: 20) ou montant fixe
  description?: string;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usageCount?: number;
  applicableSubjects?: string[]; // IDs des sujets concernés
  applicableExams?: string[];
  isActive: boolean;
}

/**
 * Code promo appliqué
 */
export interface AppliedPromoCode {
  code: string;
  type: PromoCode['type'];
  value: number;
  discountAmount: number;
  appliedAt: string;
}

/**
 * Résumé du panier
 */
export interface CartSummary {
  subtotal: number;
  discount: number;
  discountPercentage?: number;
  tax: number;
  taxRate?: number;
  shipping?: number;
  total: number;
  itemsCount: number;
  savings?: number;
  currency: string;
}

/**
 * Résultat de validation du code promo
 */
export interface PromoCodeValidation {
  isValid: boolean;
  code: string;
  discountAmount: number;
  message?: string;
  error?: string;
}

/**
 * Suggestion de bundle/pack
 */
export interface BundleSuggestion {
  id: string;
  name: string;
  description: string;
  subjects: SubjectCardData[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  savingsPercentage: number;
  reason: string; // Pourquoi cette suggestion
  confidence: number; // 0-1
}

/**
 * Statuts de commande
 */
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

/**
 * Méthodes de paiement
 */
export type PaymentMethod =
  | 'card'
  | 'mobile_money'
  | 'paypal'
  | 'bank_transfer'
  | 'cash';

/**
 * Statuts de paiement
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

/**
 * Informations de paiement
 */
export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  provider?: string; // Ex: "Stripe", "Orange Money", "MTN MoMo"
  last4?: string; // 4 derniers chiffres de la carte
  cardBrand?: string; // Ex: "Visa", "Mastercard"
}

/**
 * Informations de contact pour la commande
 */
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  address?: string;
}

/**
 * Commande complète
 */
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  
  // Items
  items: CartItem[];
  itemsCount: number;
  
  // Pricing
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  
  // Promo
  promoCode?: AppliedPromoCode;
  
  // Statut
  status: OrderStatus;
  
  // Paiement
  payment: PaymentInfo;
  
  // Contact
  contact: ContactInfo;
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  
  // Notes
  notes?: string;
  cancelReason?: string;
}

/**
 * Historique des commandes
 */
export interface OrderHistory {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Données pour créer une commande
 */
export interface CreateOrderData {
  items: CartItem[];
  promoCode?: string;
  contact: ContactInfo;
  paymentMethod: PaymentMethod;
  notes?: string;
}

/**
 * Résultat de création de commande
 */
export interface CreateOrderResult {
  order: Order;
  paymentUrl?: string; // URL de redirection pour le paiement
  paymentToken?: string; // Token pour le paiement
}

/**
 * Données de paiement
 */
export interface PaymentData {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  
  // Pour carte bancaire
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
  
  // Pour mobile money
  phoneNumber?: string;
  provider?: string;
  
  // Pour virement
  bankAccount?: string;
  bankCode?: string;
  
  // Métadonnées
  returnUrl?: string;
  cancelUrl?: string;
}

/**
 * Résultat de paiement
 */
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: PaymentStatus;
  message?: string;
  error?: string;
  redirectUrl?: string;
}

/**
 * Configuration de paiement
 */
export interface PaymentConfig {
  methods: PaymentMethod[];
  currency: string;
  taxRate: number;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Actions sur le panier
 */
export type CartAction =
  | { type: 'ADD_ITEM'; payload: { subject: SubjectCardData; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'APPLY_PROMO'; payload: { promoCode: AppliedPromoCode } }
  | { type: 'REMOVE_PROMO' }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cart: Cart } }
  | { type: 'SYNC_CART'; payload: { items: CartItem[] } };

/**
 * Contexte du panier (pour React Context)
 */
export interface CartContextValue {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (subject: SubjectCardData, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<PromoCodeValidation>;
  removePromoCode: () => Promise<void>;
  validatePromoCode: (code: string) => Promise<PromoCodeValidation>;
  
  // Getters
  getItem: (subjectId: string) => CartItem | undefined;
  hasItem: (subjectId: string) => boolean;
  getCartSummary: () => CartSummary;
  
  // Checkout
  createOrder: (data: CreateOrderData) => Promise<CreateOrderResult>;
  processPayment: (data: PaymentData) => Promise<PaymentResult>;
}

/**
 * Options de checkout
 */
export interface CheckoutOptions {
  saveContact?: boolean;
  subscribeNewsletter?: boolean;
  acceptTerms: boolean;
}

/**
 * Étapes du checkout
 */
export type CheckoutStep = 'cart' | 'contact' | 'payment' | 'confirmation';

/**
 * État du checkout
 */
export interface CheckoutState {
  currentStep: CheckoutStep;
  contact?: ContactInfo;
  paymentMethod?: PaymentMethod;
  options?: CheckoutOptions;
  isProcessing: boolean;
  error?: string;
}

/**
 * Configuration du panier
 */
export interface CartConfig {
  maxQuantityPerItem: number;
  maxItems: number;
  allowDuplicates: boolean;
  syncWithBackend: boolean;
  persistLocally: boolean;
}

/**
 * Statistiques du panier (pour analytics)
 */
export interface CartStats {
  totalValue: number;
  averageItemPrice: number;
  mostExpensiveItem?: CartItem;
  leastExpensiveItem?: CartItem;
  addedToCartAt: string;
  lastUpdatedAt: string;
  timeInCart: number; // minutes
}

/**
 * Événement de panier (pour tracking)
 */
export interface CartEvent {
  type: 'add' | 'remove' | 'update' | 'clear' | 'checkout';
  timestamp: string;
  itemId?: string;
  subjectId?: string;
  quantity?: number;
  value?: number;
}

/**
 * Notification de panier
 */
export interface CartNotification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default Cart;