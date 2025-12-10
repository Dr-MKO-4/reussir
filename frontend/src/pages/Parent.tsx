import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaUsers, FaChartLine, FaCreditCard, FaBell, FaCog,
  FaSearch, FaBars, FaSignOutAlt, FaUser, FaEnvelope, FaShieldAlt,
  FaMoon, FaSun, FaWhatsapp, FaPhone, FaAward, FaCalendar,
  FaClock, FaDownload, FaFileInvoiceDollar, FaChevronRight,
  FaCheckCircle, FaExclamationTriangle, FaTrophy, FaBook,
  FaArrowUp, FaPlus, FaBrain, FaChild, FaUserGraduate, FaMoneyBillWave,
  FaListAlt, FaFileAlt
} from 'react-icons/fa';
import { HiMenuAlt1, HiMenuAlt2 } from "react-icons/hi";

interface ParentDashboardProps {
  parentProfile?: {
    name: string;
    email: string;
    phone: string;
    profileImageUrl: string;
    children: Array<{
      id: string;
      name: string;
      level: string;
      school: string;
      targetExam: string;
      profileImageUrl: string;
      subscription: {
        plan: string;
        expiryDate: string;
        status: string;
      };
    }>;
  };
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ parentProfile }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(0);

  const defaultProfile = {
    name: "Sophie Mbarga",
    email: "sophie.mbarga@email.cm",
    phone: "+237 6XX XXX XXX",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    children: [
      {
        id: "1",
        name: "Jean Mbarga",
        level: "Terminale C",
        school: "Lycée Général Leclerc",
        targetExam: "Baccalauréat C 2025",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        subscription: {
          plan: "Premium",
          expiryDate: "2025-03-15",
          status: "active"
        }
      },
      {
        id: "2",
        name: "Marie Mbarga",
        level: "Première A",
        school: "Lycée Bilingue de Yaoundé",
        targetExam: "Probatoire A 2025",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        subscription: {
          plan: "Étudiant+",
          expiryDate: "2025-04-30",
          status: "active"
        }
      }
    ]
  };

  const profile = parentProfile || defaultProfile;
  const currentChild = profile.children[selectedChild];
  const firstName = profile.name.split(' ')[0] || profile.name;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('fr-CM', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const sidebarMenu = [
    {
      section: 'Principal',
      items: [
        { id: 'overview', icon: FaHome, label: 'Accueil', badge: null },
        { id: 'children', icon: FaUsers, label: 'Mes Enfants', badge: profile.children.length },
        { id: 'progress', icon: FaChartLine, label: 'Suivi Progrès', badge: null }
      ]
    },
    {
      section: 'Gestion',
      items: [
        { id: 'subscriptions', icon: FaCreditCard, label: 'Abonnements', badge: null },
        { id: 'reports', icon: FaDownload, label: 'Rapports', badge: null }
      ]
    },
    {
      section: 'Compte',
      items: [
        { id: 'notifications', icon: FaBell, label: 'Notifications', badge: 5 },
        { id: 'settings', icon: FaCog, label: 'Paramètres', badge: null }
      ]
    }
  ];

  const childStats = [
    {
      icon: FaChartLine,
      label: "Progression Globale",
      value: "72%",
      change: "+8% ce mois",
      prevMonth: "64%",
      color: "primary",
      positive: true,
      tooltip: "Calculée depuis le début de l'année — inclut tests et devoirs notés"
    },
    {
      icon: FaClock,
      label: "Temps d'Étude",
      value: "18h",
      change: "Cette semaine",
      prevMonth: "15h semaine précédente",
      color: "secondary",
      positive: true,
      tooltip: "Temps total passé sur les exercices et révisions"
    },
    {
      icon: FaBook,
      label: "Épreuves Complétées",
      value: "24/35",
      change: "68% terminé",
      prevMonth: "20/35 le mois dernier",
      color: "accent",
      positive: true,
      tooltip: "Épreuves terminées sur le total prévu"
    },
    {
      icon: FaTrophy,
      label: "Points Forts",
      value: "Maths",
      change: "92% moyenne",
      prevMonth: "88% le mois dernier",
      color: "warning",
      positive: true,
      tooltip: "Matière avec la meilleure performance"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      child: "Jean Mbarga",
      activity: "A complété l'épreuve de Mathématiques 2024",
      score: 85,
      date: new Date(),
      type: "success"
    },
    {
      id: 2,
      child: "Marie Mbarga",
      activity: "Session de coaching avec Dr. Kouassi",
      duration: "2h",
      date: new Date(Date.now() - 86400000),
      type: "info"
    },
    {
      id: 3,
      child: "Jean Mbarga",
      activity: "Nécessite attention en Physique-Chimie",
      score: 55,
      date: new Date(Date.now() - 172800000),
      type: "warning"
    }
  ];

  const upcomingPayments = [
    {
      id: 1,
      child: "Jean Mbarga",
      plan: "Premium",
      amount: "2,500 FCFA",
      dueDate: "2025-03-15",
      status: "pending"
    },
    {
      id: 2,
      child: "Marie Mbarga",
      plan: "Étudiant+",
      amount: "5,000 FCFA",
      dueDate: "2025-04-30",
      status: "active"
    }
  ];

  const handleLogout = () => {
    alert('Déconnexion en cours...');
  };

  const formatActivityDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 24) {
      return hours < 1 ? "À l'instant" : `Il y a ${hours}h`;
    } else if (days === 1) {
      return "Hier";
    } else {
      return `Il y a ${days} jours`;
    }
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : ''}`}>
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed && (
            <div className="sidebar-logo1">
              <div className="logo-icon1">
                <img src='ReussirLogo1.png' alt='reussir logo'/>
              </div>
              <span className="logo-text">Réussir</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="logo-icon-centered1">
              <img src='ReussirLogo1.png' alt='reussir logo'/>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sidebar-toggle"
            aria-label={sidebarCollapsed ? "Ouvrir le menu" : "Fermer le menu"}
          >
            {sidebarCollapsed ? <HiMenuAlt2 /> : <HiMenuAlt1 />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarMenu.map((section, idx) => (
            <div key={idx} className="sidebar-section">
              {!sidebarCollapsed && <h3 className="sidebar-section-title">{section.section}</h3>}
              <ul className="sidebar-menu">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                      title={sidebarCollapsed ? item.label : ''}
                      aria-current={activeSection === item.id ? 'page' : undefined}
                    >
                      <item.icon className="sidebar-item-icon" />
                      {!sidebarCollapsed && <span className="sidebar-item-label">{item.label}</span>}
                      {!sidebarCollapsed && item.badge && (
                        <span className="sidebar-badge">{item.badge}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-brand">
            <div className="footer-brand-icon">
              <img src='ReussirLogo1.png' alt='reussir logo'/>
            </div>
            {!sidebarCollapsed && (
              <div className="footer-brand-text">
                <span className="footer-brand-name">Réussir</span>
                <span className="footer-brand-tagline">Suivi Parental</span>
              </div>
            )}
          </div>
          <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
            <FaSignOutAlt className="sidebar-item-icon" />
            {!sidebarCollapsed && <span className="sidebar-item-label">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <main className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="dashboard-topbar">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Ouvrir le menu mobile"
          >
            <FaBars />
          </button>

          <div className="topbar-left">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher dans les rapports, factures..."
                className="search-input"
              />
            </div>
          </div>

          <div className="topbar-right">
            <button 
              className="topbar-btn1 theme-toggle1"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
              aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              aria-pressed={isDarkMode}
            >
              <span className="theme-icon-wrapper">
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </span>
            </button>

            <button 
              className="topbar-btn1" 
              title="Notifications"
              aria-label="Voir les notifications, 5 non lues"
            >
              <FaBell />
              <span className="notification-badge" aria-label="5 notifications">5</span>
            </button>

            <div className="topbar-user">
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="user-avatar"
              />
              <div className="user-info">
                <p className="user-name">{profile.name}</p>
                <p className="user-role">Compte Parent</p>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-section">
            <div className="welcome-text">
              <h1 className="welcome-title">
                Bonjour, {firstName} <span className="wave-emoji">👋</span>
              </h1>
              <p className="welcome-subtitle">
                Suivi rapide de {profile.children.map(c => c.name.split(' ')[0]).join(' et ')}
              </p>
            </div>
            <div className="welcome-actions">
              <button 
                className="btn-primary1"
                onClick={() => alert('Export PDF en cours...')}
                aria-label="Télécharger le rapport de progression"
              >
                <span className="btn-icon1"><FaDownload /></span>
                Télécharger Rapport
              </button>
              <button 
                className="btn-secondary1"
                onClick={() => setActiveSection('subscriptions')}
                aria-label="Renouveler l'abonnement"
              >
                <span className="btn-icon1"><FaMoneyBillWave /></span>
                Renouveler Abonnement
              </button>
            </div>
          </section>
          <section className="children-selector-section" style={{ marginBottom: '40px' }}>
            <div className="section-header1">
              <h2 className="section-title1">Mes Enfants</h2>
            </div>
            <div className="children-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {profile.children.map((child, index) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(index)}
                  aria-pressed={selectedChild === index}
                  aria-label={`Sélectionner ${child.name}`}
                  style={{
                    background: selectedChild === index ? 'var(--color-primary)' : 'var(--color-white)',
                    color: selectedChild === index ? 'white' : 'var(--color-neutral-dark)',
                    border: `2px solid ${selectedChild === index ? 'var(--color-primary)' : 'var(--color-neutral-medium)'}`,
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedChild === index ? '0 12px 32px rgba(0, 87, 183, 0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
                    textAlign: 'left',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <img 
                      src={child.profileImageUrl} 
                      alt=""
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: `3px solid ${selectedChild === index ? 'white' : 'var(--color-primary)'}`,
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{child.name}</h3>
                      <p style={{ fontSize: '14px', opacity: 0.9 }}>{child.level}</p>
                    </div>
                  </div>
                  <div style={{ paddingTop: '16px', borderTop: `1px solid ${selectedChild === index ? 'rgba(255,255,255,0.2)' : 'var(--color-neutral-medium)'}` }}>
                    <p style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaUserGraduate />
                      {child.school}
                    </p>
                    <p style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaTrophy />
                      {child.targetExam}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="stats-section" style={{ marginBottom: '40px' }}>
            <div className="section-header1">
              <h2 className="section-title1">Priorité pour {currentChild.name.split(' ')[0]} — À faire aujourd'hui</h2>
            </div>
            <div className="events-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <article className="event-card event-warning" style={{ cursor: 'default' }}>
                <div className="event-icon-wrapper">
                  <FaExclamationTriangle />
                </div>
                <div className="event-content">
                  <h3 className="event-title">Revoir les Intégrales</h3>
                  <p className="event-date">Moyenne actuelle: 55% — Intervention recommandée</p>
                  <p className="event-meta">2 exercices ciblés disponibles</p>
                </div>
                <button 
                  className="event-btn"
                  onClick={() => alert('Lancement des exercices...')}
                  aria-label="Lancer les exercices d'intégrales"
                >
                  Lancer révision
                </button>
              </article>

              <article className="event-card event-primary" style={{ cursor: 'default' }}>
                <div className="event-icon-wrapper">
                  <FaCalendar />
                </div>
                <div className="event-content">
                  <h3 className="event-title">Session de coaching aujourd'hui</h3>
                  <p className="event-date">15:00 avec Dr. Kouassi</p>
                  <p className="event-meta">Mathématiques • Durée: 2h</p>
                </div>
                <button 
                  className="event-btn"
                  onClick={() => alert('Rejoindre la session...')}
                  aria-label="Rejoindre la session de coaching"
                >
                  Rejoindre
                </button>
              </article>

              <article className="event-card event-primary" style={{ cursor: 'default', background: 'rgba(0, 166, 118, 0.1)', borderColor: '#00A676' }}>
                <div className="event-icon-wrapper" style={{ background: '#E6F7F2', color: '#00A676' }}>
                  <FaBrain />
                </div>
                <div className="event-content">
                  <h3 className="event-title">Recommandation IA</h3>
                  <p className="event-date">Épreuve Physique-Chimie 2023</p>
                  <p className="event-meta">Basé sur les dernières notes • Confiance: 87%</p>
                </div>
                <button 
                  className="event-btn"
                  style={{ background: '#00A676' }}
                  onClick={() => alert('Ajout au planning...')}
                  aria-label="Ajouter au planning de révision"
                >
                  Ajouter au planning
                </button>
              </article>
            </div>
          </section>

          <section className="stats-section">
            <div className="section-header1">
              <h2 className="section-title1">Progrès de {currentChild.name.split(' ')[0]} — Actions recommandées</h2>
            </div>
            <div className="stats-grid">
              {childStats.map((stat, index) => (
                <button
                  key={index}
                  className={`stat-card stat-${stat.color}`}
                  onClick={() => alert(`Détails ${stat.label}`)}
                  aria-label={`${stat.label}: ${stat.value}. ${stat.change}`}
                  style={{ cursor: 'pointer', textAlign: 'left', width: '100%', border: 'none' }}
                >
                  <div className="stat-icon-wrapper">
                    <stat.icon className="stat-icon1" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">
                      {stat.label}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(stat.tooltip);
                        }}
                        aria-label="Information sur le calcul"
                        title={stat.tooltip}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'help',
                          marginLeft: '6px',
                          fontSize: '12px',
                          opacity: 0.6
                        }}
                      >
                        ℹ️
                      </button>
                    </p>
                    <p className="stat-value">{stat.value}</p>
                    <p className={`stat-change ${stat.positive ? 'positive' : ''}`}>
                      {stat.positive && <FaArrowUp />}
                      {stat.change}
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                      vs {stat.prevMonth}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        <section className="quick-access-section">
        <div className="section-header1">
            <h2 className="section-title1">Accès Rapide</h2>
        </div>
        <div className="quick-access-grid">
            <button className="quick-access-card" onClick={() => alert('Ouverture Assistant IA...')}>
            <div className="quick-access-icon icon-ai">
                <FaBrain />
            </div>
            <h3 className="quick-access-title">Assistant IA</h3>
            <p className="quick-access-description">
                Obtenez des recommandations personnalisées et des conseils pour améliorer les résultats
            </p>
            <span className="quick-access-badge">
                <FaBrain /> Intelligent
            </span>
            </button>

            <button className="quick-access-card" onClick={() => alert('Ouverture Forum...')}>
            <div className="quick-access-icon icon-forum">
                <FaListAlt />
            </div>
            <h3 className="quick-access-title">Forum Parents</h3>
            <p className="quick-access-description">
                Échangez avec d'autres parents et partagez vos expériences
            </p>
            <span className="quick-access-badge" style={{background: 'rgba(245, 87, 108, 0.1)', color: '#f5576c'}}>
                <FaUsers /> Communauté
            </span>
            </button>

            <button className="quick-access-card" onClick={() => alert('Contact professeur...')}>
            <div className="quick-access-icon icon-teacher">
                <FaUserGraduate />
            </div>
            <h3 className="quick-access-title">Contacter un Prof</h3>
            <p className="quick-access-description">
                Prenez rendez-vous ou envoyez un message à un enseignant qualifié
            </p>
            <span className="quick-access-badge" style={{background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe'}}>
                <FaPhone /> Disponible 24/7
            </span>
            </button>
        </div>
        </section>

          
          <div className="dashboard-columns">
            <section className="events-section">
              <div className="section-header1">
                <h2 className="section-title1">Activité Récente</h2>
                <button 
                  className="section-link"
                  onClick={() => alert('Navigation vers historique complet...')}
                  aria-label="Voir tout l'historique d'activité"
                >
                  Voir tout
                  <FaChevronRight />
                </button>
              </div>
              {recentActivity.length > 0 ? (
                <div className="events-list">
                  {recentActivity.map((activity) => (
                    <article 
                      key={activity.id} 
                      className={`event-card event-${activity.type === 'success' ? 'primary' : activity.type === 'warning' ? 'warning' : 'secondary'}`}
                    >
                      <div className="event-icon-wrapper" aria-hidden="true">
                        {activity.type === 'success' && <FaCheckCircle />}
                        {activity.type === 'warning' && <FaExclamationTriangle />}
                        {activity.type === 'info' && <FaCalendar />}
                      </div>
                      <div className="event-content">
                        <h3 className="event-title">{activity.child}</h3>
                        <p className="event-date">{activity.activity}</p>
                        <p className="event-meta">
                          {activity.score && `Score: ${activity.score}%`}
                          {activity.duration && `Durée: ${activity.duration}`}
                          {' • '}{formatActivityDate(activity.date)}
                        </p>
                      </div>
                      {activity.type === 'warning' && (
                        <button 
                          className="event-btn"
                          onClick={() => alert(`Voir exercices pour ${activity.child}`)}
                          aria-label={`Voir exercices recommandés pour ${activity.child}`}
                        >
                          Voir exercices
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  padding: '48px 24px', 
                  textAlign: 'center', 
                  background: 'var(--color-neutral-light)', 
                  borderRadius: '16px',
                  border: '2px dashed var(--color-neutral-medium)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-neutral-dark)', marginBottom: '8px' }}>
                    Aucune activité récente
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
                    Suggestions: 1) Planifier une séance de 30 min, 2) Télécharger un test de maths
                  </p>
                  <button 
                    className="btn-primary1"
                    onClick={() => alert('Création de séance...')}
                    style={{ margin: '0 auto' }}
                  >
                    <span className="btn-icon1"><FaPlus /></span>
                    Créer une séance
                  </button>
                </div>
              )}
            </section>

            <section className="goals-section">
              <div className="section-header1">
                <h2 className="section-title1">Abonnements & Paiements</h2>
              </div>
              <div className="goals-list">
                {upcomingPayments.map((payment) => (
                  <article key={payment.id} className="goal-card priority-medium">
                    <div className="goal-header">
                      <FaCreditCard className="goal-icon" />
                      <h3 className="goal-title">{payment.child.split(' ')[0]} — {payment.plan}</h3>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '4px' }}>
                        {payment.amount}
                      </p>
                      <p style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaClock />
                        Échéance: {formatDate(payment.dueDate)}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm(`Confirmer le paiement de ${payment.amount} pour ${payment.child}?`)) {
                          alert('Redirection vers paiement sécurisé...');
                        }
                      }}
                      aria-label={`${payment.status === 'active' ? 'Renouveler' : 'Payer'} l'abonnement ${payment.plan} de ${payment.child} - ${payment.amount}`}
                      style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: payment.status === 'active' ? '#00A676' : 'var(--color-primary)',
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <FaMoneyBillWave />
                      {payment.status === 'active' ? 'Renouveler maintenant' : `Payer l'échéance (${payment.amount})`}
                    </button>
                    <button
                      onClick={() => alert('Navigation vers historique de paiement...')}
                      aria-label="Voir l'historique des paiements"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '2px solid var(--color-neutral-medium)',
                        background: 'transparent',
                        color: 'var(--color-primary)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontSize: '13px',
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <FaFileInvoiceDollar />
                      Voir factures
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo1">
                <div className="logo-icon1">
                  <img src='ReussirLogo1.png' alt='reussir logo'/>
                </div>
                <span className="logo-text1">Réussir</span>
              </div>
              <p className="footer-description">
                Accompagnez vos enfants vers l'excellence académique avec Réussir.
              </p>
              <div className="footer-contact-icons">
                <a href="https://wa.me/237XXXXXXXXX" className="contact-icon" title="WhatsApp" aria-label="Contactez-nous sur WhatsApp">
                  <FaWhatsapp />
                </a>
                <a href="mailto:contact@winplus.cm" className="contact-icon" title="Email" aria-label="Envoyez-nous un email">
                  <FaEnvelope />
                </a>
                <a href="tel:+237XXXXXXXXX" className="contact-icon" title="Téléphone" aria-label="Appelez-nous">
                  <FaPhone />
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-link-group">
                <h4>Plateforme</h4>
                <a href="#rapports">Rapports</a>
                <a href="#support">Support</a>
              </div>
              
              <div className="footer-link-group">
                <h4>Légal</h4>
                <a href="#legal">Mentions légales</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom1">
            <p>&copy; 2024 Réussir. Tous droits réservés.</p>
            <div className="footer-badges1">
              <span className="footer-badge1">
                <FaShieldAlt className="footer-badge-icon1" />
                Sécurisé SSL
              </span>
              <span className="footer-badge1">
                <FaAward className="footer-badge-icon1" />
                Paiements Sécurisés
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ParentDashboard