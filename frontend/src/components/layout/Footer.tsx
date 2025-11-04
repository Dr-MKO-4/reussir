import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ label: 'Découvrir', to: '/discover' },
			{ label: 'Catégories', to: '/categories' },
			{ label: 'Populaires', to: '/popular' },
			{ label: 'Nouveautés', to: '/new' }
		],
		company: [
			{ label: 'À propos', to: '/about' },
			{ label: 'Blog', to: '/blog' },
			{ label: 'Carrières', to: '/careers' },
			{ label: 'Contact', to: '/contact' }
		],
		support: [
			{ label: "Centre d'aide", to: '/help' },
			{ label: 'FAQ', to: '/faq' },
			{ label: 
				"Conditions d'utilisation", to: '/terms' },
			{ label: 'Politique de confidentialité', to: '/privacy' }
		]
	};

	const socialLinks = [
		{ icon: Github, href: 'https://github.com', label: 'GitHub' },
		{ icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
		{ icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
		{ icon: Mail, href: 'mailto:contact@eduai.com', label: 'Email' }
	];

	return (
		<footer className="footer">
			<div className="footer-container">
				{/* Main footer content */}
				<div className="footer-content">
					{/* Brand section */}
					<div className="footer-brand">
						<Link to="/" className="footer-logo">
							<div className="footer-logo-icon">
								<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
									<rect width="32" height="32" rx="8" fill="url(#gradient)" />
									<path d="M16 8L20 14H12L16 8Z" fill="white" />
									<path d="M16 24L12 18H20L16 24Z" fill="white" />
									<defs>
										<linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
											<stop offset="0%" stopColor="#3B82F6" />
											<stop offset="100%" stopColor="#F59E0B" />
										</linearGradient>
									</defs>
								</svg>
							</div>
							<span className="footer-logo-text">EduAI</span>
						</Link>
						<p className="footer-description">
							Plateforme éducative intelligente propulsée par l'IA pour vous aider à
							réussir vos examens et concours.
						</p>
						<div className="footer-social">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									className="footer-social-link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.label}
								>
									<social.icon size={20} />
								</a>
							))}
						</div>
					</div>

					{/* Links sections */}
					<div className="footer-links">
						<div className="footer-links-section">
							<h3 className="footer-links-title">Produit</h3>
							<ul className="footer-links-list">
								{footerLinks.product.map((link) => (
									<li key={link.to}>
										<Link to={link.to} className="footer-link">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="footer-links-section">
							<h3 className="footer-links-title">Entreprise</h3>
							<ul className="footer-links-list">
								{footerLinks.company.map((link) => (
									<li key={link.to}>
										<Link to={link.to} className="footer-link">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className="footer-links-section">
							<h3 className="footer-links-title">Support</h3>
							<ul className="footer-links-list">
								{footerLinks.support.map((link) => (
									<li key={link.to}>
										<Link to={link.to} className="footer-link">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="footer-bottom">
					<p className="footer-copyright">
						© {currentYear} EduAI Platform. Tous droits réservés.
					</p>
					<p className="footer-made-with">
						Fait avec <Heart size={14} className="heart-icon" /> par l'équipe EduAI
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
