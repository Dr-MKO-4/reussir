import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/common/SearchBar';
import { Badge } from '../components/common/Badge';
import { Spinner } from '../components/common/Spinner';
import { SubjectCardData } from '../types/catalog';
import './HomeCatalog.css';

/**
 * Catégorie de sujets
 */
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

/**
 * Page d'accueil
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredSubjects, setFeaturedSubjects] = useState<SubjectCardData[]>([]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);

  /**
   * Charger les données de la page d'accueil
   */
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Remplacer par de vrais appels API
      // Données mockées pour l'exemple
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFeaturedSubjects([
        {
          id: '1',
          title: 'Mathématiques - Baccalauréat 2024',
          description: 'Épreuve de mathématiques série C',
          exam: 'Baccalauréat',
          subject: 'Mathématiques',
          year: 2024,
          difficulty: 4,
          price: 1000,
          isFree: false,
          isPremium: true,
          tags: ['Série C', 'Trigonométrie'],
          rating: 4.5,
          isNew: true,
        },
        {
          id: '2',
          title: 'Physique-Chimie - Probatoire 2024',
          description: 'Épreuve de physique-chimie série D',
          exam: 'Probatoire',
          subject: 'Physique-Chimie',
          year: 2024,
          difficulty: 3,
          price: 0,
          isFree: true,
          isPremium: false,
          tags: ['Série D', 'Mécanique'],
          rating: 4.2,
        },
        {
          id: '3',
          title: 'Philosophie - Baccalauréat 2023',
          description: 'Épreuve de philosophie série A',
          exam: 'Baccalauréat',
          subject: 'Philosophie',
          year: 2023,
          difficulty: 5,
          price: 500,
          isFree: false,
          isPremium: false,
          tags: ['Série A', 'Dissertation'],
          rating: 4.8,
          isFeatured: true,
        },
      ]);

      setPopularCategories([
        {
          id: 'bac',
          name: 'Baccalauréat',
          icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          ),
          count: 1250,
        },
        {
          id: 'probatoire',
          name: 'Probatoire',
          icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
          count: 850,
        },
        {
          id: 'bepc',
          name: 'BEPC',
          icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          count: 620,
        },
        {
          id: 'concours',
          name: 'Concours',
          icon: (
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          ),
          count: 420,
        },
      ]);

    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Gérer la recherche
   */
  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  /**
   * Gérer le clic sur une catégorie
   */
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/catalog?category=${categoryId}`);
  };

  /**
   * Rendre les étoiles de notation
   */
  const renderStars = (rating: number) => {
    return (
      <div className="subject-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`star ${star <= rating ? 'star-filled' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="homepage">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Réussissez vos examens avec
              <span className="hero-gradient"> Réussir</span>
            </h1>
            <p className="hero-description">
              Accédez à des milliers de sujets d'examens et concours pour préparer votre réussite.
              Baccalauréat, Probatoire, BEPC et plus encore.
            </p>
            
            {/* Search Bar */}
            <div className="hero-search">
              <SearchBar
                size="lg"
                placeholder="Rechercher un sujet, un examen, une matière..."
                onSearch={handleSearch}
                fullWidth
              />
            </div>

            {/* Quick Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">3,000+</div>
                <div className="stat-label">Sujets disponibles</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">50+</div>
                <div className="stat-label">Examens & Concours</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">10,000+</div>
                <div className="stat-label">Étudiants actifs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="section-header">
            <h2 className="section-title">Catégories populaires</h2>
            <Link to="/catalog" className="section-link">
              Tout voir
              <svg className="link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="categories-grid">
              {popularCategories.map((category) => (
                <Card
                  key={category.id}
                  variant="outlined"
                  isHoverable
                  isPressable
                  className="category-card"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-count">{category.count} sujets</p>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Featured Subjects Section */}
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Sujets en vedette</h2>
            <Link to="/discover" className="section-link">
              Explorer tout
              <svg className="link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="subjects-grid">
              {featuredSubjects.map((subject) => (
                <Card
                  key={subject.id}
                  variant="elevated"
                  isHoverable
                  className="subject-card"
                >
                  <div className="subject-header">
                    <div className="subject-badges">
                      {subject.isNew && <Badge variant="primary" size="sm">Nouveau</Badge>}
                      {subject.isFree && <Badge variant="success" size="sm">Gratuit</Badge>}
                      {subject.isPremium && <Badge variant="warning" size="sm">Premium</Badge>}
                    </div>
                    <button className="favorite-button" aria-label="Ajouter aux favoris">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="subject-title">{subject.title}</h3>
                  <p className="subject-description">{subject.description}</p>

                  <div className="subject-meta">
                    <span className="meta-item">
                      <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {subject.year}
                    </span>
                    <span className="meta-item">
                      <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {subject.subject}
                    </span>
                  </div>

                  {subject.rating && renderStars(subject.rating)}

                  <div className="subject-footer">
                    <div className="subject-price">
                      {subject.isFree ? (
                        <span className="price-free">Gratuit</span>
                      ) : (
                        <span className="price-amount">{subject.price} FCFA</span>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/subjects/${subject.id}`)}
                    >
                      Voir détails
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Prêt à commencer votre préparation ?</h2>
            <p className="cta-description">
              Inscrivez-vous gratuitement et accédez à des milliers de sujets d'examens
            </p>
            <div className="cta-buttons">
              <Button variant="primary" size="lg" onClick={() => navigate('/signup')}>
                Créer un compte gratuit
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate('/discover')}>
                Explorer le catalogue
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default HomePage;