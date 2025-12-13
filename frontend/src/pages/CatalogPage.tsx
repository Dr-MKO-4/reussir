import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, Star, Clock, Download,
  Heart, ShoppingCart, Users, ArrowLeft,
  Facebook, Twitter, Instagram, Linkedin, 
  Shield, Award, ChevronLeft, ChevronRight,
  Filter, X, Crown, TrendingUp, Award as Trophy,
  CheckCircle, Zap, Target, Eye,MapPin,Mail,MessageSquare,Phone
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState('tous');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
   const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openFilters, setOpenFilters] = useState({
    examType: true,
    subject: true,
    year: true,
    type: true,
    rating: true,
  });

  const itemsPerPage = 12;

  const toggleFilter = (filterName: keyof typeof openFilters) => {
    setOpenFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  }


  // Announcements carousel - Maintenant avec Win+ Premium
  const announcements = [
    {
      id: 1,
      text: "Parents : Suivez les progrès de vos enfants en temps réel",
      cta: "Créer un compte Parent",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      text: "Professeurs : Accédez à l'IA pour un suivi personnalisé",
      cta: "Découvrir l'offre Enseignant",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      text: "Passez à Win+ Premium - Accès illimité à toutes les épreuves",
      cta: "Découvrir Premium",
      color: "linear-gradient(135deg, #a80f0fff 0%, #ea4f4fff 100%)",
    },
    {
      id: 4,
      text: "Étudiants : Plus de 1000 épreuves corrigées disponibles",
      cta: "Commencer gratuitement",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
  ];

  // Auto-rotate announcements
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => 
        prev === announcements.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const ratings = [
    { value: 'tous', label: 'Toutes notes' },
    { value: '4', label: '4+ étoiles' },
    { value: '3', label: '3+ étoiles' },
    { value: '2', label: '2+ étoiles' },
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
  const filteredTests = useMemo(() => {
    return allTests.filter(test => {
      const searchMatch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
      const examMatch = selectedExamType === 'tous' || test.examType === selectedExamType;
      const subjectMatch = selectedSubject === 'tous' || test.subject === selectedSubject;
      const yearMatch = selectedYear === 'tous' || test.year === selectedYear;
      const typeMatch = selectedType === 'tous' || 
                       (selectedType === 'gratuit' && test.isFree) ||
                       (selectedType === 'payant' && !test.isFree);
      const favoriteMatch = !showFavorites || favorites.includes(test.id);
      const ratingMatch = selectedRating === 'tous' || test.rating >= parseFloat(selectedRating);
      const priceMatch = test.price >= priceRange.min && test.price <= priceRange.max;
      
      return searchMatch && examMatch && subjectMatch && yearMatch && typeMatch && favoriteMatch && ratingMatch && priceMatch;
    });
  }, [allTests, searchQuery, selectedExamType, selectedSubject, selectedYear, selectedType, showFavorites, favorites, selectedRating, priceRange]);

  // Tri des épreuves
  const sortedTests = useMemo(() => {
    return [...filteredTests].sort((a, b) => {
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
  }, [filteredTests, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTests = sortedTests.slice(startIndex, endIndex);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSelectedExamType('tous');
    setSelectedSubject('tous');
    setSelectedYear('tous');
    setSelectedType('tous');
    setSelectedRating('tous');
    setPriceRange({ min: 0, max: 10000 });
    setSearchQuery('');
    setShowFavorites(false);
    setCurrentPage(1);
  };

  const handleAnnouncementClick = () => {
    if (currentAnnouncementIndex === 2) {
      // C'est l'annonce Premium
      navigate('/pricing');
    } else {
      navigate('/login');
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
                <img src="/logo1.png" alt="Win+" />
              </div>
              <span className={styles.logoText}>Win+</span>
            </div>

            <div className={styles.headerSearch}>
              <Search size={18} className={styles.headerSearchIcon} />
              <input
                type="text"
                placeholder="Rechercher une épreuve..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.headerSearchInput}
              />
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

      {/* Announcement Carousel */}
      <div className={styles.announcementBar} style={{ background: announcements[currentAnnouncementIndex].color }}>
        <div className={styles.container}>
          <div className={styles.announcementContent}>
            <div className={styles.announcementText}>
              {currentAnnouncementIndex === 2 ? <Crown size={20} /> : <Zap size={20} />}
              <span>{announcements[currentAnnouncementIndex].text}</span>
            </div>
            <button 
              className={styles.announcementCta}
              onClick={handleAnnouncementClick}
            >
              {announcements[currentAnnouncementIndex].cta}
            </button>
            <div className={styles.announcementDots}>
              {announcements.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.announcementDot} ${index === currentAnnouncementIndex ? styles.active : ''}`}
                  onClick={() => setCurrentAnnouncementIndex(index)}
                  aria-label={`Annonce ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Sidebar Filters */}
            {/* Sidebar Filters */}
<aside className={styles.sidebar}>
  <div className={styles.sidebarWrapper}>
    <div className={styles.sidebarSticky}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarTitle}>
          <Filter size={20} />
          <span>Filtres</span>
        </div>
        {(selectedExamType !== 'tous' || selectedSubject !== 'tous' || selectedYear !== 'tous' || selectedType !== 'tous' || selectedRating !== 'tous' || showFavorites) && (
          <button className={styles.clearFilters} onClick={clearAllFilters}>
            Réinitialiser
          </button>
        )}
      </div>

      <div className={styles.filtersScrollContainer}>
        {/* Favorites Filter */}
        <div className={styles.filterSection}>
          <button 
            className={`${styles.favoritesFilter} ${showFavorites ? styles.active : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Heart size={18} fill={showFavorites ? 'currentColor' : 'none'} />
            <span>Mes favoris ({favorites.length})</span>
          </button>
        </div>

        {/* Type d'examen Filter */}
        <div className={styles.filterSection}>
          <button 
            className={`${styles.filterHeader} ${activeFilter === 'examType' ? styles.active : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'examType' ? null : 'examType')}
          >
            <div className={styles.filterTitleGroup}>
              <Trophy size={16} className={styles.filterIcon} style={{ color: '#8B5CF6' }} />
              <h3 className={styles.filterTitle}>Type d'examen</h3>
            </div>
            <ChevronRight 
              size={18} 
              className={`${styles.filterChevron} ${activeFilter === 'examType' ? styles.open : ''}`}
            />
          </button>
        </div>

        {/* Matière Filter */}
        <div className={styles.filterSection}>
          <button 
            className={`${styles.filterHeader} ${activeFilter === 'subject' ? styles.active : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'subject' ? null : 'subject')}
          >
            <div className={styles.filterTitleGroup}>
              <BookOpen size={16} className={styles.filterIcon} style={{ color: '#3B82F6' }} />
              <h3 className={styles.filterTitle}>Matière</h3>
            </div>
            <ChevronRight 
              size={18} 
              className={`${styles.filterChevron} ${activeFilter === 'subject' ? styles.open : ''}`}
            />
          </button>
        </div>

        {/* Année Filter */}
        <div className={styles.filterSection}>
          <button 
            className={`${styles.filterHeader} ${activeFilter === 'year' ? styles.active : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'year' ? null : 'year')}
          >
            <div className={styles.filterTitleGroup}>
              <Clock size={16} className={styles.filterIcon} style={{ color: '#10B981' }} />
              <h3 className={styles.filterTitle}>Année</h3>
            </div>
            <ChevronRight 
              size={18} 
              className={`${styles.filterChevron} ${activeFilter === 'year' ? styles.open : ''}`}
            />
          </button>
        </div>

        {/* Prix Filter */}
        <div className={styles.filterSection}>
          <button 
            className={`${styles.filterHeader} ${activeFilter === 'type' ? styles.active : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'type' ? null : 'type')}
          >
            <div className={styles.filterTitleGroup}>
              <ShoppingCart size={16} className={styles.filterIcon} style={{ color: '#F59E0B' }} />
              <h3 className={styles.filterTitle}>Prix</h3>
            </div>
            <ChevronRight 
              size={18} 
              className={`${styles.filterChevron} ${activeFilter === 'type' ? styles.open : ''}`}
            />
          </button>
        </div>

        {/* Note Filter */}
        <div className={styles.filterSection}>
          <button 
            className={`${styles.filterHeader} ${activeFilter === 'rating' ? styles.active : ''}`}
            onClick={() => setActiveFilter(activeFilter === 'rating' ? null : 'rating')}
          >
            <div className={styles.filterTitleGroup}>
              <Star size={16} className={styles.filterIcon} style={{ color: '#EF4444' }} />
              <h3 className={styles.filterTitle}>Note</h3>
            </div>
            <ChevronRight 
              size={18} 
              className={`${styles.filterChevron} ${activeFilter === 'rating' ? styles.open : ''}`}
            />
          </button>
        </div>
      </div>
    </div>

    {/* Panneau des sous-filtres à droite - INTÉGRÉ */}
    {activeFilter && (
      <div className={styles.subFilterPanel}>
        <div className={styles.subFilterHeader}>
          <h4 className={styles.subFilterTitle}>
            {activeFilter === 'examType' && 'Type d\'examen'}
            {activeFilter === 'subject' && 'Matière'}
            {activeFilter === 'year' && 'Année'}
            {activeFilter === 'type' && 'Prix'}
            {activeFilter === 'rating' && 'Note'}
          </h4>
          <button 
            className={styles.closeSubFilter}
            onClick={() => setActiveFilter(null)}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.subFilterContent}>
          {/* Type d'examen options */}
          {activeFilter === 'examType' && (
            <div className={styles.filterOptions}>
              {examTypes.map(exam => (
                <label key={exam.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="examType"
                    value={exam.value}
                    checked={selectedExamType === exam.value}
                    onChange={(e) => {
                      setSelectedExamType(e.target.value);
                      setActiveFilter(null);
                    }}
                    className={styles.filterRadio}
                  />
                  <span className={styles.filterLabel}>{exam.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Matière options */}
          {activeFilter === 'subject' && (
            <div className={styles.filterOptions}>
              {subjects.map(subject => (
                <label key={subject.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="subject"
                    value={subject.value}
                    checked={selectedSubject === subject.value}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setActiveFilter(null);
                    }}
                    className={styles.filterRadio}
                  />
                  <span className={styles.filterLabel}>{subject.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Année options */}
          {activeFilter === 'year' && (
            <div className={styles.filterOptions}>
              {years.map(year => (
                <label key={year.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="year"
                    value={year.value}
                    checked={selectedYear === year.value}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setActiveFilter(null);
                    }}
                    className={styles.filterRadio}
                  />
                  <span className={styles.filterLabel}>{year.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Prix options */}
          {activeFilter === 'type' && (
            <div className={styles.filterOptions}>
              {types.map(type => (
                <label key={type.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={selectedType === type.value}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setActiveFilter(null);
                    }}
                    className={styles.filterRadio}
                  />
                  <span className={styles.filterLabel}>{type.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Note options */}
          {activeFilter === 'rating' && (
            <div className={styles.filterOptions}>
              {ratings.map(rating => (
                <label key={rating.value} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="rating"
                    value={rating.value}
                    checked={selectedRating === rating.value}
                    onChange={(e) => {
                      setSelectedRating(e.target.value);
                      setActiveFilter(null);
                    }}
                    className={styles.filterRadio}
                  />
                  <span className={styles.filterLabel}>{rating.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</aside>

            {/* Products Grid */}
            <div className={styles.productsSection}>
              {/* Top Bar */}
              <div className={styles.topBar}>
                <div className={styles.resultsInfo}>
                  <h2>Épreuves disponibles</h2>
                  <p>{sortedTests.length} résultat{sortedTests.length > 1 ? 's' : ''} trouvé{sortedTests.length > 1 ? 's' : ''}</p>
                </div>

                <div className={styles.topBarActions}>
                  <button 
                    className={styles.mobileFilterBtn}
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <Filter size={18} />
                    Filtres
                  </button>

                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="popular">Plus populaires</option>
                    <option value="recent">Plus récents</option>
                    <option value="rating">Mieux notés</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>
              </div>

              {/* Success Banner */}
              <div className={styles.successBanner}>
                <div className={styles.successIcon}>
                  <TrendingUp size={20} />
                </div>
                <div className={styles.successText}>
                  <strong>+2,000 étudiants</strong> ont réussi leurs examens grâce à Win+
                </div>
              </div>

              {/* Products Grid */}
              {currentTests.length > 0 ? (
                <>
                  <div className={styles.productsGrid}>
                    {currentTests.map(test => (
                      <article key={test.id} className={styles.productCard}>
                        <div className={styles.productImageContainer}>
                          <img 
                            src={test.image}
                            alt={test.title}
                            className={styles.productImage}
                          />
                          <button 
                            className={`${styles.favoriteBtn} ${favorites.includes(test.id) ? styles.favorited : ''}`}
                            onClick={() => toggleFavorite(test.id)}
                            aria-label="Ajouter aux favoris"
                          >
                            <Heart size={16} fill={favorites.includes(test.id) ? 'currentColor' : 'none'} />
                          </button>
                          {test.isFree ? (
                            <span className={styles.freeBadge}>Gratuit</span>
                          ) : (
                            <span className={styles.priceBadge}>{test.price} FCFA</span>
                          )}
                        </div>

                        <div className={styles.productContent}>
                          <h3 className={styles.productTitle}>{test.title}</h3>
                          
                          <div className={styles.productMeta}>
                            <div className={styles.productRating}>
                              <Star size={12} fill="#FFA500" color="#FFA500" />
                              <span>{test.rating}</span>
                            </div>
                            <div className={styles.productDownloads}>
                              <Eye size={12} />
                              <span>{test.downloads}</span>
                            </div>
                          </div>

                          <p className={styles.productDescription}>{test.description}</p>
                          
                          <div className={styles.productFooter}>
                            {!test.isFree && (
                              <div className={styles.productPrice}>{test.price} FCFA</div>
                            )}
                            <button 
                              className={test.isFree ? styles.btnDownload : styles.btnAddCart}
                              onClick={() => test.isFree ? null : handleAddToCart(test)}
                              disabled={loadingItems[test.id]}
                            >
                              {test.isFree ? (
                                <>
                                  <Download size={14} />
                                  Télécharger
                                </>
                              ) : (
                                <>
                                  <ShoppingCart size={14} />
                                  {loadingItems[test.id] ? 'Ajout...' : 'Ajouter'}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.paginationBtn}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <div className={styles.paginationNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                className={`${styles.paginationNumber} ${page === currentPage ? styles.active : ''}`}
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className={styles.paginationEllipsis}>...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        className={styles.paginationBtn}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.emptyState}>
                  <BookOpen size={64} className={styles.emptyIcon} />
                  <h3>Aucune épreuve trouvée</h3>
                  <p>Essayez de modifier vos filtres de recherche</p>
                  <button className={styles.btnSecondary} onClick={clearAllFilters}>
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className={styles.mobileFiltersOverlay} onClick={() => setShowMobileFilters(false)}>
          <div className={styles.mobileFiltersModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileFiltersHeader}>
              <h3>Filtres</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.mobileFiltersContent}>
              {/* Copy all filter sections from sidebar */}
              <div className={styles.filterSection}>
                <h3 className={styles.filterTitle}>Type d'examen</h3>
                <div className={styles.filterOptions}>
                  {examTypes.map(exam => (
                    <label key={exam.value} className={styles.filterOption}>
                      <input
                        type="radio"
                        name="examTypeMobile"
                        value={exam.value}
                        checked={selectedExamType === exam.value}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        className={styles.filterRadio}
                      />
                      <span className={styles.filterLabel}>{exam.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.mobileFiltersFooter}>
              <button className={styles.btnSecondary} onClick={clearAllFilters}>
                Réinitialiser
              </button>
              <button className={styles.btnPrimary} onClick={() => setShowMobileFilters(false)}>
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Besoin d'aide avec Win+ ?</h2>
            <p className={styles.sectionSubtitle}>Contactez notre équipe de support</p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <Mail size={32} className={styles.contactIcon} />
              <h3 className={styles.contactCardTitle}>Par Email</h3>
              <p className={styles.contactCardText}>Réponse sous 24h</p>
              <a href="mailto:contact@winplus.cm" className={styles.contactLink}>contact@winplus.cm</a>
            </div>
            <div className={styles.contactCard}>
              <Phone size={32} className={styles.contactIcon} />
              <h3 className={styles.contactCardTitle}>Par Téléphone</h3>
              <p className={styles.contactCardText}>Support direct</p>
              <a href="tel:+237123456789" className={styles.contactLink}>+237 123 456 789</a>
            </div>
            <div className={styles.contactCard}>
              <MapPin size={32} className={styles.contactIcon} />
              <h3 className={styles.contactCardTitle}>Localisation</h3>
              <p className={styles.contactCardText}>Yaoundé, Cameroun</p>
              <span className={styles.contactLink}>Centre-ville</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.container}>
          <div className={styles.bottomCta}>
            <div className={styles.bottomCtaContent}>
              <div className={styles.bottomCtaIcon}>
                <Trophy size={32} />
              </div>
              <div className={styles.bottomCtaText}>
                <h3>Besoin de plus de ressources ?</h3>
                <p>Créez un compte gratuit et accédez à des épreuves exclusives + suivi de progression</p>
              </div>
              <button className={styles.btnCtaPrimary} onClick={() => navigate('/login')}>
                Créer un compte gratuit
              </button>
            </div>
          </div>
        </div>
      </section>

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

                  