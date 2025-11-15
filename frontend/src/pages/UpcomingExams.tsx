import React from 'react';
import Card from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import './Dashboard.css';

interface Exam {
  id: string;
  name: string;
  date: string;
  daysLeft: number;
  prepared: number;
  subjects: string[];
}

interface UpcomingExamsProps {
  exams: Exam[];
  className?: string;
}

/**
 * Widget d'examens à venir avec countdown et préparation
 */
const UpcomingExams: React.FC<UpcomingExamsProps> = ({
  exams,
  className = '',
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getUrgencyColor = (daysLeft: number): 'danger' | 'warning' | 'primary' => {
    if (daysLeft < 30) return 'danger';
    if (daysLeft < 60) return 'warning';
    return 'primary';
  };

  const getPreparationStatus = (prepared: number): { color: string; label: string } => {
    if (prepared >= 75) return { color: 'success', label: 'Excellente préparation' };
    if (prepared >= 50) return { color: 'warning', label: 'Bonne progression' };
    if (prepared >= 25) return { color: 'info', label: 'En cours' };
    return { color: 'danger', label: 'À intensifier' };
  };

  return (
    <Card variant="outlined" className={`upcoming-exams ${className}`}>
      <div className="exams-header">
        <h3 className="exams-title">
          <svg className="exams-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Examens à venir
        </h3>
        <Button variant="secondary" size="sm">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Planifier
        </Button>
      </div>

      <div className="exams-list">
        {exams.map((exam) => {
          const urgency = getUrgencyColor(exam.daysLeft);
          const status = getPreparationStatus(exam.prepared);

          return (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <div className="exam-info">
                  <h4 className="exam-name">{exam.name}</h4>
                  <div className="exam-meta">
                    <svg className="exam-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(exam.date)}</span>
                  </div>
                </div>

                <Badge variant={urgency} className="exam-countdown">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  J-{exam.daysLeft}
                </Badge>
              </div>

              <div className="exam-subjects">
                {exam.subjects.slice(0, 3).map((subject, index) => (
                  <span key={index} className="exam-subject-tag">{subject}</span>
                ))}
                {exam.subjects.length > 3 && (
                  <span className="exam-subject-more">+{exam.subjects.length - 3}</span>
                )}
              </div>

              <div className="exam-preparation">
                <div className="prep-header">
                  <span className="prep-label">Préparation</span>
                  <div className="prep-status">
                    <div className={`prep-status-dot prep-status-${status.color}`}></div>
                    <span className="prep-status-text">{status.label}</span>
                  </div>
                </div>

                <div className="prep-progress-bar">
                  <div 
                    className={`prep-progress-fill prep-progress-${status.color}`}
                    style={{ width: `${exam.prepared}%` }}
                  >
                    <div className="prep-progress-shine"></div>
                  </div>
                </div>

                <div className="prep-footer">
                  <span className="prep-percentage">{exam.prepared}%</span>
                  <Button variant="primary" size="sm">
                    Continuer
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>

              {exam.prepared < 50 && exam.daysLeft < 60 && (
                <div className="exam-alert">
                  <svg className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Intensifiez votre préparation !</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {exams.length === 0 && (
        <div className="exams-empty">
          <svg className="exams-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Aucun examen planifié</p>
          <Button variant="primary" size="sm">
            Planifier un examen
          </Button>
        </div>
      )}
    </Card>
  );
};

export default UpcomingExams;