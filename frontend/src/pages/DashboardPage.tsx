import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { useAuth } from '../hooks/useAuth';
import './DashboardPage.css';
import SubjectFilters, { FilterOptions } from '../components/catalog/SubjectFilters';
import SearchBar from '../components/common/SearchBar';

interface DashboardStats {
  totalSubjects: number;
  completedSubjects: number;
  averageScore: number;
  studyStreak: number;
}

interface RecentSubject {
  id: string;
  title: string;
  progress: number;
  lastAccessed: string;
}

interface UpcomingExam {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  prepared: number;
}

/**
 * Page du tableau de bord utilisateur
 */
const DashboardPage: React.FC = () => {
  // État pour la recherche et les filtres avancés
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Callback pour la SearchBar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Lancer la recherche avancée ou filtrer les données du dashboard
  };

  // Callback pour les filtres
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // TODO: Appliquer les filtres sur les données du dashboard
  };
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    completedSubjects: 0,
    averageScore: 0,
    studyStreak: 0,
  });
  const [recentSubjects, setRecentSubjects] = useState<RecentSubject[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simulation de chargement des données
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Données mockées
      setStats({
        totalSubjects: 24,
        completedSubjects: 18,
        averageScore: 14.5,
        studyStreak: 7,
      });

      setRecentSubjects([
        {
          id: '1',
          title: 'Mathématiques - Bac 2024',
          progress: 75,
          lastAccessed: '2024-11-10',
        },
        {
          id: '2',
          title: 'Physique - Bac 2024',
          progress: 50,
          lastAccessed: '2024-11-09',
        },
        {
          id: '3',
          title: 'Chimie - Bac 2024',
          progress: 30,
          lastAccessed: '2024-11-08',
        },
      ]);

      setUpcomingExams([
        {
          id: '1',
          name: 'Baccalauréat 2025',
          date: '2025-06-15',
          daysLeft: 215,
          prepared: 65,
        },
        {
          id: '2',
          name: 'Probatoire 2025',
          date: '2025-05-20',
          daysLeft: 189,
          prepared: 45,
        },
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="dashboard-loading">
          <Spinner size="xl" label="Chargement du tableau de bord..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-page">
        {/* Barre de recherche avancée */}
        <div className="dashboard-searchbar">
          <SearchBar
            placeholder="Rechercher dans le dashboard..."
            value={searchQuery}
            onSearch={handleSearch}
            onChange={setSearchQuery}
            size="md"
            fullWidth
          />
        </div>

        {/* Sidebar de filtres avancés */}
        <div className="dashboard-filters">
          <SubjectFilters onFiltersChange={handleFiltersChange} />
        </div>
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Bonjour, {user?.firstName || 'Étudiant'} 👋
            </h1>
            <p className="dashboard-subtitle">
              Voici un aperçu de votre progression
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/discover')}
            leftIcon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          >
            Explorer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <Card variant="outlined" className="stat-card stat-card-primary">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Sujets étudiés</p>
              <p className="stat-value">{stats.totalSubjects}</p>
            </div>
          </Card>

          <Card variant="outlined" className="stat-card stat-card-success">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Sujets complétés</p>
              <p className="stat-value">{stats.completedSubjects}</p>
            </div>
          </Card>

          <Card variant="outlined" className="stat-card stat-card-warning">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Moyenne</p>
              <p className="stat-value">{stats.averageScore}/20</p>
            </div>
          </Card>

          <Card variant="outlined" className="stat-card stat-card-info">
            <div className="stat-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Série actuelle</p>
              <p className="stat-value">{stats.studyStreak} jours 🔥</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Recent Subjects */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Sujets récents</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/subjects')}
              >
                Voir tout
              </Button>
            </div>

            <div className="recent-subjects">
              {recentSubjects.map((subject) => (
                <Card
                  key={subject.id}
                  variant="outlined"
                  isHoverable
                  className="recent-subject-card"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  <div className="recent-subject-header">
                    <h3 className="recent-subject-title">{subject.title}</h3>
                    <Badge variant="neutral">{subject.progress}%</Badge>
                  </div>
                  
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>

                  <p className="recent-subject-date">
                    Dernière ouverture : {new Date(subject.lastAccessed).toLocaleDateString('fr-FR')}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Examens à venir</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/planner')}
              >
                Planifier
              </Button>
            </div>

            <div className="upcoming-exams">
              {upcomingExams.map((exam) => (
                <Card
                  key={exam.id}
                  variant="outlined"
                  className="exam-card"
                >
                  <div className="exam-header">
                    <h3 className="exam-name">{exam.name}</h3>
                    <Badge 
                      variant={exam.daysLeft < 30 ? 'danger' : 'primary'}
                    >
                      {exam.daysLeft} jours
                    </Badge>
                  </div>

                  <p className="exam-date">
                    <svg className="exam-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(exam.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>

                  <div className="exam-preparation">
                    <div className="prep-label">
                      <span>Préparation</span>
                      <span className="prep-percentage">{exam.prepared}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill progress-fill-success"
                        style={{ width: `${exam.prepared}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card variant="outlined" className="quick-actions-card">
          <h2 className="quick-actions-title">Actions rapides</h2>
          <div className="quick-actions-grid">
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/ai-assistant')}
            >
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Assistant IA</span>
            </button>

            <button 
              className="quick-action-btn"
              onClick={() => navigate('/favorites')}
            >
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Favoris</span>
            </button>

            <button 
              className="quick-action-btn"
              onClick={() => navigate('/history')}
            >
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Historique</span>
            </button>

            <button 
              className="quick-action-btn"
              onClick={() => navigate('/analytics')}
            >
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Statistiques</span>
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;