import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Composant qui scroll vers le haut à chaque changement de route
 */
const ScrollToTop: React.FC = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// Scroll vers le haut avec un petit délai pour la fluidité
		const timer = setTimeout(() => {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		}, 0);
		return () => clearTimeout(timer);
	}, [pathname]);

	return null;
};

export default ScrollToTop;
