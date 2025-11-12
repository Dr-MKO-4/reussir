import React, { useState } from 'react';
import { Button } from '../common/Button';
import './PreviewCarousel.css';

interface PreviewImage {
  id: string;
  url: string;
  alt: string;
}

interface PreviewCarouselProps {
  images: PreviewImage[];
  className?: string;
}

/**
 * Carrousel d'aperçu des pages d'un sujet
 */
export const PreviewCarousel: React.FC<PreviewCarouselProps> = ({
  images,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`preview-carousel preview-empty ${className}`}>
        <p>Aucun aperçu disponible</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className={`preview-carousel ${className}`}>
      {/* Main Image */}
      <div className="carousel-main">
        <div 
          className={`carousel-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
          onClick={toggleZoom}
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="carousel-image"
          />
          {!isZoomed && (
            <div className="zoom-hint">
              <svg className="zoom-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span>Cliquez pour zoomer</span>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="carousel-button carousel-button-prev"
              onClick={handlePrevious}
              aria-label="Image précédente"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="carousel-button carousel-button-next"
              onClick={handleNext}
              aria-label="Image suivante"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        <div className="carousel-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="carousel-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`thumbnail ${index === currentIndex ? 'thumbnail-active' : ''}`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`Afficher ${image.alt}`}
            >
              <img src={image.url} alt={image.alt} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewCarousel;