import React from 'react';

interface RecommendationWidgetProps {
  recommendations: string[];
}

const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ recommendations }) => {
  return (
    <div className="recommendation-widget">
      <h3>Recommandations personnalisées</h3>
      <ul>
        {recommendations.map((rec, idx) => (
          <li key={idx}>{rec}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationWidget;
