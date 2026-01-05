import React, { useState } from 'react';
import { 
  Check, ChevronLeft, ChevronRight, Users, Award, Trophy, 
  Star, Clock, BookOpen, Shield, Zap, Target, MessageSquare,
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram,
  GraduationCap, UserCheck, Heart
} from 'lucide-react';
import styles from './Pricing.module.css';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'students' | 'teachers' | 'parents'>('students');
  const [currentPlanSlide, setCurrentPlanSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleCards = () => {
    if (windowWidth < 900) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const visibleCardsCount = getVisibleCards();

  const studentPlans = [
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

  const teacherPlans = [
    {
      name: "Enseignant Débutant",
      price: "0",
      period: "Gratuit",
      features: [
        "Créer jusqu'à 5 épreuves",
        "Accès aux outils de base",
        "Support communautaire",
        "Statistiques basiques"
      ],
      popular: false,
      icon: BookOpen,
    },
    {
      name: "Enseignant Pro",
      price: "5000",
      period: "/mois",
      features: [
        "Épreuves illimitées",
        "Correction automatique IA",
        "Tableau de bord avancé",
        "Support prioritaire",
        "Bibliothèque de ressources"
      ],
      popular: true,
      icon: GraduationCap,
    },
    {
      name: "Enseignant Expert",
      price: "12000",
      period: "/trimestre",
      features: [
        "Tous les avantages Pro",
        "Gestion de classes multiples",
        "Rapports détaillés",
        "Formation continue",
        "Badge certifié",
        "Visibilité sur la plateforme"
      ],
      popular: false,
      icon: Award,
    },
    {
      name: "Établissement",
      price: "35000",
      period: "/an",
      features: [
        "Comptes illimités pour enseignants",
        "Licence institutionnelle",
        "Formation sur site",
        "Support dédié 24/7",
        "Intégration système",
        "Branding personnalisé"
      ],
      popular: false,
      icon: Shield,
    },
  ];

  const parentPlans = [
    {
      name: "Parent Vigilant",
      price: "0",
      period: "Gratuit",
      features: [
        "Suivi de 1 enfant",
        "Rapports mensuels",
        "Notifications basiques",
        "Accès au forum parents"
      ],
      popular: false,
      icon: Heart,
    },
    {
      name: "Parent Investi",
      price: "2500",
      period: "/mois",
      features: [
        "Suivi de 2 enfants",
        "Rapports hebdomadaires détaillés",
        "Notifications en temps réel",
        "Messagerie avec enseignants",
        "Recommandations personnalisées"
      ],
      popular: true,
      icon: UserCheck,
    },
    {
      name: "Famille Premium",
      price: "4500",
      period: "/mois",
      features: [
        "Suivi illimité d'enfants",
        "Rapports quotidiens",
        "Coaching parental",
        "Séances famille-tuteur",
        "Accès ressources parentales",
        "Support prioritaire"
      ],
      popular: false,
      icon: Users,
    },
    {
      name: "Famille VIP",
      price: "12000",
      period: "/trimestre",
      features: [
        "Tous les avantages Premium",
        "Conseiller familial dédié",
        "Webinaires exclusifs",
        "Ateliers parentalité",
        "Réseau de parents VIP",
        "Remises sur événements"
      ],
      popular: false,
      icon: Trophy,
    },
  ];

  const getCurrentPlans = () => {
    switch (selectedCategory) {
      case 'teachers':
        return teacherPlans;
      case 'parents':
        return parentPlans;
      default:
        return studentPlans;
    }
  };

  const plans = getCurrentPlans();
  const visiblePlans = plans.slice(currentPlanSlide, currentPlanSlide + visibleCardsCount);
  const canGoNext = currentPlanSlide < plans.length - visibleCardsCount;
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

  const totalDots = plans.length - visibleCardsCount + 1;

  const getCategoryInfo = () => {
    switch (selectedCategory) {
      case 'teachers':
        return {
          title: "Plans pour Enseignants",
          subtitle: "Des outils puissants pour transformer votre enseignement",
          icon: GraduationCap
        };
      case 'parents':
        return {
          title: "Plans pour Parents",
          subtitle: "Accompagnez la réussite scolaire de vos enfants",
          icon: Heart
        };
      default:
        return {
          title: "Plans pour Étudiants",
          subtitle: "Choisissez le plan qui correspond à vos ambitions",
          icon: BookOpen
        };
    }
  };

  const categoryInfo = getCategoryInfo();
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <div className={styles.logo} onClick={() => navigate('/')}>
              <div className={styles.logoIcon}>  
                <img src="\logo1.png" alt="Win+" />
              </div>
            </div>

            <nav className={styles.nav}>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a>
              <a href="/catalog" onClick={(e) => { e.preventDefault(); navigate('/catalog'); }}>Catalogue</a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}>Plans</a>
              <a href="/#about" onClick={(e) => { e.preventDefault(); navigate('/#about'); }}>À propos</a>
              <a href="/#contact" onClick={(e) => { e.preventDefault(); navigate('/#contact'); }}>Contact</a>
            </nav>

            <div className={styles.headerActions}>
              <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
                Connexion
              </button>
              <button className={styles.btnSecondary} onClick={() => navigate('/signup')}>
                Inscription
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Award size={16} /> Tarification
            </div>
            <h1 className={styles.heroTitle}>
              Des plans adaptés à <span className={styles.accent}>chaque profil</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Que vous soyez étudiant, enseignant ou parent, Win+ a la solution parfaite pour vous
            </p>
          </div>
        </div>
      </section>

      {/* Category Selector */}
      <section className={styles.categorySection}>
        <div className={styles.container}>
          <div className={styles.categorySelector}>
            <button
              className={`${styles.categoryBtn} ${selectedCategory === 'students' ? styles.categoryBtnActive : ''}`}
              onClick={() => {
                setSelectedCategory('students');
                setCurrentPlanSlide(0);
              }}
            >
              <BookOpen size={24} />
              <span>Étudiants</span>
            </button>
            <button
              className={`${styles.categoryBtn} ${selectedCategory === 'teachers' ? styles.categoryBtnActive : ''}`}
              onClick={() => {
                setSelectedCategory('teachers');
                setCurrentPlanSlide(0);
              }}
            >
              <GraduationCap size={24} />
              <span>Enseignants</span>
            </button>
            <button
              className={`${styles.categoryBtn} ${selectedCategory === 'parents' ? styles.categoryBtnActive : ''}`}
              onClick={() => {
                setSelectedCategory('parents');
                setCurrentPlanSlide(0);
              }}
            >
              <Heart size={24} />
              <span>Parents</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <CategoryIcon size={16} /> {categoryInfo.title}
            </div>
            <h2 className={styles.sectionTitle}>{categoryInfo.subtitle}</h2>
          </div>

          <div className={styles.pricingContainer}>
            <button 
              onClick={prevPlans}
              className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`}
              disabled={!canGoPrev}
              aria-label="Plans précédents"
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
              aria-label="Plans suivants"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {totalDots > 1 && (
            <div className={styles.pricingDots}>
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPlanSlide(i)}
                  className={`${styles.pricingDot} ${i === currentPlanSlide ? styles.pricingDotActive : ''}`}
                  aria-label={`Aller à la page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className={styles.comparison}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tableau comparatif détaillé</h2>
            <p className={styles.sectionSubtitle}>Trouvez le plan qui vous convient le mieux</p>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Fonctionnalités</th>
                  {plans.slice(0, 4).map((plan, i) => (
                    <th key={i}>{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedCategory === 'students' && (
                  <>
                    <tr>
                      <td>Accès aux épreuves</td>
                      <td>50 épreuves</td>
                      <td>Toutes</td>
                      <td>Toutes</td>
                      <td>Toutes + Exclusives</td>
                    </tr>
                    <tr>
                      <td>Chatbot IA</td>
                      <td>Basique</td>
                      <td>Avancé</td>
                      <td>Avancé</td>
                      <td>Expert</td>
                    </tr>
                    <tr>
                      <td>Corrections</td>
                      <td>❌</td>
                      <td>Basiques</td>
                      <td>Personnalisées</td>
                      <td>Personnalisées</td>
                    </tr>
                    <tr>
                      <td>Support</td>
                      <td>Forum</td>
                      <td>Standard</td>
                      <td>Prioritaire</td>
                      <td>Prioritaire</td>
                    </tr>
                    <tr>
                      <td>Coaching</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>✓ Individuel</td>
                    </tr>
                  </>
                )}
                {selectedCategory === 'teachers' && (
                  <>
                    <tr>
                      <td>Nombre d'épreuves</td>
                      <td>5</td>
                      <td>Illimité</td>
                      <td>Illimité</td>
                      <td>Illimité</td>
                    </tr>
                    <tr>
                      <td>Correction IA</td>
                      <td>❌</td>
                      <td>✓</td>
                      <td>✓ Avancée</td>
                      <td>✓ Avancée</td>
                    </tr>
                    <tr>
                      <td>Gestion classes</td>
                      <td>1 classe</td>
                      <td>3 classes</td>
                      <td>Illimité</td>
                      <td>Illimité</td>
                    </tr>
                    <tr>
                      <td>Formation</td>
                      <td>❌</td>
                      <td>En ligne</td>
                      <td>✓ Continue</td>
                      <td>✓ Sur site</td>
                    </tr>
                    <tr>
                      <td>Support</td>
                      <td>Forum</td>
                      <td>Prioritaire</td>
                      <td>Prioritaire</td>
                      <td>Dédié 24/7</td>
                    </tr>
                  </>
                )}
                {selectedCategory === 'parents' && (
                  <>
                    <tr>
                      <td>Nombre d'enfants</td>
                      <td>1</td>
                      <td>2</td>
                      <td>Illimité</td>
                      <td>Illimité</td>
                    </tr>
                    <tr>
                      <td>Rapports</td>
                      <td>Mensuel</td>
                      <td>Hebdomadaire</td>
                      <td>Quotidien</td>
                      <td>Temps réel</td>
                    </tr>
                    <tr>
                      <td>Messagerie enseignants</td>
                      <td>❌</td>
                      <td>✓</td>
                      <td>✓</td>
                      <td>✓ Prioritaire</td>
                    </tr>
                    <tr>
                      <td>Coaching parental</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>✓</td>
                      <td>✓ Dédié</td>
                    </tr>
                    <tr>
                      <td>Webinaires</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>✓ Exclusifs</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.badge}>
              <MessageSquare size={16} /> FAQ
            </div>
            <h2 className={styles.sectionTitle}>Questions fréquentes</h2>
          </div>

          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <h4>Puis-je changer de plan ?</h4>
              <p>Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment depuis votre compte.</p>
            </div>
            <div className={styles.faqCard}>
              <h4>Y a-t-il une période d'essai ?</h4>
              <p>Tous nos plans payants offrent une période d'essai de 7 jours sans engagement.</p>
            </div>
            <div className={styles.faqCard}>
              <h4>Comment annuler mon abonnement ?</h4>
              <p>Vous pouvez annuler à tout moment depuis votre espace personnel, sans frais supplémentaires.</p>
            </div>
            <div className={styles.faqCard}>
              <h4>Les paiements sont-ils sécurisés ?</h4>
              <p>Oui, tous les paiements sont cryptés et sécurisés via nos partenaires de confiance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Prêt à commencer votre parcours ?</h2>
            <p className={styles.ctaText}>Rejoignez plus de 2000 étudiants qui réussissent avec Win+</p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnLarge} onClick={() => navigate('/signup')}>
                Commencer gratuitement
              </button>
              <button className={styles.btnLargeSecondary} onClick={() => navigate('/#contact')}>
                Nous contacter
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
                  <img src="\logo1.png" alt="Win+" />
                </div>
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
              <a href="/privacy" className={styles.footerLink}>Confidentialité</a>
              <a href="/terms" className={styles.footerLink}>Conditions</a>
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

export default Pricing;