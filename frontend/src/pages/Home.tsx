import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import catalogService from '@services/catalogService';
import Button from '@components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import Spinner from '@components/common/Spinner';
import { 
  Search, 
  TrendingUp, 
  BookOpen, 
  Award,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [popularSubjects, setPopularSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les sujets populaires et catégories
      const [subjectsRes, categoriesRes] = await Promise.all([
        catalogService.getPopularSubjects(6),
        catalogService.getCategories()
      ]);
      
      if (subjectsRes?.data) {
        setPopularSubjects(subjectsRes.data);
      }
      
      if (categoriesRes?.data) {
        setCategories(categoriesRes.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: BookOpen, value: '10,000+', label: 'Sujets disponibles' },
    { icon: Users, value: '50,000+', label: 'Étudiants actifs' },
    { icon: Award, value: '95%', label: 'Taux de réussite' },
    { icon: CheckCircle, value: '100+', label: 'Concours couverts' }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'IA Personnalisée',
      description: 'Recommandations adaptées à votre niveau et vos objectifs'
    },
    {
      icon: TrendingUp,
      title: 'Analyse de Progression',
      description: 'Suivez vos performances en temps réel avec des graphiques'
    },
    {
      icon: Award,
      title: 'Prédiction de Réussite',
      description: 'L\'IA estime vos chances de réussir chaque sujet'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Propulsé par l'Intelligence Artificielle</span>
          </div>
          
          <h1 className="hero-title">
            Réussissez vos{' '}
            <span className="hero-title-gradient">examens</span>
            {' '}avec l'IA
          </h1>
          
          <p className="hero-description">
            Accédez à des milliers de sujets d'examens et concours avec des
            recommandations personnalisées par intelligence artificielle.
          </p>
          
          <div className="hero-actions">
            <Link to="/discover">
              <Button variant="primary" size="lg" icon={<Search size={20} />}>
                Découvrir les sujets
              </Button>
            </Link>
            
            {!isAuthenticated && (
              <Link to="/signup">
                <Button variant="secondary" size="lg">
                  Créer un compte gratuit
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <BookOpen size={120} className="hero-icon" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Pourquoi nous choisir ?</h2>
          <p className="section-description">
            Une plateforme complète pour maximiser vos chances de réussite
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} variant="elevated" hoverable>
              <CardBody>
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Subjects Section */}
      <section className="subjects-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Sujets populaires</h2>
            <p className="section-description">
              Les sujets les plus consultés cette semaine
            </p>
          </div>
          <Link to="/discover">
            <Button variant="ghost" icon={<ArrowRight size={20} />}>
              Voir tout
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="subjects-loading">
            <Spinner size="lg" text="Chargement des sujets..." />
          </div>
        ) : (
          <div className="subjects-grid">
            {popularSubjects.length > 0 ? (
              popularSubjects.map((subject) => (
                <Card key={subject.id} variant="default" hoverable clickable>
                  <Card.Image 
                    src={subject.image || '/placeholder.jpg'} 
                    alt={subject.title}
                  />
                  <CardBody>
                    <div className="subject-meta">
                      <span className="subject-badge">{subject.category}</span>
                      <span className="subject-year">{subject.year}</span>
                    </div>
                    <h3 className="subject-title">{subject.title}</h3>
                    <p className="subject-description">
                      {subject.description}
                    </p>
                  </CardBody>
                  <Card.Footer>
                    <Button variant="ghost" size="sm" fullWidth>
                      Voir les détails
                    </Button>
                  </Card.Footer>
                </Card>
              ))
            ) : (
              <div className="subjects-empty">
                <BookOpen size={48} />
                <p>Aucun sujet disponible</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">Parcourir par catégorie</h2>
          <p className="section-description">
            Trouvez rapidement ce que vous cherchez
          </p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/discover?category=${category.slug}`}
              className="category-card"
            >
              <div className="category-icon">
                {category.icon || <BookOpen size={24} />}
              </div>
              <div className="category-name">{category.name}</div>
              <div className="category-count">{category.count} sujets</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <Card variant="elevated">
            <CardBody>
              <div className="cta-content">
                <h2 className="cta-title">
                  Prêt à commencer votre préparation ?
                </h2>
                <p className="cta-description">
                  Créez votre compte gratuitement et accédez à des milliers de
                  sujets avec recommandations IA personnalisées.
                </p>
                <div className="cta-actions">
                  <Link to="/signup">
                    <Button variant="primary" size="lg">
                      Créer un compte gratuit
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="lg">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      )}
    </div>
  );
};

export default Home;