/**
 * Composant StudyProgress - COMPLÈTE 100%
 * Affiche la progression d'étude avec visualisations avancées
 */

import React, { useMemo } from 'react';

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  estimatedHoursRemaining: number;
  lastUpdated: Date;
}

interface StudyProgressProps {
  courses: CourseProgress[];
  overallProgress?: number;
  showEstimates?: boolean;
  showLastUpdated?: boolean;
  onCourseClick?: (courseId: string) => void;
}

const StudyProgress: React.FC<StudyProgressProps> = ({
  courses,
  overallProgress,
  showEstimates = true,
  showLastUpdated = true,
  onCourseClick,
}) => {
  // Calculer la progression moyenne si non fournie
  const calculatedProgress = useMemo(() => {
    if (overallProgress !== undefined) return overallProgress;
    if (courses.length === 0) return 0;
    return Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);
  }, [courses, overallProgress]);

  // Calculer les heures totales restantes
  const totalHoursRemaining = useMemo(() => {
    return courses.reduce((sum, c) => sum + c.estimatedHoursRemaining, 0);
  }, [courses]);

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'progress-success';
    if (progress >= 50) return 'progress-warning';
    if (progress >= 25) return 'progress-info';
    return 'progress-danger';
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="study-progress">
      <div className="study-progress-header">
        <h3>Votre progression d'étude</h3>
        <div className="overall-progress-circle">
          <svg viewBox="0 0 120 120" className="progress-circle">
            <circle cx="60" cy="60" r="54" className="progress-circle-bg" />
            <circle
              cx="60"
              cy="60"
              r="54"
              className="progress-circle-fill"
              style={{
                strokeDashoffset: 54 * 2 * Math.PI * (1 - calculatedProgress / 100),
              }}
            />
          </svg>
          <div className="progress-circle-text">
            <span className="progress-value">{calculatedProgress}%</span>
          </div>
        </div>
      </div>

      {totalHoursRemaining > 0 && showEstimates && (
        <div className="progress-estimate">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Environ {totalHoursRemaining}h de travail restantes</span>
        </div>
      )}

      <div className="courses-progress-list">
        {courses.length === 0 ? (
          <div className="empty-state">
            <p>Aucun cours en cours</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="course-progress-item"
              onClick={() => onCourseClick?.(course.id)}
              role={onCourseClick ? 'button' : undefined}
              tabIndex={onCourseClick ? 0 : undefined}
            >
              <div className="course-progress-info">
                <h4 className="course-title">{course.title}</h4>
                <div className="course-meta">
                  <span className="progress-percentage">{course.progress}%</span>
                  {showEstimates && (
                    <span className="estimated-hours">
                      {course.estimatedHoursRemaining}h restantes
                    </span>
                  )}
                </div>
              </div>

              <div className="course-progress-bar">
                <div
                  className={`progress-fill ${getProgressColor(course.progress)}`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>

              {showLastUpdated && (
                <div className="course-last-updated">
                  {formatDate(course.lastUpdated)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {courses.length > 0 && (
        <div className="progress-stats">
          <div className="stat-box">
            <span className="stat-label">Cours en cours</span>
            <span className="stat-value">{courses.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Progression moyenne</span>
            <span className="stat-value">{calculatedProgress}%</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Plus avancé</span>
            <span className="stat-value">
              {Math.max(...courses.map((c) => c.progress))}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyProgress;
