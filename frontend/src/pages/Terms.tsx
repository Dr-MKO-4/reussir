import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, UserCheck, AlertTriangle, Shield, CreditCard, 
  XCircle, RefreshCw, Lock, Scale, Mail, MapPin, Menu, X,
  Facebook, Twitter, Linkedin, Instagram, Award, CheckCircle
} from 'lucide-react';
import styles from './Legal.module.css';

const Terms = () => {
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
      title: "1. Acceptation des Conditions",
      content: "En accédant à et en utilisant la plateforme Win+, vous acceptez de respecter ces conditions d'utilisation. Si vous n'êtes pas d'accord avec ces termes, veuillez ne pas utiliser notre plateforme.",
    },
    {
      icon: UserCheck,
      title: "2. Compte Utilisateur",
      content: "Vous êtes responsable de maintenir la confidentialité de vos identifiants de connexion et du mot de passe. Vous acceptez d'être responsable de toutes les activités qui se produisent sur votre compte.",
      list: [
        "Vous devez fournir des informations exactes et complètes lors de la création du compte",
        "Vous êtes responsable de la sécurité de votre compte",
        "Vous notifierez immédiatement Win+ de tout accès non autorisé"
      ]
    },
    {
      icon: CheckCircle,
      title: "3. Utilisation Acceptable",
      content: "Vous acceptez de n'utiliser la plateforme que pour des fins légales et légitimes :",
      list: [
        "Pas d'utilisation pour l'harassment ou les menaces",
        "Pas de contenu illégal ou offensant",
        "Pas de tentatives de piratage ou de fraude",
        "Pas de téléchargement ou distribution de contenu protégé sans autorisation",
        "Pas de spam ou de contenu malveillant"
      ]
    },
    {
      icon: Shield,
      title: "4. Propriété Intellectuelle",
      content: "Tous les contenus, cours, matériaux et ressources disponibles sur Win+ sont protégés par les droits d'auteur et la propriété intellectuelle.",
      list: [
        "Vous pouvez accéder aux contenus pour votre apprentissage personnel",
        "Vous ne pouvez pas reproduire ou distribuer les contenus sans permission",
        "Les cours et matériaux demeurent la propriété de Win+ ou de ses créateurs"
      ]
    },
    {
      icon: CreditCard,
      title: "5. Abonnements et Paiements",
      list: [
        "Les abonnements se renouvellent automatiquement chaque mois",
        "Vous devez disposer de moyens de paiement valides",
        "Win+ se réserve le droit de modifier les prix avec notification préalable",
        "Les remboursements sont soumis à notre politique de remboursement"
      ]
    },
    {
      icon: AlertTriangle,
      title: "6. Limitation de Responsabilité",
      content: "Win+ est fourni \"tel quel\" sans garanties de quelque nature que ce soit. Nous ne sommes pas responsables des dommages indirects, spéciaux ou consécutifs.",
      warning: {
        title: "Important",
        text: "L'utilisation de la plateforme est à vos propres risques. Win+ ne garantit pas l'exactitude ou l'exhaustivité des contenus."
      }
    },
    {
      icon: RefreshCw,
      title: "7. Modifications des Services",
      content: "Win+ se réserve le droit de modifier, suspendre ou discontinuer tout service avec ou sans préavis. Nous nous efforçons de maintenir une continuité de service optimale."
    },
    {
      icon: XCircle,
      title: "8. Résiliation du Compte",
      content: "Vous pouvez résilier votre compte à tout moment en contactant notre support. Win+ peut résilier les comptes en cas de violation des conditions d'utilisation.",
      list: [
        "Résiliation volontaire disponible à tout moment",
        "Résiliation pour violation des conditions",
        "Perte d'accès immédiate après résiliation",
        "Données conservées selon la politique de confidentialité"
      ]
    },
    {
      icon: Lock,
      title: "9. Confidentialité",
      content: "Notre traitement des données personnelles est régi par notre Politique de Confidentialité. En utilisant Win+, vous consentez à notre collecte et utilisation des données conformément à cette politique."
    },
    {
      icon: Scale,
      title: "10. Droit Applicable",
      content: "Ces conditions sont régies par les lois du Cameroun. Tout différend sera résolu selon la juridiction compétente de Yaoundé."
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
              <Scale size={16} /> Conditions légales
            </div>
            <h1 className={styles.heroTitle}>Conditions d'Utilisation</h1>
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

                {section.warning && (
                  <div className={styles.warningBox}>
                    <div className={styles.warningTitle}>
                      <AlertTriangle size={18} />
                      {section.warning.title}
                    </div>
                    <p className={styles.sectionText} style={{ marginBottom: 0 }}>
                      {section.warning.text}
                    </p>
                  </div>
                )}
              </article>
            ))}

            {/* Contact Box */}
            <div className={styles.contactBox}>
              <h3 className={styles.contactTitle}>
                <Mail size={24} /> Questions juridiques ?
              </h3>
              <p className={styles.contactText}>
                Pour toute question concernant ces Conditions d'Utilisation :
              </p>
              <p className={styles.contactText}>
                Email: <a href="mailto:legal@winplus.cm" className={styles.contactLink}>legal@winplus.cm</a>
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
              <a href="/terms" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className={styles.footerLink}>Conditions</a>
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

export default Terms;