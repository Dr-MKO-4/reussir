import React, { useState, useEffect, MouseEvent, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaWhatsapp } from "react-icons/fa";
import { 
  Rocket, Crown, BadgeDollarSign, Cpu, Layers, BookOpen, 
  Mail, Phone, Send, MessageSquare, MapPin, Clock, Search, 
  Users, Trophy, Star, Check, Menu, X, Sun, Moon, Filter, 
  ArrowRight, Zap, Target, Award, Eye, Download, Heart, 
  Shield, ChevronLeft, ChevronRight
} from 'lucide-react';
import styles from './HomePage.module.css';

interface Plan {
  name: string;
  color: "standard" | "premium" | "premium-trial" | "student-plus" | "student-plus-trial";
  price: string | number;
  period: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactMethod: 'email' | 'whatsapp';
}

interface Test {
  id: number;
  title: string;
  subject: string;
  class: string;
  difficulty: string;
  duration: string;
  views: number;
  downloads: number;
  rating: number;
  isFree: boolean;
  image: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('tous');
  const [selectedClass, setSelectedClass] = useState('tous');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentPlanSlide, setCurrentPlanSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Session management
  useEffect(() => {
    const checkAuth = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const timeout = 24 * 60 * 60 * 1000;
      
      if (lastActivity && Date.now() - parseInt(lastActivity) > timeout) {
        logout();
        localStorage.removeItem('lastActivity');
      } else if (isAuthenticated && user) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, logout]);

  // Data
  const subjects = [
    { value: 'tous', label: 'Toutes les matières' },
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'physique', label: 'Physique' },
    { value: 'chimie', label: 'Chimie' },
    { value: 'svt', label: 'SVT' },
    { value: 'francais', label: 'Français' },
    { value: 'philosophie', label: 'Philosophie' },
    { value: 'histoire-geo', label: 'Histoire-Géographie' },
    { value: 'anglais', label: 'Anglais' }
  ];

  const classes = [
    { value: 'tous', label: 'Toutes les classes' },
    { value: 'seconde', label: 'Seconde' },
    { value: 'premiere', label: 'Première' },
    { value: 'terminale', label: 'Terminale' },
    { value: 'licence-1', label: 'Licence 1' },
    { value: 'licence-2', label: 'Licence 2' },
    { value: 'licence-3', label: 'Licence 3' }
  ];

  const freeTests: Test[] = [
    {
      id: 1,
      title: "Baccalauréat Mathématiques 2023",
      subject: "mathematiques",
      class: "terminale",
      difficulty: "Difficile",
      duration: "4h",
      views: 1250,
      downloads: 890,
      rating: 4.8,
      isFree: true,
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Concours ENSPD 2023",
      subject: "physique",
      class: "licence-3",
      difficulty: "Très difficile",
      duration: "3h",
      views: 987,
      downloads: 654,
      rating: 4.9,
      isFree: true,
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "BEPC Camerounais 2023",
      subject: "francais",
      class: "terminale",
      difficulty: "Moyen",
      duration: "2h30",
      views: 2100,
      downloads: 1500,
      rating: 4.6,
      isFree: true,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Informatique - Concours ENSPD",
      subject: "informatique",
      class: "licence-1",
      difficulty: "Moyen",
      duration: "3h",
      views: 1890,
      downloads: 1200,
      rating: 4.7,
      isFree: true,
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Marie Kouakou",
      role: "Étudiante en Licence 3",
      content: "Grâce à Réussir, j'ai pu me préparer efficacement pour mes concours.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Jean-Baptiste Assi",
      role: "Élève de Terminale",
      content: "L'interface est intuitive et les sujets variés. J'ai réussi mon bac avec mention !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
    }
  ];

  const plans: Plan[] = [
    {
      name: "Standard",
      price: "0",
      period: "Gratuit",
      features: [
        "Accès aux épreuves gratuites",
        "Chatbot pédagogique de base",
        "Suivi basique des progrès",
        "Accès au forum communautaire"
      ],
      popular: false,
      ctaText: "Commencer",
      color: "standard"
    },
    {
      name: "Premium",
      price: "2500",
      period: "/mois",
      features: [
        "Accès à toutes les épreuves",
        "Chatbot IA avancé",
        "Corrections personnalisées",
        "Support prioritaire",
        "Téléchargements illimités"
      ],
      popular: true,
      ctaText: "Essayer Premium",
      color: "premium"
    },
    {
      name: "Étudiant+",
      price: "5000",
      period: "/trimestre",
      features: [
        "Tous les avantages Premium",
        "Coaching individuel",
        "Annales exclusives",
        "Statistiques avancées",
        "Certificat de réussite"
      ],
      popular: false,
      ctaText: "Choisir Étudiant+",
      color: "student-plus"
    },
    {
      name: "Premium 2 semaines",
      price: "1500",
      period: "/2 semaines",
      features: [
        "Tous les avantages Premium",
        "Période d'essai courte",
        "Sans engagement"
      ],
      popular: false,
      ctaText: "Essayer",
      color: "premium-trial"
    },
    {
      name: "Étudiant+ 2 semaines",
      price: "2000",
      period: "/2 semaines",
      features: [
        "Tous les avantages Étudiant+",
        "Coaching intensif",
        "Garantie satisfaction"
      ],
      popular: false,
      ctaText: "Essayer",
      color: "student-plus-trial"
    }
  ];

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const filteredTests = freeTests.filter(test => {
    const subjectMatch = selectedSubject === 'tous' || test.subject === selectedSubject;
    const classMatch = selectedClass === 'tous' || test.class === selectedClass;
    return subjectMatch && classMatch;
  });

  const getDifficultyClass = (difficulty: string): string => {
    const map: Record<string, string> = {
      'Facile': styles.difficultyEasy,
      'Moyen': styles.difficultyMedium,
      'Difficile': styles.difficultyHard,
      'Très difficile': styles.difficultyVeryHard
    };
    return map[difficulty] || styles.difficultyDefault;
  };

  const handleSmoothScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlanNext = () => {
    setCurrentPlanSlide((prev) => (prev + 1) % 2);
  };

  const handlePlanPrev = () => {
    setCurrentPlanSlide((prev) => (prev - 1 + 2) % 2);
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (contactForm.contactMethod === 'whatsapp') {
        const phone = "+237123456789";
        const msg = `Bonjour, je suis ${contactForm.name}. ${contactForm.message}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      } else {
        window.location.href = `mailto:contact@reussir.com?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(`Nom: ${contactForm.name}\nEmail: ${contactForm.email}\n\n${contactForm.message}`)}`;
      }
      
      setContactForm({
        name: '', email: '', phone: '', subject: '', message: '', contactMethod: 'email'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.rp} ${isDarkMode ? styles.dark : ''}`}>
      {/* Header */}
      <header className={`${styles.rpHeader} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.rpContainer}>
          <div className={styles.rpHeaderContent}>
            <div className={styles.rpLogo} onClick={() => handleSmoothScroll('hero')}>
              <img src="/ReussirLogo1.png" alt="Réussir" className={styles.rpLogoImage} />
              <span className={styles.rpLogoText}>Réussir</span>
            </div>

            <nav className={styles.rpNav}>
              <a href="#catalog" onClick={(e) => { e.preventDefault(); handleSmoothScroll('catalog'); }}>Catalogue</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); handleSmoothScroll('pricing'); }}>Plans</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleSmoothScroll('contact'); }}>Contact</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); handleSmoothScroll('about'); }}>À propos</a>
            </nav>

            <div className={styles.rpHeaderActions}>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={styles.rpThemeToggle} aria-label="Toggle theme">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {isAuthenticated && user ? (
                <>
                  <button onClick={() => navigate('/dashboard')} className={styles.rpBtnSecondary}>
                    Tableau de bord
                  </button>
                  <button onClick={logout} className={styles.rpBtnPrimary}>Déconnexion</button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className={styles.rpBtnSecondary}>Connexion</button>
                  <button onClick={() => navigate('/signup')} className={styles.rpBtnPrimary}>Inscription</button>
                </>
              )}

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.rpMobileToggle}>
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.rpMobileMenu}>
            <a href="#catalog" onClick={(e) => { e.preventDefault(); handleSmoothScroll('catalog'); setIsMobileMenuOpen(false); }}>Catalogue</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); handleSmoothScroll('pricing'); setIsMobileMenuOpen(false); }}>Plans</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); handleSmoothScroll('contact'); setIsMobileMenuOpen(false); }}>Contact</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); handleSmoothScroll('about'); setIsMobileMenuOpen(false); }}>À propos</a>
            
            <div className={styles.rpMobileActions}>
              {isAuthenticated ? (
                <>
                  <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className={styles.rpBtnSecondary}>Tableau de bord</button>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className={styles.rpBtnPrimary}>Déconnexion</button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className={styles.rpBtnSecondary}>Connexion</button>
                  <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }} className={styles.rpBtnPrimary}>Inscription</button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className={styles.rpHero}>
        <div className={styles.rpContainer}>
          <div className={styles.rpHeroContent}>
            <div className={styles.rpHeroText}>
              <h1 className={styles.rpHeroTitle}>
                <span className={styles.accent}>Réussissez</span> vos concours avec <span className={styles.accent}>confiance</span>
              </h1>
              <p className={styles.rpHeroSubtitle}>
                Accédez à des milliers d'annales corrigées avec une assistance pédagogique intelligente pour maximiser vos chances de réussite.
              </p>

              <div className={styles.rpHeroStats}>
                <div className={styles.rpHeroStat}>
                  <span className={styles.number}>2000+</span>
                  <span className={styles.label}>Étudiants</span>
                </div>
                <div className={styles.rpHeroStat}>
                  <span className={styles.number}>1000+</span>
                  <span className={styles.label}>Épreuves</span>
                </div>
                <div className={styles.rpHeroStat}>
                  <span className={styles.number}>95%</span>
                  <span className={styles.label}>Réussite</span>
                </div>
              </div>

              <div className={styles.rpHeroActions}>
                {isAuthenticated ? (
                  <button onClick={() => navigate('/dashboard')} className={styles.rpBtnPrimary}>
                    Tableau de bord <ArrowRight size={20} />
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleSmoothScroll('catalog')} className={styles.rpBtnPrimary}>
                      Découvrir <ArrowRight size={20} />
                    </button>
                    <button onClick={() => navigate('/signup')} className={styles.rpBtnSecondary}>
                      <Users size={20} /> S'inscrire
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.rpHeroImage}>
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop" 
                alt="Étudiants camerounais en train d'étudier"
                className={styles.heroImg}
              />
              <div className={styles.rpHeroBadge}>
                <Trophy size={24} />
                <span>Plateforme #1 au Cameroun</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.rpFeatures}>
        <div className={styles.rpContainer}>
          <div className={styles.rpSectionHeader}>
            <span className={styles.rpBadge}><Zap size={16} /> Fonctionnalités</span>
            <h2 className={styles.rpSectionTitle}>Pourquoi choisir Réussir ?</h2>
            <p className={styles.rpSectionSubtitle}>Des outils puissants propulsés par l'IA</p>
          </div>

          <div className={styles.rpFeaturesGrid}>
            {[
              { icon: Rocket, title: "Accès instantané", desc: "Téléchargez immédiatement vos annales corrigées" },
              { icon: Cpu, title: "IA Pédagogique", desc: "Assistant intelligent qui s'adapte à votre niveau" },
              { icon: Target, title: "Suivi Intelligent", desc: "Analysez vos progrès en temps réel" },
              { icon: Users, title: "Communauté", desc: "Rejoignez une communauté d'étudiants brillants" }
            ].map((feature, i) => (
              <div key={i} className={styles.rpFeatureCard}>
                <div className={styles.rpFeatureIcon}><feature.icon size={28} /></div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className={styles.rpCatalog}>
        <div className={styles.rpContainer}>
          <div className={styles.rpSectionHeader}>
            <span className={styles.rpBadge}><BookOpen size={16} /> Catalogue</span>
            <h2 className={styles.rpSectionTitle}>Épreuves gratuites</h2>
            <p className={styles.rpSectionSubtitle}>Commencez votre préparation dès maintenant</p>
          </div>

          <div className={styles.rpFilters}>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className={styles.rpSelect}>
              {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className={styles.rpSelect}>
              {classes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className={styles.rpTestsGrid}>
            {filteredTests.map(test => (
              <article key={test.id} className={styles.rpTestCard}>
                <div className={styles.rpTestImage}>
                  <img src={test.image} alt={test.title} loading="lazy" />
                  <span className={getDifficultyClass(test.difficulty)}>{test.difficulty}</span>
                  <button className={styles.rpFavorite} aria-label="Favori"><Heart size={16} /></button>
                </div>
                <div className={styles.rpTestContent}>
                  <h3>{test.title}</h3>
                  <div className={styles.rpTestMeta}>
                    <span><Clock size={14} /> {test.duration}</span>
                    <span><Eye size={14} /> {test.views}</span>
                    <span><Download size={14} /> {test.downloads}</span>
                  </div>
                  <div className={styles.rpTestFooter}>
                    <div className={styles.rpRating}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(test.rating) ? styles.filled : styles.empty} />
                      ))}
                      <span>({test.rating})</span>
                    </div>
                    <span className={styles.rpFree}>GRATUIT</span>
                  </div>
                  <button className={styles.rpBtnPrimary}><Download size={16} /> Télécharger</button>
                </div>
              </article>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className={styles.rpNoResults}>
              <Search size={48} />
              <h3>Aucune épreuve trouvée</h3>
              <p>Modifiez vos filtres</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.rpTestimonials}>
        <div className={styles.rpContainer}>
          <div className={styles.rpSectionHeader}>
            <span className={styles.rpBadge}><MessageSquare size={16} /> Témoignages</span>
            <h2 className={styles.rpSectionTitle}>Ce que disent nos utilisateurs</h2>
          </div>

          <div className={styles.rpTestimonialCard}>
            <img src={testimonials[currentTestimonial].avatar} alt={testimonials[currentTestimonial].name} />
            <div className={styles.rpStars}>
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className={styles.filled} />)}
            </div>
            <p className={styles.rpTestimonialText}>"{testimonials[currentTestimonial].content}"</p>
            <h4>{testimonials[currentTestimonial].name}</h4>
            <p className={styles.rpTestimonialRole}>{testimonials[currentTestimonial].role}</p>
          </div>

          <div className={styles.rpDots}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrentTestimonial(i)} className={i === currentTestimonial ? styles.active : ''} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.rpPricing}>
        <div className={styles.rpContainer}>
          <div className={styles.rpSectionHeader}>
            <span className={styles.rpBadge}><BadgeDollarSign size={16} /> Plans</span>
            <h2 className={styles.rpSectionTitle}>Choisissez votre <span className={styles.accent}>formule</span></h2>
            <p className={styles.rpSectionSubtitle}>Des plans adaptés à tous les besoins</p>
          </div>

          {/* 3 plans principaux */}
          <div className={styles.rpPricingGrid}>
            {plans.slice(0, 3).map((plan, i) => (
              <div key={i} className={`${styles.rpPlanCard} ${plan.popular ? styles.popular : ''}`}>
                {plan.popular && <span className={styles.rpPopularBadge}>★ Le plus populaire</span>}
                <div className={styles.rpPlanIcon}>
                  {plan.color === 'standard' && <Users size={24} />}
                  {plan.color === 'premium' && <Star size={24} />}
                  {plan.color === 'student-plus' && <Crown size={24} />}
                </div>
                <h3>{plan.name}</h3>
                <div className={styles.rpPlanPrice}>
                  <span className={styles.amount}>{plan.price}</span>
                  {plan.period !== 'Gratuit' && <span className={styles.period}>FCFA{plan.period}</span>}
                </div>
                {plan.period === 'Gratuit' && <span className={styles.period}>{plan.period}</span>}
                <ul className={styles.rpPlanFeatures}>
                  {plan.features.map((f, j) => (
                    <li key={j}><Check size={16} /> {f}</li>
                  ))}
                </ul>
                <button className={styles.rpBtnPrimary}>{plan.ctaText}</button>
              </div>
            ))}
          </div>

          {/* Carousel pour 2 autres plans */}
          <div className={styles.rpPlanCarousel}>
            <button onClick={handlePlanPrev} className={styles.rpCarouselBtn} aria-label="Précédent">
              <ChevronLeft size={24} />
            </button>

            <div className={styles.rpCarouselTrack} style={{ transform: `translateX(-${currentPlanSlide * 100}%)` }}>
              {plans.slice(3).map((plan, i) => (
                <div key={i} className={styles.rpCarouselSlide}>
                  <div className={styles.rpPlanCard}>
                    <div className={styles.rpPlanIcon}>
                      {plan.color === 'premium-trial' && <Zap size={24} />}
                      {plan.color === 'student-plus-trial' && <Zap size={24} />}
                    </div>
                    <h3>{plan.name}</h3>
                    <div className={styles.rpPlanPrice}>
                      <span className={styles.amount}>{plan.price}</span>
                      <span className={styles.period}>FCFA{plan.period}</span>
                    </div>
                    <ul className={styles.rpPlanFeatures}>
                      {plan.features.map((f, j) => (
                        <li key={j}><Check size={16} /> {f}</li>
                      ))}
                    </ul>
                    <button className={styles.rpBtnPrimary}>{plan.ctaText}</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handlePlanNext} className={styles.rpCarouselBtn} aria-label="Suivant">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className={styles.rpCarouselDots}>
            {[0, 1].map(i => (
              <button key={i} onClick={() => setCurrentPlanSlide(i)} className={i === currentPlanSlide ? styles.active : ''} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={styles.rpAbout}>
        <div className={styles.rpContainer}>
          <div className={styles.rpSectionHeader}>
            <span className={styles.rpBadge}><Users size={16} /> À propos</span>
            <h2 className={styles.rpSectionTitle}>Notre mission</h2>
            <p className={styles.rpSectionSubtitle}>Démocratiser l'accès à une éducation de qualité</p>
          </div>

          <div className={styles.rpAboutContent}>
            <div className={styles.rpAboutText}>
              <h3>Une plateforme née de la passion pour l'éducation</h3>
              <p>
                Réussir est née du constat que de nombreux étudiants talentueux au Cameroun manquent d'accès 
                à des ressources de qualité pour préparer leurs concours. Notre mission est de démocratiser 
                l'accès à une préparation d'excellence.
              </p>
            </div>

            <div className={styles.rpAboutStats}>
              <div className={styles.rpAboutStat}>
                <BookOpen size={32} />
                <span className={styles.number}>1000+</span><span className={styles.label}>Épreuves</span>
          </div>
          <div className={styles.rpAboutStat}>
            <Users size={32} />
            <span className={styles.number}>2000+</span>
            <span className={styles.label}>Étudiants</span>
          </div>
          <div className={styles.rpAboutStat}>
            <Trophy size={32} />
            <span className={styles.number}>95%</span>
            <span className={styles.label}>Réussite</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Contact */}
  <section id="contact" className={styles.rpContact}>
    <div className={styles.rpContainer}>
      <div className={styles.rpSectionHeader}>
        <span className={styles.rpBadge}><MessageSquare size={16} /> Contact</span>
        <h2 className={styles.rpSectionTitle}>Contactez-nous</h2>
        <p className={styles.rpSectionSubtitle}>Notre équipe est là pour vous</p>
      </div>

      <div className={styles.rpContactContent}>
        <div className={styles.rpContactInfo}>
          <div className={styles.rpContactCard}>
            <Mail size={32} />
            <h3>Par Email</h3>
            <p>Réponse sous 24h</p>
            <a href="mailto:contact@reussir.com">contact@reussir.com</a>
          </div>

          <div className={styles.rpContactCard}>
            <FaWhatsapp size={32} />
            <h3>Par WhatsApp</h3>
            <p>Réponse rapide</p>
            <a href="https://wa.me/237123456789" target="_blank" rel="noopener noreferrer">+237 123 456 789</a>
          </div>

          <div className={styles.rpContactCard}>
            <MapPin size={32} />
            <h3>Localisation</h3>
            <p>Yaoundé, Cameroun</p>
          </div>
        </div>

        <form className={styles.rpContactForm} onSubmit={handleContactSubmit}>
          <h3>Envoyez un message</h3>
          
          <div className={styles.rpMethodSelector}>
            <label className={contactForm.contactMethod === 'email' ? styles.active : ''}>
              <input type="radio" name="contactMethod" value="email" checked={contactForm.contactMethod === 'email'} onChange={() => setContactForm(prev => ({ ...prev, contactMethod: 'email' }))} />
              <Mail size={20} /> Email
            </label>
            <label className={contactForm.contactMethod === 'whatsapp' ? styles.active : ''}>
              <input type="radio" name="contactMethod" value="whatsapp" checked={contactForm.contactMethod === 'whatsapp'} onChange={() => setContactForm(prev => ({ ...prev, contactMethod: 'whatsapp' }))} />
              <FaWhatsapp size={20} /> WhatsApp
            </label>
          </div>

          <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} placeholder="Nom complet *" required />
          
          {contactForm.contactMethod === 'email' ? (
            <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} placeholder="Email *" required />
          ) : (
            <input type="tel" name="phone" value={contactForm.phone} onChange={handleContactChange} placeholder="Téléphone WhatsApp *" required />
          )}

          <select name="subject" value={contactForm.subject} onChange={handleContactChange} required>
            <option value="">Choisissez un sujet</option>
            <option value="support">Support technique</option>
            <option value="general">Question générale</option>
            <option value="payment">Paiement</option>
            <option value="other">Autre</option>
          </select>

          <textarea name="message" value={contactForm.message} onChange={handleContactChange} rows={5} placeholder="Votre message *" required />

          <button type="submit" disabled={isSubmitting} className={styles.rpBtnPrimary}>
            {isSubmitting ? 'Envoi...' : <><Send size={20} /> Envoyer</>}
          </button>
        </form>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className={styles.rpFooter}>
    <div className={styles.rpContainer}>
      <div className={styles.rpFooterContent}>
        <div className={styles.rpFooterSection}>
          <div className={styles.rpLogo}>
            <img src="/ReussirLogo1.png" alt="Réussir" />
            <span>Réussir</span>
          </div>
          <p>La plateforme de référence pour les concours au Cameroun</p>
          <div className={styles.rpSocial}>
            <button aria-label="Email"><Mail size={20} /></button>
            <button aria-label="Chat"><MessageSquare size={20} /></button>
            <button aria-label="Phone"><Phone size={20} /></button>
          </div>
        </div>

        <div className={styles.rpFooterSection}>
          <h4>Plateforme</h4>
          <a href="#catalog">Catalogue</a>
          <a href="#pricing">Plans</a>
          <a href="#chatbot">Chatbot IA</a>
        </div>

        <div className={styles.rpFooterSection}>
          <h4>Support</h4>
          <a href="#help">Aide</a>
          <a href="#contact">Contact</a>
          <a href="#faq">FAQ</a>
        </div>

        <div className={styles.rpFooterSection}>
          <h4>Légal</h4>
          <a href="#terms">CGU</a>
          <a href="#privacy">Confidentialité</a>
          <a href="#legal">Mentions légales</a>
        </div>
      </div>

      <div className={styles.rpFooterBottom}>
        <p>&copy; 2024 Réussir. Tous droits réservés.</p>
        <div className={styles.rpBadges}>
          <span><Shield size={16} /> Sécurisé</span>
          <span><Award size={16} /> Certifié</span>
        </div>
      </div>
    </div>
  </footer>
</div>);
};
export default HomePage;