import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  StatsCard  from './StatsCard';
import  RecentActivity  from './RecentActivity';
import  StudyProgress  from './StudyProgress';
import PerformanceChart from './PerformanceChart';
import  UpcomingExams  from './UpcomingExams';
import  RecommendationWidget  from './RecommendationWidget';
import AchievementBadges from './AchievementBadges';
import  StudyStreak  from './StudyStreak';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import './Dashboard.css';

interface UserStats {
  totalSubjects: number;
  completedSubjects: number;
  averageScore: number;
  studyStreak: number;
  totalStudyTime: number;
  rankPosition: number;
}

interface Activity {
  id: string;
  type: 'study' | 'purchase' | 'achievement' | 'exam';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  prepared: number;
  subjects: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  locked?: boolean;
}

interface Recommendation {
  id: string;
  type: 'subject' | 'bundle' | 'practice';
  title: string;
  description: string;
  image: string;
  reason: string;
  confidence: number;
}

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalSubjects: 0,
    completedSubjects: 0,
    averageScore: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    rankPosition: 0,
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Statistiques mockées
      setStats({
        totalSubjects: 47,
        completedSubjects: 32,
        averageScore: 15.8,
        studyStreak: 12,
        totalStudyTime: 156, // heures
        rankPosition: 23,
      });

      // Activités récentes
      setRecentActivities([
        {
          id: '1',
          type: 'study',
          title: 'Session d\'étude terminée',
          description: 'Mathématiques - Bac 2024 (2h 15min)',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          icon: '📚',
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Nouveau badge débloqué !',
          description: 'Série de 10 jours consécutifs',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          icon: '🏆',
        },
        {
          id: '3',
          type: 'purchase',
          title: 'Nouvel achat',
          description: 'Pack Physique-Chimie 2024',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          icon: '🛒',
        },
        {
          id: '4',
          type: 'exam',
          title: 'Simulation d\'examen',
          description: 'Score: 16/20 en Mathématiques',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          icon: '📝',
        },
      ]);

      // Examens à venir
      setUpcomingExams([
        {
          id: '1',
          name: 'Baccalauréat 2025',
          date: '2025-06-15',
          daysLeft: 212,
          prepared: 68,
          subjects: ['Mathématiques', 'Physique', 'Chimie', 'SVT', 'Français'],
        },
        {
          id: '2',
          name: 'Probatoire 2025',
          date: '2025-05-20',
          daysLeft: 186,
          prepared: 52,
          subjects: ['Mathématiques', 'Physique', 'Français', 'Anglais'],
        },
      ]);

      // Achievements
      setAchievements([
        {
          id: '1',
          title: 'Premier pas',
          description: 'Complétez votre premier sujet',
          icon: '🎯',
          unlockedAt: '2024-09-15',
        },
        {
          id: '2',
          title: 'Série de feu',
          description: '10 jours consécutifs d\'étude',
          icon: '🔥',
          unlockedAt: '2024-11-10',
        },
        {
          id: '3',
          title: 'Expert',
          description: 'Moyenne de 16/20 sur 10 sujets',
          icon: '⭐',
          progress: 70,
        },
        {
          id: '4',
          title: 'Marathonien',
          description: '100 heures d\'étude totales',
          icon: '🏃',
          unlockedAt: '2024-11-01',
        },
        {
          id: '5',
          title: 'Perfectionniste',
          description: 'Obtenez 20/20 à un sujet',
          icon: '💯',
          locked: true,
        },
        {
          id: '6',
          title: 'Collectionneur',
          description: 'Complétez 50 sujets',
          icon: '📚',
          progress: 64,
        },
      ]);

      // Recommandations IA
      setRecommendations([
        {
          id: '1',
          type: 'subject',
          title: 'Mathématiques - Trigonométrie Avancée',
          description: 'Basé sur vos performances récentes, ce sujet vous aidera à combler vos lacunes',
          image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
          reason: 'Recommandé suite à vos difficultés en trigonométrie',
          confidence: 92,
        },
        {
          id: '2',
          type: 'bundle',
          title: 'Pack Révision Bac C Complet',
          description: 'Économisez 25% sur ce pack complet de préparation',
          image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop',
          reason: 'Pack optimal pour votre niveau et vos objectifs',
          confidence: 88,
        },
        {
          id: '3',
          type: 'practice',
          title: 'Quiz Interactif - Chimie Organique',
          description: '50 questions pour tester vos connaissances',
          image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
          reason: 'Vous n\'avez pas pratiqué la chimie depuis 2 semaines',
          confidence: 85,
        },
      ]);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="user-dashboard-loading">
        <Spinner size="xl" label="Chargement de votre tableau de bord..." />
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Hero Section with Wave Background */}
      <div className="dashboard-hero">
        <div className="hero-background">
          <svg className="hero-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="url(#gradient)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Bonjour, Champion ! 👋</h1>
            <p className="hero-subtitle">Prêt à exceller aujourd'hui ?</p>
          </div>
          <div className="hero-actions">
            <Button variant="primary" size="lg" onClick={() => navigate('/discover')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Découvrir des sujets
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/ai-assistant')}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Assistant IA
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <StatsCard
          icon="📚"
          label="Sujets étudiés"
          value={stats.totalSubjects}
          trend={12}
          color="primary"
        />
        <StatsCard
          icon="✅"
          label="Complétés"
          value={stats.completedSubjects}
          progress={(stats.completedSubjects / stats.totalSubjects) * 100}
          color="success"
        />
        <StatsCard
          icon="⭐"
          label="Moyenne"
          value={`${stats.averageScore}/20`}
          trend={0.3}
          color="warning"
        />
        <StatsCard
          icon="🔥"
          label="Série actuelle"
          value={`${stats.studyStreak} jours`}
          color="danger"
        />
        <StatsCard
          icon="⏱️"
          label="Temps d'étude"
          value={`${stats.totalStudyTime}h`}
          color="info"
        />
        <StatsCard
          icon="🏆"
          label="Classement"
          value={`#${stats.rankPosition}`}
          trend={-5}
          color="purple"
        />
      </div>

      {/* Study Streak Widget */}
      <StudyStreak currentStreak={stats.studyStreak} bestStreak={18} />

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          <StudyProgress subjects={stats.totalSubjects} completed={stats.completedSubjects} />
          <PerformanceChart />
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          <UpcomingExams exams={upcomingExams} />
          <AchievementBadges achievements={achievements} />
          <RecommendationWidget recommendations={recommendations} />
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="dashboard-cta">
        <div className="cta-content">
          <div className="cta-text">
            <h3>Prêt pour votre prochain défi ?</h3>
            <p>Découvrez nos nouveaux sujets et continuez à progresser</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate('/discover')}>
            Explorer maintenant
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;