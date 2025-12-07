import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectList.css';

interface Subject {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  rating: number;
  price: number;
  image: string;
  category: string;
  level: string;
}

const SubjectList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subjects`);
        if (!response.ok) throw new Error('Erreur lors du chargement des sujets');
        const data = await response.json();
        setSubjects(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = (id: string) => {
    navigate(`/subject/${id}`);
  };

  if (loading) {
    return <div className="subject-list-loading">Chargement des sujets...</div>;
  }

  if (error) {
    return <div className="subject-list-error">Erreur: {error}</div>;
  }

  if (subjects.length === 0) {
    return (
      <div className="subject-list-empty">
        <p>Aucun sujet disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="subject-list-container">
      <div className="subject-list-header">
        <h1>Tous les Sujets</h1>
        <p>Découvrez notre catalogue complet de cours</p>
      </div>
      <div className="subject-list">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="subject-card"
            onClick={() => handleSubjectClick(subject.id)}
          >
            <div className="subject-image">
              <img src={subject.image} alt={subject.title} />
            </div>
            <div className="subject-content">
              <h3 className="subject-title">{subject.title}</h3>
              <p className="subject-description">{subject.description}</p>
              <div className="subject-meta">
                <span className="subject-category">{subject.category}</span>
                <span className="subject-level">{subject.level}</span>
              </div>
              <div className="subject-footer">
                <div className="subject-instructor">
                  <span>Par {subject.instructor}</span>
                </div>
                <div className="subject-stats">
                  <span className="subject-students">{subject.students} étudiants</span>
                  <span className="subject-rating">⭐ {subject.rating.toFixed(1)}</span>
                </div>
                <div className="subject-price">
                  <span className="price">{subject.price}€</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectList;
