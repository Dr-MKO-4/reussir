// src/components/catalog/QuickActions.tsx
import React, { useState } from 'react';
import Button from '../common/Button';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  subjectId: string;
  onAddToCart?: (subjectId: string) => void;
  onAddToFavorite?: (subjectId: string) => void;
  onShare?: (subjectId: string) => void;
  inCart?: boolean;
  inFavorites?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

const QuickActions: React.FC<QuickActionsProps> = ({
  subjectId,
  onAddToCart,
  onAddToFavorite,
  onShare,
  inCart = false,
  inFavorites = false,
  disabled = false,
  variant = 'default',
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Gérer l'ajout au panier
  const handleAddToCart = async () => {
    if (!onAddToCart || disabled || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await onAddToCart(subjectId);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Gérer l'ajout aux favoris
  const handleAddToFavorites = async () => {
    if (!onAddToFavorite || disabled || isAddingToFavorites) return;

    setIsAddingToFavorites(true);
    try {
      await onAddToFavorite(subjectId);
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  // Gérer le partage
  const handleShare = () => {
    if (!onShare || disabled) return;
    setShowShareMenu(!showShareMenu);
  };

  // Copier le lien
  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/subjects/${subjectId}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => {
        setCopiedLink(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la copie du lien:', error);
    }
  };

  // Partager sur les réseaux sociaux
  const handleSocialShare = (platform: string) => {
    const url = `${window.location.origin}/subjects/${subjectId}`;
    const text = 'Découvrez ce sujet sur Réussir!';

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  return (
    <div className={`${styles.quickActions} ${styles[variant]}`}>
      {/* Bouton principal - Ajouter au panier */}
      <Button
        variant="primary"
        size={variant === 'compact' ? 'small' : 'medium'}
        onClick={handleAddToCart}
        disabled={disabled || isAddingToCart || inCart}
        className={styles.cartButton}
        aria-label={inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
      >
        {isAddingToCart ? (
          <>
            <span className={styles.spinner}></span>
            <span>Ajout...</span>
          </>
        ) : inCart ? (
          <>
            <span>✓</span>
            <span>Dans le panier</span>
          </>
        ) : (
          <>
            <span>🛒</span>
            <span>Ajouter au panier</span>
          </>
        )}
      </Button>

      {/* Actions secondaires */}
      <div className={styles.secondaryActions}>
        {/* Bouton favoris */}
        <button
          type="button"
          className={`${styles.actionButton} ${
            inFavorites ? styles.active : ''
          }`}
          onClick={handleAddToFavorites}
          disabled={disabled || isAddingToFavorites}
          aria-label={inFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          title={inFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          {isAddingToFavorites ? (
            <span className={styles.spinner}></span>
          ) : (
            <span className={styles.icon}>
              {inFavorites ? '❤️' : '🤍'}
            </span>
          )}
        </button>

        {/* Bouton partage */}
        <div className={styles.shareContainer}>
          <button
            type="button"
            className={`${styles.actionButton} ${
              showShareMenu ? styles.active : ''
            }`}
            onClick={handleShare}
            disabled={disabled}
            aria-label="Partager"
            aria-expanded={showShareMenu}
            title="Partager"
          >
            <span className={styles.icon}>📤</span>
          </button>

          {/* Menu de partage */}
          {showShareMenu && (
            <div className={styles.shareMenu} role="menu">
              <button
                type="button"
                className={styles.shareOption}
                onClick={handleCopyLink}
                role="menuitem"
              >
                <span className={styles.shareIcon}>
                  {copiedLink ? '✓' : '🔗'}
                </span>
                <span className={styles.shareLabel}>
                  {copiedLink ? 'Copié!' : 'Copier le lien'}
                </span>
              </button>

              <button
                type="button"
                className={styles.shareOption}
                onClick={() => handleSocialShare('whatsapp')}
                role="menuitem"
              >
                <span className={styles.shareIcon}>💬</span>
                <span className={styles.shareLabel}>WhatsApp</span>
              </button>

              <button
                type="button"
                className={styles.shareOption}
                onClick={() => handleSocialShare('facebook')}
                role="menuitem"
              >
                <span className={styles.shareIcon}>📘</span>
                <span className={styles.shareLabel}>Facebook</span>
              </button>

              <button
                type="button"
                className={styles.shareOption}
                onClick={() => handleSocialShare('twitter')}
                role="menuitem"
              >
                <span className={styles.shareIcon}>🐦</span>
                <span className={styles.shareLabel}>Twitter</span>
              </button>

              <button
                type="button"
                className={styles.shareOption}
                onClick={() => handleSocialShare('email')}
                role="menuitem"
              >
                <span className={styles.shareIcon}>📧</span>
                <span className={styles.shareLabel}>Email</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;