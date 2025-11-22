// src/components/catalog/PreviewCarousel.tsx
import React, { useState, useEffect } from 'react';
import styles from './PreviewCarousel.module.css';

interface PreviewCarouselProps {
  images: string[];
  title: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const PreviewCarousel: React.FC<PreviewCarouselProps> = ({
  images,
  title,
  autoPlay = false,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Assurer qu'il y a au moins une image par défaut
  const displayImages =
    images && images.length > 0
      ? images
      : ['/placeholder-subject.png'];

  // Auto-play
  useEffect(() => {
    if (!autoPlay || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, displayImages.length]);

  // Navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Toggle zoom
  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  return (
    <div className={styles.carouselContainer}>
      {/* Image principale */}
      <div className={styles.mainImageWrapper}>
        <div
          className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          aria-label={isZoomed ? 'Dézoomer l\'image' : 'Zoomer l\'image'}
        >
          <img
            src={displayImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            loading="eager"
          />

          {/* Badge de zoom */}
          <div className={styles.zoomBadge}>
            {isZoomed ? '🔍 Cliquer pour dézoomer' : '🔍 Cliquer pour zoomer'}
          </div>
        </div>

        {/* Boutons de navigation */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevious}
              aria-label="Image précédente"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Image suivante"
            >
              ›
            </button>
          </>
        )}

        {/* Indicateurs de pagination */}
        {displayImages.length > 1 && (
          <div className={styles.indicators}>
            {displayImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.indicator} ${
                  index === currentIndex ? styles.active : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Aller à l'image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}

        {/* Compteur */}
        {displayImages.length > 1 && (
          <div className={styles.counter}>
            {currentIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className={styles.thumbnailsWrapper}>
          <div className={styles.thumbnails}>
            {displayImages.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`${styles.thumbnail} ${
                  index === currentIndex ? styles.activeThumbnail : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`Miniature ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${title} - Miniature ${index + 1}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal zoom (version plein écran) */}
      {isZoomed && (
        <div
          className={styles.zoomModal}
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-label="Image en plein écran"
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setIsZoomed(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
          <img
            src={displayImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1} (plein écran)`}
            className={styles.zoomedImage}
          />
        </div>
      )}
    </div>
  );
};

export default PreviewCarousel;