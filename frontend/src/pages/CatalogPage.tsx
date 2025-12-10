import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, BookOpen, Star, Clock, Eye, Download,
  ChevronRight, Heart, ShoppingCart, TrendingUp, Sparkles,
  Award, Target, Zap, Users, ArrowLeft, X, Check, Crown,
  Lock, Unlock, ChevronDown, Grid, List
} from 'lucide-react';
import styles from './Catalog.module.css';
import { useCartContext } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';

const CatalogPage = () => {
  const navigate = useNavigate();
  const { cart, addItem } = useCartContext();
  const { showSuccess, showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('tous');
  const [selectedClass, setSelectedClass] = useState('tous');
  const [selectedDifficulty, setSelectedDifficulty] = useState('tous');
  const [selectedType, setSelectedType] = useState('tous');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const subjects = [
    { value: 'tous', label: 'Toutes les matières' },
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'physique', label: 'Physique' },
    { value: 'chimie', label: 'Chimie' },
    { value: 'svt', label: 'SVT' },
    { value: 'francais', label: 'Français' },
    { value: 'anglais', label: 'Anglais' },
    { value: 'histoire', label: 'Histoire-Géo' },
    { value: 'philosophie', label: 'Philosophie' },
    { value: 'informatique', label: 'Informatique' },
  ];

  const classes = [
    { value: 'tous', label: 'Tous les niveaux' },
    { value: 'college', label: 'Collège' },
    { value: 'seconde', label: 'Seconde' },
    { value: 'premiere', label: 'Première' },
    { value: 'terminale', label: 'Terminale' },
    { value: 'universite', label: 'Université' },
  ];

  const difficulties = [
    { value: 'tous', label: 'Toutes difficultés' },
    { value: 'facile', label: 'Facile' },
    { value: 'moyen', label: 'Moyen' },
    { value: 'difficile', label: 'Difficile' },
    { value: 'expert', label: 'Expert' },
  ];

  const types = [
    { value: 'tous', label: 'Tous types' },
    { value: 'gratuit', label: 'Gratuit' },
    { value: 'payant', label: 'Payant' },
  ];

  const testImages = {
    mathematiques: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
    physique: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=250&fit=crop",
    francais: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=250&fit=crop",
    chimie: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop",
    svt: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=250&fit=crop",
    anglais: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
    histoire: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=250&fit=crop",
    philosophie: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=250&fit=crop",
    informatique: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
  };

  const allTests = [
    {
      id: '1',
      title: "Baccalauréat Mathématiques 2023",
      subject: "mathematiques",
      class: "terminale",
      difficulty: "Difficile",
      duration: "4h",
      views: 1250,
      downloads: 890,
      rating: 4.8,
      isFree: true,
      image: testImages.mathematiques,
      price: 0,
      description: "Épreuve complète de mathématiques du baccalauréat 2023"
    },
    {
      id: '2',
      title: "Physique ENSPD 2023",
      subject: "physique",
      class: "terminale",
      difficulty: "Expert",
      duration: "3h",
      views: 987,
      downloads: 654,
      rating: 4.9,
      isFree: false,
      image: testImages.physique,
      price: 3000,
      description: "Concours ENSPD - Épreuve de physique avancée"
    },
    {
      id: '3',
      title: "Français BAC Camerounais 2023",
      subject: "francais",
      class: "terminale",
      difficulty: "Moyen",
      duration: "2h30",
      views: 2100,
      downloads: 1500,
      rating: 4.6,
      isFree: true,
      image: testImages.francais,
      price: 0,
      description: "Épreuve de français - Baccalauréat général"
    },
    {
      id: '4',
      title: "Chimie Organique Université",
      subject: "chimie",
      class: "universite",
      difficulty: "Expert",
      duration: "3h30",
      views: 756,
      downloads: 432,
      rating: 4.7,
      isFree: false,
      image: testImages.chimie,
      price: 3500,
      description: "Examen final de chimie organique niveau L2"
    },
    {
      id: '5',
      title: "SVT Bepc 2023",
      subject: "svt",
      class: "college",
      difficulty: "Facile",
      duration: "2h",
      views: 1890,
      downloads: 1234,
      rating: 4.5,
      isFree: true,
      image: testImages.svt,
      price: 0,
      description: "Épreuve de SVT pour le BEPC"
    },
    {
      id: '6',
      title: "Anglais Probatoire 2023",
      subject: "anglais",
      class: "premiere",
      difficulty: "Moyen",
      duration: "2h",
      views: 1456,
      downloads: 987,
      rating: 4.4,
      isFree: false,
      image: testImages.anglais,
      price: 2000,
      description: "Épreuve complète d'anglais du probatoire"
    },
    {
      id: '7',
      title: "Mathématiques Seconde 2024",
      subject: "mathematiques",
      class: "seconde",
      difficulty: "Moyen",
      duration: "2h30",
      views: 1678,
      downloads: 1123,
      rating: 4.6,
      isFree: true,
      image: testImages.mathematiques,
      price: 0,
      description: "Examen de mathématiques pour la classe de seconde"
    },
    {
      id: '8',
      title: "Histoire-Géo BAC 2023",
      subject: "histoire",
      class: "terminale",
      difficulty: "Moyen",
      duration: "3h",
      views: 1234,
      downloads: 876,
      rating: 4.3,
      isFree: false,
      image: testImages.histoire,
      price: 2500,
      description: "Épreuve d'histoire et géographie du baccalauréat"
    },
    {
      id: '9',
      title: "Philosophie BAC 2023",
      subject: "philosophie",
      class: "terminale",
      difficulty: "Difficile",
      duration: "4h",
      views: 1567,
      downloads: 1098,
      rating: 4.7,
      isFree: false,
      image: testImages.philosophie,
      price: 2500,
      description: "Dissertation et commentaire de texte"
    },
    {
      id: '10',
      title: "Informatique Licence 1",
      subject: "informatique",
      class: "universite",
      difficulty: "Difficile",
      duration: "3h",
      views: 890,
      downloads: 567,
      rating: 4.8,
      isFree: false,
      image: testImages.informatique,
      price: 3000,
      description: "Programmation et algorithmique"
    },
    {
      id: '11',
      title: "Physique-Chimie Seconde",
      subject: "physique",
      class: "seconde",
      difficulty: "Facile",
      duration: "2h",
      views: 1345,
      downloads: 890,
      rating: 4.4,
      isFree: true,
      image: testImages.physique,
      price: 0,
      description: "Contrôle continu de physique-chimie"
    },
    {
      id: '12',
      title: "Français Collège 3ème",
      subject: "francais",
      class: "college",
      difficulty: "Facile",
      duration: "2h",
      views: 1789,
      downloads: 1234,
      rating: 4.5,
      isFree: true,
      image: testImages.francais,
      price: 0,
      description: "Brevet blanc de français"
    },
  ];

  const filteredTests = allTests.filter(test => {
    const searchMatch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const subjectMatch = selectedSubject === 'tous' || test.subject === selectedSubject;
    const classMatch = selectedClass === 'tous' || test.class === selectedClass;
    const difficultyMatch = selectedDifficulty === 'tous' || test.difficulty.toLowerCase() === selectedDifficulty;
    const typeMatch = selectedType === 'tous' || 
                     (selectedType === 'gratuit' && test.isFree) ||
                     (selectedType === 'payant' && !test.isFree);
    
    return searchMatch && subjectMatch && classMatch && difficultyMatch && typeMatch;
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    switch(sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'recent':
        return b.id.localeCompare(a.id);
      case 'rating':
        return b.rating - a.rating;
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const toggleFavorite = (testId: string) => {
    setFavorites(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
    showSuccess(favorites.includes(testId) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleAddToCart = async (test: typeof allTests[0]) => {
    try {
      setLoadingItems(prev => ({ ...prev, [test.id]: true }));

      const subjectData = {
        id: test.id,
        title: test.title,
        description: test.description,
        price: test.price,
        image: test.image,
        category: test.subject,
        level: test.class,
        difficulty: test.difficulty,
        rating: test.rating,
        studentsCount: test.views,
      };

      await addItem(subjectData, 1);
      showSuccess(`"${test.title}" ajouté au panier`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      showError(error.message || 'Erreur lors de l\'ajout au panier');
    } finally {
      setLoadingItems(prev => ({ ...prev, [test.id]: false }));
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <button 
              className={styles.backBtn}
              onClick={() => navigate(-1)}
              aria-label="Retour"
            >
              <ArrowLeft size={20} />
            </button>

            <div className={styles.logo} onClick={() => navigate('/')}>
              <div className={styles.logoIcon}>  
                <img src="\logo1.png" alt="Win+" />
              </div>
            </div>

            <div className={styles.headerActions}>
              <button 
                className={styles.cartBtn} 
                onClick={() => navigate('/cart')}
                aria-label="Panier"
              >
                <ShoppingCart size={20} />
                {cart.itemsCount > 0 && (
                  <span className={styles.cartBadge}>{cart.itemsCount}</span>
                )}
              </button>

              <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
                Connexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <div className={styles.badge}>
                <Sparkles size={16} /> Catalogue
              </div>
              <h1 className={styles.heroTitle}>
                Explorez notre <span className={styles.accent}>bibliothèque</span> d'épreuves
              </h1>
              <p className={styles.heroSubtitle}>
                Plus de 1000+ épreuves corrigées pour exceller dans vos études
              </p>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <BookOpen size={24} className={styles.statIcon} />
                  <div>
                    <div className={styles.statNumber}>1000+</div>
                    <div className={styles.statLabel}>Épreuves</div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Users size={24} className={styles.statIcon} />
                  <div>
                    <div className={styles.statNumber}>2000+</div>
                    <div className={styles.statLabel}>Étudiants</div>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <Star size={24} className={styles.statIcon} />
                  <div>
                    <div className={styles.statNumber}>4.8/5</div>
                    <div className={styles.statLabel}>Note moyenne</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.floatingCard}>
                <Crown size={32} className={styles.floatingIcon} />
                <h3>Accès Premium</h3>
                <p>Débloquez toutes les épreuves</p>
                <button className={styles.btnHero} onClick={() => navigate('/signup')}>
                  Essayer gratuitement
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>
              <Zap size={32} />
            </div>
            <div className={styles.ctaText}>
              <h3>🎯 Connectez-vous pour un suivi personnalisé par IA</h3>
              <p>Suivez vos progrès, recevez des recommandations personnalisées et débloquez des fonctionnalités exclusives</p>
            </div>
            <button className={styles.btnCtaLarge} onClick={() => navigate('/signup')}>
              Créer un compte gratuit
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Search & Filters */}
            <div className={styles.searchSection}>
              <div className={styles.searchBar}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Rechercher une épreuve..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <button 
                className={styles.filterToggle}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filtres
                <ChevronDown size={16} className={showFilters ? styles.rotated : ''} />
              </button>

              <div className={styles.viewToggle}>
                <button 
                  className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {showFilters && (
              <div className={styles.filtersPanel}>
                <div className={styles.filterGroup}>
                  <label>Matière</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className={styles.select}
                  >
                    {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Niveau</label>
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className={styles.select}
                  >
                    {classes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Difficulté</label>
                  <select 
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className={styles.select}
                  >
                    {difficulties.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Type</label>
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={styles.select}
                  >
                    {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>Trier par</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.select}
                  >
                    <option value="popular">Plus populaires</option>
                    <option value="recent">Plus récents</option>
                    <option value="rating">Mieux notés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>
              </div>
            )}

            {/* Results Info */}
            <div className={styles.resultsInfo}>
              <p>{sortedTests.length} épreuve{sortedTests.length > 1 ? 's' : ''} trouvée{sortedTests.length > 1 ? 's' : ''}</p>
            </div>

            {/* Tests Grid */}
            <div className={`${styles.testsGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
              {sortedTests.map(test => (
                <article key={test.id} className={styles.testCard}>
                  <div className={styles.testImageContainer}>
                    <img 
                      src={test.image}
                      alt={test.title}
                      className={styles.testImage}
                    />
                    <span className={styles.difficulty}>{test.difficulty}</span>
                    <button 
                      className={`${styles.favoriteBtn} ${favorites.includes(test.id) ? styles.favorited : ''}`}
                      onClick={() => toggleFavorite(test.id)}
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart size={18} fill={favorites.includes(test.id) ? 'currentColor' : 'none'} />
                    </button>
                    {!test.isFree && (
                      <span className={styles.priceBadge}>{test.price} FCFA</span>
                    )}
                    {test.isFree && (
                      <span className={styles.freeBadge}>Gratuit</span>
                    )}
                  </div>

                  <div className={styles.testContent}>
                    <h3 className={styles.testTitle}>{test.title}</h3>
                    <p className={styles.testDescription}>{test.description}</p>
                    
                    <div className={styles.testMeta}>
                      <span><Clock size={14} /> {test.duration}</span>
                      <span><Eye size={14} /> {test.views}</span>
                      <span><Download size={14} /> {test.downloads}</span>
                    </div>

                    <div className={styles.testFooter}>
                      <div className={styles.rating}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < Math.floor(test.rating) ? '#FF8C00' : 'none'}
                            color="#FF8C00"
                          />
                        ))}
                        <span>({test.rating})</span>
                      </div>
                    </div>

                    <button 
                      className={test.isFree ? styles.btnDownload : styles.btnAddCart}
                      onClick={() => test.isFree ? null : handleAddToCart(test)}
                      disabled={loadingItems[test.id]}
                    >
                      {test.isFree ? (
                        <>
                          <Download size={16} />
                          Télécharger
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          {loadingItems[test.id] ? 'Ajout...' : 'Ajouter au panier'}
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {sortedTests.length === 0 && (
              <div className={styles.emptyState}>
                <BookOpen size={64} className={styles.emptyIcon} />
                <h3>Aucune épreuve trouvée</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Target size={32} />
              </div>
              <h3>Suivi personnalisé</h3>
              <p>Notre IA analyse vos performances et adapte vos recommandations</p>
              <button className={styles.btnBenefit} onClick={() => navigate('/signup')}>
                Commencer maintenant
              </button>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <TrendingUp size={32} />
              </div>
              <h3>Progression garantie</h3>
              <p>95% de nos utilisateurs améliorent leurs notes en 3 mois</p>
              <button className={styles.btnBenefit} onClick={() => navigate('/signup')}>
                Rejoindre Win+
              </button>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Award size={32} />
              </div>
              <h3>Certificats reconnus</h3>
              <p>Obtenez des certificats validant vos compétences</p>
              <button className={styles.btnBenefit} onClick={() => navigate('/signup')}>
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.finalCtaContent}>
            <h2>Prêt à exceller dans vos études ?</h2>
            <p>Rejoignez 2000+ étudiants qui ont déjà transformé leurs résultats avec Win+</p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnFinalPrimary} onClick={() => navigate('/signup')}>
                Créer un compte gratuit
              </button>
              <button className={styles.btnFinalSecondary} onClick={() => navigate('/')}>
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogPage;