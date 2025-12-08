import api from './api';

// ==================== TYPES ====================
interface PageView {
  page: string;
  timestamp: number;
  duration: number;
}

interface UserEvent {
  eventName: string;
  eventData: Record<string, any>;
  timestamp: number;
}

interface ConversionFunnel {
  step: string;
  count: number;
  conversionRate: number;
}

interface UserSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  userCount: number;
}

interface Analytics {
  pageViews: PageView[];
  events: UserEvent[];
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
}

// ==================== ANALYTICS SERVICE ====================
class AnalyticsService {
  private static sessionStart = Date.now();
  private static pageViews: PageView[] = [];
  private static events: UserEvent[] = [];
  private static currentPage = '';
  private static currentPageStart = Date.now();

  /**
   * Track page view
   */
  static trackPageView(page: string): void {
    if (this.currentPage) {
      const duration = Date.now() - this.currentPageStart;
      this.pageViews.push({
        page: this.currentPage,
        timestamp: this.currentPageStart,
        duration,
      });
    }

    this.currentPage = page;
    this.currentPageStart = Date.now();

    // Send to backend
    this.sendEvent('page_view', { page });
  }

  /**
   * Track custom event
   */
  static trackEvent(eventName: string, eventData: Record<string, any> = {}): void {
    this.events.push({
      eventName,
      eventData,
      timestamp: Date.now(),
    });

    this.sendEvent(eventName, eventData);
  }

  /**
   * Track course interaction
   */
  static trackCourseInteraction(courseId: string, action: string, details?: Record<string, any>): void {
    this.trackEvent('course_interaction', {
      courseId,
      action,
      ...details,
    });
  }

  /**
   * Track video engagement
   */
  static trackVideoEngagement(
    videoId: string,
    action: 'play' | 'pause' | 'seek' | 'complete',
    currentTime?: number,
    duration?: number
  ): void {
    this.trackEvent('video_engagement', {
      videoId,
      action,
      currentTime,
      duration,
      percentComplete: duration ? Math.round((currentTime || 0) / duration * 100) : 0,
    });
  }

  /**
   * Track search query
   */
  static trackSearch(query: string, resultsCount: number): void {
    this.trackEvent('search', {
      query,
      resultsCount,
      timestamp: Date.now(),
    });
  }

  /**
   * Track purchase
   */
  static trackPurchase(amount: number, currency: string, items: Array<{ id: string; quantity: number }>): void {
    this.trackEvent('purchase', {
      amount,
      currency,
      items,
      timestamp: Date.now(),
    });
  }

  /**
   * Get session analytics
   */
  static getSessionAnalytics(): Analytics {
    const sessionDuration = Math.round((Date.now() - this.sessionStart) / 1000 / 60); // in minutes

    return {
      pageViews: this.pageViews,
      events: this.events,
      sessionDuration,
      bounceRate: this.calculateBounceRate(),
      conversionRate: this.calculateConversionRate(),
    };
  }

  /**
   * Get conversion funnel
   */
  static getConversionFunnel(steps: string[]): ConversionFunnel[] {
    const eventCounts = this.events.reduce(
      (acc, event) => {
        acc[event.eventName] = (acc[event.eventName] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    let previousCount = this.pageViews.length;

    return steps.map(step => {
      const count = eventCounts[step] || 0;
      const conversionRate = previousCount > 0 ? Math.round((count / previousCount) * 100) : 0;
      previousCount = count;

      return {
        step,
        count,
        conversionRate,
      };
    });
  }

  /**
   * Get user segments (mock)
   */
  static getUserSegments(): UserSegment[] {
    return [
      {
        id: 'segment_1',
        name: 'Active Learners',
        criteria: { sessionsPerWeek: { $gte: 3 }, courseCompleted: { $gte: 1 } },
        userCount: 12450,
      },
      {
        id: 'segment_2',
        name: 'Casual Users',
        criteria: { sessionsPerWeek: { $lt: 3 }, courseStarted: true },
        userCount: 8320,
      },
      {
        id: 'segment_3',
        name: 'Premium Subscribers',
        criteria: { subscriptionTier: 'premium' },
        userCount: 3290,
      },
    ];
  }

  /**
   * Track user property
   */
  static setUserProperty(propertyName: string, value: any): void {
    this.trackEvent('set_user_property', {
      propertyName,
      value,
    });
  }

  /**
   * Clear analytics data
   */
  static clearAnalytics(): void {
    this.pageViews = [];
    this.events = [];
    this.sessionStart = Date.now();
    this.currentPage = '';
    this.currentPageStart = Date.now();
  }

  // ==================== PRIVATE METHODS ====================
  private static calculateBounceRate(): number {
    if (this.pageViews.length === 0) return 0;
    const bounceCount = this.pageViews.filter(pv => pv.duration < 10000).length;
    return Math.round((bounceCount / this.pageViews.length) * 100);
  }

  private static calculateConversionRate(): number {
    const purchaseEvents = this.events.filter(e => e.eventName === 'purchase');
    if (this.pageViews.length === 0) return 0;
    return Math.round((purchaseEvents.length / this.pageViews.length) * 100);
  }

  private static async sendEvent(eventName: string, eventData: Record<string, any>): Promise<void> {
    try {
      await api.post('/api/analytics/track', {
        eventName,
        eventData,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sending analytics event:', error);
    }
  }
}

export default AnalyticsService;
