import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useTheme } from '@contexts/ThemeContext';
import CartIcon from '@components/cart/CartIcon';
import { 
	Menu, 
	X, 
	Search, 
	User, 
	LogOut, 
	Settings, 
	LayoutDashboard,
	Heart,
	History as HistoryIcon,
	Sun,
	Moon
} from 'lucide-react';
import './Header.css';

interface HeaderProps {
	onMenuClick: () => void;
	sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
	const navigate = useNavigate();
	const { user, isAuthenticated, signOut } = useAuth();
	const { theme, toggleTheme, isDark } = useTheme();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const handleSignOut = async () => {
		await signOut();
		setShowUserMenu(false);
		navigate('/');
	};

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<header className="header">
			<div className="header-container">
				{/* Left section: Logo + Menu */}
				<div className="header-left">
					{/* Menu burger (mobile) */}
					<button
						className="menu-toggle"
						onClick={onMenuClick}
						aria-label="Toggle menu"
					>
						{sidebarOpen ? <X size={24} /> : <Menu size={24} />}
					</button>

					{/* Logo */}
					<Link to="/" className="header-logo">
						<div className="logo-icon">
							<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
								<rect width="32" height="32" rx="8" fill="url(#gradient)" />
								<path
									d="M16 8L20 14H12L16 8Z"
									fill="white"
								/>
								<path
									d="M16 24L12 18H20L16 24Z"
									fill="white"
								/>
								<defs>
									<linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
										<stop offset="0%" stopColor="#3B82F6" />
										<stop offset="100%" stopColor="#F59E0B" />
									</linearGradient>
								</defs>
							</svg>
						</div>
						<span className="logo-text">EduAI</span>
					</Link>

					{/* Navigation principale (desktop) */}
					<nav className="header-nav">
						<Link to="/" className="nav-link">
							Accueil
						</Link>
						<Link to="/discover" className="nav-link">
							Découvrir
						</Link>
						{isAuthenticated && (
							<>
								<Link to="/favorites" className="nav-link">
									Favoris
								</Link>
								<Link to="/history" className="nav-link">
									Historique
								</Link>
							</>
						)}
					</nav>
				</div>

				{/* Center section: Search (desktop) */}
				<div className="header-center">
					<form className="header-search" onSubmit={handleSearch}>
						<Search size={20} className="search-icon" />
						<input
							type="text"
							placeholder="Rechercher un sujet, concours, matière..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="search-input"
						/>
						{searchQuery && (
							<button
								type="button"
								className="search-clear"
								onClick={() => setSearchQuery('')}
								aria-label="Clear search"
							>
								<X size={16} />
							</button>
						)}
					</form>
				</div>

				{/* Right section: Actions */}
				<div className="header-right">
					{/* Theme toggle */}
					<button
						className="header-icon-btn"
						onClick={toggleTheme}
						aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
						title={isDark ? 'Mode clair' : 'Mode sombre'}
					>
						{isDark ? <Sun size={20} /> : <Moon size={20} />}
					</button>

					{/* Cart */}
					<CartIcon />

					{/* User menu */}
					{isAuthenticated ? (
						<div className="user-menu">
							<button
								className="user-menu-trigger"
								onClick={() => setShowUserMenu(!showUserMenu)}
								aria-expanded={showUserMenu}
								aria-haspopup="true"
							>
								<div className="user-avatar">
									{user?.attributes?.name?.charAt(0).toUpperCase() || 'U'}
								</div>
								<span className="user-name">
									{user?.attributes?.name || 'Utilisateur'}
								</span>
							</button>

							{showUserMenu && (
								<>
									<div
										className="user-menu-overlay"
										onClick={() => setShowUserMenu(false)}
									/>
									<div className="user-menu-dropdown">
										<div className="user-menu-header">
											<div className="user-menu-avatar">
												{user?.attributes?.name?.charAt(0).toUpperCase() || 'U'}
											</div>
											<div className="user-menu-info">
												<div className="user-menu-name">
													{user?.attributes?.name || 'Utilisateur'}
												</div>
												<div className="user-menu-email">
													{user?.attributes?.email}
												</div>
											</div>
										</div>

										<div className="user-menu-divider" />

										<nav className="user-menu-nav">
											<Link
												to="/dashboard"
												className="user-menu-item"
												onClick={() => setShowUserMenu(false)}
											>
												<LayoutDashboard size={18} />
												<span>Tableau de bord</span>
											</Link>
											<Link
												to="/favorites"
												className="user-menu-item"
												onClick={() => setShowUserMenu(false)}
											>
												<Heart size={18} />
												<span>Mes favoris</span>
											</Link>
											<Link
												to="/history"
												className="user-menu-item"
												onClick={() => setShowUserMenu(false)}
											>
												<HistoryIcon size={18} />
												<span>Mon historique</span>
											</Link>
											<Link
												to="/profile"
												className="user-menu-item"
												onClick={() => setShowUserMenu(false)}
											>
												<Settings size={18} />
												<span>Paramètres</span>
											</Link>
										</nav>

										<div className="user-menu-divider" />

										<button
											className="user-menu-item user-menu-signout"
											onClick={handleSignOut}
										>
											<LogOut size={18} />
											<span>Déconnexion</span>
										</button>
									</div>
								</>
							)}
						</div>
					) : (
						<div className="auth-buttons">
							<Link to="/login" className="btn btn-ghost btn-sm">
								Connexion
							</Link>
							<Link to="/signup" className="btn btn-primary btn-sm">
								Inscription
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* Mobile search */}
			<div className="header-mobile-search">
				<form className="header-search" onSubmit={handleSearch}>
					<Search size={20} className="search-icon" />
					<input
						type="text"
						placeholder="Rechercher..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
				</form>
			</div>
		</header>
	);
};

export default Header;
