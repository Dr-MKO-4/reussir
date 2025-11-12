// src/components/catalog/SortDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './SortDropdown.module.css';

export type SortOption = 
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc'
  | 'popularity'
  | 'rating';

interface SortItem {
  value: SortOption;
  label: string;
  icon?: string;
}

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  options?: SortItem[];
  disabled?: boolean;
}

const defaultOptions: SortItem[] = [
  { value: 'relevance', label: 'Pertinence', icon: '🎯' },
  { value: 'newest', label: 'Plus récents', icon: '🆕' },
  { value: 'oldest', label: 'Plus anciens', icon: '📅' },
  { value: 'price-asc', label: 'Prix croissant', icon: '💰' },
  { value: 'price-desc', label: 'Prix décroissant', icon: '💸' },
  { value: 'title-asc', label: 'Titre A-Z', icon: '🔤' },
  { value: 'title-desc', label: 'Titre Z-A', icon: '🔡' },
  { value: 'popularity', label: 'Popularité', icon: '⭐' },
  { value: 'rating', label: 'Meilleures notes', icon: '⭐' },
];

const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  options = defaultOptions,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Trouver l'option actuellement sélectionnée
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Gérer la touche Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Gérer la sélection
  const handleSelect = (option: SortItem) => {
    onChange(option.value);
    setIsOpen(false);
  };

  // Gérer le clic sur le bouton
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`${styles.sortDropdown} ${disabled ? styles.disabled : ''}`}
      ref={dropdownRef}
    >
      {/* Label */}
      <label htmlFor="sort-button" className={styles.label}>
        Trier par :
      </label>

      {/* Bouton toggle */}
      <button
        id="sort-button"
        type="button"
        className={`${styles.toggleButton} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Options de tri"
      >
        <span className={styles.selectedOption}>
          {selectedOption.icon && (
            <span className={styles.icon} aria-hidden="true">
              {selectedOption.icon}
            </span>
          )}
          <span className={styles.label}>{selectedOption.label}</span>
        </span>
        <span className={`${styles.arrow} ${isOpen ? styles.rotated : ''}`}>
          ▼
        </span>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          <ul className={styles.optionList}>
            {options.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  className={`${styles.option} ${
                    option.value === value ? styles.selected : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.icon && (
                    <span className={styles.icon} aria-hidden="true">
                      {option.icon}
                    </span>
                  )}
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.value === value && (
                    <span className={styles.checkmark} aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;