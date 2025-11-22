import React from 'react';

interface PerformanceChartProps {
  data: number[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  // À compléter : graphique de performance (barres, lignes, etc.)
  return (
    <div className="performance-chart">
      <h3>Performance</h3>
      <div className="chart-placeholder">Graphique à venir</div>
    </div>
  );
};

export default PerformanceChart;
