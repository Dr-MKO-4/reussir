// src/components/catalog/TagCloud.tsx
import React, { useState, useMemo } from 'react';
import styles from './TagCloud.module.css';

export interface Tag {
  id: string;
  name: string;
  count: number;
  color?: string;
}

interface TagCloudProps {
  tags: Tag[];
  selectedTags?: string[];
  onTagClick: (tagId: string) => void;
  maxTags?: number;
  minFontSize?: number;
  maxFontSize?: number;
  showCount?: boolean;
  multiSelect?: boolean;
  variant?: 'default' | 'minimal' | 'colorful';
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  selectedTags = [],
  onTagClick,
  maxTags = 30,
  minFontSize = 12,
  maxFontSize = 24,
  showCount = true,
  multiSelect = false,
  variant = 'default',
}) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  // Trier et limiter les tags par popularité
  const sortedTags = useMemo(() => {
    return [...tags]
      .sort((a, b) => b.count - a.count)
      .slice(0, maxTags);
  }, [tags, maxTags]);

  // Calculer la taille de police pour chaque tag
  const getTagSize = (count: number): number => {
    if (sortedTags.length === 0) return minFontSize;

    const minCount = Math.min(...sortedTags.map((t) => t.count));
    const maxCount = Math.max(...sortedTags.map((t) => t.count));

    if (maxCount === minCount) return minFontSize;

    const ratio = (count - minCount) / (maxCount - minCount);
    return minFontSize + ratio * (maxFontSize - minFontSize);
  };

  // Générer une couleur aléatoire mais cohérente basée sur le nom du tag
  const getTagColor = (tagName: string): string => {
    const colors = [
      '#3B82F6', // bleu
      '#10B981', // vert
      '#F59E0B', // orange
      '#EF4444', // rouge
      '#8B5CF6', // violet
      '#EC4899', // rose
      '#14B8A6', // turquoise
      '#F97316', // orange foncé
    ];

    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Gérer le clic sur un tag
  const handleTagClick = (tagId: string) => {
    onTagClick(tagId);
  };

  // Vérifier si un tag est sélectionné
  const isSelected = (tagId: string): boolean => {
    return selectedTags.includes(tagId);
  };

  return (
    <div className={styles.tagCloudContainer}>
      {/* Titre */}
      <div className={styles.header}>
        <h3 className={styles.title}>Tags populaires</h3>
        {selectedTags.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => selectedTags.forEach((id) => onTagClick(id))}
            aria-label="Effacer tous les tags sélectionnés"
          >
            Effacer tout ({selectedTags.length})
          </button>
        )}
      </div>

      {/* Nuage de tags */}
      <div
        className={`${styles.tagCloud} ${styles[variant]}`}
        role="list"
        aria-label="Nuage de tags"
      >
        {sortedTags.map((tag) => {
          const fontSize = getTagSize(tag.count);
          const color = variant === 'colorful' 
            ? (tag.color || getTagColor(tag.name))
            : undefined;
          const selected = isSelected(tag.id);
          const hovered = hoveredTag === tag.id;

          return (
            <button
              key={tag.id}
              type="button"
              className={`${styles.tag} ${selected ? styles.selected : ''} ${
                hovered ? styles.hovered : ''
              }`}
              onClick={() => handleTagClick(tag.id)}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              style={{
                fontSize: `${fontSize}px`,
                color: selected ? undefined : color,
              }}
              role="listitem"
              aria-pressed={multiSelect ? selected : undefined}
              aria-label={`${tag.name} - ${tag.count} sujet${tag.count > 1 ? 's' : ''}`}
            >
              <span className={styles.tagName}>{tag.name}</span>
              {showCount && (
                <span className={styles.tagCount} aria-hidden="true">
                  {tag.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info */}
      {tags.length > maxTags && (
        <p className={styles.info}>
          Affichage de {maxTags} tags sur {tags.length}
        </p>
      )}
    </div>
  );
};

export default TagCloud;