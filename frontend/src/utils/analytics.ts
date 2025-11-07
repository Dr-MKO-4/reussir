// Tracking événements
  trackPageView(path: string): void
  trackEvent(category: string, action: string): void
  trackPurchase(items: CartItem[], total: number): void