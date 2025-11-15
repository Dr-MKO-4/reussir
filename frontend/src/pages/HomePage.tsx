import React, { useState, useEffect, MouseEvent, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaWhatsapp, FaGoogle } from "react-icons/fa";
import { Rocket, Crown ,BadgeDollarSign, Cpu, Layers, BookOpen, Mail, Phone, Send, MessageSquare, MapPin, Clock, Search, Users, Trophy, Star, Check, Menu, X, Sun, Moon, Filter, ChevronDown, Play, ArrowRight, Zap, Target, Award, Eye, Download, Heart, MessageCircle, Shield, Globe } from 'lucide-react';
import './HomePage.css';

interface Plan {
  name: string;
  color:
    | "standard"
    | "premium"
    | "premium-trial"
    | "student-plus"
    | "student-plus-trial"
    | string; // <- string au cas où tu ajoutes d’autres couleurs
  price: string | number;
  period: string;
  popular?: boolean;
  features: string[];
  ctaText: string;
}

// 🔹 Définition des props du composant
interface PricingPlansSectionProps {
  plans: Plan[];
  handlePlanSelect: (planName: string) => void;
}

const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({
  plans,
  handlePlanSelect,
}) => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  // Icônes pour chaque plan
  const getIconComponent = (color: Plan["color"]) => {
    switch (color) {
      case "standard":
        return Users;
      case "premium":
        return Star;
      case "premium-trial":
        return Zap;
      case "student-plus":
        return Crown;
      case "student-plus-trial":
        return Zap;
      default:
        return Star;
    }
  };

  const CheckIcon: React.FC = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
  );

  return (
    <div className="plans-section-wrapper">
      <div className="pricing-plans-container">
        {/* Header */}
        <div className="pricing-header">
          <div className="section-badge">
              <BadgeDollarSign size={16} />
              <span>Plans d'abonnement</span>
            </div>
          

          <h2 className="pricing-title">
            Choisissez votre
            <span className="pricing-title-gradient">formule</span>
          </h2>

          <p className="pricing-subtitle">
            Des plans adaptés à tous les besoins et budgets pour optimiser votre
            réussite académique
          </p>
        </div>

        {/* Plans principaux (3 premiers) */}
        <div className="pricing-grid">
          {plans.slice(0, 3).map((plan: Plan, index: number) => {
            const IconComponent = getIconComponent(plan.color);

            return (
              <div
                key={index}
                className={`enhanced-plan-card plan-${plan.color} ${
                  plan.popular ? "popular" : ""
                }`}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Badge populaire */}
                {plan.popular && (
                  <div className="enhanced-plan-badge">
                    <span className="enhanced-plan-badge-text">
                      ⭐ Le plus populaire
                    </span>
                  </div>
                )}

                <div className="enhanced-plan-header">
                  <div className="plan-icon">
                    <IconComponent size={24} />
                  </div>

                  <h3 className="enhanced-plan-name">{plan.name}</h3>

                  <div className="enhanced-plan-price">
                    <span className="plan-price-amount">{plan.price}</span>
                    {plan.period !== "Gratuit" && (
                      <span className="enhanced-plan-price-period">
                        FCFA{plan.period}
                      </span>
                    )}
                  </div>

                  {plan.period === "Gratuit" && (
                    <span className="enhanced-plan-price-period">
                      {plan.period}
                    </span>
                  )}
                </div>

                {/* Fonctionnalités */}
                <ul className="enhanced-plan-features">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="enhanced-plan-feature">
                      <div className="enhanced-plan-feature-icon">
                        <CheckIcon />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton CTA */}
                <button
                  onClick={() => handlePlanSelect(plan.name)}
                  className="enhanced-plan-cta"
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Plans du bas - Centrés */}
        <div className="pricing-grid-bottom">
          {plans.slice(3).map((plan: Plan, index: number) => {
            const IconComponent = getIconComponent(plan.color);
            const actualIndex = index + 3;

            return (
              <div
                key={actualIndex}
                className={`enhanced-plan-card plan-${plan.color}`}
                onMouseEnter={() => setHoveredPlan(actualIndex)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                <div className="enhanced-plan-header">
                  <div className="plan-icon">
                    <IconComponent size={24} />
                  </div>

                  <h3 className="enhanced-plan-name">{plan.name}</h3>

                  <div className="enhanced-plan-price">
                    <span className="plan-price-amount">{plan.price}</span>
                    <span className="enhanced-plan-price-period">
                      FCFA{plan.period}
                    </span>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <ul className="enhanced-plan-features">
                  {plan.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="enhanced-plan-feature">
                      <div className="enhanced-plan-feature-icon">
                        <CheckIcon />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton CTA */}
                <button
                  onClick={() => handlePlanSelect(plan.name)}
                  className="enhanced-plan-cta"
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  contactMethod: 'email' | 'whatsapp';
}

interface Subject {
  value: string;
  label: string;
}

interface Class {
  value: string;
  label: string;
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

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}


const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('tous');
  const [selectedClass, setSelectedClass] = useState('tous');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

  // Gestion intelligente de l'authentification
  useEffect(() => {
    const checkAuthenticationStatus = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const sessionTimeout = 24 * 60 * 60 * 1000;
      
      if (lastActivity && Date.now() - parseInt(lastActivity) > sessionTimeout) {
        logout();
        localStorage.removeItem('lastActivity');
      } else if (isAuthenticated && user) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    checkAuthenticationStatus();
    const intervalId = setInterval(checkAuthenticationStatus, 60000);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, user, logout]);

  // Sample data avec plans mis à jour
  const subjects = [
    { value: 'tous', label: 'Toutes les matières' },
    { value: 'mathematiques', label: 'Mathématiques' },
    { value: 'physique', label: 'Physique' },
    { value: 'chimie', label: 'Chimie' },
    { value: 'svt', label: 'SVT' },
    { value: 'francais', label: 'Français' },
    { value: 'philosophie', label: 'Philosophie' },
    { value: 'histoire-geo', label: 'Histoire-Géographie' },
    { value: 'anglais', label: 'Anglais' },
    { value: 'economie', label: 'Économie' },
    { value: 'informatique', label: 'Informatique' }
  ];

  const classes = [
    { value: 'tous', label: 'Toutes les classes' },
    { value: 'seconde', label: 'Seconde' },
    { value: 'premiere', label: 'Première' },
    { value: 'terminale', label: 'Terminale' },
    { value: 'licence-1', label: 'Licence 1' },
    { value: 'licence-2', label: 'Licence 2' },
    { value: 'licence-3', label: 'Licence 3' },
    { value: 'master', label: 'Master' },
    { value: 'prepa', label: 'Classes préparatoires' }
  ];

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
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Concours ENSPD 2023 - Niveau 1",
      subject: "physique",
      class: "licence-3",
      difficulty: "Très difficile",
      duration: "3h",
      views: 987,
      downloads: 654,
      rating: 4.9,
      isFree: true,
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300&h=200&fit=crop"
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
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Concours d'entrée ENSPD - GIT",
      subject: "informatique",
      class: "licence-1",
      difficulty: "Moyen",
      duration: "3h",
      views: 1890,
      downloads: 1200,
      rating: 4.7,
      isFree: true,
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Philosophie - Sujet Type BAC",
      subject: "philosophie",
      class: "terminale",
      difficulty: "Difficile",
      duration: "4h",
      views: 756,
      downloads: 432,
      rating: 4.5,
      isFree: true,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      title: "Économie Générale - Licence 2",
      subject: "economie",
      class: "licence-2",
      difficulty: "Moyen",
      duration: "2h",
      views: 943,
      downloads: 678,
      rating: 4.4,
      isFree: true,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop"
    }
  ];

  const testimonials = [
    {
      name: "Marie Kouakou",
      role: "Étudiante en Licence 3",
      content: "Grâce à Réussir, j'ai pu me préparer efficacement pour mes concours. Le chatbot pédagogique m'a vraiment aidée à comprendre mes erreurs.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Jean-Baptiste Assi",
      role: "Élève de Terminale",
      content: "L'interface est intuitive et les sujets sont variés. J'ai réussi mon bac avec mention grâce à cette plateforme !",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Fatima Traoré",
      role: "Enseignante",
      content: "Je recommande cette plateforme à tous mes élèves. Les corrections sont détaillées et pédagogiques.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Amadou Diallo",
      role: "Étudiant en Master",
      content: "La qualité des sujets et la rapidité d'accès ont fait la différence dans ma préparation aux concours d'entrée en grande école.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    }
  ];

  // Plans mis à jour avec options de 2 semaines
  const plans = [
    {
      name: "Standard",
      price: "0",
      period: "Gratuit",
      features: [
        "Accès aux épreuves gratuites",
        "Chatbot pédagogique de base",
        "Suivi basique des progrès",
        "Accès au forum communautaire",
        "Téléchargements limités (5/mois)"
      ],
      popular: false,
      ctaText: "Commencer gratuitement",
      color: "standard"
    },
    {
      name: "Premium",
      price: "2500",
      period: "/mois",
      features: [
        "Accès à toutes les épreuves",
        "Chatbot pédagogique avancé",
        "Suivi détaillé des performances",
        "Corrections personnalisées",
        "Support prioritaire",
        "Téléchargements illimités",
        "Accès aux webinaires exclusifs"
      ],
      popular: true,
      ctaText: "Passer en Premium",
      color: "premium"
    },
    {
      name: "Premium 2 semaines",
      price: "1500",
      period: "/2 semaines",
      features: [
        "Tous les avantages Premium",
        "Période d'essai courte",
        "Support prioritaire",
        "Téléchargements illimités",
        "Accès complet temporaire",
        "Sans engagement"
      ],
      popular: false,
      ctaText: "Essayer Premium",
      color: "premium"
    },
    {
      name: "Étudiant+",
      price: "5000",
      period: "/trimestre",
      features: [
        "Tous les avantages Premium",
        "Séances de coaching individuel",
        "Accès aux annales exclusives",
        "Planificateur de révisions intelligent",
        "Statistiques avancées",
        "Groupe d'étude privé",
        "Certificat de réussite"
      ],
      popular: false,
      ctaText: "Choisir Étudiant+",
      color: "student-plus"
    },
    {
      name: "Étudiant+ 2 semaines",
      price: "2000",
      period: "/2 semaines",
      features: [
        "Tous les avantages Étudiant+",
        "Coaching intensif 2 semaines",
        "Préparation express",
        "Support 24h/7j",
        "Accès prioritaire aux ressources",
        "Garantie satisfaction"
      ],
      popular: false,
      ctaText: "Essayer Étudiant+",
      color: "student-plus"
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Utility functions
  const filteredTests = freeTests.filter(test => {
    const subjectMatch = selectedSubject === 'tous' || test.subject === selectedSubject;
    const classMatch = selectedClass === 'tous' || test.class === selectedClass;
    return subjectMatch && classMatch;
  });

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Facile': return 'difficulty-easy';
      case 'Moyen': return 'difficulty-medium';
      case 'Difficile': return 'difficulty-hard';
      case 'Très difficile': return 'difficulty-very-hard';
      default: return 'difficulty-default';
    }
  };

  // Fonctions de redirection améliorées
  const handleLoginRedirect = () => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleSignupRedirect = () => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('lastActivity');
  };

  const handleSmoothScroll = (targetId: string): void => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleTestDownload = (testId: number): void => {
    console.log('Téléchargement du test:', testId);
  };

  const handleTestFavorite = (testId: number, event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    console.log('Ajout aux favoris:', testId);
  };

  const handlePlanSelect = (planName: string): void => {
    console.log('Plan sélectionné:', planName);
  };

  // Fonctions de gestion du formulaire de contact améliorées
  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactMethodChange = (method: 'email' | 'whatsapp') => {
    setContactForm(prev => ({
      ...prev,
      contactMethod: method,
      // Réinitialiser les champs conditionnels
      email: method === 'whatsapp' ? '' : prev.email,
      phone: method === 'email' ? '' : prev.phone
    }));
  };

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (contactForm.contactMethod === "whatsapp") {
        const phoneNumber = "+237123456789";
        const message = `Bonjour, je suis ${contactForm.name}. ${contactForm.message}`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      } else {
        const mailtoUrl = `mailto:contact@reussir.com?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(
          `Nom: ${contactForm.name}\nEmail: ${contactForm.email}\nTéléphone: ${contactForm.phone}\n\nMessage:\n${contactForm.message}`
        )}`;
        window.location.href = mailtoUrl;
      }

      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactMethod: "email"
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`homepage ${isDarkMode ? 'dark' : ''} ${contactForm.contactMethod === 'email' ? 'contact-method-email' : 'contact-method-whatsapp'}`}>
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <img src='ReussirLogo1.png' alt='reussir logo'/>
              </div>
              <span className="logo-text">Réussir</span>
            </div>

            {/* Navigation Desktop */}
            <nav className="nav-desktop">
              <a 
                href="#accueil" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('accueil');
                }}
              >
                Accueil
              </a>
              <a 
                href="#catalogue" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('catalogue');
                }}
              >
                Catalogue
              </a>
              <a 
                href="#plans" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('plans');
                }}
              >
                Plans
              </a>
              <a 
                href="#contact" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('contact');
                }}
              >
                Contact
              </a>
              <a 
                href="#a-propos" 
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll('a-propos');
                }}
              >
                À propos
              </a>
            </nav>

            {/* Actions */}
            <div className="header-actions">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="theme-toggle"
                aria-label="Basculer le thème"
                data-tooltip={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <div className="auth-buttons">
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="btn-secondary"
                    >
                      {user.firstName || user.username || 'Tableau de bord'}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="btn-primary"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLoginRedirect}
                      className="btn-secondary"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={handleSignupRedirect}
                      className="btn-primary"
                    >
                      Inscription
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mobile-menu-toggle"
                aria-label="Menu mobile"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <a 
              href="#accueil" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll('accueil');
                setIsMobileMenuOpen(false);
              }}
            >
              Accueil
            </a>
            <a 
              href="#catalogue" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll('catalogue');
                setIsMobileMenuOpen(false);
              }}
            >
              Catalogue
            </a>
            <a 
              href="#plans" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll('plans');
                setIsMobileMenuOpen(false);
              }}
            >
              Plans
            </a>
            <a 
              href="#contact" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll('contact');
                setIsMobileMenuOpen(false);
              }}
            >
              Contact
            </a>
            <a 
              href="#a-propos" 
              className="mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleSmoothScroll('a-propos');
                setIsMobileMenuOpen(false);
              }}
            >
              À propos
            </a>
            <div className="mobile-auth-buttons">
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-secondary mobile-btn"
                  >
                    Tableau de bord
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary mobile-btn"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleLoginRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-secondary mobile-btn"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      handleSignupRedirect();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn-primary mobile-btn"
                  >
                    Inscription
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="accueil" className="hero">
        <div className="hero-bg"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-title-section">
                <h1 className="hero-title text-shadow">
                  <span className="hero-title-accent">Réussissez</span>
                  <br />
                  vos concours avec
                  <br />
                  <span className="hero-title-main">confiance</span>
                </h1>
                <p className="hero-subtitle">
                  Accédez à des milliers d'annales corrigées, bénéficiez d'un suivi personnalisé et d'une assistance pédagogique intelligente pour maximiser vos chances de réussite.
                </p>
              </div>
              
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="hero-stat-number">2,000+</span>
                  <span className="hero-stat-label">Étudiants</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-number">1,000+</span>
                  <span className="hero-stat-label">Épreuves</span>
                </div>
                <div className="hero-stat">
                  <span className="hero-stat-number">95%</span>
                  <span className="hero-stat-label">Taux de réussite</span>
                </div>
              </div>
              
              <div className="hero-actions">
                {isAuthenticated && user ? (
                  <button 
                    className="btn-primary hero-btn"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span>Accéder au tableau de bord</span>
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-primary hero-btn"
                      onClick={() => handleSmoothScroll('catalogue')}
                    >
                      <span>Découvrir les sujets gratuits</span>
                      <ArrowRight size={20} />
                    </button>
                    <button 
                      className="btn-secondary hero-btn"
                      onClick={handleSignupRedirect}
                    >
                      <Users size={20} />
                      <span>Créer un compte</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-card-bg"></div>
              <div className="hero-card backdrop-blur">
                <div className="hero-card-content">
                  <div className="hero-card-icon">
                    <Trophy size={32} />
                  </div>
                  <h3 className="hero-card-title">Plateforme de référence</h3>
                  <p className="hero-card-text">pour la préparation aux concours au Cameroun</p>
                  <div className="hero-card-badges">
                    <span className="hero-badge">Certifié</span>
                    <span className="hero-badge">Sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Points forts */}
      <section className="features enhanced">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Zap size={16} />
              <span>Fonctionnalités</span>
            </div>
            <h2 className="section-title1">Pourquoi choisir Réussir ?</h2>
            <p className="section-subtitle">Des outils puissants propulsés par l'IA pour maximiser vos chances de réussite</p>
          </div>

          <div className="features-grid enhanced">
            {[
              {
                icon: Rocket,
                color: 'blue',
                title: "Accès instantané",
                description: "Téléchargez immédiatement vos annales corrigées et commencez à réviser sans attendre"
              },
              {
                icon: Cpu,
                color: 'orange',
                title: "IA Pédagogique",
                description: "Assistant intelligent qui s'adapte à votre niveau et vous guide personnellement"
              },
              {
                icon: Target,
                color: 'green',
                title: "Suivi Intelligent",
                description: "Analysez vos progrès en temps réel avec des insights précis sur vos performances"
              },
              {
                icon: Layers,
                color: 'purple',
                title: "Communauté",
                description: "Rejoignez une communauté d'élite d'étudiants brillants et d'enseignants experts"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`feature-card feature-card-${feature.color} enhanced`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="feature-icon enhanced">
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue des épreuves gratuites */}
      <section id="catalogue" className="catalogue">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <BookOpen size={16} />
              <span>Catalogue</span>
            </div>
            <h2 className="section-title1">Épreuves gratuites disponibles</h2>
            <p className="section-subtitle">Découvrez notre sélection d'annales gratuites pour commencer votre préparation</p>
          </div>
          
          {/* Filtres améliorés */}
          <div className="filters">
            <div className="filter-group">
              <Filter size={20} />
              <span>Filtrer</span>
            </div>
            <label htmlFor="subject-filter" className="sr-only">Filtrer par matière</label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="filter-select"
              aria-label="Filtrer par matière"
            >
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
            
            <label htmlFor="class-filter" className="sr-only">Filtrer par classe</label>
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="filter-select"
              aria-label="Filtrer par classe"
            >
              {classes.map(classe => (
                <option key={classe.value} value={classe.value}>
                  {classe.label}
                </option>
              ))}
            </select>
          </div>

          {/* Grille des épreuves */}
          <div className="tests-grid">
            {filteredTests.map((test) => (
              <article 
                key={test.id} 
                className="test-card"
                tabIndex={0}
                role="article"
                aria-labelledby={`test-title-${test.id}`}
              >
                <div className="test-card-image">
                  <img 
                    src={test.image} 
                    alt={`Illustration pour ${test.title}`}
                    loading="lazy"
                  />
                  <div className="test-card-badges">
                    <span 
                      className={`difficulty-badge ${getDifficultyColor(test.difficulty)}`}
                      aria-label={`Difficulté: ${test.difficulty}`}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                  <button 
                    className="favorite-btn" 
                    aria-label={`Ajouter ${test.title} aux favoris`}
                    onClick={(e) => handleTestFavorite(test.id, e)}
                    data-tooltip="Ajouter aux favoris"
                  >
                    <Heart size={16} />
                  </button>
                </div>
                
                <div className="test-card-content">
                  <h3 id={`test-title-${test.id}`} className="test-card-title">
                    {test.title}
                  </h3>
                  
                  <div className="test-card-meta">
                    <div className="meta-item" aria-label={`Durée: ${test.duration}`}>
                      <Clock size={14} />
                      <span>{test.duration}</span>
                    </div>
                    <div className="meta-item" aria-label={`${test.views} vues`}>
                      <Eye size={14} />
                      <span>{test.views.toLocaleString()}</span>
                    </div>
                    <div className="meta-item" aria-label={`${test.downloads} téléchargements`}>
                      <Download size={14} />
                      <span>{test.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="test-card-footer">
                    <div className="rating" aria-label={`Note: ${test.rating} sur 5 étoiles`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(test.rating) ? 'star-filled' : 'star-empty'}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="rating-value">({test.rating})</span>
                    </div>
                    <span 
                      className="price-free"
                      aria-label="Épreuve gratuite"
                    >
                      GRATUIT
                    </span>
                  </div>
                  
                  <button 
                    className="download-btn"
                    onClick={() => handleTestDownload(test.id)}
                    aria-label={`Télécharger ${test.title}`}
                  >
                    <Download size={16} />
                    <span>Télécharger</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="no-results" role="status" aria-live="polite">
              <Search size={48} aria-hidden="true" />
              <h3>Aucune épreuve trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}

          <div className="section-cta">
            <button 
              className="btn-secondary"
              onClick={() => console.log('Voir toutes les épreuves')}
            >
              Voir toutes les épreuves gratuites
            </button>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="testimonials" aria-labelledby="testimonials-title">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <MessageCircle size={16} />
              <span>Témoignages</span>
            </div>
            <h2 id="testimonials-title" className="section-title1">Ce que disent nos utilisateurs</h2>
            <p className="section-subtitle">Plus de 2,000 étudiants nous font confiance</p>
          </div>
          
          <div className="testimonial-container">
            <div 
              className="testimonial-card"
              role="region"
              aria-live="polite"
              aria-labelledby={`testimonial-author-${currentTestimonial}`}
            >
              <div className="testimonial-content">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={`Photo de ${testimonials[currentTestimonial].name}`}
                  className="testimonial-avatar"
                  loading="lazy"
                />
                <div 
                  className="testimonial-stars"
                  aria-label={`${testimonials[currentTestimonial].rating} étoiles sur 5`}
                >
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="star-filled" size={20} aria-hidden="true" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonials[currentTestimonial].content}"</p>
                <div className="testimonial-author">
                  <h4 id={`testimonial-author-${currentTestimonial}`}>
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p>{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-dots" role="tablist" aria-label="Navigation des témoignages">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`testimonial-dot ${index === currentTestimonial ? 'active' : ''}`}
                  aria-label={`Témoignage ${index + 1}`}
                  role="tab"
                  aria-selected={index === currentTestimonial}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans d'abonnement */}
      <section id="plans" aria-labelledby="plans-title">
        <PricingPlansSection 
          plans={plans}
          handlePlanSelect={handlePlanSelect}
        />
      </section>

      {/* Section À propos */}
      <section id="a-propos" className="about" aria-labelledby="about-title">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Users size={16} />
              <span>À propos</span>
            </div>
            <h2 id="about-title" className="section-title1">À propos de Réussir</h2>
            <p className="section-subtitle">Notre mission : démocratiser l'accès à une éducation de qualité</p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <div className="about-intro">
                <h3 className="about-subtitle">Une plateforme née de la passion pour l'éducation</h3>
                <p className="about-description">
                  Réussir est née du constat que de nombreux étudiants talentueux au Cameroun et en Afrique 
                  manquent d'accès à des ressources de qualité pour préparer leurs concours et examens. 
                  Notre mission est de démocratiser l'accès à une préparation d'excellence.
                </p>
              </div>
              
              <div className="about-mission">
                <h4 className="about-section-title">Notre engagement</h4>
                <div className="about-values">
                  <div className="value-item">
                    <div className="value-icon">
                      <Target size={24} />
                    </div>
                    <div className="value-content">
                      <h5 className="value-title">Excellence pédagogique</h5>
                      <p className="value-text">Des contenus créés par des experts reconnus dans leur domaine</p>
                    </div>
                  </div>
                  
                  <div className="value-item">
                    <div className="value-icon">
                      <Shield size={24} />
                    </div>
                    <div className="value-content">
                      <h5 className="value-title">Accessibilité</h5>
                      <p className="value-text">Des tarifs adaptés au contexte économique local</p>
                    </div>
                  </div>
                  
                  <div className="value-item">
                    <div className="value-icon">
                      <Users size={24} />
                    </div>
                    <div className="value-content">
                      <h5 className="value-title">Communauté</h5>
                      <p className="value-text">Un environnement d'entraide et de partage entre étudiants</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="about-stats">
              <div className="about-stat-card">
                <div className="stat-icon">
                  <BookOpen size={32} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">1,000+</span>
                  <span className="stat-label">Épreuves disponibles</span>
                </div>
              </div>
              
              <div className="about-stat-card">
                <div className="stat-icon">
                  <Users size={32} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">2,000+</span>
                  <span className="stat-label">Étudiants actifs</span>
                </div>
              </div>
              
              <div className="about-stat-card">
                <div className="stat-icon">
                  <Trophy size={32} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">Taux de réussite</span>
                </div>
              </div>
              
              <div className="about-stat-card">
                <div className="stat-icon">
                  <Award size={32} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Établissements partenaires</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-cta">
            <h3 className="cta-title">Prêt à commencer votre réussite ?</h3>
            <p className="cta-text">Rejoignez des milliers d'étudiants qui nous font déjà confiance</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={handleSignupRedirect}
              >
                Commencer gratuitement
              </button>
              <button 
                className="btn-secondary"
                onClick={() => handleSmoothScroll('plans')}
              >
                Voir les plans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact améliorée */}
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <MessageSquare size={16} />
              <span>Contact</span>
            </div>
            <h2 id="contact-title" className="section-title1">Contactez-nous</h2>
            <p className="section-subtitle">
              Une question ? Un besoin d'aide ? Notre équipe est là pour vous accompagner
            </p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-card-icon email-icon">
                  <Mail size={32} />
                </div>
                <div className="contact-card-content">
                  <h3 className="contact-card-title">Par Email</h3>
                  <p className="contact-card-text">
                    Envoyez-nous un message et nous vous répondrons dans les 24h
                  </p>
                  <a 
                    href="mailto:contact@reussir.com" 
                    className="contact-link"
                    aria-label="Nous contacter par email"
                  >
                    contact@reussir.com
                  </a>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-card-icon whatsapp-icon">
                  <FaWhatsapp size={32} />
                </div>
                <div className="contact-card-content">
                  <h3 className="contact-card-title">Par WhatsApp</h3>
                  <p className="contact-card-text">
                    Contactez-nous directement pour une réponse rapide
                  </p>
                  <a 
                    href="https://wa.me/237123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contact-link"
                    aria-label="Nous contacter sur WhatsApp"
                  >
                    +237 123 456 789
                  </a>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-card-icon location-icon">
                  <MapPin size={32} />
                </div>
                <div className="contact-card-content">
                  <h3 className="contact-card-title">Notre Localisation</h3>
                  <p className="contact-card-text">
                    Yaoundé, Centre, Cameroun
                  </p>
                  <span className="contact-link">
                    Disponible en ligne 24h/7j
                  </span>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-card-icon time-icon">
                  <Clock size={32} />
                </div>
                <div className="contact-card-content">
                  <h3 className="contact-card-title">Horaires de Support</h3>
                  <p className="contact-card-text">
                    Lundi - Vendredi: 8h - 18h<br />
                    Weekend: 10h - 16h
                  </p>
                  <span className="contact-link">
                    GMT+1 (Heure de Yaoundé)
                  </span>
                </div>
              </div>
            </div>
            
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-header">
                  <h3 className="form-title">Envoyez-nous un message</h3>
                  <p className="form-subtitle">
                    Choisissez votre méthode de contact préférée
                  </p>
                </div>
                
                <div className="contact-method-selector">
                  <div className="method-options">
                    <label className="method-option">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={contactForm.contactMethod === 'email'}
                        onChange={(e) => handleContactMethodChange('email')}
                        className="sr-only"
                      />
                      <div className={`method-button ${contactForm.contactMethod === 'email' ? 'active' : ''}`}>
                        <Mail size={20} />
                        <span>Email</span>
                      </div>
                    </label>
                    
                    <label className="method-option">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={contactForm.contactMethod === 'whatsapp'}
                        onChange={(e) => handleContactMethodChange('whatsapp')}
                        className="sr-only"
                      />
                      <div className={`method-button ${contactForm.contactMethod === 'whatsapp' ? 'active' : ''}`}>
                        <FaWhatsapp size={20} />
                        <span>WhatsApp</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      required
                      className="form-input"
                      placeholder="Votre nom et prénom"
                      aria-describedby="name-error"
                    />
                  </div>
                  
                  {/* Champ email - visible seulement si méthode email sélectionnée */}
                  <div className="form-group email-only">
                    <label htmlFor="contact-email" className="form-label">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      required={contactForm.contactMethod === 'email'}
                      className="form-input"
                      placeholder="votre@email.com"
                      aria-describedby="email-error"
                    />
                  </div>
                  
                  {/* Champ téléphone - visible seulement si méthode WhatsApp sélectionnée */}
                  <div className="form-group phone-only">
                    <label htmlFor="contact-phone" className="form-label">
                      Téléphone WhatsApp *
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      required={contactForm.contactMethod === 'whatsapp'}
                      className="form-input"
                      placeholder="+237 6XX XXX XXX"
                      aria-describedby="phone-error"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label">
                      Sujet *
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      required
                      className="form-select"
                      aria-describedby="subject-error"
                    >
                      <option value="">Choisissez un sujet</option>
                      <option value="support-technique">Support technique</option>
                      <option value="question-generale">Question générale</option>
                      <option value="probleme-paiement">Problème de paiement</option>
                      <option value="suggestion">Suggestion d'amélioration</option>
                      <option value="partenariat">Partenariat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="contact-message" className="form-label">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows={5}
                    className="form-textarea"
                    placeholder="Décrivez votre demande en détail..."
                    aria-describedby="message-error"
                  />
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                    aria-label={`Envoyer le message via ${contactForm.contactMethod === 'email' ? 'email' : 'WhatsApp'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        {contactForm.contactMethod === 'email' ? (
                          <Send size={20} />
                        ) : (
                          <FaWhatsapp size={20} />
                        )}
                        <span>
                          Envoyer via {contactForm.contactMethod === 'email' ? 'Email' : 'WhatsApp'}
                        </span>
                      </>
                    )}
                  </button>
                  
                  <p className="form-note">
                    * Champs obligatoires. Nous respectons votre vie privée et ne partageons jamais vos données.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo1">
                <div className="logo-icon1">
                  <img src='ReussirLogo1.png' alt='logo reussir'/>
                </div>
                <span className="logo-text1">Réussir</span>
              </div>
              <p className="footer-description">
                La plateforme de référence pour la préparation aux concours au Cameroun et en Afrique. 
                Nous accompagnons chaque étudiant vers la réussite avec des outils modernes et efficaces.
              </p>
              <div className="footer-contact-icons">
                <button className="social-btn" aria-label="Contact-Mail">
                  <Mail size={20} />
                </button>
                <button className="social-btn" aria-label="ChatBot">
                  <MessageCircle size={20} />
                </button>
                <button className="social-btn" aria-label="Contact-WhatsApp">
                  <Phone size={20} />
                </button>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Plateforme</h4>
              <ul className="footer-links">
                <li><a href="#catalogue">Catalogue</a></li>
                <li><a href="#plans">Plans & Tarifs</a></li>
                <li><a href="#chatbot">Chatbot IA</a></li>
                <li><a href="#forum">Forum</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#aide">Centre d'aide</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#tutoriels">Tutoriels</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Légal</h4>
              <ul className="footer-links">
                <li><a href="#cgu">CGU</a></li>
                <li><a href="#confidentialite">Confidentialité</a></li>
                <li><a href="#cookies">Cookies</a></li>
                <li><a href="#mentions">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Réussir. Tous droits réservés.</p>
            <div className="footer-badges">
              <div className="footer-badge">
                <Shield size={16} />
                <span>Sécurisé</span>
              </div>
              <div className="footer-badge">
                <Award size={16} />
                <span>Certifié</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;