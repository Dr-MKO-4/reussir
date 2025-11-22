import React from 'react';

interface QuickActionsProps {
  actions: { label: string; onClick: () => void; icon?: React.ReactNode }[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="quick-actions">
      {actions.map((action, idx) => (
        <button key={idx} onClick={action.onClick} className="quick-action-btn" aria-label={action.label}>
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
