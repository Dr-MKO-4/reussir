interface AIRecommendation {
    subject: Subject;
    score: number;
    reason: string;
  }
  
  interface SuccessPrediction {
    subject: Subject;
    probability: number;
    factors: string[];
  }
  
  interface StudyPlan {
    id: string;
    subjects: Subject[];
    duration: number;
    goals: string[];
    schedule: ScheduleItem[];
  }