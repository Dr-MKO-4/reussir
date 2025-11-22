
// ==================== SortDropdown.tsx ====================
import React from 'react';
import { Select } from '../components/common/Select';

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating' | 'difficulty';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Meilleures notes' },
    { value: 'difficulty', label: 'Difficulté' },
  ];

  return (
    <div className={`sort-dropdown ${className}`}>
      <label className="sort-label">
        <svg className="sort-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        Trier par :
      </label>
      <Select
        value={value}
        onChange={(val) => onChange(val as SortOption)}
        options={sortOptions}
      />
    </div>
  );
};
