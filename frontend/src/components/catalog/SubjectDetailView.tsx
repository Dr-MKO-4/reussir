// src/components/catalog/SubjectDetailView.tsx
import React, { useState } from 'react';
import { Subject } from '../../types/catalog';
import PreviewCarousel from './PreviewCarousel';
import SubjectMetadata from './SubjectMetadata';
import QuickActions from './QuickActions';
import Badge from '../common/Badge';
import Tabs from '../common/Tabs';
import styles from './SubjectDetailView.module.css';

interface SubjectDetailViewProps {
  subject: Subject;
  onAddToCart?: (subjectId: string) => void;
  onAddToFavorite?: (subjectId: string) => void;
  onShare?: (subjectId: string) => void;
  loading?: boolean;
}

const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  onAddToCart,
  onAddToFavorite,
  onShare,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState('description');

  // Calculer la note moyenne
  const averageRating = subject.ratings?.average || 0;
  const totalReviews = subject.ratings?.total || 0;

  // Tabs pour le contenu
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'content', label: 'Contenu' },
    { id: 'reviews', label: `Avis (${totalReviews})` },
    { id: 'faq', label: 'FAQ' },
  ];

  if (loading) {
    return (
      <div className={styles.detailView}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Chargement du sujet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailView}>
      {/* En-tête avec breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <a href="/">Accueil</a>
        <span className={styles.separator}>›</span>
        <a href="/catalog">Catalogue</a>
        <span className={styles.separator}>›</span>
        <a href={`/catalog?category=${subject.category}`}>{subject.category}</a>
        <span className={styles.separator}>›</span>
        <span className={styles.current}>{subject.title}</span>
      </nav>

      {/* Contenu principal */}
      <div className={styles.mainContent}>
        {/* Section gauche - Aperçu */}
        <div className={styles.leftSection}>
          <PreviewCarousel
            images={subject.images || []}
            title={subject.title}
          />

          {/* Métadonnées desktop */}
          <div className={styles.desktopMetadata}>
            <SubjectMetadata subject={subject} />
          </div>
        </div>

        {/* Section droite - Informations */}
        <div className={styles.rightSection}>
          {/* En-tête du sujet */}
          <div className={styles.subjectHeader}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{subject.title}</h1>
              {subject.featured && (
                <Badge variant="primary" size="small">
                  ⭐ Recommandé
                </Badge>
              )}
            </div>

            {/* Tags */}
            {subject.tags && subject.tags.length > 0 && (
              <div className={styles.tags}>
                {subject.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Note et avis */}
            {averageRating > 0 && (
              <div className={styles.rating}>
                <span className={styles.stars}>
                  {'⭐'.repeat(Math.round(averageRating))}
                  {'☆'.repeat(5 - Math.round(averageRating))}
                </span>
                <span className={styles.ratingText}>
                  {averageRating.toFixed(1)} ({totalReviews} avis)
                </span>
              </div>
            )}

            {/* Prix */}
            <div className={styles.priceSection}>
              {subject.originalPrice && subject.originalPrice > subject.price && (
                <span className={styles.originalPrice}>
                  {subject.originalPrice} FCFA
                </span>
              )}
              <span className={styles.price}>{subject.price} FCFA</span>
              {subject.discount && (
                <Badge variant="success" size="small">
                  -{subject.discount}%
                </Badge>
              )}
            </div>

            {/* Description courte */}
            <p className={styles.shortDescription}>{subject.description}</p>

            {/* Actions rapides */}
            <QuickActions
              subjectId={subject.id}
              onAddToCart={onAddToCart}
              onAddToFavorite={onAddToFavorite}
              onShare={onShare}
            />
          </div>

          {/* Métadonnées mobile */}
          <div className={styles.mobileMetadata}>
            <SubjectMetadata subject={subject} />
          </div>

          {/* Tabs avec contenu détaillé */}
          <div className={styles.tabsSection}>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className={styles.tabContent}>
              {activeTab === 'description' && (
                <div className={styles.descriptionContent}>
                  <h3>À propos de ce sujet</h3>
                  <div className={styles.longDescription}>
                    {subject.longDescription || subject.description}
                  </div>

                  {subject.objectives && subject.objectives.length > 0 && (
                    <div className={styles.objectives}>
                      <h4>Objectifs pédagogiques</h4>
                      <ul>
                        {subject.objectives.map((obj, index) => (
                          <li key={index}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {subject.prerequisites && subject.prerequisites.length > 0 && (
                    <div className={styles.prerequisites}>
                      <h4>Prérequis</h4>
                      <ul>
                        {subject.prerequisites.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'content' && (
                <div className={styles.contentPreview}>
                  <h3>Contenu du sujet</h3>
                  {subject.chapters && subject.chapters.length > 0 ? (
                    <div className={styles.chapters}>
                      {subject.chapters.map((chapter, index) => (
                        <div key={index} className={styles.chapter}>
                          <div className={styles.chapterHeader}>
                            <span className={styles.chapterNumber}>
                              Chapitre {index + 1}
                            </span>
                            <h4 className={styles.chapterTitle}>{chapter.title}</h4>
                          </div>
                          {chapter.duration && (
                            <span className={styles.chapterDuration}>
                              ⏱️ {chapter.duration}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.noContent}>
                      Le détail du contenu sera disponible après l'achat.
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className={styles.reviewsContent}>
                  <h3>Avis des utilisateurs</h3>
                  {totalReviews > 0 ? (
                    <div className={styles.reviewsPlaceholder}>
                      <p>Section avis en cours de développement</p>
                    </div>
                  ) : (
                    <p className={styles.noReviews}>
                      Aucun avis pour le moment. Soyez le premier à donner votre avis !
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'faq' && (
                <div className={styles.faqContent}>
                  <h3>Questions fréquentes</h3>
                  <div className={styles.faqPlaceholder}>
                    <p>Section FAQ en cours de développement</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailView;