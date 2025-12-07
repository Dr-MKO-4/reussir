import { api } from './api';

/**
 * Service de gestion des commandes
 */

// ==================== TYPES ====================

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  promoCode?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  subjectId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CreateOrderData {
  items: Array<{
    subjectId: string;
    quantity: number;
  }>;
  promoCode?: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  paymentMethodId?: string;
}

export interface OrderHistory {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== SERVICE ====================

class OrderService {
  /**
   * Créer une nouvelle commande
   */
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post<Order>('/api/orders', orderData);
      return response;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'historique des commandes
   */
  async getOrders(page: number = 1, limit: number = 10): Promise<OrderHistory> {
    try {
      const response = await api.get<OrderHistory>(
        `/api/orders?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'une commande
   */
  async getOrderDetails(orderId: string): Promise<Order> {
    try {
      const response = await api.get<Order>(`/api/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  /**
   * Annuler une commande
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await api.post<Order>(`/api/orders/${orderId}/cancel`, {
        reason,
      });
      return response;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  /**
   * Demander un remboursement
   */
  async requestRefund(orderId: string, reason: string): Promise<Order> {
    try {
      const response = await api.post<Order>(`/api/orders/${orderId}/refund`, {
        reason,
      });
      return response;
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  }

  /**
   * Télécharger la facture
   */
  async downloadInvoice(orderId: string): Promise<void> {
    try {
      await api.download(`/api/orders/${orderId}/invoice`, `invoice-${orderId}.pdf`);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  /**
   * Obtenir le résumé d'une commande avant création
   */
  async getOrderSummary(items: Array<{ subjectId: string; quantity: number }>, promoCode?: string): Promise<{
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    items: OrderItem[];
  }> {
    try {
      const response = await api.post<{
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        items: OrderItem[];
      }>('/api/orders/summary', {
        items,
        promoCode,
      });
      return response;
    } catch (error) {
      console.error('Error fetching order summary:', error);
      throw error;
    }
  }

  /**
   * Vérifier le statut d'une commande
   */
  async checkOrderStatus(orderId: string): Promise<{
    status: Order['status'];
    paymentStatus: Order['paymentStatus'];
    updatedAt: string;
  }> {
    try {
      const response = await api.get<{
        status: Order['status'];
        paymentStatus: Order['paymentStatus'];
        updatedAt: string;
      }>(`/api/orders/${orderId}/status`);
      return response;
    } catch (error) {
      console.error('Error checking order status:', error);
      throw error;
    }
  }

  /**
   * Obtenir les statistiques des commandes
   */
  async getOrderStatistics(): Promise<{
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    try {
      const response = await api.get<{
        totalOrders: number;
        completedOrders: number;
        pendingOrders: number;
        cancelledOrders: number;
        totalSpent: number;
        averageOrderValue: number;
      }>('/api/orders/statistics');
      return response;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  }

  /**
   * Filtrer les commandes par statut
   */
  async getOrdersByStatus(
    status: Order['status'],
    page: number = 1,
    limit: number = 10
  ): Promise<OrderHistory> {
    try {
      const response = await api.get<OrderHistory>(
        `/api/orders?status=${status}&page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      throw error;
    }
  }

  /**
   * Rechercher des commandes
   */
  async searchOrders(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<OrderHistory> {
    try {
      const response = await api.get<OrderHistory>(
        `/api/orders/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }
}

export default new OrderService();