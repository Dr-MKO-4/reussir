import React, { useState, ReactNode } from 'react';
import './Tabs.css';

/**
 * Interface pour un onglet
 */
export interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

/**
 * Orientation des onglets
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Variante des onglets
 */
export type TabsVariant = 'line' | 'enclosed' | 'soft-rounded';

/**
 * Props du composant Tabs
 */
export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Composant Tabs pour navigation par onglets
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  orientation = 'horizontal',
  variant = 'line',
  fullWidth = false,
  className = '',
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(
    defaultTab || tabs[0]?.id || ''
  );

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;

    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string, index: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled);
    const currentIndex = enabledTabs.findIndex((t) => t.id === tabId);

    let nextIndex = currentIndex;

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      }
    } else {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      }
    }

    if (nextIndex !== currentIndex) {
      handleTabClick(enabledTabs[nextIndex].id);
      // Focus sur le nouvel onglet
      const tabElement = document.querySelector(
        `[data-tab-id="${enabledTabs[nextIndex].id}"]`
      ) as HTMLElement;
      tabElement?.focus();
    }

    if (e.key === 'Home') {
      e.preventDefault();
      handleTabClick(enabledTabs[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabClick(enabledTabs[enabledTabs.length - 1].id);
    }
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const containerClasses = [
    'tabs',
    `tabs-${orientation}`,
    `tabs-${variant}`,
    fullWidth ? 'tabs-full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Tab List */}
      <div className="tabs-list" role="tablist" aria-orientation={orientation}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const tabClasses = [
            'tab',
            isActive ? 'tab-active' : '',
            tab.disabled ? 'tab-disabled' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              className={tabClasses}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="tabs-panels">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              className={`tab-panel ${isActive ? 'tab-panel-active' : ''}`}
              role="tabpanel"
              aria-labelledby={tab.id}
              hidden={!isActive}
            >
              {isActive && tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;