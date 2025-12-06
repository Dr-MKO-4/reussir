import React, { useState, useRef, useEffect, ReactNode } from 'react';
import styles from './Dropdown.module.css';

interface DropdownItem {
  id: string;
  label: string;
  icon?: string;
  divider?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  align?: 'left' | 'right';
  closeOnSelect?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  align = 'left',
  closeOnSelect = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    onSelect(id);
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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

  return (
    <div
      ref={containerRef}
      className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}
    >
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div className={`${styles.menu} ${styles[align]}`}>
          {items.map(item =>
            item.divider ? (
              <div key={`divider-${item.id}`} className={styles.divider} />
            ) : (
              <button
                key={item.id}
                className={styles.menuItem}
                onClick={() => handleSelect(item.id)}
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
