import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaBook, FaBullseye, FaTrophy, FaChartLine, FaClock,
  FaCalendar, FaStar, FaAward, FaBolt, FaChevronRight, FaPlay,
  FaCheckCircle, FaCircle, FaChartBar, FaBrain, FaUsers,
  FaBell, FaCog, FaSearch, FaPlus, FaTimes, FaBars,
  FaComments, FaFileAlt, FaGraduationCap, FaLayerGroup,
  FaChevronLeft, FaSignOutAlt, FaUser, FaEnvelope, FaShieldAlt,
  FaMoon, FaSun, FaBookmark, FaShare, FaArrowUp, FaFire,
  FaDownload, FaShoppingCart, FaTag, FaWhatsapp, FaPhone, FaCalendarAlt,
  FaLightbulb, FaRocket, FaCheck
} from 'react-icons/fa';
import { HiMenu, HiMenuAlt1, HiMenuAlt2 } from "react-icons/hi";
import './student.css';

interface DashboardProps {
  userProfile?: {
    username: string;
    profileImageUrl: string;
    institution: string;
    currentLevel: string;
    specialization: string;
    targetExam: string;
    academicGoals: string[];
    learningStyle: {
      preferredTime: string;
      studyMethod: string;
      difficulty: string;
    };
    studySchedule: {
      mondayToFriday: string;
      weekend: string;
      preferredDuration: string;
    };
  };
}

const Student: React.FC<DashboardProps> = ({ userProfile }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultProfile = {
    username: "Marie Kouakou",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    institution: "Université de Yaoundé I",
    currentLevel: "Licence 3",
    specialization: "Sciences Mathématiques",
    targetExam: "Baccalauréat Général",
    academicGoals: ["Obtenir une mention au baccalauréat", "Intégrer une grande école", "Maîtriser l'analyse mathématique"],
    learningStyle: {
      preferredTime: "morning",
      studyMethod: "visual",
      difficulty: "intermediate"
    },
    studySchedule: {
      mondayToFriday: "morning",
      weekend: "afternoon",
      preferredDuration: "2hours"
    }
  };

  const profile = userProfile || defaultProfile;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const sidebarMenu = [
    {
      section: 'Apprentissage',
      items: [
        { id: 'overview', icon: FaHome, label: 'Accueil', badge: null },
        { id: 'courses', icon: FaBook, label: 'Mes Épreuves', badge: 12 },
        { id: 'catalogue', icon: FaLayerGroup, label: 'Catalogue', badge: null },
        { id: 'chatbot', icon: FaBrain, label: 'Assistant IA', badge: 'NEW' }
      ]
    },
    {
      section: 'Progression',
      items: [
        { id: 'dashboard', icon: FaChartBar, label: 'Statistiques', badge: null },
        { id: 'goals', icon: FaBullseye, label: 'Objectifs', badge: 3 },
        { id: 'achievements', icon: FaTrophy, label: 'Récompenses', badge: null }
      ]
    },
    {
      section: 'Communauté',
      items: [
        { id: 'forum', icon: FaUsers, label: 'Forum', badge: null },
        { id: 'events', icon: FaCalendar, label: 'Événements', badge: 2 }
      ]
    },
    {
      section: 'Compte',
      items: [
        { id: 'profile', icon: FaUser, label: 'Mon Profil', badge: null },
        { id: 'settings', icon: FaCog, label: 'Paramètres', badge: null }
      ]
    }
  ];

  // NOUVEAU : Priorités du jour
  const todayPriorities = [
    {
      id: 1,
      title: "Exercice Intégrales",
      duration: "30 min",
      reason: "Faiblesse détectée - Score actuel: 55%",
      expectedImprovement: "+15%",
      type: "practice",
      urgency: "high"
    },
    {
      id: 2,
      title: "Simuler Bac Maths 2024",
      duration: "60 min",
      reason: "Préparation examen dans 12 jours",
      expectedImprovement: "Score prévu: 75%",
      type: "exam",
      urgency: "medium"
    },
    {
      id: 3,
      title: "Revoir Corrigé Physique",
      duration: "20 min",
      reason: "Complément du test d'hier",
      expectedImprovement: "Consolidation",
      type: "review",
      urgency: "low"
    }
  ];


  // NOUVEAU : Recommandations IA
  const aiRecommendations = [
    {
      id: 1,
      title: "Épreuve Intégrales - Niveau avancé",
      reason: "Basé sur votre score de 55% au dernier test",
      confidence: 92,
      estimatedScore: "75%",
      duration: "45 min",
      type: "exam"
    },
    {
      id: 2,
      title: "Chapitre: Dérivées partielles",
      reason: "Prérequis pour votre prochain cours",
      confidence: 88,
      estimatedScore: "Score attendu: B+",
      duration: "30 min",
      type: "chapter"
    },
    {
      id: 3,
      title: "Quiz ciblé: Trigonométrie",
      reason: "Améliorer votre vitesse de calcul",
      confidence: 85,
      estimatedScore: "+20% de rapidité",
      duration: "15 min",
      type: "quiz"
    }
  ];

  const featuredExams = [
    {
      id: 1,
      title: "Mathématiques Bac C 2024",
      subject: "Mathématiques",
      level: "Terminale C",
      price: "2500 FCFA",
      isFree: false,
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      rating: 4.8,
      downloads: 1245,
      difficulty: "Difficile",
      year: "2024",
      included: false,
      accessTime: "Accès immédiat",
      whyRecommended: "Score actuel 55% - Amélioration possible"
    },
    {
      id: 2,
      title: "Physique-Chimie Bac D 2023",
      subject: "Physique-Chimie",
      level: "Terminale D",
      price: "GRATUIT",
      isFree: true,
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=250&fit=crop",
      rating: 4.9,
      downloads: 2103,
      difficulty: "Moyen",
      year: "2023",
      included: true,
      accessTime: "Téléchargement immédiat",
      whyRecommended: "Populaire dans votre niveau"
    },
    {
      id: 3,
      title: "Philosophie Bac A 2024",
      subject: "Philosophie",
      level: "Terminale A",
      price: "1500 FCFA",
      isFree: false,
      thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
      rating: 4.7,
      downloads: 892,
      difficulty: "Moyen",
      year: "2024",
      included: false,
      accessTime: "Accès immédiat",
      whyRecommended: "Basé sur votre parcours"
    },
    {
      id: 4,
      title: "SVT Bac D 2024 - Corrigé inclus",
      subject: "Sciences de la Vie",
      level: "Terminale D",
      price: "3000 FCFA",
      isFree: false,
      thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=250&fit=crop",
      rating: 5.0,
      downloads: 1567,
      difficulty: "Difficile",
      year: "2024",
      included: false,
      accessTime: "Accès immédiat + PDF",
      whyRecommended: "Note élevée - 5.0/5"
    }
  ];

  const stats = [
    {
      icon: FaChartLine,
      label: "Progression Globale",
      value: "68%",
      change: "+12% cette semaine",
      color: "primary",
      positive: true,
      tooltip: "Moyenne pondérée de tous vos tests"
    },
    {
      icon: FaClock,
      label: "Temps d'étude",
      value: "24h",
      change: "Cette semaine",
      color: "secondary",
      positive: true,
      tooltip: "Temps total passé sur la plateforme"
    },
    {
      icon: FaBullseye,
      label: "Objectifs",
      value: `${profile.academicGoals.length}/5`,
      change: "Définis",
      color: "accent",
      positive: true,
      tooltip: "Objectifs académiques actifs"
    },
    {
      icon: FaFire,
      label: "Série Active",
      value: "7 jours",
      change: "Record: 12j",
      color: "warning",
      positive: true,
      tooltip: "Jours consécutifs d'activité"
    }
  ];

  const continueStudying = [
    {
      id: 1,
      title: `${profile.specialization} - Analyse Avancée`,
      progress: 65,
      duration: "2h restantes",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      difficulty: "Difficile",
      lastAccessed: "Il y a 2 heures",
      nextSession: "Demain 8h",
      resumeAt: "Chapitre 3: Intégrales doubles"
    },
    {
      id: 2,
      title: `Préparation ${profile.targetExam}`,
      progress: 42,
      duration: "4h restantes",
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=250&fit=crop",
      difficulty: "Moyen",
      lastAccessed: "Hier",
      nextSession: "Samedi 15h",
      resumeAt: "Test blanc n°3"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: `Session de coaching - ${profile.specialization}`,
      date: "Aujourd'hui, 15:00",
      type: "coaching",
      instructor: "Dr. Kouassi",
      color: "primary",
      spotsLeft: 3,
      duration: "1h30"
    },
    {
      id: 2,
      title: `Examen blanc - ${profile.targetExam}`,
      date: "Demain, 10:00",
      type: "exam",
      duration: "2h",
      color: "warning",
      spotsLeft: null,
      participants: 45
    }
  ];

  const userGoals = profile.academicGoals.map((goal, index) => ({
    id: index + 1,
    title: goal,
    progress: Math.floor(Math.random() * 100),
    deadline: "30 jours",
    priority: index === 0 ? "high" : "medium",
    nextStep: "Compléter 3 exercices d'analyse"
  }));

  const getDifficultyClass = (difficulty: string) => {
    const map: { [key: string]: string } = {
      'Facile': 'difficulty-facile',
      'Moyen': 'difficulty-moyen',
      'Difficile': 'difficulty-difficile'
    };
    return map[difficulty] || 'difficulty-moyen';
  };

  const getUrgencyClass = (urgency: string) => {
    const map: { [key: string]: string } = {
      'high': 'urgency-high',
      'medium': 'urgency-medium',
      'low': 'urgency-low'
    };
    return map[urgency] || 'urgency-medium';
  };

  const handleStartPriority = (priorityId: number) => {
    console.log('Démarrage de la priorité:', priorityId);
    // Implémentation réelle avec votre backend
  };

  const handleFollowPlan = () => {
    console.log('Suivi du plan du jour');
  };

  const handleAdaptPlan = () => {
    console.log('Adaptation du plan');
  };

  const handleStartRecommendation = (recoId: number) => {
    console.log('Démarrage recommandation IA:', recoId);
  };

  const handleAddToPlan = (recoId: number) => {
    console.log('Ajout au plan:', recoId);
  };

  const handleLogout = () => {
    console.log('Déconnexion en cours...');
  };

  const formatDate = (dateStr: string) => {
    return dateStr; // Utiliser Intl.DateTimeFormat en production
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
                <span className="footer-brand-tagline">Excellence Académique</span>
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
          >
            <FaBars />
          </button>

          <div className="topbar-left">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher des épreuves, cours, sujets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Rechercher du contenu"
              />
            </div>
          </div>

          <div className="topbar-right">
            <button 
              className="topbar-btn1 theme-toggle1"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
              aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
            >
              <span className="theme-icon-wrapper">
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </span>
            </button>

            <button 
              className="topbar-btn1 notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              aria-label="Afficher les notifications"
            >
              <FaBell />
              <span className="notification-badge">3</span>
            </button>

            <div className="topbar-user">
              <img
                src={profile.profileImageUrl}
                alt={profile.username}
                className="user-avatar"
              />
              <div className="user-info">
                <p className="user-name">{profile.username}</p>
                <p className="user-role">{profile.currentLevel}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Welcome Section avec Quick Actions */}
          <section className="welcome-section">
            <div className="welcome-text">
              <h1 className="welcome-title">
                Bonjour, {profile.username.split(' ')[0]} <span className="wave-emoji">👋</span>
              </h1>
              <p className="welcome-subtitle">
                Prête pour 45 min de révision ? 0% de votre plan complété aujourd'hui.
              </p>
            </div>
            <div className="welcome-actions">
              <button className="btn-primary1">
                <span className="btn-icon1"><FaLayerGroup /></span>
                Catalogue
              </button>
              <button className="btn-secondary1">
                <span className="btn-icon1"><FaCalendarAlt /></span>
                Planning
              </button>
              
            </div>
          </section>
          {/* Continuer l'apprentissage (amélioré) */}
          <section className="courses-section">
            <div className="section-header1">
              <h2 className="section-title1">Continuer l'apprentissage</h2>
              <button className="section-link">
                Voir tout
                <FaChevronRight />
              </button>
            </div>

            <div className="courses-grid">
              {continueStudying.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-thumbnail">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="course-overlay"></div>
                    <span className={`course-difficulty ${getDifficultyClass(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    <button className="course-play-btn">
                      <FaPlay />
                    </button>
                  </div>

                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    
                    {/* NOUVEAU : Point de reprise */}
                    <p className="course-resume-at">
                      <FaBookmark className="resume-icon" />
                      Reprendre à : {course.resumeAt}
                    </p>
                    
                    <div className="course-meta">
                      <span className="course-meta-item">
                        <FaClock />
                        {course.duration}
                      </span>
                      <span className="course-meta-item">
                        {course.lastAccessed}
                      </span>
                    </div>

                    <div className="course-progress-wrapper">
                      <div className="progress-info">
                        <span className="progress-label">Progression</span>
                        <span className="progress-value">{course.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="course-next-session">
                      <FaCalendar />
                      <span>Prochaine session: {course.nextSession}</span>
                    </div>

                    {/* NOUVEAU : Actions rapides */}
                    <div className="course-quick-actions">
                      <button className="btn-course-primary">
                        <FaPlay /> Reprendre
                      </button>
                      <button className="btn-course-secondary">
                        Voir corrigé
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* NOUVEAU : Priorités du jour */}
          <section className="priorities-section">
            <div className="section-header1">
              <h2 className="section-title1">Priorités pour aujourd'hui</h2>
            </div>

            <div className="priorities-grid">
              {todayPriorities.map((priority) => (
                <div key={priority.id} className={`priority-card ${getUrgencyClass(priority.urgency)}`}>
                  <div className="priority-header">
                    <div className="priority-number">{priority.id}</div>
                    <span className={`priority-badge urgency-${priority.urgency}`}>
                      {priority.urgency === 'high' && 'Urgent'}
                      {priority.urgency === 'medium' && 'Important'}
                      {priority.urgency === 'low' && 'À faire'}
                    </span>
                  </div>
                  
                  <h3 className="priority-title">{priority.title}</h3>
                  
                  <div className="priority-meta">
                    <span className="priority-duration">
                      <FaClock /> {priority.duration}
                    </span>
                    <span className="priority-improvement">
                      <FaArrowUp /> {priority.expectedImprovement}
                    </span>
                  </div>

                  <p className="priority-reason">{priority.reason}</p>

                  <div className="priority-actions">
                    <button 
                      className="btn-priority-primary"
                      onClick={() => handleStartPriority(priority.id)}
                    >
                      Commencer ({priority.duration})
                    </button>
                    <button className="btn-priority-secondary">
                      Planifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Épreuves recommandées (améliorées) */}
          <section className="exams-section">
            <div className="section-header1">
              <h2 className="section-title1">Épreuves Recommandées</h2>
              <button className="section-link">
                Voir le catalogue complet
                <FaChevronRight />
              </button>
            </div>

            <div className="exams-grid">
              {featuredExams.map((exam) => (
                <div key={exam.id} className="exam-card">
                  <div className="exam-thumbnail">
                    <img src={exam.thumbnail} alt={exam.title} />
                    <div className="exam-overlay"></div>
                    {exam.isFree && <span className="exam-free-badge">GRATUIT</span>}
                    {exam.included && <span className="exam-included-badge">Inclus</span>}
                    <span className={`exam-difficulty ${getDifficultyClass(exam.difficulty)}`}>
                      {exam.difficulty}
                    </span>
                    <div className="exam-actions">
                      <button className="exam-action-btn" title="Enregistrer">
                        <FaBookmark />
                      </button>
                      <button className="exam-action-btn" title="Partager">
                        <FaShare />
                      </button>
                    </div>
                  </div>

                  <div className="exam-content">
                    <div className="exam-header">
                      <span className="exam-level">{exam.level}</span>
                      <div className="exam-rating">
                        <FaStar />
                        <span>{exam.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="exam-title">{exam.title}</h3>

                    {/* NOUVEAU : Raison de recommandation */}
                    <p className="exam-why">
                      <FaLightbulb className="why-icon" />
                      {exam.whyRecommended}
                    </p>
                    
                    <div className="exam-meta">
                      <span className="exam-meta-item">
                        <FaDownload />
                        {exam.downloads} téléchargements
                      </span>
                      <span className="exam-meta-item exam-access-time">
                        {exam.accessTime}
                      </span>
                    </div>

                    <div className="exam-footer">
                      <div className="exam-price">
                        {exam.isFree ? (
                          <span className="price-free">Gratuit</span>
                        ) : (
                          <>
                            <span className="price-amount">{exam.price}</span>
                            {exam.included && <span className="price-note">Inclus abonnement</span>}
                          </>
                        )}
                      </div>
                      <button className={`exam-btn ${exam.isFree ? 'btn-download' : 'btn-buy'}`}>
                        {exam.isFree ? (
                          <>
                            <FaDownload />
                            Télécharger
                          </>
                        ) : (
                          <>
                            <FaShoppingCart />
                            Acheter
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Statistiques (avec tooltips) */}
          <section className="stats-section">
            <div className="section-header1">
              <h2 className="section-title1">Vos Statistiques</h2>
            </div>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className={`stat-card stat-${stat.color}`} title={stat.tooltip}>
                  <div className="stat-icon-wrapper">
                    <stat.icon className="stat-icon1" />
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                    <p className={`stat-change ${stat.positive ? 'positive' : ''}`}>
                      {stat.positive && <FaArrowUp />}
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="dashboard-columns">
            {/* Événements (améliorés) */}
            <section className="events-section">
              <div className="section-header1">
                <h2 className="section-title1">Événements à venir</h2>
              </div>
              
              <div className="events-list">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className={`event-card event-${event.color}`}>
                    <div className="event-icon-wrapper">
                      <FaCalendar />
                    </div>
                    <div className="event-content">
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-date">{formatDate(event.date)}</p>
                      {event.instructor && (
                        <p className="event-meta">avec {event.instructor}</p>
                      )}
                      {event.duration && (
                        <p className="event-meta">Durée: {event.duration}</p>
                      )}
                      {/* NOUVEAU : Places restantes */}
                      {event.spotsLeft && (
                        <p className="event-spots">
                          <FaUsers /> {event.spotsLeft} places restantes
                        </p>
                      )}
                      {event.participants && (
                        <p className="event-participants">
                          <FaUsers /> {event.participants} participants
                        </p>
                      )}
                    </div>
                    <div className="event-actions-group">
                      <button className="event-btn">Rejoindre</button>
                      <button className="event-btn-secondary" title="Ajouter au calendrier">
                        <FaCalendarAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Objectifs (améliorés) */}
            <section className="goals-section">
              <div className="section-header1">
                <h2 className="section-title1">Vos Objectifs</h2>
              </div>
              
              <div className="goals-list">
                {userGoals.map((goal) => (
                  <div key={goal.id} className={`goal-card priority-${goal.priority}`}>
                    <div className="goal-header">
                      <FaBullseye className="goal-icon" />
                      <h3 className="goal-title">{goal.title}</h3>
                    </div>
                    <div className="goal-progress-wrapper">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="goal-progress-text">{goal.progress}%</span>
                    </div>
                    <p className="goal-deadline">
                      <FaClock />
                      {goal.deadline}
                    </p>
                    {/* NOUVEAU : Prochaine étape */}
                    <p className="goal-next-step">
                      <FaLightbulb className="next-step-icon" />
                      Prochaine étape : {goal.nextStep}
                    </p>
                    <button className="btn-goal-action">
                      Décomposer
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* NOUVEAU : Ressources rapides / Aide */}
          <section className="quick-help-section">
            <div className="section-header1">
              <h2 className="section-title1">Besoin d'aide ?</h2>
            </div>
            <div className="quick-help-grid">
              <a href="#faq" className="help-card">
                <div className="help-icon">
                  <FaComments />
                </div>
                <h3>FAQ</h3>
                <p>Questions fréquentes</p>
              </a>
              <a href="#tutorials" className="help-card">
                <div className="help-icon">
                  <FaGraduationCap />
                </div>
                <h3>Tutoriels</h3>
                <p>Guides d'utilisation</p>
              </a>
              <a href="#support" className="help-card">
                <div className="help-icon">
                  <FaEnvelope />
                </div>
                <h3>Support</h3>
                <p>Contactez-nous</p>
              </a>
            </div>
          </section>
        </div>

        {/* Footer compact */}
        <footer className="dashboard-footer">
          <div className="footer-content-compact">
            <div className="footer-section-compact">
              <div className="footer-logo1">
                <div className="logo-icon1">
                  <img src='ReussirLogo1.png' alt='reussir logo'/>
                </div>
                <span className="logo-text1">Réussir</span>
              </div>
              <p className="footer-description-compact">
                Excellence académique au Cameroun et en Afrique.
              </p>
            </div>

            <div className="footer-links-compact">
              <a href="#support">Support</a>
              <a href="#cgu">CGU</a>
              <a href="#confidentialite">Confidentialité</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="footer-contact-icons">
              <a href="https://wa.me/237XXXXXXXXX" className="contact-icon" title="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="mailto:contact@winplus.cm" className="contact-icon" title="Email">
                <FaEnvelope />
              </a>
              <a href="tel:+237XXXXXXXXX" className="contact-icon" title="Téléphone">
                <FaPhone />
              </a>
            </div>
          </div>

          <div className="footer-bottom-compact">
            <p>&copy; 2024 Réussir. Tous droits réservés.</p>
            <div className="footer-badges1">
              <span className="footer-badge1">
                <FaShieldAlt />
                Sécurisé
              </span>
              <span className="footer-badge1">
                <FaAward />
                Certifié
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Student;