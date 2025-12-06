// ==================== TYPES ====================
interface HistoryItem {
  id: string;
  type: 'course_started' | 'course_completed' | 'test_taken' | 'purchase' | 'certificate_earned';
  title: string;
  description: string;
  timestamp: Date;
  courseId?: string;
  score?: number;
  details?: Record<string, any>;
}

interface CourseHistory {
  courseId: string;
  title: string;
  startDate: Date;
  completionDate?: Date;
  progress: number;
  lastAccessed: Date;
  sessionsCount: number;
  totalDuration: number; // en minutes
}

// ==================== HISTORY SERVICE ====================
class HistoryService {
  private static readonly STORAGE_KEY = 'reussir_history';
  private static readonly MAX_ITEMS = 1000;

  /**
   * Add an item to user's history
   */
  static addToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
    const history = this.getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    history.unshift(newItem);

    // Keep only the latest items
    if (history.length > this.MAX_ITEMS) {
      history.splice(this.MAX_ITEMS);
    }

    this.saveHistory(history);
    return newItem;
  }

  /**
   * Get all history items
   */
  static getHistory(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      return JSON.parse(stored).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Error retrieving history:', error);
      return [];
    }
  }

  /**
   * Get history items filtered by type
   */
  static getHistoryByType(type: HistoryItem['type']): HistoryItem[] {
    return this.getHistory().filter(item => item.type === type);
  }

  /**
   * Get history items for a specific date range
   */
  static getHistoryByDateRange(startDate: Date, endDate: Date): HistoryItem[] {
    return this.getHistory().filter(
      item =>
        item.timestamp >= startDate &&
        item.timestamp <= endDate
    );
  }

  /**
   * Get course history
   */
  static getCourseHistory(courseId: string): CourseHistory | null {
    const courseItems = this.getHistory().filter(
      item => item.courseId === courseId
    );

    if (courseItems.length === 0) return null;

    const startItem = courseItems[courseItems.length - 1];
    const endItem = courseItems.find(
      item => item.type === 'course_completed'
    );

    return {
      courseId,
      title: courseItems[0].title,
      startDate: new Date(startItem.timestamp),
      completionDate: endItem ? new Date(endItem.timestamp) : undefined,
      progress: courseItems[0].details?.progress || 0,
      lastAccessed: new Date(courseItems[0].timestamp),
      sessionsCount: courseItems.length,
      totalDuration: courseItems.reduce(
        (sum, item) => sum + (item.details?.duration || 0),
        0
      ),
    };
  }

  /**
   * Get learning statistics
   */
  static getLearningStats() {
    const history = this.getHistory();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    return {
      totalActivities: history.length,
      coursesStarted: history.filter(
        item => item.type === 'course_started'
      ).length,
      coursesCompleted: history.filter(
        item => item.type === 'course_completed'
      ).length,
      testsTaken: history.filter(
        item => item.type === 'test_taken'
      ).length,
      certificatesEarned: history.filter(
        item => item.type === 'certificate_earned'
      ).length,
      activitiesLast30Days: history.filter(
        item => new Date(item.timestamp) >= last30Days
      ).length,
      averageScore: this.calculateAverageScore(history),
    };
  }

  /**
   * Clear history
   */
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Delete a specific history item
   */
  static deleteHistoryItem(id: string): void {
    const history = this.getHistory().filter(item => item.id !== id);
    this.saveHistory(history);
  }

  /**
   * Export history as JSON
   */
  static exportHistory(): string {
    return JSON.stringify(this.getHistory(), null, 2);
  }

  // ==================== PRIVATE METHODS ====================
  private static saveHistory(history: HistoryItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  private static calculateAverageScore(history: HistoryItem[]): number {
    const testItems = history.filter(item => item.type === 'test_taken' && item.score);
    if (testItems.length === 0) return 0;

    const totalScore = testItems.reduce((sum, item) => sum + (item.score || 0), 0);
    return Math.round(totalScore / testItems.length);
  }
}

export default HistoryService;
