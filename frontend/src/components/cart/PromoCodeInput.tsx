
import React, { useState } from 'react';

interface PromoCodeInputProps {
  onApply: (code: string) => void;
  onRemove: () => void;
  applied: boolean;
  value: string;
  setValue: (v: string) => void;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({ onApply, onRemove, applied, value, setValue }) => {
  const [input, setInput] = useState(value);
  return (
    <div className="promo-code-input">
      <input
        type="text"
        placeholder="Code promo"
        value={input}
        onChange={e => { setInput(e.target.value); setValue(e.target.value); }}
        disabled={applied}
        aria-label="Entrer un code promo"
      />
      {applied ? (
        <button onClick={onRemove} aria-label="Retirer le code promo">Retirer</button>
      ) : (
        <button onClick={() => onApply(input)} disabled={!input.trim()} aria-label="Appliquer le code promo">Appliquer</button>
      )}
    </div>
  );
};

export default PromoCodeInput;
