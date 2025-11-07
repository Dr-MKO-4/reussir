import { useCartContext } from '../contexts/CartContext';
import { SubjectCardData } from '../types/catalog';
import { CartItem } from '../types/cart';

/**
 * Hook personnalisé pour accéder au contexte du panier
 * Fournit des utilitaires et raccourcis pour gérer le panier
 */
export const useCart = () => {
  const context = useCartContext();

  /**
   * Vérifier si le panier est vide
   */
  const isEmpty = (): boolean => {
    return context.cart.items.length === 0;
  };

  /**
   * Obtenir le nombre total d'items
   */
  const getItemsCount = (): number => {
    return context.cart.itemsCount;
  };

  /**
   * Obtenir le total du panier
   */
  const getTotal = (): number => {
    return context.cart.total;
  };

  /**
   * Obtenir le sous-total du panier
   */
  const getSubtotal = (): number => {
    return context.cart.subtotal;
  };

  /**
   * Obtenir la réduction totale
   */
  const getDiscount = (): number => {
    return context.cart.discount;
  };

  /**
   * Vérifier si un code promo est appliqué
   */
  const hasPromoCode = (): boolean => {
    return !!context.cart.promoCode;
  };

  /**
   * Obtenir le code promo appliqué
   */
  const getPromoCode = (): string | null => {
    return context.cart.promoCode?.code || null;
  };

  /**
   * Obtenir la quantité d'un sujet spécifique
   */
  const getItemQuantity = (subjectId: string): number => {
    const item = context.getItem(subjectId);
    return item?.quantity || 0;
  };

  /**
   * Obtenir le prix total d'un item (prix * quantité)
   */
  const getItemTotal = (itemId: string): number => {
    const item = context.cart.items.find((i) => i.id === itemId);
    return item ? item.price * item.quantity : 0;
  };

  /**
   * Incrémenter la quantité d'un item
   */
  const incrementQuantity = async (itemId: string): Promise<void> => {
    const item = context.cart.items.find((i) => i.id === itemId);
    if (item) {
      await context.updateQuantity(itemId, item.quantity + 1);
    }
  };

  /**
   * Décrémenter la quantité d'un item
   */
  const decrementQuantity = async (itemId: string): Promise<void> => {
    const item = context.cart.items.find((i) => i.id === itemId);
    if (item && item.quantity > 1) {
      await context.updateQuantity(itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      // Si quantité = 1, supprimer l'item
      await context.removeItem(itemId);
    }
  };

  /**
   * Ajouter ou mettre à jour un item (toggle)
   */
  const toggleItem = async (subject: SubjectCardData): Promise<void> => {
    if (context.hasItem(subject.id)) {
      // Si déjà dans le panier, le retirer
      const item = context.getItem(subject.id);
      if (item) {
        await context.removeItem(item.id);
      }
    } else {
      // Sinon, l'ajouter
      await context.addItem(subject);
    }
  };

  /**
   * Obtenir le pourcentage de réduction
   */
  const getDiscountPercentage = (): number => {
    if (context.cart.subtotal === 0) return 0;
    return (context.cart.discount / context.cart.subtotal) * 100;
  };

  /**
   * Formater un montant dans la devise du panier
   */
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: context.cart.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Obtenir tous les sujets du panier (sans les infos de quantité)
   */
  const getSubjects = (): SubjectCardData[] => {
    return context.cart.items.map((item) => item.subject);
  };

  /**
   * Obtenir les IDs de tous les sujets
   */
  const getSubjectIds = (): string[] => {
    return context.cart.items.map((item) => item.subject.id);
  };

  /**
   * Calculer l'économie totale (originalPrice - price)
   */
  const getTotalSavings = (): number => {
    return context.cart.items.reduce((total, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        const itemSavings = (item.originalPrice - item.price) * item.quantity;
        return total + itemSavings;
      }
      return total;
    }, 0);
  };

  /**
   * Obtenir le nombre de sujets différents (pas la quantité totale)
   */
  const getUniqueItemsCount = (): number => {
    return context.cart.items.length;
  };

  /**
   * Vérifier si le panier contient des items gratuits uniquement
   */
  const isFreeCart = (): boolean => {
    if (isEmpty()) return false;
    return context.cart.items.every((item) => item.subject.isFree);
  };

  /**
   * Vérifier si le panier contient au moins un item premium
   */
  const hasPremiumItems = (): boolean => {
    return context.cart.items.some((item) => item.subject.isPremium);
  };

  /**
   * Obtenir le sujet le plus cher du panier
   */
  const getMostExpensiveItem = (): CartItem | null => {
    if (isEmpty()) return null;
    
    return context.cart.items.reduce((max, item) => {
      return item.price > max.price ? item : max;
    });
  };

  /**
   * Obtenir le sujet le moins cher du panier
   */
  const getLeastExpensiveItem = (): CartItem | null => {
    if (isEmpty()) return null;
    
    return context.cart.items.reduce((min, item) => {
      return item.price < min.price ? item : min;
    });
  };

  /**
   * Obtenir les sujets groupés par matière
   */
  const getItemsBySubject = (): Record<string, CartItem[]> => {
    return context.cart.items.reduce((acc, item) => {
      const subject = item.subject.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  };

  /**
   * Obtenir les sujets groupés par examen
   */
  const getItemsByExam = (): Record<string, CartItem[]> => {
    return context.cart.items.reduce((acc, item) => {
      const exam = item.subject.exam;
      if (!acc[exam]) {
        acc[exam] = [];
      }
      acc[exam].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);
  };

  /**
   * Obtenir le prix moyen des items
   */
  const getAveragePrice = (): number => {
    if (isEmpty()) return 0;
    const total = context.cart.items.reduce((sum, item) => sum + item.price, 0);
    return total / context.cart.items.length;
  };

  /**
   * Vérifier si le panier atteint un montant minimum
   */
  const meetsMinimumAmount = (minAmount: number): boolean => {
    return context.cart.total >= minAmount;
  };

  /**
   * Obtenir le montant manquant pour atteindre un seuil
   */
  const getAmountToReachMinimum = (minAmount: number): number => {
    const remaining = minAmount - context.cart.total;
    return remaining > 0 ? remaining : 0;
  };

  return {
    // État du contexte
    ...context,

    // Utilitaires de vérification
    isEmpty,
    hasPromoCode,
    isFreeCart,
    hasPremiumItems,
    meetsMinimumAmount,

    // Utilitaires de calcul
    getItemsCount,
    getUniqueItemsCount,
    getTotal,
    getSubtotal,
    getDiscount,
    getDiscountPercentage,
    getTotalSavings,
    getAveragePrice,
    getAmountToReachMinimum,

    // Utilitaires d'items
    getItemQuantity,
    getItemTotal,
    getMostExpensiveItem,
    getLeastExpensiveItem,

    // Actions sur quantité
    incrementQuantity,
    decrementQuantity,
    toggleItem,

    // Utilitaires de récupération
    getPromoCode,
    getSubjects,
    getSubjectIds,
    getItemsBySubject,
    getItemsByExam,

    // Utilitaires de formatage
    formatPrice,
  };
};

export default useCart;