import React from 'react';

interface StudyProgressProps {
  progress: number; // en pourcentage
}

const StudyProgress: React.FC<StudyProgressProps> = ({ progress }) => {
  return (
    <div className="study-progress">
      <h3>Progression d'étude</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span>{progress}%</span>
    </div>
  );
};

export default StudyProgress;
