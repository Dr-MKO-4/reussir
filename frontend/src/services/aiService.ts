import api from './api';

// ==================== TYPES ====================
interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // in days
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: StudyModule[];
  estimatedTime: number; // in hours
  successProbability: number; // 0-100
}

interface StudyModule {
  id: string;
  title: string;
  topics: string[];
  estimatedDays: number;
  assessments: Assessment[];
}

interface Assessment {
  id: string;
  title: string;
  type: 'quiz' | 'exercise' | 'project';
  difficulty: number; // 1-5
  estimatedTime: number; // in minutes
}

interface SuccessPrediction {
  probability: number; // 0-100
  factors: PredictionFactor[];
  recommendations: string[];
  estimatedCompletionDate: Date;
}

interface PredictionFactor {
  name: string;
  impact: number; // -100 to +100
  description: string;
}

interface AIRecommendation {
  type: 'course' | 'exercise' | 'study_plan' | 'mentor';
  title: string;
  description: string;
  relevanceScore: number; // 0-100
  reason: string;
}

// ==================== AI SERVICE ====================
class AIService {
  /**
   * Generate personalized study plan based on user profile
   */
  static async generateStudyPlan(
    courseId: string,
    userLevel: string,
    availableHours: number
  ): Promise<StudyPlan> {
    try {
      const response = await api.post('/ai/study-plan', {
        courseId,
        userLevel,
        availableHours,
      });

      return response.data;
    } catch (error) {
      console.error('Error generating study plan:', error);
      throw error;
    }
  }

  /**
   * Predict success probability for a course
   */
  static async predictSuccess(courseId: string): Promise<SuccessPrediction> {
    try {
      const response = await api.post('/ai/predict-success', {
        courseId,
      });

      return {
        ...response.data,
        estimatedCompletionDate: new Date(response.data.estimatedCompletionDate),
      };
    } catch (error) {
      console.error('Error predicting success:', error);
      // Return mock data for demo
      return {
        probability: Math.floor(Math.random() * 40 + 60),
        factors: [
          {
            name: 'Learning Consistency',
            impact: 25,
            description: 'You have consistent study habits',
          },
          {
            name: 'Course Difficulty',
            impact: -15,
            description: 'This course is intermediate level',
          },
          {
            name: 'Performance History',
            impact: 20,
            description: 'Your past performance is strong',
          },
        ],
        recommendations: [
          'Study for at least 30 minutes daily',
          'Complete practice exercises regularly',
          'Join study groups for peer learning',
        ],
        estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
    }
  }

  /**
   * Get AI-powered recommendations
   */
  static async getRecommendations(userId: string): Promise<AIRecommendation[]> {
    try {
      const response = await api.get(`/ai/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Return mock data for demo
      return [
        {
          type: 'course',
          title: 'Advanced JavaScript',
          description: 'Based on your Python skills',
          relevanceScore: 92,
          reason: 'You have strong programming fundamentals',
        },
        {
          type: 'exercise',
          title: 'Daily Coding Challenge',
          description: 'Improve problem-solving skills',
          relevanceScore: 85,
          reason: 'Recommended for your level',
        },
        {
          type: 'mentor',
          title: 'Connect with Sarah',
          description: 'Expert in your learning area',
          relevanceScore: 78,
          reason: 'Similar learning goals',
        },
      ];
    }
  }

  /**
   * Analyze learning style
   */
  static async analyzeLearningStyle(quizAnswers: Record<string, any>): Promise<{
    style: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
    characteristics: string[];
    recommendations: string[];
  }> {
    try {
      const response = await api.post('/ai/analyze-learning-style', {
        answers: quizAnswers,
      });

      return response.data;
    } catch (error) {
      console.error('Error analyzing learning style:', error);
      throw error;
    }
  }

  /**
   * Get personalized study tips
   */
  static async getStudyTips(topic: string, difficulty: number): Promise<string[]> {
    try {
      const response = await api.get('/ai/study-tips', {
        params: { topic, difficulty },
      });

      return response.data.tips;
    } catch (error) {
      console.error('Error fetching study tips:', error);
      return [
        'Break down the topic into smaller concepts',
        'Use active recall to test your knowledge',
        'Teach the concept to someone else',
        'Create mind maps to visualize relationships',
        'Practice with real-world examples',
      ];
    }
  }

  /**
   * Generate adaptive quiz based on performance
   */
  static async generateAdaptiveQuiz(
    courseId: string,
    previousScore: number
  ): Promise<any[]> {
    try {
      const response = await api.post('/ai/adaptive-quiz', {
        courseId,
        previousScore,
      });

      return response.data.questions;
    } catch (error) {
      console.error('Error generating adaptive quiz:', error);
      throw error;
    }
  }

  /**
   * Get content recommendations based on learning patterns
   */
  static async getContentRecommendations(userId: string): Promise<{
    nextTopic: string;
    reviewTopics: string[];
    challengingTopics: string[];
  }> {
    try {
      const response = await api.get(`/ai/content-recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching content recommendations:', error);
      return {
        nextTopic: 'Advanced Functions',
        reviewTopics: ['Variables', 'Data Types'],
        challengingTopics: ['Closures', 'Async Programming'],
      };
    }
  }

  /**
   * Analyze performance and provide insights
   */
  static async analyzePerformance(userId: string): Promise<{
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    actionItems: string[];
  }> {
    try {
      const response = await api.get(`/ai/performance-analysis/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return {
        overallScore: 78,
        strengths: ['Problem-solving', 'Consistency', 'Collaboration'],
        weaknesses: ['Time management', 'Advanced concepts'],
        actionItems: [
          'Practice daily for 45 minutes',
          'Focus on advanced modules',
          'Join study groups',
        ],
      };
    }
  }

  /**
   * Get AI chat response for learning assistance
   */
  static async getChatResponse(
    message: string,
    context?: { courseId: string; topicId: string }
  ): Promise<string> {
    try {
      const response = await api.post('/ai/chat', {
        message,
        context,
      });

      return response.data.response;
    } catch (error) {
      console.error('Error getting chat response:', error);
      return 'I apologize, I could not process your request. Please try again later.';
    }
  }
}

export default AIService;
