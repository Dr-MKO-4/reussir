import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cookie, Shield, Settings, Eye, BarChart, TrendingUp,
  Clock, Trash2, Mail, MapPin, Menu, X,
  Facebook, Twitter, Linkedin, Instagram, Award
} from 'lucide-react';
import styles from './Legal.module.css';

const Cookies = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCookie = (type: string) => {
    if (type === 'essential') return; // Essential cookies can't be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    console.log('Preferences saved:', cookiePreferences);
    alert('Vos préférences ont été enregistrées avec succès !');
  };

  const acceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true
    });
    console.log('All cookies accepted');
    alert('Tous les cookies ont été acceptés !');
  };

  const sections = [
    {
      icon: Cookie,
      title: "1. Qu'est-ce qu'un Cookie ?",
      content: "Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez un site web. Ils permettent au site de mémoriser vos actions et préférences sur une période donnée.",
    },
    {
      icon: Eye,
      title: "2. Comment Nous Utilisons les Cookies",
      content: "Win+ utilise des cookies pour améliorer votre expérience utilisateur et optimiser nos services :",
      list: [
        "Mémoriser vos préférences de connexion",
        "Comprendre comment vous utilisez notre plateforme",
        "Personnaliser le contenu et les recommandations",
        "Mesurer l'efficacité de nos campagnes marketing",
        "Assurer la sécurité et prévenir la fraude"
      ]
    },
    {
      icon: Settings,
      title: "3. Types de Cookies que Nous Utilisons",
      content: "Nous utilisons différents types de cookies sur notre plateforme :",
    },
    {
      icon: Clock,
      title: "4. Durée de Conservation",
      content: "La durée de conservation des cookies varie selon leur type :",
      list: [
        "Cookies de session : supprimés automatiquement à la fermeture du navigateur",
        "Cookies persistants : conservés jusqu'à 12 mois maximum",
        "Cookies tiers : gérés selon les politiques des fournisseurs"
      ]
    },
    {
      icon: Trash2,
      title: "5. Gestion de Vos Cookies",
      content: "Vous avez le contrôle total sur les cookies. Vous pouvez :",
      list: [
        "Modifier vos préférences à tout moment via les paramètres ci-dessous",
        "Supprimer les cookies existants via votre navigateur",
        "Bloquer tous les cookies (certaines fonctionnalités peuvent être limitées)",
        "Configurer votre navigateur pour recevoir des notifications avant l'installation de cookies"
      ]
    },
    {
      icon: BarChart,
      title: "6. Cookies Tiers",
      content: "Nous utilisons des services tiers qui peuvent placer leurs propres cookies. Ces services incluent Google Analytics, Facebook Pixel, et d'autres outils d'analyse et de marketing. Chaque service a sa propre politique de confidentialité."
    },
    {
      icon: Shield,
      title: "7. Modifications de Cette Politique",
      content: "Nous pouvons mettre à jour cette politique de cookies pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires."
    }
  ];

  const cookieCategories = [
    {
      id: 'essential',
      title: 'Cookies Essentiels',
      icon: Shield,
      description: 'Ces cookies sont nécessaires au fonctionnement de base de notre site. Ils ne peuvent pas être désactivés.',
      enabled: cookiePreferences.essential,
      required: true
    },
    {
      id: 'analytics',
      title: 'Cookies Analytiques',
      icon: BarChart,
      description: 'Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site en collectant des informations de manière anonyme.',
      enabled: cookiePreferences.analytics,
      required: false
    },
    {
      id: 'marketing',
      title: 'Cookies Marketing',
      icon: TrendingUp,
      description: 'Ces cookies sont utilisés pour afficher des publicités pertinentes et mesurer l\'efficacité de nos campagnes.',
      enabled: cookiePreferences.marketing,
      required: false
    },
    {
      id: 'personalization',
      title: 'Cookies de Personnalisation',
      icon: Settings,
      description: 'Ces cookies permettent au site de mémoriser vos choix et de personnaliser votre expérience.',
      enabled: cookiePreferences.personalization,
      required: false
    }
  ];

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <a href="/" className={styles.logo} onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <div className={styles.logoIcon}>
                <img src="/logo1.png" alt="Win+" />
              </div>
              <span className={styles.logoText}>Win+</span>
            </a>

            <nav className={styles.nav}>
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Accueil</a>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Confidentialité</a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Conditions</a>
              <a href="/cookies" onClick={(e) => { e.preventDefault(); navigate('/cookies'); }}>Cookies</a>
            </nav>

            <div className={styles.headerActions}>
              <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
                Connexion
              </button>

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
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); setIsMobileMenuOpen(false); }}>Accueil</a>
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); setIsMobileMenuOpen(false); }}>Confidentialité</a>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); setIsMobileMenuOpen(false); }}>Conditions</a>
            <a href="/cookies" onClick={(e) => { e.preventDefault(); navigate('/cookies'); setIsMobileMenuOpen(false); }}>Cookies</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Cookie size={16} /> Gestion des cookies
            </div>
            <h1 className={styles.heroTitle}>Politique de Cookies</h1>
            <p className={styles.lastUpdated}>Dernière mise à jour : Décembre 2025</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {sections.map((section, index) => (
              <article key={index} className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>
                    <section.icon size={20} />
                  </div>
                  {section.title}
                </h2>
                
                {section.content && (
                  <p className={styles.sectionText}>{section.content}</p>
                )}
                
                {section.list && (
                  <ul className={styles.sectionList}>
                    {section.list.map((item, i) => (
                      <li key={i} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Cookie Settings Section */}
                {section.title.includes('Types de Cookies') && (
                  <div className={styles.cookieSettings}>
                    {cookieCategories.map((category) => (
                      <div key={category.id} className={styles.cookieCategory}>
                        <div className={styles.cookieCategoryHeader}>
                          <div className={styles.cookieCategoryTitle}>
                            <category.icon size={18} />
                            {category.title}
                          </div>
                          <div 
                            className={`${styles.toggle} ${category.enabled ? styles.active : ''} ${category.required ? styles.disabled : ''}`}
                            onClick={() => !category.required && toggleCookie(category.id)}
                          >
                            <div className={styles.toggleKnob}></div>
                          </div>
                        </div>
                        <p className={styles.cookieCategoryDesc}>
                          {category.description}
                          {category.required && ' (Obligatoire)'}
                        </p>
                      </div>
                    ))}
                    
                    <div className={styles.cookieActions}>
                      <button className={styles.btnSecondary} onClick={savePreferences}>
                        Enregistrer mes préférences
                      </button>
                      <button className={styles.btnPrimary} onClick={acceptAll}>
                        Tout accepter
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {/* Contact Box */}
            <div className={styles.contactBox}>
              <h3 className={styles.contactTitle}>
                <Mail size={24} /> Questions sur les cookies ?
              </h3>
              <p className={styles.contactText}>
                Pour toute question concernant notre utilisation des cookies :
              </p>
              <p className={styles.contactText}>
                Email: <a href="mailto:privacy@winplus.cm" className={styles.contactLink}>privacy@winplus.cm</a>
              </p>
              <p className={styles.contactText}>
                <MapPin size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Adresse: Yaoundé, Cameroun
              </p>
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
              <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={styles.footerLink}>Accueil</a>
              <a href="/about" className={styles.footerLink}>À propos</a>
              <a href="/contact" className={styles.footerLink}>Contact</a>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Légal</h4>
              <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className={styles.footerLink}>Confidentialité</a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className={styles.footerLink}>Conditions</a>
              <a href="/cookies" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className={styles.footerLink}>Cookies</a>
            </div>

            <div className={styles.footerSection}>
              <h4 className={styles.footerHeading}>Support</h4>
              <a href="/help" className={styles.footerLink}>Centre d'aide</a>
              <a href="/faq" className={styles.footerLink}>FAQ</a>
              <a href="/contact" className={styles.footerLink}>Nous contacter</a>
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

export default Cookies;