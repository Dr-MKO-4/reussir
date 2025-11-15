import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import { Tabs } from '../components/common/Tabs';
import { Spinner } from '../components/common/Spinner';
import { Alert } from '../components/common/Alert';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { SubjectCardData } from '../types/catalog';
import './SubjectDetailsPage.css';
import SubjectFilters, { FilterOptions } from '../components/catalog/SubjectFilters';
import SearchBar from '../components/common/SearchBar';

/**
 * Page de détails d'un sujet
 */
const SubjectDetailsPage: React.FC = () => {
  // État pour la recherche et les filtres avancés
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Callback pour la SearchBar
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Lancer la recherche avancée ou filtrer les données
  };

  // Callback pour les filtres
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // TODO: Appliquer les filtres sur les données du sujet ou suggestions
  };
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, hasItem } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState<SubjectCardData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarSubjects, setSimilarSubjects] = useState<SubjectCardData[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const isInCart = subject ? hasItem(subject.id) : false;

  /**
   * Charger les détails du sujet
   */
  useEffect(() => {
    if (id) {
      loadSubjectDetails(id);
    }
  }, [id]);

  const loadSubjectDetails = async (subjectId: string) => {
    try {
      setIsLoading(true);
      
      // TODO: Remplacer par de vrais appels API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Données mockées
      const mockSubject: SubjectCardData = {
        id: subjectId,
        title: 'Mathématiques - Baccalauréat 2024',
        description: 'Épreuve de mathématiques série C - Session normale. Cette épreuve couvre l\'ensemble du programme de Terminale C avec un focus particulier sur l\'analyse, l\'algèbre et la géométrie.',
        exam: 'Baccalauréat',
        subject: 'Mathématiques',
        year: 2024,
        difficulty: 4,
        price: 1000,
        isFree: false,
        isPremium: true,
        tags: ['Série C', 'Trigonométrie', 'Analyse', 'Géométrie'],
        rating: 4.5,
        isNew: true,
        thumbnailUrl: '/images/math-subject.jpg',
      };

      const mockSimilarSubjects: SubjectCardData[] = [
        {
          id: '2',
          title: 'Mathématiques - Baccalauréat 2023',
          description: 'Épreuve de mathématiques série C',
          exam: 'Baccalauréat',
          subject: 'Mathématiques',
          year: 2023,
          difficulty: 4,
          price: 800,
          isFree: false,
          isPremium: false,
          tags: ['Série C'],
          rating: 4.3,
        },
        {
          id: '3',
          title: 'Mathématiques - Probatoire 2024',
          description: 'Épreuve de mathématiques série C',
          exam: 'Probatoire',
          subject: 'Mathématiques',
          year: 2024,
          difficulty: 3,
          price: 0,
          isFree: true,
          isPremium: false,
          tags: ['Série C'],
          rating: 4.1,
        },
      ];

      setSubject(mockSubject);
      setSimilarSubjects(mockSimilarSubjects);

    } catch (error) {
      console.error('Error loading subject details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ajouter au panier
   */
  const handleAddToCart = async () => {
    if (!subject) return;

    try {
      setAddingToCart(true);
      await addItem(subject);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  /**
   * Toggle favoris
   */
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsFavorite(!isFavorite);
    // TODO: Appeler l'API pour sauvegarder
  };

  /**
   * Télécharger (pour les gratuits)
   */
  const handleDownload = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // TODO: Gérer le téléchargement
    console.log('Download subject:', subject?.id);
  };

  /**
   * Rendre les étoiles
   */
  const renderStars = (rating: number) => {
    return (
      <div className="rating-stars">
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
      </div>
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="loading-page">
          <Spinner size="xl" label="Chargement du sujet..." />
        </div>
      </MainLayout>
    );
  }

  if (!subject) {
    return (
      <MainLayout>
        <div className="error-page">
          <h1>Sujet non trouvé</h1>
          <p>Le sujet que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button variant="primary" onClick={() => navigate('/discover')}>
            Retour à la recherche
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="subject-details-page">
        {/* Barre de recherche avancée */}
        <div className="subject-details-searchbar">
          <SearchBar
            placeholder="Rechercher dans le catalogue..."
            value={searchQuery}
            onSearch={handleSearch}
            onChange={setSearchQuery}
            size="md"
            fullWidth
          />
        </div>

        {/* Sidebar de filtres avancés */}
        <div className="subject-details-filters">
          <SubjectFilters onFiltersChange={handleFiltersChange} />
        </div>
        {/* Success Alert */}
        {showSuccessAlert && (
          <div className="fixed-alert">
            <Alert variant="success" title="Ajouté au panier" isDismissible onDismiss={() => setShowSuccessAlert(false)}>
              Le sujet a été ajouté à votre panier avec succès
            </Alert>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">Accueil</button>
          <span className="breadcrumb-separator">/</span>
          <button onClick={() => navigate('/discover')} className="breadcrumb-link">Catalogue</button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{subject.title}</span>
        </nav>

        <div className="subject-layout">
          {/* Main Content */}
          <div className="subject-main">
            {/* Header */}
            <div className="subject-header">
              <div className="subject-badges-row">
                {subject.isNew && <Badge variant="primary">Nouveau</Badge>}
                {subject.isFree && <Badge variant="success">Gratuit</Badge>}
                {subject.isPremium && <Badge variant="warning">Premium</Badge>}
              </div>

              <h1 className="subject-title">{subject.title}</h1>
              
              <div className="subject-meta-row">
                <div className="meta-item">
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{subject.exam}</span>
                </div>
                <div className="meta-item">
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{subject.year}</span>
                </div>
                <div className="meta-item">
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>{subject.subject}</span>
                </div>
                <div className="meta-item">
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Difficulté {subject.difficulty}/5</span>
                </div>
              </div>

              {subject.rating && (
                <div className="subject-rating">
                  {renderStars(subject.rating)}
                  <span className="rating-text">{subject.rating} / 5</span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs
              tabs={[
                {
                  id: 'description',
                  label: 'Description',
                  content: (
                    <div className="tab-content">
                      <p className="subject-description">{subject.description}</p>
                      
                      <div className="subject-info-grid">
                        <div className="info-card">
                          <h3>Chapitres couverts</h3>
                          <ul>
                            <li>Analyse : Fonctions, limites, dérivées</li>
                            <li>Algèbre : Nombres complexes, polynômes</li>
                            <li>Géométrie : Géométrie dans l'espace</li>
                            <li>Probabilités et statistiques</li>
                          </ul>
                        </div>
                        
                        <div className="info-card">
                          <h3>Prérequis</h3>
                          <ul>
                            <li>Maîtrise du programme de Première C</li>
                            <li>Connaissance des fonctions usuelles</li>
                            <li>Bases en trigonométrie</li>
                          </ul>
                        </div>
                      </div>

                      <div className="tags-section">
                        <h3>Tags</h3>
                        <div className="tags-list">
                          {subject.tags.map((tag, index) => (
                            <Badge key={index} variant="neutral">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'preview',
                  label: 'Aperçu',
                  content: (
                    <div className="tab-content">
                      <p className="preview-info">
                        Un aperçu du sujet sera disponible ici pour les utilisateurs connectés.
                      </p>
                      {!isAuthenticated && (
                        <Alert variant="info" title="Connexion requise">
                          Connectez-vous pour voir l'aperçu du sujet
                        </Alert>
                      )}
                    </div>
                  ),
                },
                {
                  id: 'correction',
                  label: 'Correction',
                  content: (
                    <div className="tab-content">
                      <p className="correction-info">
                        La correction détaillée de ce sujet est disponible après l'achat.
                      </p>
                      <Alert variant="warning" title="Correction disponible">
                        Achetez ce sujet pour accéder à la correction complète
                      </Alert>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/* Sidebar */}
          <aside className="subject-sidebar">
            <Card variant="outlined" className="purchase-card">
              <div className="price-section">
                {subject.isFree ? (
                  <div className="price-free">Gratuit</div>
                ) : (
                  <div className="price-amount">{subject.price} FCFA</div>
                )}
              </div>

              <div className="actions-section">
                {subject.isFree ? (
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleDownload}
                  >
                    <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger
                  </Button>
                ) : (
                  <>
                    {isInCart ? (
                      <Button
                        variant="secondary"
                        fullWidth
                        size="lg"
                        onClick={() => navigate('/cart')}
                      >
                        Voir le panier
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        onClick={handleAddToCart}
                        isLoading={addingToCart}
                      >
                        <svg className="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Ajouter au panier
                      </Button>
                    )}
                  </>
                )}

                <Button
                  variant="secondary"
                  fullWidth
                  size="lg"
                  onClick={handleToggleFavorite}
                  leftIcon={
                    <svg fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  }
                >
                  {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </Button>
              </div>

              <div className="features-section">
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Correction détaillée incluse</span>
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Téléchargement immédiat</span>
                </div>
                <div className="feature-item">
                  <svg className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>

        {/* Similar Subjects */}
        {similarSubjects.length > 0 && (
          <section className="similar-section">
            <h2 className="similar-title">Sujets similaires</h2>
            <div className="similar-grid">
              {similarSubjects.map((similar) => (
                <Card
                  key={similar.id}
                  variant="outlined"
                  isHoverable
                  className="similar-card"
                  onClick={() => navigate(`/subjects/${similar.id}`)}
                >
                  <h3 className="similar-card-title">{similar.title}</h3>
                  <p className="similar-card-description">{similar.description}</p>
                  <div className="similar-card-footer">
                    <span className="similar-price">
                      {similar.isFree ? 'Gratuit' : `${similar.price} FCFA`}
                    </span>
                    {similar.rating && (
                      <span className="similar-rating">★ {similar.rating}</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

export default SubjectDetailsPage;