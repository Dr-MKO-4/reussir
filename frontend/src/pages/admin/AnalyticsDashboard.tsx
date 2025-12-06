// ==================== AnalyticsDashboard ====================
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { SearchBar } from '../../components/common/SearchBar';
import './AdminDashboard.css';
export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="analytics-container">
      <div className="analytics-grid">
        <Card variant="outlined" className="analytics-card">
          <h3 className="analytics-title">Revenus mensuels</h3>
          <div className="analytics-chart-placeholder">
            <div className="chart-bar" style={{ height: '60%' }}></div>
            <div className="chart-bar" style={{ height: '75%' }}></div>
            <div className="chart-bar" style={{ height: '50%' }}></div>
            <div className="chart-bar" style={{ height: '90%' }}></div>
            <div className="chart-bar" style={{ height: '70%' }}></div>
            <div className="chart-bar" style={{ height: '85%' }}></div>
          </div>
          <div className="analytics-legend">
            <span>Janv</span>
            <span>Fév</span>
            <span>Mars</span>
            <span>Avr</span>
            <span>Mai</span>
            <span>Juin</span>
          </div>
        </Card>

        <Card variant="outlined" className="analytics-card">
          <h3 className="analytics-title">Utilisateurs actifs</h3>
          <div className="analytics-metric">
            <div className="metric-value">8,934</div>
            <div className="metric-label">Utilisateurs actifs ce mois</div>
            <div className="metric-change positive">+12.5%</div>
          </div>
        </Card>

        <Card variant="outlined" className="analytics-card">
          <h3 className="analytics-title">Sujets populaires</h3>
          <div className="popular-list">
            {['Mathématiques Bac 2024', 'Physique Probatoire 2024', 'Français Bac 2024'].map((item, i) => (
              <div key={i} className="popular-item">
                <span>{item}</span>
                <Badge variant="primary">{Math.floor(Math.random() * 500)}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="outlined" className="analytics-card">
          <h3 className="analytics-title">Taux de conversion</h3>
          <div className="analytics-metric">
            <div className="metric-value">3.8%</div>
            <div className="metric-label">Visiteurs → Clients</div>
            <div className="metric-change positive">+0.3%</div>
          </div>
        </Card>
      </div>

      <Card variant="outlined" className="analytics-card-wide">
        <h3 className="analytics-title">Rapport détaillé</h3>
        <p className="analytics-description">
          Consultez les rapports détaillés pour une analyse approfondie des performances de la plateforme.
        </p>
        <Button variant="primary">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Générer un rapport complet
        </Button>
      </Card>
    </div>
  );
};


export default AnalyticsDashboard;