import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
	Home,
	Search,
	Heart,
	History as HistoryIcon,
	LayoutDashboard,
	User,
	BookOpen,
	TrendingUp,
	Star,
	Calendar,
	MessageCircle
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
	const { isAuthenticated } = useAuth();

	const publicLinks = [
		{ to: '/', icon: Home, label: 'Accueil' },
		{ to: '/discover', icon: Search, label: 'Découvrir' },
		{ to: '/popular', icon: TrendingUp, label: 'Populaires' },
		{ to: '/categories', icon: BookOpen, label: 'Catégories' }
	];

	const authenticatedLinks = [
		{ to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
		{ to: '/favorites', icon: Heart, label: 'Mes favoris' },
		{ to: '/history', icon: HistoryIcon, label: 'Mon historique' },
		{ to: '/study-plan', icon: Calendar, label: "Plan d'étude" },
		{ to: '/profile', icon: User, label: 'Mon profil' }
	];

	return (
		<>
			<aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
				<nav className="sidebar-nav">
					{/* Public links */}
					<div className="sidebar-section">
						<h3 className="sidebar-section-title">Navigation</h3>
						<ul className="sidebar-menu">
							{publicLinks.map((link) => (
								<li key={link.to}>
									<NavLink
										to={link.to}
										className={({ isActive }) =>
											`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
										}
										onClick={onClose}
									>
										<link.icon size={20} className="sidebar-icon" />
										<span>{link.label}</span>
									</NavLink>
								</li>
							))}
						</ul>
					</div>

					{/* Authenticated links */}
					{isAuthenticated && (
						<div className="sidebar-section">
							<h3 className="sidebar-section-title">Mon espace</h3>
							<ul className="sidebar-menu">
								{authenticatedLinks.map((link) => (
									<li key={link.to}>
										<NavLink
											to={link.to}
											className={({ isActive }) =>
												`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
											}
											onClick={onClose}
										>
											<link.icon size={20} className="sidebar-icon" />
											<span>{link.label}</span>
										</NavLink>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* AI Assistant */}
					<div className="sidebar-section">
						<h3 className="sidebar-section-title">IA</h3>
						<ul className="sidebar-menu">
							<li>
								<button className="sidebar-link sidebar-ai-btn">
									<MessageCircle size={20} className="sidebar-icon" />
									<span>Assistant IA</span>
									<span className="badge badge-primary">Nouveau</span>
								</button>
							</li>
						</ul>
					</div>

					{/* Quick stats (if authenticated) */}
					{isAuthenticated && (
						<div className="sidebar-section sidebar-stats">
							<h3 className="sidebar-section-title">Statistiques</h3>
							<div className="stat-card">
								<div className="stat-icon">
									<Star size={18} />
								</div>
								<div className="stat-info">
									<div className="stat-value">0</div>
									<div className="stat-label">Sujets complétés</div>
								</div>
							</div>
							<div className="stat-card">
								<div className="stat-icon">
									<TrendingUp size={18} />
								</div>
								<div className="stat-info">
									<div className="stat-value">0%</div>
									<div className="stat-label">Taux de réussite</div>
								</div>
							</div>
						</div>
					)}
				</nav>

				{/* Sidebar footer */}
				<div className="sidebar-footer">
					<p className="sidebar-footer-text">
						© 2025 EduAI Platform
					</p>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
