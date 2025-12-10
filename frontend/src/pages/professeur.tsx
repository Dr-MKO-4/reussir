import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBook, FaUpload, FaChartBar, FaUsers, FaCalendar,
  FaSearch, FaBars, FaSignOutAlt, FaUser, FaEnvelope, FaShieldAlt,
  FaMoon, FaSun, FaWhatsapp, FaPhone, FaAward, FaCog, FaBell,
  FaCheckCircle, FaEdit, FaChevronRight,
  FaClock, FaDownload, FaStar, FaEye, FaTrophy,
  FaArrowUp, FaMoneyBillWave,
  FaBrain, FaUserCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { HiMenuAlt1, HiMenuAlt2 } from "react-icons/hi";

interface TeacherDashboardProps {
  teacherProfile?: {
    name: string;
    email: string;
    specialization: string;
    institution: string;
    profileImageUrl: string;
    verified: boolean;
  };
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherProfile }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultProfile = {
    name: "Dr. Albert Kouassi",
    email: "a.kouassi@reussir.cm",
    specialization: "Mathématiques & Physique",
    institution: "Université de Yaoundé I",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    verified: true
  };

  const profile = teacherProfile || defaultProfile;
  const firstName = profile.name.split(' ').pop() || profile.name;

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
      section: 'Contenu',
      items: [
        { id: 'overview', icon: FaHome, label: 'Accueil', badge: null },
        { id: 'my-content', icon: FaBook, label: 'Mes Contenus', badge: 24 },
        { id: 'upload', icon: FaUpload, label: 'Téléverser', badge: 'NEW' },
        { id: 'corrections', icon: FaEdit, label: 'Corrections', badge: 8 }
      ]
    },
    {
      section: 'Enseignement',
      items: [
        { id: 'students', icon: FaUsers, label: 'Mes Élèves', badge: 142 },
        { id: 'analytics', icon: FaChartBar, label: 'Statistiques', badge: null },
        { id: 'sessions', icon: FaCalendar, label: 'Sessions', badge: 3 }
      ]
    },
    {
      section: 'Compte',
      items: [
        { id: 'earnings', icon: FaMoneyBillWave, label: 'Revenus', badge: null },
        { id: 'settings', icon: FaCog, label: 'Paramètres', badge: null }
      ]
    }
  ];

  const stats = [
    {
      icon: FaUsers,
      label: "Élèves Actifs",
      value: "142",
      change: "+18 ce mois",
      prevMonth: "124 le mois dernier",
      color: "primary",
      positive: true,
      tooltip: "Nombre d'élèves ayant utilisé vos contenus ce mois"
    },
    {
      icon: FaBook,
      label: "Contenus Publiés",
      value: "24",
      change: "+3 cette semaine",
      prevMonth: "21 la semaine dernière",
      color: "secondary",
      positive: true,
      tooltip: "Total de vos contenus disponibles sur la plateforme"
    },
    {
      icon: FaDownload,
      label: "Téléchargements",
      value: "3,247",
      change: "+12% ce mois",
      prevMonth: "2,899 le mois dernier",
      color: "accent",
      positive: true,
      tooltip: "Nombre total de téléchargements de vos contenus"
    },
    {
      icon: FaStar,
      label: "Note Moyenne",
      value: "4.9",
      change: "Sur 5.0",
      prevMonth: "4.8 le mois dernier",
      color: "warning",
      positive: true,
      tooltip: "Note moyenne attribuée par les élèves et parents"
    }
  ];

  const myContent = [
    {
      id: 1,
      title: "Mathématiques Bac C 2024 - Corrigé Complet",
      type: "Correction",
      subject: "Mathématiques",
      level: "Terminale C",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      downloads: 1245,
      rating: 4.9,
      students: 89,
      status: "published",
      price: "2500 FCFA",
      uploadDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Physique-Chimie - Électricité Avancée",
      type: "Cours",
      subject: "Physique",
      level: "Terminale D",
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=250&fit=crop",
      downloads: 892,
      rating: 4.8,
      students: 67,
      status: "published",
      price: "1500 FCFA",
      uploadDate: "2024-01-08"
    },
    {
      id: 3,
      title: "Analyse Mathématique - Série d'Exercices",
      type: "Exercices",
      subject: "Mathématiques",
      level: "Licence 1",
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop",
      downloads: 567,
      rating: 5.0,
      students: 45,
      status: "draft",
      price: "Gratuit",
      uploadDate: "draft"
    }
  ];

  const recentStudents = [
    {
      id: 1,
      name: "Marie Kouakou",
      level: "Terminale C",
      progress: 78,
      lastActivity: new Date(Date.now() - 7200000),
      status: "active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Jean Mbarga",
      level: "Terminale C",
      progress: 65,
      lastActivity: new Date(Date.now() - 86400000),
      status: "active",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Sophie Nkomo",
      level: "Première D",
      progress: 45,
      lastActivity: new Date(Date.now() - 259200000),
      status: "attention",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "Session de Coaching - Analyse Mathématique",
      students: 12,
      date: new Date(),
      duration: "2h",
      type: "coaching"
    },
    {
      id: 2,
      title: "Correction Examen Blanc - Physique",
      students: 25,
      date: new Date(Date.now() + 86400000),
      duration: "3h",
      type: "correction"
    }
  ];

  const pendingCorrections = [
    {
      id: 1,
      student: "Marie Kouakou",
      assignment: "Devoir Mathématiques - Intégrales",
      submittedDate: new Date(Date.now() - 86400000),
      priority: "high"
    },
    {
      id: 2,
      student: "Jean Mbarga",
      assignment: "Exercices Physique - Mécanique",
      submittedDate: new Date(Date.now() - 172800000),
      priority: "medium"
    },
    {
      id: 3,
      student: "Sophie Nkomo",
      assignment: "Quiz Chimie - Réactions",
      submittedDate: new Date(Date.now() - 259200000),
      priority: "medium"
    }
  ];

  const handleLogout = () => {
    alert('Déconnexion en cours...');
  };

  const handleUpload = () => {
    alert('Interface de téléversement - À implémenter');
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

  const formatSessionDate = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();

    const timeStr = new Intl.DateTimeFormat('fr-CM', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);

    if (isToday) return `Aujourd'hui, ${timeStr}`;
    if (isTomorrow) return `Demain, ${timeStr}`;
    return new Intl.DateTimeFormat('fr-CM', { 
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
                        <span className={`sidebar-badge ${typeof item.badge === 'string' ? 'badge-new' : ''}`}>
                          {item.badge}
                        </span>
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
                <span className="footer-brand-tagline">Espace Enseignant</span>
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
                placeholder="Rechercher des contenus, élèves, devoirs..."
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
              aria-label="Voir les notifications, 7 non lues"
            >
              <FaBell />
              <span className="notification-badge" aria-label="7 notifications">7</span>
            </button>

            <div className="topbar-user">
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="user-avatar"
              />
              <div className="user-info">
                <p className="user-name">
                  {profile.name}
                  {profile.verified && (
                    <FaUserCheck style={{ marginLeft: '6px', color: '#00A676', fontSize: '14px' }} title="Enseignant vérifié" />
                  )}
                </p>
                <p className="user-role">Enseignant</p>
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
                Gérez vos contenus, suivez vos élèves et créez l'excellence pédagogique
              </p>
            </div>
            <div className="welcome-actions">
              <button 
                className="btn-primary1" 
                onClick={handleUpload}
                aria-label="Téléverser un nouveau contenu"
              >
                <span className="btn-icon1"><FaUpload /></span>
                Téléverser Contenu
              </button>
              <button 
                className="btn-secondary1"
                onClick={() => alert('Export des statistiques...')}
                aria-label="Exporter les statistiques"
              >
                <span className="btn-icon1"><FaDownload /></span>
                Exporter Rapport
              </button>
            </div>
          </section>

          <section className="stats-section" style={{ marginBottom: '40px' }}>
            <div className="section-header1">
              <h2 className="section-title1">Actions Prioritaires — À faire maintenant</h2>
            </div>
            <div className="events-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <article className="event-card event-warning" style={{ cursor: 'default' }}>
                <div className="event-icon-wrapper">
                  <FaExclamationTriangle />
                </div>
                <div className="event-content">
                  <h3 className="event-title">8 corrections en attente</h3>
                  <p className="event-date">Dont 3 prioritaires depuis plus de 2 jours</p>
                  <p className="event-meta">Temps estimé: 45 min</p>
                </div>
                <button 
                  className="event-btn"
                  onClick={() => setActiveSection('corrections')}
                  aria-label="Commencer les corrections"
                >
                  Corriger maintenant
                </button>
              </article>

              <article className="event-card event-primary" style={{ cursor: 'default' }}>
                <div className="event-icon-wrapper">
                  <FaCalendar />
                </div>
                <div className="event-content">
                  <h3 className="event-title">Session dans 2 heures</h3>
                  <p className="event-date">Coaching Analyse Mathématique</p>
                  <p className="event-meta">12 élèves inscrits • Durée: 2h</p>
                </div>
                <button 
                  className="event-btn"
                  onClick={() => alert('Préparation de la session...')}
                  aria-label="Préparer la session"
                >
                  Préparer
                </button>
              </article>

              <article className="event-card event-primary" style={{ cursor: 'default', background: 'rgba(0, 166, 118, 0.1)', borderColor: '#00A676' }}>
                <div className="event-icon-wrapper" style={{ background: '#E6F7F2', color: '#00A676' }}>
                  <FaBrain />
                </div>
                <div className="event-content">
                  <h3 className="event-title">Recommandation IA</h3>
                  <p className="event-date">Créer une épreuve sur les Intégrales</p>
                  <p className="event-meta">Forte demande • Potentiel: +200 téléchargements</p>
                </div>
                <button 
                  className="event-btn"
                  style={{ background: '#00A676' }}
                  onClick={() => setActiveSection('upload')}
                  aria-label="Créer le contenu recommandé"
                >
                  Créer maintenant
                </button>
              </article>
            </div>
          </section>
<section className="exams-section">
            <div className="section-header1">
              <h2 className="section-title1">Mes Contenus — Performances</h2>
              <button 
                className="section-link"
                onClick={() => setActiveSection('my-content')}
                aria-label="Voir tous mes contenus"
              >
                Voir tous mes contenus
                <FaChevronRight />
              </button>
            </div>

            <div className="exams-grid">
              {myContent.map((content) => (
                <article key={content.id} className="exam-card">
                  <div className="exam-thumbnail">
                    <img src={content.thumbnail} alt={content.title} />
                    <div className="exam-overlay"></div>
                    <span className={`exam-difficulty ${content.status === 'published' ? 'difficulty-facile' : 'difficulty-moyen'}`}>
                      {content.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                    <div className="exam-actions">
                      <button 
                        className="exam-action-btn" 
                        title="Modifier"
                        onClick={() => alert(`Modification du contenu ${content.id}`)}
                        aria-label={`Modifier ${content.title}`}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="exam-action-btn" 
                        title="Voir"
                        onClick={() => alert(`Aperçu du contenu ${content.id}`)}
                        aria-label={`Voir ${content.title}`}
                      >
                        <FaEye />
                      </button>
                    </div>
                  </div>

                  <div className="exam-content">
                    <div className="exam-header">
                      <span className="exam-level">{content.level}</span>
                      <div className="exam-rating">
                        <FaStar />
                        <span>{content.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="exam-title">{content.title}</h3>
                    
                    <div className="exam-meta">
                      <span className="exam-meta-item">
                        <FaDownload />
                        {content.downloads} téléchargements
                      </span>
                      <span className="exam-meta-item">
                        <FaUsers />
                        {content.students} élèves
                      </span>
                    </div>

                    <div className="exam-footer">
                      <div className="exam-price">
                        <span className={content.price === 'Gratuit' ? 'price-free' : 'price-amount'}>
                          {content.price}
                        </span>
                        <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {content.uploadDate !== 'draft' ? `Publié le ${formatDate(content.uploadDate)}` : 'En brouillon'}
                        </p>
                      </div>
                      <button 
                        className="exam-btn btn-download"
                        onClick={() => alert(`Édition du contenu ${content.id}`)}
                        aria-label={`Éditer ${content.title}`}
                      >
                        <FaEdit />
                        Éditer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="stats-section">
            <div className="section-header1">
              <h2 className="section-title1">Vue d'Ensemble — Vos Performances</h2>
            </div>
            <div className="stats-grid">
              {stats.map((stat, index) => (
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
                        aria-label="Information sur cette statistique"
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

          
          <div className="dashboard-columns">
            <section className="events-section">
              <div className="section-header1">
                <h2 className="section-title1">Élèves Récents</h2>
                <button 
                  className="section-link"
                  onClick={() => setActiveSection('students')}
                  aria-label="Voir tous les élèves"
                >
                  Voir tous
                  <FaChevronRight />
                </button>
              </div>
              
              <div className="events-list">
                {recentStudents.map((student) => (
                  <article 
                    key={student.id}
                    className={`event-card event-${student.status === 'attention' ? 'warning' : 'primary'}`}
                  >
                    <img 
                      src={student.avatar}
                      alt={student.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid var(--color-primary)'
                      }}
                    />
                    <div className="event-content">
                      <h3 className="event-title">{student.name}</h3>
                      <p className="event-date">{student.level}</p>
                      <div className="goal-progress-wrapper" style={{ marginTop: '8px' }}>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="goal-progress-text">{student.progress}%</span>
                      </div>
                      <p className="event-meta">{formatActivityDate(student.lastActivity)}</p>
                    </div>
                    <button 
                      className="event-btn"
                      onClick={() => alert(`Voir le profil de ${student.name}`)}
                      aria-label={`Voir le profil de ${student.name}`}
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      Voir profil
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="goals-section">
              <div className="section-header1">
                <h2 className="section-title1">Corrections en Attente</h2>
              </div>
              
              <div className="goals-list">
                {pendingCorrections.map((correction) => (
                  <article key={correction.id} className={`goal-card priority-${correction.priority}`}>
                    <div className="goal-header">
                      <FaEdit className="goal-icon" />
                      <h3 className="goal-title">{correction.student}</h3>
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--color-neutral-dark)', marginBottom: '8px', fontWeight: '600' }}>
                      {correction.assignment}
                    </p>
                    <p className="goal-deadline">
                      <FaClock />
                      Soumis {formatActivityDate(correction.submittedDate)}
                    </p>
                    <button 
                      onClick={() => alert(`Correction de ${correction.assignment}`)}
                      aria-label={`Corriger le devoir de ${correction.student}`}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '13px'
                      }}
                    >
                      <FaCheckCircle />
                      Corriger Maintenant
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="events-section" style={{ marginTop: '48px' }}>
            <div className="section-header1">
              <h2 className="section-title1">Sessions à Venir</h2>
            </div>
            
            <div className="events-list">
              {upcomingSessions.map((session) => (
                <article key={session.id} className="event-card event-primary">
                  <div className="event-icon-wrapper">
                    <FaCalendar />
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{session.title}</h3>
                    <p className="event-date">{formatSessionDate(session.date)}</p>
                    <p className="event-meta">
                      {session.students} élèves • Durée: {session.duration}
                    </p>
                  </div>
                  <button 
                    className="event-btn"
                    onClick={() => alert(`Détails de ${session.title}`)}
                    aria-label={`Voir les détails de ${session.title}`}
                  >
                    Détails
                  </button>
                </article>
              ))}
            </div>
          </section>
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
                Créez du contenu de qualité et accompagnez vos élèves vers la réussite.
              </p>
              <div className="footer-contact-icons">
                <a href="https://wa.me/237XXXXXXXXX" className="contact-icon" title="WhatsApp" aria-label="Contactez-nous sur WhatsApp">
                  <FaWhatsapp />
                </a>
                <a href="mailto:enseignants@winplus.cm" className="contact-icon" title="Email" aria-label="Envoyez-nous un email">
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
                <a href="#upload">Téléverser</a>
                <a href="#analytics">Statistiques</a>
              </div>
              
              <div className="footer-link-group">
                <h4>Support</h4>
                <a href="#aide">Centre d'aide</a>
                <a href="#contact">Contact</a>
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
                Enseignant Vérifié
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default TeacherDashboard;