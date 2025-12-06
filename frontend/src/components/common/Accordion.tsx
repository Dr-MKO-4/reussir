import React, { useState, ReactNode } from 'react';
import styles from './Accordion.module.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expanded);

    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      if (!allowMultiple) {
        newExpanded.clear();
      }
      newExpanded.add(id);
    }

    setExpanded(newExpanded);
  };

  return (
    <div className={styles.accordion}>
      {items.map(item => (
        <div
          key={item.id}
          className={`${styles.item} ${expanded.has(item.id) ? styles.expanded : ''} ${
            item.disabled ? styles.disabled : ''
          }`}
        >
          <button
            className={styles.trigger}
            onClick={() => !item.disabled && toggleItem(item.id)}
            disabled={item.disabled}
          >
            <span className={styles.title}>{item.title}</span>
            <span className={styles.icon}>
              {expanded.has(item.id) ? '−' : '+'}
            </span>
          </button>

          {expanded.has(item.id) && (
            <div className={styles.content}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
