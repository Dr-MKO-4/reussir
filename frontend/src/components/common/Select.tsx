import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './Select.css';

/**
 * Option pour le Select
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

/**
 * Tailles du Select
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant Select
 */
export interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  size?: SelectSize;
  isDisabled?: boolean;
  isRequired?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
}

/**
 * Composant Select avec recherche et multi-sélection
 */
export function Select<T = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  error,
  helperText,
  size = 'md',
  isDisabled = false,
  isRequired = false,
  isSearchable = false,
  isMulti = false,
  fullWidth = false,
  className = '',
  id,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(
    defaultValue || (isMulti ? [] : undefined)
  );
  
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectId = id || `select-${Math.random().toString(36).substring(7)}`;
  const currentValue = value !== undefined ? value : internalValue;

  /**
   * Fermer le dropdown en cliquant à l'extérieur
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Focus sur le champ de recherche quand le dropdown s'ouvre
   */
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  /**
   * Filtrer les options selon la recherche
   */
  const filteredOptions = isSearchable && searchQuery
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  /**
   * Obtenir l'option sélectionnée
   */
  const getSelectedOption = () => {
    if (isMulti) {
      const values = (currentValue as T[]) || [];
      return options.filter((opt) => values.includes(opt.value));
    }
    return options.find((opt) => opt.value === currentValue);
  };

  /**
   * Obtenir le label affiché
   */
  const getDisplayLabel = () => {
    if (isMulti) {
      const selected = getSelectedOption() as SelectOption<T>[];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) return selected[0].label;
      return `${selected.length} sélectionnés`;
    }
    
    const selected = getSelectedOption() as SelectOption<T> | undefined;
    return selected?.label || placeholder;
  };

  /**
   * Gérer la sélection d'une option
   */
  const handleSelectOption = (option: SelectOption<T>) => {
    if (option.disabled) return;

    if (isMulti) {
      const values = (currentValue as T[]) || [];
      const newValues = values.includes(option.value)
        ? values.filter((v) => v !== option.value)
        : [...values, option.value];
      
      setInternalValue(newValues);
      onChange(newValues as T);
    } else {
      setInternalValue(option.value);
      onChange(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  /**
   * Gérer l'ouverture/fermeture du dropdown
   */
  const toggleDropdown = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
      }
    }
  };

  /**
   * Gérer la navigation au clavier
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleDropdown();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  /**
   * Vérifier si une option est sélectionnée
   */
  const isOptionSelected = (option: SelectOption<T>) => {
    if (isMulti) {
      const values = (currentValue as T[]) || [];
      return values.includes(option.value);
    }
    return currentValue === option.value;
  };

  const containerClasses = [
    'select-container',
    fullWidth ? 'select-container-full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const triggerClasses = [
    'select-trigger',
    `select-trigger-${size}`,
    isOpen ? 'select-trigger-open' : '',
    error ? 'select-trigger-error' : '',
    isDisabled ? 'select-trigger-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={selectRef}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {isRequired && <span className="select-required">*</span>}
        </label>
      )}

      <div
        className={triggerClasses}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${selectId}-label` : undefined}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
      >
        <span className="select-value">{getDisplayLabel()}</span>
        
        <svg
          className={`select-arrow ${isOpen ? 'select-arrow-open' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          {isSearchable && (
            <div className="select-search">
              <input
                ref={searchInputRef}
                type="text"
                className="select-search-input"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <ul className="select-options" role="listbox">
            {filteredOptions.length === 0 ? (
              <li className="select-option-empty">Aucun résultat</li>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = isOptionSelected(option);
                
                return (
                  <li
                    key={index}
                    className={`select-option ${selected ? 'select-option-selected' : ''} ${
                      option.disabled ? 'select-option-disabled' : ''
                    }`}
                    onClick={() => handleSelectOption(option)}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={option.disabled}
                  >
                    {isMulti && (
                      <span className="select-checkbox">
                        {selected && (
                          <svg
                            className="select-checkbox-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                    
                    {option.icon && (
                      <span className="select-option-icon">{option.icon}</span>
                    )}
                    
                    <span className="select-option-label">{option.label}</span>
                    
                    {!isMulti && selected && (
                      <svg
                        className="select-check-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="select-error" role="alert">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p className="select-helper">{helperText}</p>
      )}
    </div>
  );
}

export default Select;