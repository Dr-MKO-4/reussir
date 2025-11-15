import React from 'react';
import Card from '../components/common/Card';
import './Dashboard.css';

interface StudyStreakProps {
  currentStreak: number;
  bestStreak: number;
  className?: string;
}

/**
 * Widget de série d'étude avec calendrier visuel
 */
const StudyStreak: React.FC<StudyStreakProps> = ({
  currentStreak,
  bestStreak,
  className = '',
}) => {
  // Générer les 7 derniers jours
  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
      const isActive = i < currentStreak;
      const isToday = i === 0;
      
      days.push({
        name: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
        date: date.getDate(),
        isActive,
        isToday,
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Commencez votre série aujourd'hui !";
    if (currentStreak === 1) return "Bon début ! Continuez demain.";
    if (currentStreak < 7) return "Excellente progression !";
    if (currentStreak < 30) return "Incroyable série ! 🔥";
    return "Vous êtes une légende ! 🏆";
  };

  const getStreakLevel = () => {
    if (currentStreak < 3) return 'beginner';
    if (currentStreak < 7) return 'intermediate';
    if (currentStreak < 30) return 'advanced';
    return 'master';
  };

  return (
    <Card variant="outlined" className={`study-streak study-streak-${getStreakLevel()} ${className}`}>
      <div className="streak-background">
        <div className="streak-flame streak-flame-1">🔥</div>
        <div className="streak-flame streak-flame-2">🔥</div>
        <div className="streak-flame streak-flame-3">🔥</div>
      </div>

      <div className="streak-content">
        <div className="streak-main">
          <div className="streak-icon-container">
            <div className="streak-icon">🔥</div>
            <div className="streak-icon-glow"></div>
          </div>

          <div className="streak-info">
            <div className="streak-current">
              <span className="streak-number">{currentStreak}</span>
              <span className="streak-label">jour{currentStreak > 1 ? 's' : ''} de série</span>
            </div>
            <p className="streak-message">{getStreakMessage()}</p>
          </div>

          <div className="streak-best">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div>
              <div className="streak-best-value">{bestStreak}</div>
              <div className="streak-best-label">Meilleure série</div>
            </div>
          </div>
        </div>

        <div className="streak-calendar">
          <div className="calendar-days">
            {weekDays.map((day, index) => (
              <div key={index} className="calendar-day">
                <div className="day-name">{day.name}</div>
                <div className={`day-circle ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}>
                  {day.isActive && (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="day-date">{day.date}</div>
              </div>
            ))}
          </div>
        </div>

        {currentStreak > 0 && (
          <div className="streak-footer">
            <div className="streak-tip">
              💡 <strong>Astuce :</strong> Étudiez au moins 15 minutes aujourd'hui pour maintenir votre série !
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StudyStreak;