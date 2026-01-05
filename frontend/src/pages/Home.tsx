import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import catalogService from '../services/catalogService';
import { useToast } from '../hooks/useToast';
import styles from './Catalog.module.css';
import { 
  Search, 
  TrendingUp, 
  BookOpen, 
  Award,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle,
  ShoppingCart,
  Heart,
  Star,
  Download,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  Trophy,
  Phone,
  Mail,
  MapPin,
  Zap,
  Crown,
  Eye
} from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart } = useCartContext();
  const { showSuccess, showError } = useToast();
  
  const [popularSubjects, setPopularSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

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

  const toggleFavorite = (subjectId: string) => {
    setFavorites(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
    showSuccess(favorites.includes(subjectId) ? 'Retiré des favoris' : 'Ajouté aux favoris');
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

  const handleAddToCart = async (subject: any) => {
    try {
      setLoadingItems(prev => ({ ...prev, [subject.id]: true }));
      showSuccess(`"${subject.title}" ajouté au panier`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      showError(error.message || 'Erreur lors de l\'ajout au panier');
    } finally {
      setLoadingItems(prev => ({ ...prev, [subject.id]: false }));
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header - Same as CatalogPage */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
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
                className={styles.headerSearchInput}
                onFocus={() => navigate('/catalog')}
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

              <button className={styles.btnPrimary} onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}>
                {isAuthenticated ? 'Tableau de bord' : 'Connexion'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Announcement Carousel */}
      <div className={styles.announcementBar} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className={styles.container}>
          <div className={styles.announcementContent}>
            <div className={styles.announcementText}>
              <Sparkles size={20} />
              <span>Réussissez vos examens avec l'IA - Plus de 10,000 sujets disponibles</span>
            </div>
            <button 
              className={styles.announcementCta}
              onClick={() => navigate('/catalog')}
            >
              Découvrir le catalogue
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Hero Section */}
          <section style={{ paddingTop: '60px', paddingBottom: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#E0F2FE', color: '#0284C7', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', marginBottom: '20px' }}>
                  <Sparkles size={16} />
                  <span>Propulsé par l'Intelligence Artificielle</span>
                </div>
                
                <h1 style={{ fontSize: '48px', fontWeight: 'bold', lineHeight: '1.2', color: '#111827', marginBottom: '20px' }}>
                  Réussissez vos <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>examens</span> avec l'IA
                </h1>
                
                <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '30px', lineHeight: '1.6' }}>
                  Accédez à des milliers de sujets d'examens et concours avec des recommandations personnalisées par intelligence artificielle.
                </p>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button 
                    className={styles.btnPrimary}
                    onClick={() => navigate('/catalog')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Search size={20} />
                    Découvrir les sujets
                  </button>
                  
                  {!isAuthenticated && (
                    <button 
                      className={styles.btnSecondary}
                      onClick={() => navigate('/signup')}
                    >
                      Créer un compte gratuit
                    </button>
                  )}
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <BookOpen size={120} style={{ color: 'white' }} />
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              {stats.map((stat, index) => (
                <div key={index} style={{ padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
                  <div style={{ color: '#667eea', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                    <stat.icon size={32} />
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>{stat.value}</div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Pourquoi nous choisir ?</h2>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>Une plateforme complète pour maximiser vos chances de réussite</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {features.map((feature, index) => (
                <div key={index} style={{ padding: '24px', background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}>
                  <div style={{ color: '#667eea', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <feature.icon size={32} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Subjects Section */}
          <section style={{ paddingTop: '40px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Sujets populaires</h2>
                <p style={{ fontSize: '16px', color: '#6B7280' }}>Les sujets les plus consultés cette semaine</p>
              </div>
              <button 
                className={styles.btnGhost}
                onClick={() => navigate('/catalog')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Voir tout
                <ArrowRight size={20} />
              </button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ display: 'inline-block', fontSize: '14px', color: '#6B7280' }}>Chargement des sujets...</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {popularSubjects.length > 0 ? (
                  popularSubjects.map((subject) => (
                    <div key={subject.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        {subject.image && <img src={subject.image} alt={subject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        <button 
                          style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => toggleFavorite(subject.id)}
                        >
                          <Heart size={18} fill={favorites.includes(subject.id) ? '#EF4444' : 'none'} color={favorites.includes(subject.id) ? '#EF4444' : '#9CA3AF'} />
                        </button>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '4px 8px', borderRadius: '4px' }}>{subject.category || 'Général'}</span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>{subject.title}</h3>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>{subject.description}</p>
                        <button 
                          className={styles.btnAddCart}
                          onClick={() => handleAddToCart(subject)}
                          disabled={loadingItems[subject.id]}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <ShoppingCart size={16} />
                          {loadingItems[subject.id] ? 'Ajout...' : 'Ajouter au panier'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
                    <BookOpen size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                    <p style={{ color: '#6B7280' }}>Aucun sujet disponible</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* CTA Section */}
          {!isAuthenticated && (
            <section style={{ paddingTop: '40px', paddingBottom: '60px' }}>
              <div style={{ padding: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px', textAlign: 'center', color: 'white' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
                  Prêt à commencer votre préparation ?
                </h2>
                <p style={{ fontSize: '16px', marginBottom: '30px', opacity: 0.95 }}>
                  Créez votre compte gratuitement et accédez à des milliers de sujets avec recommandations IA personnalisées.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button 
                    className={styles.btnPrimary}
                    onClick={() => navigate('/signup')}
                  >
                    Créer un compte gratuit
                  </button>
                  <button 
                    className={styles.btnSecondary}
                    onClick={() => navigate('/login')}
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer - Same as CatalogPage */}
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

export default Home;