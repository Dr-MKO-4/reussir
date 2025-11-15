import React from 'react';
import Card from '../components/common/Card';
import { Button } from '../components/common/Button';
import './Dashboard.css';

interface Recommendation {
  id: string;
  type: 'subject' | 'bundle' | 'practice';
  title: string;
  description: string;
  image: string;
  reason: string;
  confidence: number;
}

interface RecommendationWidgetProps {
  recommendations: Recommendation[];
  className?: string;
}

/**
 * Widget de recommandations IA avec images
 */
const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({
  recommendations,
  className = '',
}) => {
  const getTypeIcon = (type: Recommendation['type']) => {
    const icons = {
      subject: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bundle: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      practice: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    };
    return icons[type];
  };

  const getTypeLabel = (type: Recommendation['type']) => {
    const labels = {
      subject: 'Sujet recommandé',
      bundle: 'Pack suggéré',
      practice: 'Pratique',
    };
    return labels[type];
  };

  return (
    <Card variant="outlined" className={`recommendation-widget ${className}`}>
      <div className="recommendations-header">
        <h3 className="recommendations-title">
          <svg className="recommendations-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Recommandations IA
        </h3>
        <div className="ai-badge">
          <div className="ai-badge-pulse"></div>
          <span>IA Active</span>
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="recommendation-image">
              <img src={rec.image} alt={rec.title} loading="lazy" />
              <div className="recommendation-type-badge">
                {getTypeIcon(rec.type)}
                <span>{getTypeLabel(rec.type)}</span>
              </div>
              <div className="recommendation-confidence">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rec.confidence}%
              </div>
            </div>

            <div className="recommendation-content">
              <h4 className="recommendation-title">{rec.title}</h4>
              <p className="recommendation-description">{rec.description}</p>
              
              <div className="recommendation-reason">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{rec.reason}</span>
              </div>

              <Button variant="primary" size="sm" fullWidth>
                Voir plus
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="recommendations-empty">
          <div className="empty-icon">🤖</div>
          <p>L'IA analyse vos performances...</p>
          <span className="empty-hint">Les recommandations apparaîtront bientôt</span>
        </div>
      )}
    </Card>
  );
};

export default RecommendationWidget;