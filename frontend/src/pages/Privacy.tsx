import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Lock, Eye, Database, Users, FileText, 
  AlertCircle, CheckCircle, Mail, MapPin, Menu, X,
  Facebook, Twitter, Linkedin, Instagram, Award, Cookie
} from 'lucide-react';
import styles from './Legal.module.css';

const Privacy = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections = [
    {
      icon: FileText,
      title: "1. Introduction",
      content: "Chez Win+, nous prenons la protection de vos données personnelles très au sérieux. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et sauvegardons vos informations.",
    },
    {
      icon: Database,
      title: "2. Informations que Nous Collectons",
      content: "Nous collectons les informations suivantes :",
      list: [
        { label: "Données d'identification", value: "nom, email, téléphone, adresse" },
        { label: "Données de compte", value: "nom d'utilisateur, mot de passe (crypté)" },
        { label: "Données de profil", value: "photo de profil, bio, préférences d'apprentissage" },
        { label: "Données d'utilisation", value: "pages visitées, temps d'accès, cours suivis" },
        { label: "Données de paiement", value: "informations de carte de crédit (traitées de manière sécurisée)" },
        { label: "Données techniques", value: "adresse IP, type de navigateur, appareil utilisé" }
      ]
    },
    {
      icon: Eye,
      title: "3. Comment Nous Utilisons Vos Informations",
      list: [
        "Fournir et améliorer nos services",
        "Traiter vos paiements et gérer votre abonnement",
        "Envoyer des notifications liées à votre compte",
        "Vous envoyer des mises à jour et des offres promotionnelles",
        "Analyser l'utilisation pour améliorer notre plateforme",
        "Détecter et prévenir la fraude",
        "Respecter les obligations légales"
      ]
    },
    {
      icon: Users,
      title: "4. Partage de Vos Informations",
      content: "Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations dans les cas suivants :",
      list: [
        "Avec les prestataires de services (paiement, hosting, support)",
        "Avec les enseignants ou autres utilisateurs (selon vos paramètres de confidentialité)",
        "Pour se conformer aux obligations légales",
        "Lors de fusions ou acquisitions (avec notification)"
      ]
    },
    {
      icon: Lock,
      title: "5. Sécurité des Données",
      content: "Nous utilisons des mesures de sécurité robustes pour protéger vos données :",
      list: [
        "Chiffrement SSL pour tous les transferts de données",
        "Stockage sécurisé en centre de données certifié",
        "Contrôle d'accès et authentification multi-facteurs",
        "Audits de sécurité réguliers",
        "Conformité RGPD et standards internationaux"
      ]
    },
    {
      icon: CheckCircle,
      title: "6. Vos Droits",
      content: "Vous avez le droit de :",
      list: [
        "Accéder à vos données personnelles",
        "Corriger les informations inexactes",
        "Demander la suppression de vos données",
        "Vous opposer au traitement de vos données",
        "Demander une portabilité des données",
        "Révoquer votre consentement à tout moment"
      ]
    },
    {
      icon: Cookie,
      title: "7. Cookies et Suivi",
      content: "Nous utilisons des cookies pour améliorer votre expérience utilisateur. Vous pouvez contrôler les cookies via les paramètres de votre navigateur.",
      list: [
        { label: "Cookies essentiels", value: "nécessaires pour le fonctionnement du site" },
        { label: "Cookies analytiques", value: "nous aident à comprendre comment vous utilisez notre plateforme" },
        { label: "Cookies de marketing", value: "pour personnaliser les publicités" }
      ]
    },
    {
      icon: AlertCircle,
      title: "8. Données des Mineurs",
      content: "Win+ ne s'adresse pas intentionnellement aux enfants de moins de 13 ans. Si nous apprenons qu'un mineur nous a fourni des données sans consentement parental, nous les supprimerons promptement."
    },
    {
      icon: Shield,
      title: "9. Modifications de Cette Politique",
      content: "Nous pouvons modifier cette Politique de Confidentialité. Les modifications significatives seront communiquées par email."
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
              <Shield size={16} /> Protection des données
            </div>
            <h1 className={styles.heroTitle}>Politique de Confidentialité</h1>
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
                        {typeof item === 'string' ? (
                          item
                        ) : (
                          <>
                            <strong>{item.label}:</strong> {item.value}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            {/* Contact Box */}
            <div className={styles.contactBox}>
              <h3 className={styles.contactTitle}>
                <Mail size={24} /> Besoin d'aide ?
              </h3>
              <p className={styles.contactText}>
                Pour toute question concernant cette Politique de Confidentialité :
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
              <a href="/privacy" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className={styles.footerLink}>Confidentialité</a>
              <a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className={styles.footerLink}>Conditions</a>
              <a href="/cookies" onClick={(e) => { e.preventDefault(); navigate('/cookies'); }} className={styles.footerLink}>Cookies</a>
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

export default Privacy;