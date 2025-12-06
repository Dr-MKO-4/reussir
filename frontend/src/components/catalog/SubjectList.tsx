import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SubjectCardData } from '../../types/catalog';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import './SubjectList.css';

interface SubjectListProps {
  subjects: SubjectCardData[];
  onAddToCart?: (subject: SubjectCardData) => void;
  onToggleFavorite?: (subjectId: string) => void;
  favorites?: string[];
  className?: string;
}

/**
 * Affichage en liste des sujets
 */
export const SubjectList: React.FC<SubjectListProps> = ({
  subjects,
  onAddToCart,
  onToggleFavorite,
  favorites = [],
  className = '',
}) => {
  const navigate = useNavigate();

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subjects/${subjectId}`);
  };

  const isFavorite = (subjectId: string) => favorites.includes(subjectId);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="subject-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`star ${star <= rating ? 'star-filled' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  if (!subjects || subjects.length === 0) {
    return (
      <div className="subject-list-empty">
        <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Aucun sujet trouvé</p>
      </div>
    );
  }

  return (
    <div className={`subject-list ${className}`}>
      {subjects.map((subject) => (
        <div key={subject.id} className="subject-list-item">
          {/* Image */}
          <div 
            className="subject-list-image"
            onClick={() => handleSubjectClick(subject.id)}
          >
            {subject.thumbnailUrl ? (
              <img src={subject.thumbnailUrl} alt={subject.title} />
            ) : (
              <div className="subject-placeholder">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="subject-list-content">
            <div className="subject-list-badges">
              {subject.isNew && <Badge variant="primary">Nouveau</Badge>}
              {subject.isFree && <Badge variant="success">Gratuit</Badge>}
              {subject.isPremium && <Badge variant="warning">Premium</Badge>}
            </div>

            <h3 
              className="subject-list-title"
              onClick={() => handleSubjectClick(subject.id)}
            >
              {subject.title}
            </h3>

            <p className="subject-list-description">{subject.description}</p>

            <div className="subject-list-meta">
              <span className="meta-item">
                <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {subject.exam}
              </span>
              <span className="meta-separator">•</span>
              <span className="meta-item">{subject.year}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">Difficulté {subject.difficulty}/5</span>
            </div>

            {renderStars(subject.rating)}

            {subject.tags && subject.tags.length > 0 && (
              <div className="subject-list-tags">
                {subject.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
                {subject.tags.length > 3 && (
                  <span className="tag-more">+{subject.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="subject-list-actions">
            <div className="subject-price">
              {subject.isFree ? (
                <span className="price-free">Gratuit</span>
              ) : (
                <span className="price-amount">{subject.price} FCFA</span>
              )}
            </div>

            <div className="action-buttons">
              {onToggleFavorite && (
                <button
                  className={`action-btn ${isFavorite(subject.id) ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(subject.id)}
                  aria-label="Favoris"
                >
                  <svg fill={isFavorite(subject.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}

              {subject.isFree ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSubjectClick(subject.id)}
                >
                  Télécharger
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAddToCart?.(subject)}
                >
                  Ajouter
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectList;