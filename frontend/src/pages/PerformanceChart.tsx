import React, { useState } from 'react';
import Card from '../components/common/Card';
import './Dashboard.css';

interface PerformanceData {
  week: string;
  score: number;
  hours: number;
}

interface PerformanceChartProps {
  className?: string;
}

/**
 * Graphique de performance avec visualisation interactive
 */
const PerformanceChart: React.FC<PerformanceChartProps> = ({
  className = '',
}) => {
  const [activeMetric, setActiveMetric] = useState<'score' | 'hours'>('score');
  
  // Données mockées des 4 dernières semaines
  const data: PerformanceData[] = [
    { week: 'Sem 1', score: 13.5, hours: 8 },
    { week: 'Sem 2', score: 14.2, hours: 12 },
    { week: 'Sem 3', score: 15.1, hours: 15 },
    { week: 'Sem 4', score: 15.8, hours: 18 },
  ];

  const maxScore = 20;
  const maxHours = Math.max(...data.map(d => d.hours)) * 1.2;

  const getBarHeight = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const getAverageScore = () => {
    const sum = data.reduce((acc, d) => acc + d.score, 0);
    return (sum / data.length).toFixed(1);
  };

  const getTotalHours = () => {
    return data.reduce((acc, d) => acc + d.hours, 0);
  };

  const getTrend = () => {
    if (data.length < 2) return 0;
    const lastWeek = activeMetric === 'score' ? data[data.length - 1].score : data[data.length - 1].hours;
    const prevWeek = activeMetric === 'score' ? data[data.length - 2].score : data[data.length - 2].hours;
    return ((lastWeek - prevWeek) / prevWeek) * 100;
  };

  const trend = getTrend();

  return (
    <Card variant="outlined" className={`performance-chart ${className}`}>
      <div className="chart-header">
        <div>
          <h3 className="chart-title">
            <svg className="chart-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Performance
          </h3>
          <p className="chart-subtitle">Évolution sur 4 semaines</p>
        </div>

        <div className="chart-metric-toggle">
          <button
            className={`metric-btn ${activeMetric === 'score' ? 'active' : ''}`}
            onClick={() => setActiveMetric('score')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Scores
          </button>
          <button
            className={`metric-btn ${activeMetric === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveMetric('hours')}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Heures
          </button>
        </div>
      </div>

      <div className="chart-stats-row">
        <div className="chart-stat">
          <div className="chart-stat-value">
            {activeMetric === 'score' ? getAverageScore() : getTotalHours()}
            <span className="chart-stat-unit">
              {activeMetric === 'score' ? '/20' : 'h'}
            </span>
          </div>
          <div className="chart-stat-label">
            {activeMetric === 'score' ? 'Moyenne' : 'Total'}
          </div>
        </div>

        <div className={`chart-stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {trend >= 0 ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            )}
          </svg>
          <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-bars">
          {data.map((item, index) => {
            const value = activeMetric === 'score' ? item.score : item.hours;
            const max = activeMetric === 'score' ? maxScore : maxHours;
            const height = getBarHeight(value, max);

            return (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar-wrapper">
                  <div className="chart-bar-value">{value}{activeMetric === 'score' ? '' : 'h'}</div>
                  <div className="chart-bar-container">
                    <div 
                      className={`chart-bar chart-bar-${activeMetric}`}
                      style={{ height: `${height}%` }}
                    >
                      <div className="chart-bar-gradient"></div>
                    </div>
                  </div>
                </div>
                <div className="chart-bar-label">{item.week}</div>
              </div>
            );
          })}
        </div>

        <div className="chart-grid">
          {[0, 25, 50, 75, 100].map((line) => (
            <div key={line} className="chart-grid-line" style={{ bottom: `${line}%` }} />
          ))}
        </div>
      </div>

      <div className="chart-footer">
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot legend-dot-score"></div>
            <span>Scores moyens</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot legend-dot-hours"></div>
            <span>Heures d'étude</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceChart;