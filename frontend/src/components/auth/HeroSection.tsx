import React from 'react';
import styles from './HeroSection.module.css';
import logoUrl from '../../assets/ReussirLogo1.png'; // Assurez-vous que le chemin est correct
interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  logoSrc?: string | React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title = "Bienvenue !",
  subtitle = "Connectez-vous pour accéder à votre espace personnel et découvrir toutes nos fonctionnalités",
  logoSrc = logoUrl
}) => {
  return (
    <div className={styles.heroSection}>
      <div className={styles.backgroundPattern} />
      
      <div className={styles.brandContainer}>
        <div className={styles.brandLogo}>
          {logoSrc ? (
            typeof logoSrc === "string" ? (
              <img 
                src={logoSrc} 
                alt="Logo Réussir" 
                className={styles.logoImage}
              />
            ) : (
              logoSrc
            )
          ) : (
            // Logo par défaut avec animation sablier si pas d'image fournie
            <svg className={styles.logoSvg} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              {/* Cadre principal du R */}
              <path 
                d="M20 20 L20 100 L35 100 L35 65 L50 65 L65 100 L85 100 L65 60 Q75 60 80 55 Q85 50 85 40 Q85 30 80 25 Q75 20 65 20 L20 20 Z M35 35 L65 35 Q70 35 70 40 Q70 45 65 45 L35 45 Z" 
                fill="rgba(255, 255, 255, 0.9)"
                className={styles.letterR}
              />
              
              {/* Sablier intégré */}
              <g transform="translate(45, 25)" className={styles.hourglass}>
                {/* Cadre du sablier */}
                <rect 
                  x="0" y="0" 
                  width="30" height="35" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.8)" 
                  strokeWidth="2" 
                  rx="2"
                />
                <line x1="0" y1="0" x2="30" y2="0" stroke="rgba(255,255,255,0.9)" strokeWidth="3"/>
                <line x1="0" y1="35" x2="30" y2="35" stroke="rgba(255,255,255,0.9)" strokeWidth="3"/>
                
                {/* Sable supérieur animé */}
                <polygon 
                  points="5,5 25,5 25,12 15,17.5 5,12" 
                  fill="rgba(255,255,255,0.8)"
                  className={styles.sandTop}
                />
                
                {/* Sable inférieur animé */}
                <polygon 
                  points="5,30 25,30 20,23 15,17.5 10,23" 
                  fill="rgba(255,255,255,0.6)"
                  className={styles.sandBottom}
                />
                
                {/* Particule de sable qui tombe */}
                <circle 
                  cx="15" cy="17.5" r="0.8" 
                  fill="rgba(255,255,255,0.9)"
                  className={styles.sandParticle}
                />
              </g>
            </svg>
          )}
        </div>
      </div>
      
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
      </div>
      
      {/* Éléments décoratifs */}
      <div className={styles.decorativeElements}>
        <div className={styles.decorations}>
          <div className={styles.floatingElement} style={{ top: '10%', left: '10%', animationDelay: '0s' }}>
            <div className={styles.circle}></div>
          </div>
          <div className={styles.floatingElement} style={{ top: '70%', right: '15%', animationDelay: '2s' }}>
            <div className={styles.triangle}></div>
          </div>
          <div className={styles.floatingElement} style={{ bottom: '20%', left: '20%', animationDelay: '4s' }}>
            <div className={styles.square}></div>
          </div>
          <div className={styles.floatingElement} style={{ top: '30%', right: '25%', animationDelay: '1s' }}>
            <div className={styles.hexagon}></div>
          </div>
        </div>
        <div className={styles.decorElement1} />
        <div className={styles.decorElement2} />
        <div className={styles.decorElement3} />
      </div>
      <div className={styles.waveEffect}>
        <svg
          className={styles.wave}
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
            />
          </defs>
          <g className={styles.waves}>
            <use href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use href="#gentle-wave" x="48" y="7" fill="white" />
          </g>
        </svg>
      </div>
    </div>
    
  );
};

export default HeroSection;