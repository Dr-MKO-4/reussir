import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, BookOpen, Star, Clock, Download,
  Heart, ShoppingCart, TrendingUp, Users, ArrowLeft,
  ChevronDown, Grid, List, Facebook, Twitter, Instagram,
  Linkedin, Shield, Award, Target, Zap, Crown, Eye
} from 'lucide-react';

import styles from './Catalog.module.css';
import { useCartContext } from '../contexts/CartContext';
import { useToast } from '../hooks/useToast';
import { fetchCatalogItems } from '../services/catalogService';

const CatalogPage = () => {
  const navigate = useNavigate();
  const { cart, addItem } = useCartContext();
  const { showSuccess, showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('tous');
  const [selectedSubject, setSelectedSubject] = useState('tous');
  const [selectedYear, setSelectedYear] = useState('tous');
  const [selectedType, setSelectedType] = useState('tous');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Types d'examens et concours
  const examTypes = [
    { value: 'tous', label: 'Tous les examens' },
    { value: 'bepc', label: 'BEPC Camerounais' },
    { value: 'probatoire', label: 'Probatoire' },
    { value: 'baccalaureat', label: 'Baccalauréat' },
    { value: 'ensp', label: 'ENSP (École Normale Supérieure)' },
    { value: 'enset', label: 'ENSET (Enseignement Technique)' },
    { value: 'enam', label: 'ENAM (Administration et Magistrature)' },
    { value: 'iric', label: 'IRIC (Relations Internationales)' },
    { value: 'essec', label: 'ESSEC (Sciences Économiques)' },
    { value: 'polytechnique', label: 'École Polytechnique' },
    { value: 'iut', label: 'IUT (Institut Universitaire)' },
    { value: 'fmsb', label: 'FMSB (Médecine et Sciences Biomédicales)' },
  ];

  const subjects = [
    { value: 'tous', label: 'Toutes les matières' },
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'physique', label: 'Physique' },
    { value: 'chimie', label: 'Chimie' },
    { value: 'svt', label: 'SVT' },
    { value: 'francais', label: 'Français' },
    { value: 'anglais', label: 'Anglais' },
    { value: 'philosophie', label: 'Philosophie' },
    { value: 'histoire', label: 'Histoire-Géo' },
    { value: 'economie', label: 'Économie' },
    { value: 'informatique', label: 'Informatique' },
  ];

  const years = [
    { value: 'tous', label: 'Toutes les années' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
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
    economie: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
  };

  // Base de données complète des épreuves
  const allTests = [
    // BEPC
    { id: 'bepc1', title: "Mathématiques BEPC 2023", examType: "bepc", subject: "mathematiques", year: "2023", duration: "2h", downloads: 1250, rating: 4.5, isFree: true, image: testImages.mathematiques, price: 0, description: "Épreuve complète avec corrigé détaillé" },
    { id: 'bepc2', title: "Français BEPC 2023", examType: "bepc", subject: "francais", year: "2023", duration: "2h", downloads: 980, rating: 4.3, isFree: true, image: testImages.francais, price: 0, description: "Composition et questions de compréhension" },
    { id: 'bepc3', title: "Anglais BEPC 2023", examType: "bepc", subject: "anglais", year: "2023", duration: "2h", downloads: 850, rating: 4.4, isFree: true, image: testImages.anglais, price: 0, description: "Reading comprehension et expression écrite" },
    { id: 'bepc4', title: "SVT BEPC 2022", examType: "bepc", subject: "svt", year: "2022", duration: "2h", downloads: 720, rating: 4.2, isFree: false, image: testImages.svt, price: 1500, description: "Biologie et sciences de la terre" },
    
    // Probatoire
    { id: 'prob1', title: "Mathématiques Probatoire C 2023", examType: "probatoire", subject: "mathematiques", year: "2023", duration: "3h", downloads: 2100, rating: 4.7, isFree: false, image: testImages.mathematiques, price: 2000, description: "Série C - Épreuve complète corrigée" },
    { id: 'prob2', title: "Physique Probatoire D 2023", examType: "probatoire", subject: "physique", year: "2023", duration: "3h", downloads: 1800, rating: 4.6, isFree: false, image: testImages.physique, price: 2000, description: "Série D - Mécanique et électricité" },
    { id: 'prob3', title: "Philosophie Probatoire A 2023", examType: "probatoire", subject: "philosophie", year: "2023", duration: "4h", downloads: 1500, rating: 4.5, isFree: false, image: testImages.philosophie, price: 2000, description: "Série A - Dissertation et commentaire" },
    { id: 'prob4', title: "Histoire-Géo Probatoire 2022", examType: "probatoire", subject: "histoire", year: "2022", duration: "3h", downloads: 1200, rating: 4.3, isFree: true, image: testImages.histoire, price: 0, description: "Toutes séries - Épreuve d'histoire" },
    
    // Baccalauréat
    { id: 'bac1', title: "Mathématiques BAC C 2023", examType: "baccalaureat", subject: "mathematiques", year: "2023", duration: "4h", downloads: 3500, rating: 4.9, isFree: false, image: testImages.mathematiques, price: 3000, description: "BAC série C - Corrigé détaillé avec barème" },
    { id: 'bac2', title: "Physique BAC D 2023", examType: "baccalaureat", subject: "physique", year: "2023", duration: "4h", downloads: 3200, rating: 4.8, isFree: false, image: testImages.physique, price: 3000, description: "BAC série D - Physique complète" },
    { id: 'bac3', title: "Français BAC A 2023", examType: "baccalaureat", subject: "francais", year: "2023", duration: "4h", downloads: 2800, rating: 4.7, isFree: false, image: testImages.francais, price: 2500, description: "BAC série A - Littérature" },
    { id: 'bac4', title: "Philosophie BAC 2023", examType: "baccalaureat", subject: "philosophie", year: "2023", duration: "4h", downloads: 2600, rating: 4.6, isFree: true, image: testImages.philosophie, price: 0, description: "Toutes séries - Sujets et corrigés" },
    
    // ENSP
    { id: 'ensp1', title: "Mathématiques ENSP 2023", examType: "ensp", subject: "mathematiques", year: "2023", duration: "3h", downloads: 1800, rating: 4.8, isFree: false, image: testImages.mathematiques, price: 4000, description: "Concours ENSP - Niveau avancé" },
    { id: 'ensp2', title: "Français ENSP 2023", examType: "ensp", subject: "francais", year: "2023", duration: "3h", downloads: 1500, rating: 4.7, isFree: false, image: testImages.francais, price: 4000, description: "Culture générale et expression" },
    { id: 'ensp3', title: "Épreuve générale ENSP 2022", examType: "ensp", subject: "francais", year: "2022", duration: "4h", downloads: 1200, rating: 4.6, isFree: false, image: testImages.francais, price: 3500, description: "Épreuve de culture générale" },
    
    // ENSET
    { id: 'enset1', title: "Mathématiques ENSET 2023", examType: "enset", subject: "mathematiques", year: "2023", duration: "3h", downloads: 980, rating: 4.7, isFree: false, image: testImages.mathematiques, price: 3500, description: "Concours d'entrée ENSET" },
    { id: 'enset2', title: "Physique ENSET 2023", examType: "enset", subject: "physique", year: "2023", duration: "3h", downloads: 850, rating: 4.6, isFree: false, image: testImages.physique, price: 3500, description: "Épreuve technique ENSET" },
    
    // ENAM
    { id: 'enam1', title: "Culture Générale ENAM 2023", examType: "enam", subject: "francais", year: "2023", duration: "4h", downloads: 1600, rating: 4.8, isFree: false, image: testImages.francais, price: 4500, description: "Concours ENAM - Section A" },
    { id: 'enam2', title: "Droit ENAM 2023", examType: "enam", subject: "economie", year: "2023", duration: "3h", downloads: 1400, rating: 4.7, isFree: false, image: testImages.economie, price: 4500, description: "Droit administratif et constitutionnel" },
    
    // IRIC
    { id: 'iric1', title: "Relations Internationales IRIC 2023", examType: "iric", subject: "histoire", year: "2023", duration: "4h", downloads: 890, rating: 4.6, isFree: false, image: testImages.histoire, price: 4000, description: "Géopolitique et relations internationales" },
    { id: 'iric2', title: "Anglais IRIC 2023", examType: "iric", subject: "anglais", year: "2023", duration: "3h", downloads: 750, rating: 4.5, isFree: false, image: testImages.anglais, price: 4000, description: "English proficiency test" },
    
    // ESSEC
    { id: 'essec1', title: "Économie ESSEC 2023", examType: "essec", subject: "economie", year: "2023", duration: "4h", downloads: 1300, rating: 4.7, isFree: false, image: testImages.economie, price: 4000, description: "Microéconomie et macroéconomie" },
    { id: 'essec2', title: "Mathématiques ESSEC 2023", examType: "essec", subject: "mathematiques", year: "2023", duration: "3h", downloads: 1100, rating: 4.6, isFree: false, image: testImages.mathematiques, price: 4000, description: "Mathématiques pour économistes" },
    
    // Polytechnique
    { id: 'poly1', title: "Mathématiques Polytechnique 2023", examType: "polytechnique", subject: "mathematiques", year: "2023", duration: "4h", downloads: 2200, rating: 4.9, isFree: false, image: testImages.mathematiques, price: 5000, description: "Concours Polytechnique - Niveau expert" },
    { id: 'poly2', title: "Physique Polytechnique 2023", examType: "polytechnique", subject: "physique", year: "2023", duration: "4h", downloads: 2000, rating: 4.9, isFree: false, image: testImages.physique, price: 5000, description: "Physique avancée" },
    { id: 'poly3', title: "Chimie Polytechnique 2022", examType: "polytechnique", subject: "chimie", year: "2022", duration: "3h", downloads: 1800, rating: 4.8, isFree: false, image: testImages.chimie, price: 4500, description: "Chimie générale et organique" },
    
    // IUT
    { id: 'iut1', title: "Informatique IUT 2023", examType: "iut", subject: "informatique", year: "2023", duration: "3h", downloads: 1500, rating: 4.7, isFree: false, image: testImages.informatique, price: 3500, description: "Algorithmique et programmation" },
    { id: 'iut2', title: "Mathématiques IUT 2023", examType: "iut", subject: "mathematiques", year: "2023", duration: "3h", downloads: 1300, rating: 4.6, isFree: false, image: testImages.mathematiques, price: 3500, description: "Mathématiques appliquées" },
    
    // FMSB
    { id: 'fmsb1', title: "Biologie FMSB 2023", examType: "fmsb", subject: "svt", year: "2023", duration: "4h", downloads: 1700, rating: 4.8, isFree: false, image: testImages.svt, price: 5000, description: "Concours médecine - Biologie" },
    { id: 'fmsb2', title: "Chimie FMSB 2023", examType: "fmsb", subject: "chimie", year: "2023", duration: "3h", downloads: 1600, rating: 4.7, isFree: false, image: testImages.chimie, price: 5000, description: "Chimie organique et biochimie" },
  ];

  // Filtrage des épreuves
  // Utiliser les données dynamiques si disponibles, sinon fallback sur les données statiques
  const dataSource = catalogItems && catalogItems.length > 0 ? catalogItems : allTests;

  const filteredTests = dataSource.filter((test: any) => {
    const searchMatch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const examMatch = selectedExamType === 'tous' || test.examType === selectedExamType;
    const subjectMatch = selectedSubject === 'tous' || test.subject === selectedSubject;
    const yearMatch = selectedYear === 'tous' || test.year === selectedYear;
    const typeMatch = selectedType === 'tous' || 
                     (selectedType === 'gratuit' && test.isFree) ||
                     (selectedType === 'payant' && !test.isFree);
    const favoriteMatch = !showFavorites || favorites.includes(test.id);
    
    return searchMatch && examMatch && subjectMatch && yearMatch && typeMatch && favoriteMatch;
  });

  // Tri des épreuves
  const sortedTests = [...filteredTests].sort((a: any, b: any) => {
    switch(sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'recent':
        return b.year.localeCompare(a.year);
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
        level: test.examType,
        difficulty: test.examType,
        rating: test.rating,
        studentsCount: test.downloads,
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

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const items = await fetchCatalogItems();
        setCatalogItems(items);
      } catch (error) {
        console.error('Erreur lors du chargement du catalogue:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  if (loading) {
    return <div>Chargement du catalogue...</div>;
  }

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
                <img src="/logo1.png" alt="Win+" />
              </div>
              <span className={styles.logoText}>Win+</span>
            </div>

            <nav className={styles.nav}>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a>
              <a href="/catalog" onClick={(e) => { e.preventDefault(); navigate('/catalog'); }} className={styles.active}>Catalogue</a>
              <a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>À propos</a>
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact</a>
            </nav>

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

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Catalogue d'Épreuves</h1>
              <p>Accédez à plus de 1000 épreuves corrigées des examens et concours camerounais</p>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <BookOpen size={20} />
                  <span>{(catalogItems && catalogItems.length) || allTests.length}+ Épreuves</span>
                </div>
                <div className={styles.statItem}>
                  <Users size={20} />
                  <span>2000+ Étudiants</span>
                </div>
                <div className={styles.statItem}>
                  <Star size={20} />
                  <span>4.8/5 Note</span>
                </div>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop" alt="Catalogue" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Filters Section */}
          <div className={styles.filtersSection}>
            <div className={styles.mainFilters}>
              <div className={styles.filterGroup}>
                <label>Type d'examen</label>
                <select 
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className={styles.select}
                >
                  {examTypes.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
              </div>

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
                <label>Année</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={styles.select}
                >
                  {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
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
            </div>

            <div className={styles.searchAndSort}>
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

              <div className={styles.sortGroup}>
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

              <button 
                className={`${styles.favoritesBtn} ${showFavorites ? styles.active : ''}`}
                onClick={() => setShowFavorites(!showFavorites)}
              >
                <Heart size={18} fill={showFavorites ? 'currentColor' : 'none'} />
                Favoris ({favorites.length})
              </button>
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultsInfo}>
            <p>{sortedTests.length} épreuve{sortedTests.length > 1 ? 's' : ''} trouvée{sortedTests.length > 1 ? 's' : ''}</p>
          </div>

          {/* Tests Grid */}
          <div className={styles.testsGrid}>
            {sortedTests.map(test => (
              <article key={test.id} className={styles.testCard}>
                <div className={styles.testImageContainer}>
                  <img 
                    src={test.image}
                    alt={test.title}
                    className={styles.testImage}
                  />
                  <button 
                    className={`${styles.favoriteBtn} ${favorites.includes(test.id) ? styles.favorited : ''}`}
                    onClick={() => toggleFavorite(test.id)}
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart size={18} fill={favorites.includes(test.id) ? 'currentColor' : 'none'} />
                  </button>
                  {test.isFree ? (
                    <span className={styles.freeBadge}>Gratuit</span>
                  ) : (
                    <span className={styles.priceBadge}>{test.price} FCFA</span>
                  )}
                </div>

                <div className={styles.testContent}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testDescription}>{test.description}</p>
                  
                  <div className={styles.testMeta}>
                    <span><Clock size={14} /> {test.duration}</span>
                    <span><Download size={14} /> {test.downloads}</span>
                  </div>

                  <div className={styles.testFooter}>
                    <div className={styles.rating}>
                      <Star size={14} fill="#FFA500" color="#FFA500" />
                      <span>{test.rating}</span>
                    </div>
                    {!test.isFree && (
                      <div className={styles.price}>{test.price} FCFA</div>
                    )}
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
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <div className={styles.logoIcon}>  
                  <img src="/logo1.png" alt="Win+" />
                </div>
                <span className={styles.logoText}>Win+</span>
              </div>
              <p className={styles.footerText}>
                Autonomiser les éducateurs pour améliorer notre monde
              </p>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon} aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="#" className={styles.socialIcon} aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Légal</h4>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className={styles.footerLink}>Confidentialité</a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className={styles.footerLink}>Conditions</a>
              <a href="#" className={styles.footerLink}>Cookies</a>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Support</h4>
              <a href="#" className={styles.footerLink}>Documentation</a>
              <a href="#" className={styles.footerLink}>Forums</a>
              <a href="#" className={styles.footerLink}>Service Providers</a>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>S'impliquer</h4>
              <a href="#" className={styles.footerLink}>Développement</a>
              <a href="#" className={styles.footerLink}>Traduction</a>
              <a href="#" className={styles.footerLink}>Expérience utilisateur</a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <div>
              <p className={styles.footerCopyright}>
                © 2024 Win+. Tous droits réservés.
              </p>
              <div style={{ marginTop: '8px', fontSize: '13px' }}>
                <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '16px', textDecoration: 'none' }}>
                  Politique de confidentialité
                </a>
                <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
                  Conditions d'utilisation
                </a>
              </div>
            </div>
            <div className={styles.footerBadges}>
              <span className={styles.footerBadge}>
                <Shield size={16} /> Sécurisé
              </span>
              <span className={styles.footerBadge}>
                <Award size={16} /> Certifié
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogPage;