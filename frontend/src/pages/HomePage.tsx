import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, Trophy, Users, Star, Download, Clock, 
  Eye, ChevronRight, Mail, Phone, MessageSquare, MapPin,
  Check, Menu, X, Award, Shield, Zap, Target, Cpu,
  Facebook, Twitter, Linkedin, Instagram, ChevronLeft
} from 'lucide-react';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('tous');
  const [selectedClass, setSelectedClass] = useState('tous');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentPlanSlide, setCurrentPlanSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const subjects = [
    { value: 'tous', label: 'Toutes les matières' },
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'physique', label: 'Physique' },
    { value: 'chimie', label: 'Chimie' },
    { value: 'svt', label: 'SVT' },
    { value: 'francais', label: 'Français' },
  ];

  const classes = [
    { value: 'tous', label: 'Toutes les classes' },
    { value: 'seconde', label: 'Seconde' },
    { value: 'premiere', label: 'Première' },
    { value: 'terminale', label: 'Terminale' },
  ];

  const testImages = {
    mathematiques: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    physique: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=200&fit=crop",
    francais: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop"
  };

  const freeTests = [
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
      image: testImages.mathematiques
    },
    {
      id: 2,
      title: "Physique ENSPD 2023",
      subject: "physique",
      class: "terminale",
      difficulty: "Très difficile",
      duration: "3h",
      views: 987,
      downloads: 654,
      rating: 4.9,
      isFree: true,
      image: testImages.physique
    },
    {
      id: 3,
      title: "Epreuve francais BAC Camerounais 2023",
      subject: "francais",
      class: "terminale",
      difficulty: "Moyen",
      duration: "2h30",
      views: 2100,
      downloads: 1500,
      rating: 4.6,
      isFree: true,
      image: testImages.francais
    },
  ];

  const testimonials = [
    {
      name: "Marie Kouakou",
      role: "Étudiante en Licence 3",
      content: "Grâce à Win+, j'ai pu me préparer efficacement pour mes concours. Les ressources sont de qualité et l'interface est très intuitive.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Jean-Baptiste Assi",
      role: "Élève de Terminale",
      content: "L'interface est intuitive et les sujets variés. J'ai réussi mon bac avec mention grâce aux annales disponibles sur Win+!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Aminata Diallo",
      role: "Étudiante en Médecine",
      content: "Le chatbot IA m'a beaucoup aidée à comprendre des concepts difficiles. C'est comme avoir un professeur disponible 24h/24!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
    },
    {
      name: "Paul Mbarga",
      role: "Élève de Première",
      content: "Les corrections personnalisées et le suivi des progrès m'ont vraiment motivé. J'ai amélioré mes notes de façon spectaculaire!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
    }
  ];

  const plans = [
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
      icon: Users,
    },
    {
      name: "2 Semaines",
      price: "1750",
      period: "/2 semaines",
      features: [
        "Accès à toutes les épreuves",
        "Chatbot IA avancé",
        "Corrections de base",
        "Support standard"
      ],
      popular: false,
      icon: Clock,
    },
    {
      name: "Premium",
      price: "3500",
      period: "/mois",
      features: [
        "Accès à toutes les épreuves",
        "Chatbot IA avancé",
        "Corrections personnalisées",
        "Support prioritaire",
        "Téléchargements illimités"
      ],
      popular: true,
      icon: Star,
    },
    {
      name: "Étudiant+",
      price: "6000",
      period: "/trimestre",
      features: [
        "Tous les avantages Premium",
        "Coaching individuel",
        "Annales exclusives",
        "Statistiques avancées",
        "Certificat de réussite"
      ],
      popular: false,
      icon: Trophy,
    },
    {
      name: "Annuel",
      price: "20000",
      period: "/an",
      features: [
        "Tous les avantages Étudiant+",
        "3 mois gratuits",
        "Séances de groupe",
        "Accès à vie aux ressources",
        "Badge premium"
      ],
      popular: false,
      icon: Award,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTests = freeTests.filter(test => {
    const subjectMatch = selectedSubject === 'tous' || test.subject === selectedSubject;
    const classMatch = selectedClass === 'tous' || test.class === selectedClass;
    return subjectMatch && classMatch;
  });

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const visiblePlans = plans.slice(currentPlanSlide, currentPlanSlide + 3);
  const canGoNext = currentPlanSlide < plans.length - 3;
  const canGoPrev = currentPlanSlide > 0;

  const nextPlans = () => {
    if (canGoNext) {
      setCurrentPlanSlide(prev => prev + 1);
    }
  };

  const prevPlans = () => {
    if (canGoPrev) {
      setCurrentPlanSlide(prev => prev - 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logo} onClick={() => scrollToSection('hero')}>
              <div className={styles.logoIcon}>  
                <img src="\WhatsApp Image 2025-12-06 à 18.05.03_606bc515.JPG" alt="Win+" />
              </div>
              <span className={styles.logoText}>Win+</span>
            </div>

            <nav className={styles.nav}>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a>
              <a href="#catalog" onClick={(e) => { e.preventDefault(); scrollToSection('catalog'); }}>Catalogue</a>
              <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Plans</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À propos</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            </nav>

            <div className={styles.headerActions}>
              <div className={styles.searchContainer}>
                <Search size={20} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className={styles.btnPrimary}>Connexion</button>
              <button className={styles.btnSecondary}>Inscription</button>

              <button 
                className={styles.mobileToggle}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Accueil</a>
            <a href="#catalog" onClick={(e) => { e.preventDefault(); scrollToSection('catalog'); }}>Catalogue</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Plans</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>À propos</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
            <div className={styles.mobileActions}>
              <button className={styles.btnPrimary}>Connexion</button>
              <button className={styles.btnSecondary}>Inscription</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Bienvenue dans la communauté <span className={styles.accent}>Win+</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Le site pour obtenir de l'aide, poser des questions et contribuer à la plateforme d'épreuves en ligne Win+.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <BookOpen size={32} className={styles.statIcon} />
                  <div>
                    <div className={styles.statNumber}>1,000+</div>
                    <div className={styles.statLabel}>Épreuves</div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <Users size={32} className={styles.statIcon} />
                  <div>
                    <div className={styles.statNumber}>2,000+</div>
                    <div className={styles.statLabel}>Étudiants</div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <Trophy size={32} className={styles.statIcon} />
                  <div>
                    <div className={styles.statNumber}>95%</div>
                    <div className={styles.statLabel}>Réussite</div>
                  </div>
                </div>
              </div>

              <button className={styles.btnLarge} onClick={() => scrollToSection('catalog')}>
                Participer <ChevronRight size={20} />
              </button>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.heroImageWrapper}>
                <img 
                  src="\felipe-gregate-Ph2KD5qr7VQ-unsplash.jpg"
                  alt="Étudiants africains"
                  className={styles.heroImage}
                />
                <div className={styles.heroImageOverlay}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <Zap size={16} /> Fonctionnalités
            </div>
            <h2 className={styles.sectionTitle}>Pourquoi choisir Win+ ?</h2>
            <p className={styles.sectionSubtitle}>Des outils puissants pour votre réussite</p>
          </div>

          <div className={styles.featuresGrid}>
            {[
              { icon: Cpu, title: "IA Pédagogique", desc: "Assistant intelligent qui s'adapte à votre niveau" },
              { icon: Target, title: "Suivi Intelligent", desc: "Analysez vos progrès en temps réel" },
              { icon: BookOpen, title: "Accès instantané", desc: "Téléchargez immédiatement vos annales corrigées" },
              { icon: Users, title: "Communauté", desc: "Rejoignez une communauté d'étudiants brillants" }
            ].map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon size={32} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className={styles.catalog}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <BookOpen size={16} /> Catalogue
            </div>
            <h2 className={styles.sectionTitle}>Épreuves gratuites</h2>
            <p className={styles.sectionSubtitle}>Commencez votre préparation dès maintenant</p>
          </div>

          <div className={styles.filters}>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={styles.select}
            >
              {subjects.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles.select}
            >
              {classes.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className={styles.testsGrid}>
            {filteredTests.map(test => (
              <article key={test.id} className={styles.testCard}>
                <div className={styles.testImageContainer}>
                  <img 
                    src={test.image}
                    alt={test.title}
                    className={styles.testImage}
                  />
                  <span className={styles.difficulty}>{test.difficulty}</span>
                </div>
                <div className={styles.testContent}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
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
                    <span className={styles.freeTag}>GRATUIT</span>
                  </div>
                  <button className={styles.btnCardPrimary}>
                    <Download size={16} /> Télécharger
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.catalogCTA}>
            <button className={styles.btnLarge}>
              Voir tout le catalogue <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <MessageSquare size={16} /> Témoignages
            </div>
            <h2 className={styles.sectionTitle}>Ce que disent nos utilisateurs</h2>
          </div>

          <div className={styles.testimonialCard}>
            <img 
              src={testimonials[currentTestimonial].image}
              alt={testimonials[currentTestimonial].name}
              className={styles.testimonialImage}
            />
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#FF8C00" color="#FF8C00" />
              ))}
            </div>
            <p className={styles.testimonialText}>"{testimonials[currentTestimonial].content}"</p>
            <h4 className={styles.testimonialName}>{testimonials[currentTestimonial].name}</h4>
            <p className={styles.testimonialRole}>{testimonials[currentTestimonial].role}</p>

            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`${styles.dot} ${i === currentTestimonial ? styles.dotActive : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <Award size={16} /> Plans
            </div>
            <h2 className={styles.sectionTitle}>Choisissez votre <span className={styles.accent}>formule</span></h2>
            <p className={styles.sectionSubtitle}>Des plans adaptés à tous les besoins</p>
          </div>

          <div className={styles.pricingContainer}>
            <button 
              onClick={prevPlans}
              className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
              disabled={!canGoPrev}
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.pricingGrid}>
              {visiblePlans.map((plan, i) => (
                <div 
                  key={currentPlanSlide + i} 
                  className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
                >
                  {plan.popular && (
                    <div className={styles.popularBadge}>
                      ★ Le plus populaire
                    </div>
                  )}
                  <div className={styles.planIcon}>
                    <plan.icon size={32} />
                  </div>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.priceAmount}>{plan.price}</span>
                    {plan.period !== 'Gratuit' && <span className={styles.pricePeriod}>FCFA{plan.period}</span>}
                  </div>
                  {plan.period === 'Gratuit' && <span className={styles.pricePeriod}>{plan.period}</span>}
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f, j) => (
                      <li key={j} className={styles.planFeature}>
                        <Check size={16} color="#1A4D5E" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={plan.popular ? styles.btnCardPrimary : styles.btnCardSecondary}>
                    Choisir ce plan
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={nextPlans}
              className={`${styles.carouselBtn} ${styles.carouselBtnNext}`}
              disabled={!canGoNext}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className={styles.pricingDots}>
            {Array.from({ length: plans.length - 2 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPlanSlide(i)}
                className={`${styles.pricingDot} ${i === currentPlanSlide ? styles.pricingDotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutLeft}>
              <div className={styles.badge}>
                <Users size={16} /> À propos
              </div>
              <h2 className={styles.aboutTitle}>Notre vision produit</h2>
              <p className={styles.aboutText}>
                Plongez dans notre vision et découvrez comment notre processus transforme les idées en solutions d'apprentissage percutantes.
              </p>
              <p className={styles.aboutText}>
                Win+ est née du constat que de nombreux étudiants talentueux au Cameroun manquent d'accès à des ressources de qualité pour préparer leurs concours.
              </p>
              <button className={styles.btnLarge}>
                Suivre notre vision <ChevronRight size={20} />
              </button>
            </div>
            <div className={styles.aboutRight}>
              <img 
                src="\desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg"
                alt="Équipe Win+"
                className={styles.aboutImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <MessageSquare size={16} /> Contact
            </div>
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
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <div className={styles.footerLogo}>
                <div className={styles.logoIcon}>  
                <img src="\WhatsApp Image 2025-12-06 à 18.05.03_606bc515.JPG" alt="Win+" />
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
              <h4 className={styles.footerHeading}>Win+</h4>
              <a href="#" className={styles.footerLink}>À propos de Win+</a>
              <a href="#" className={styles.footerLink}>Statistiques</a>
              <a href="#" className={styles.footerLink}>Contact</a>
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
            <p className={styles.footerCopyright}>
              © 2024 Win+. Tous droits réservés.
            </p>
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

export default HomePage;