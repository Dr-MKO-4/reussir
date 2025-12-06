interface DashboardStats {
    totalSubjects: number;
    totalSpent: number;
    averageScore: number;
    studyTime: number;
  }
  
  interface RecentActivity {
    type: 'view' | 'purchase' | 'favorite';
    subject: Subject;
    timestamp: Date;
  }