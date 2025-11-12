
import React from 'react';

interface BundleSuggestionsProps {
  suggestions: string[];
  onSelect: (bundle: string) => void;
}

const BundleSuggestions: React.FC<BundleSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className="bundle-suggestions">
      <h3>Suggestions IA</h3>
      <ul>
        {suggestions.map((bundle, idx) => (
          <li key={idx}>
            <button onClick={() => onSelect(bundle)}>{bundle}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BundleSuggestions;
