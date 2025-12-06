import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, TrendingUp, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Subject } from 'types';
import useCart from '../../hooks/useCart';
import './SubjectCard.css';

interface SubjectCardProps {
  subject: Subject;
  onFavorite?: (subjectId: number) => void;
  isFavorite?: boolean;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onFavorite,
  isFavorite = false 
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: subject.id,
      title: subject.titre,
      image: subject.image,
      price: subject.prix || 0,
      quantity: 1,
      subject
    });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onFavorite) {
      onFavorite(subject.id);
    }
  };

  const getDifficultyColor = (difficulte: number): string => {
    if (difficulte < 0.4) return 'difficulty-easy';
    if (difficulte < 0.7) return 'difficulty-medium';
    return 'difficulty-hard';
  };

  const getDifficultyLabel = (difficulte: number): string => {
    if (difficulte < 0.4) return 'Facile';
    if (difficulte < 0.7) return 'Moyen';
    return 'Difficile';
  };

  return (
    <Link to={`/subjects/${subject.id}`} className="subject-card-link">
      <Card variant="default" hoverable clickable className="subject-card">
        {/* Image */}
        {subject.image ? (
          <Card.Image 
            src={subject.image} 
            alt={subject.titre}
            aspectRatio="16/9"
          />
        ) : (
          <div className="subject-card-placeholder">
            <TrendingUp size={48} />
          </div>
        )}

        {/* Badge gratuit */}
        {subject.gratuit && (
          <div className="subject-card-badge subject-badge-free">
            Gratuit
          </div>
        )}

        {/* Favorite button */}
        <button
          className={`subject-favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
          onClick={handleFavorite}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart 
            size={20} 
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>

        <Card.Body>
          {/* Metadata */}
          <div className="subject-card-meta">
            <span className="subject-theme">{subject.theme}</span>
            {subject.annee && (
              <span className="subject-year">{subject.annee}</span>
            )}
          </div>

          {/* Title */}
          <h3 className="subject-card-title">{subject.titre}</h3>

          {/* Description */}
          <p className="subject-card-description">
            {subject.description}
          </p>

          {/* Tags */}
          {subject.tags && subject.tags.length > 0 && (
            <div className="subject-card-tags">
              {subject.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="subject-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="subject-card-stats">
            <div className="subject-stat">
              <div className={`difficulty-badge ${getDifficultyColor(subject.difficulte)}`}>
                {getDifficultyLabel(subject.difficulte)}
              </div>
            </div>
            
            {subject.dureeEstimee && (
              <div className="subject-stat">
                <Clock size={14} />
                <span>{subject.dureeEstimee} min</span>
              </div>
            )}
          </div>
        </Card.Body>

        <Card.Footer>
          <div className="subject-card-footer-content">
            {/* Price */}
            <div className="subject-price">
              {subject.prix && subject.prix > 0 ? (
                <>
                  <span className="price-amount">{subject.prix}€</span>
                </>
              ) : (
                <span className="price-free">Gratuit</span>
              )}
            </div>

            {/* Add to cart button */}
            <Button
              variant="primary"
              size="sm"
              icon={<ShoppingCart size={16} />}
              onClick={handleAddToCart}
            >
              Ajouter
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default SubjectCard;