import api from './api';

// ==================== TYPES ====================
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  data?: Record<string, any>;
}

interface NotificationPreferences {
  email: {
    courseUpdates: boolean;
    newMessages: boolean;
    promotions: boolean;
    weeklyDigest: boolean;
  };
  push: {
    courseUpdates: boolean;
    newMessages: boolean;
    reminders: boolean;
  };
  inApp: {
    all: boolean;
  };
}

// ==================== NOTIFICATION SERVICE ====================
class NotificationService {
  private static readonly STORAGE_KEY = 'reussir_notifications';
  private static readonly PREFERENCES_KEY = 'reussir_notification_preferences';
  private static listeners: Set<(notifications: Notification[]) => void> = new Set();

  /**
   * Send a notification
   */
  static async sendNotification(
    type: Notification['type'],
    title: string,
    message: string,
    options?: { actionUrl?: string; data?: Record<string, any> }
  ): Promise<Notification> {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
      read: false,
      timestamp: new Date(),
      ...options,
    };

    const notifications = this.getNotifications();
    notifications.unshift(notification);
    this.saveNotifications(notifications);

    // Notify listeners
    this.notifyListeners(notifications);

    // Send to backend if user is authenticated
    try {
      await api.post('/notifications', { notification });
    } catch (error) {
      console.error('Error sending notification to backend:', error);
    }

    return notification;
  }

  /**
   * Get all notifications
   */
  static getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      return JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    } catch (error) {
      console.error('Error retrieving notifications:', error);
      return [];
    }
  }

  /**
   * Get unread notifications count
   */
  static getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  /**
   * Mark notification as read
   */
  static markAsRead(id: string): void {
    const notifications = this.getNotifications().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications(notifications);
    this.notifyListeners(notifications);
  }

  /**
   * Mark all notifications as read
   */
  static markAllAsRead(): void {
    const notifications = this.getNotifications().map(n => ({
      ...n,
      read: true,
    }));
    this.saveNotifications(notifications);
    this.notifyListeners(notifications);
  }

  /**
   * Delete notification
   */
  static deleteNotification(id: string): void {
    const notifications = this.getNotifications().filter(n => n.id !== id);
    this.saveNotifications(notifications);
    this.notifyListeners(notifications);
  }

  /**
   * Delete all notifications
   */
  static deleteAllNotifications(): void {
    this.saveNotifications([]);
    this.notifyListeners([]);
  }

  /**
   * Get notification preferences
   */
  static getPreferences(): NotificationPreferences {
    try {
      const stored = localStorage.getItem(this.PREFERENCES_KEY);
      if (!stored) {
        return this.getDefaultPreferences();
      }
      return JSON.parse(stored);
    } catch (error) {
      return this.getDefaultPreferences();
    }
  }

  /**
   * Update notification preferences
   */
  static updatePreferences(preferences: Partial<NotificationPreferences>): void {
    const current = this.getPreferences();
    const updated = {
      ...current,
      ...preferences,
    };

    try {
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(updated));
      // Sync with backend
      api.put('/notifications/preferences', updated).catch(error =>
        console.error('Error updating preferences:', error)
      );
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  /**
   * Send push notification (if supported)
   */
  static async sendPushNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, options);
      }
    }
  }

  /**
   * Subscribe to notification changes
   */
  static subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // ==================== PRIVATE METHODS ====================
  private static saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  private static notifyListeners(notifications: Notification[]): void {
    this.listeners.forEach(listener => listener(notifications));
  }

  private static getDefaultPreferences(): NotificationPreferences {
    return {
      email: {
        courseUpdates: true,
        newMessages: true,
        promotions: false,
        weeklyDigest: true,
      },
      push: {
        courseUpdates: true,
        newMessages: true,
        reminders: true,
      },
      inApp: {
        all: true,
      },
    };
  }
}

export default NotificationService;
