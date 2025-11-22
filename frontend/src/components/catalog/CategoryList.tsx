// src/components/catalog/CategoryList.tsx
import React, { useState } from 'react';
import styles from './CategoryList.module.css';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count?: number;
  description?: string;
  color?: string;
  subcategories?: Category[];
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string) => void;
  showCount?: boolean;
  showIcons?: boolean;
  collapsible?: boolean;
  variant?: 'default' | 'compact' | 'card';
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  showCount = true,
  showIcons = true,
  collapsible = true,
  variant = 'default',
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Toggle expansion d'une catégorie
  const toggleExpanded = (categoryId: string) => {
    if (!collapsible) return;

    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Gérer la sélection d'une catégorie
  const handleCategoryClick = (categoryId: string, hasSubcategories: boolean) => {
    if (hasSubcategories && collapsible) {
      toggleExpanded(categoryId);
    }
    onCategorySelect(categoryId);
  };

  // Rendu d'une catégorie
  const renderCategory = (category: Category, level: number = 0) => {
    const isSelected = selectedCategory === category.id;
    const isExpanded = expandedCategories.has(category.id);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <li key={category.id} className={styles.categoryItem}>
        <button
          type="button"
          className={`${styles.categoryButton} ${
            isSelected ? styles.selected : ''
          } ${styles[variant]} ${level > 0 ? styles.subcategory : ''}`}
          onClick={() => handleCategoryClick(category.id, !!hasSubcategories)}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          aria-expanded={hasSubcategories ? isExpanded : undefined}
          aria-current={isSelected ? 'true' : undefined}
        >
          {/* Icône */}
          {showIcons && category.icon && (
            <span
              className={styles.icon}
              aria-hidden="true"
              style={{ color: category.color }}
            >
              {category.icon}
            </span>
          )}

          {/* Nom de la catégorie */}
          <span className={styles.categoryName}>{category.name}</span>

          {/* Compteur */}
          {showCount && typeof category.count === 'number' && (
            <span className={styles.count} aria-label={`${category.count} sujets`}>
              {category.count}
            </span>
          )}

          {/* Flèche d'expansion */}
          {hasSubcategories && collapsible && (
            <span
              className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
              aria-hidden="true"
            >
              ›
            </span>
          )}
        </button>

        {/* Sous-catégories */}
        {hasSubcategories && isExpanded && (
          <ul className={styles.subcategoryList} role="group">
            {category.subcategories!.map((subcat) =>
              renderCategory(subcat, level + 1)
            )}
          </ul>
        )}
      </li>
    );
  };

  // Variante Card
  const renderCardVariant = () => (
    <div className={styles.cardGrid}>
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            className={`${styles.categoryCard} ${
              isSelected ? styles.selectedCard : ''
            }`}
            onClick={() => onCategorySelect(category.id)}
            style={{ borderColor: category.color }}
          >
            {showIcons && category.icon && (
              <span
                className={styles.cardIcon}
                style={{ color: category.color }}
                aria-hidden="true"
              >
                {category.icon}
              </span>
            )}
            <span className={styles.cardName}>{category.name}</span>
            {showCount && typeof category.count === 'number' && (
              <span className={styles.cardCount}>{category.count} sujets</span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={styles.categoryListContainer}>
      {/* Titre */}
      <h3 className={styles.title}>Catégories</h3>

      {/* Liste ou Cartes */}
      {variant === 'card' ? (
        renderCardVariant()
      ) : (
        <ul className={styles.categoryList} role="list">
          {categories.map((category) => renderCategory(category))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;