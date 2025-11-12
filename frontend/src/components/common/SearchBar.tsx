import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SearchBar.css';

/**
 * Suggestion de recherche
 */
export interface SearchSuggestion {
  text: string;
  type?: 'query' | 'subject' | 'exam' | 'tag';
  count?: number;
  icon?: React.ReactNode;
}

/**
 * Tailles du SearchBar
 */
export type SearchBarSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant SearchBar
 */
export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  onChange?: (query: string) => void;
  onClear?: () => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  isLoading?: boolean;
  debounceDelay?: number;
  size?: SearchBarSize;
  fullWidth?: boolean;
  autoFocus?: boolean;
  showClearButton?: boolean;
  className?: string;
}

/**
 * Composant SearchBar avec auto-complétion et suggestions
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Rechercher...',
  value,
  defaultValue = '',
  onSearch,
  onChange,
  onClear,
  suggestions = [],
  recentSearches = [],
  isLoading = false,
  debounceDelay = 300,
  size = 'md',
  fullWidth = false,
  autoFocus = false,
  showClearButton = true,
  className = '',
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const currentValue = value !== undefined ? value : query;
  const hasValue = currentValue.length > 0;

  /**
   * Filtrer les suggestions selon la query
   */
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.text.toLowerCase().includes(currentValue.toLowerCase())
  );

  const displaySuggestions = currentValue.length > 0 ? filteredSuggestions : [];
  const displayRecentSearches = currentValue.length === 0 && recentSearches.length > 0;

  /**
   * Fermer les suggestions en cliquant à l'extérieur
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  /**
   * Auto-focus
   */
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  /**
   * Debounce onChange
   */
  const debouncedOnChange = useCallback(
    (searchQuery: string) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        onChange?.(searchQuery);
      }, debounceDelay);
    },
    [onChange, debounceDelay]
  );

  /**
   * Gérer le changement de valeur
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (value === undefined) {
      setQuery(newValue);
    }
    
    debouncedOnChange(newValue);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  /**
   * Gérer la soumission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentValue.trim()) {
      onSearch(currentValue.trim());
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  /**
   * Gérer le clic sur une suggestion
   */
  const handleSuggestionClick = (suggestion: string) => {
    if (value === undefined) {
      setQuery(suggestion);
    }
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  /**
   * Gérer le bouton clear
   */
  const handleClear = () => {
    if (value === undefined) {
      setQuery('');
    }
    onClear?.();
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  /**
   * Gérer la navigation clavier
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = displaySuggestions.length + (displayRecentSearches ? recentSearches.length : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowSuggestions(true);
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      
      if (displayRecentSearches && selectedIndex < recentSearches.length) {
        handleSuggestionClick(recentSearches[selectedIndex]);
      } else {
        const adjustedIndex = displayRecentSearches 
          ? selectedIndex - recentSearches.length 
          : selectedIndex;
        if (displaySuggestions[adjustedIndex]) {
          handleSuggestionClick(displaySuggestions[adjustedIndex].text);
        }
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  /**
   * Gérer le focus
   */
  const handleFocus = () => {
    setIsFocused(true);
    if (currentValue.length > 0 || recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  /**
   * Gérer le blur
   */
  const handleBlur = () => {
    setIsFocused(false);
  };

  /**
   * Obtenir l'icône selon le type
   */
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'subject':
        return (
          <svg className="suggestion-type-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'exam':
        return (
          <svg className="suggestion-type-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="suggestion-type-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      default:
        return (
          <svg className="suggestion-type-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  const containerClasses = [
    'searchbar',
    `searchbar-${size}`,
    fullWidth ? 'searchbar-full-width' : '',
    isFocused ? 'searchbar-focused' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} ref={containerRef}>
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <div className="searchbar-input-wrapper">
          {/* Search Icon */}
          <svg
            className="searchbar-icon searchbar-icon-search"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="search"
            className="searchbar-input"
            placeholder={placeholder}
            value={currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label="Rechercher"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="searchbar-suggestions"
          />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="searchbar-loader">
              <svg className="searchbar-spinner" viewBox="0 0 24 24">
                <circle
                  className="searchbar-spinner-circle"
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  strokeWidth="3"
                />
              </svg>
            </div>
          )}

          {/* Clear Button */}
          {showClearButton && hasValue && !isLoading && (
            <button
              type="button"
              className="searchbar-clear"
              onClick={handleClear}
              aria-label="Effacer"
            >
              <svg
                className="searchbar-icon searchbar-icon-clear"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="searchbar-submit"
            aria-label="Rechercher"
          >
            <svg
              className="searchbar-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (displaySuggestions.length > 0 || displayRecentSearches) && (
        <div className="searchbar-dropdown" id="searchbar-suggestions" role="listbox">
          {/* Recent Searches */}
          {displayRecentSearches && (
            <div className="searchbar-section">
              <div className="searchbar-section-title">Recherches récentes</div>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  type="button"
                  className={`searchbar-suggestion ${
                    selectedIndex === index ? 'searchbar-suggestion-selected' : ''
                  }`}
                  onClick={() => handleSuggestionClick(search)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <svg
                    className="suggestion-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="suggestion-text">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {displaySuggestions.length > 0 && (
            <div className="searchbar-section">
              {currentValue.length > 0 && (
                <div className="searchbar-section-title">Suggestions</div>
              )}
              {displaySuggestions.map((suggestion, index) => {
                const adjustedIndex = displayRecentSearches 
                  ? index + recentSearches.length 
                  : index;

                return (
                  <button
                    key={`suggestion-${index}`}
                    type="button"
                    className={`searchbar-suggestion ${
                      selectedIndex === adjustedIndex ? 'searchbar-suggestion-selected' : ''
                    }`}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    role="option"
                    aria-selected={selectedIndex === adjustedIndex}
                  >
                    {suggestion.icon || getTypeIcon(suggestion.type)}
                    <span className="suggestion-text">{suggestion.text}</span>
                    {suggestion.count !== undefined && (
                      <span className="suggestion-count">{suggestion.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.displayName = 'SearchBar';

export default SearchBar;