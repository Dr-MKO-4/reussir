import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { SearchBar } from '../../components/common/SearchBar';
import './AdminDashboard.css';


// ==================== SubjectManagement ====================
interface Subject {
  id: string;
  title: string;
  exam: string;
  subject: string;
  year: number;
  status: 'published' | 'draft' | 'pending';
  price: number;
  downloads: number;
  rating: number;
  createdAt: string;
}

export const SubjectManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const subjects: Subject[] = Array.from({ length: 40 }, (_, i) => ({
    id: `subject-${i + 1}`,
    title: `Sujet ${i + 1} - Mathématiques Bac`,
    exam: ['Baccalauréat', 'Probatoire', 'BEPC'][Math.floor(Math.random() * 3)],
    subject: ['Mathématiques', 'Physique', 'Français'][Math.floor(Math.random() * 3)],
    year: 2024,
    status: ['published', 'draft', 'pending'][Math.floor(Math.random() * 3)] as any,
    price: Math.floor(Math.random() * 5000),
    downloads: Math.floor(Math.random() * 1000),
    rating: 3 + Math.random() * 2,
    createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
  }));

  const filteredSubjects = subjects.filter(subject =>
    subject.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: Subject['status']) => {
    const variants = { published: 'success', draft: 'neutral', pending: 'warning' };
    const labels = { published: 'Publié', draft: 'Brouillon', pending: 'En attente' };
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher un sujet..."
        />
        <div className="management-actions">
          <Button variant="secondary">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtres
          </Button>
          <Button variant="primary">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouveau sujet
          </Button>
        </div>
      </div>

      <Card variant="outlined" className="data-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Examen</th>
              <th>Matière</th>
              <th>Année</th>
              <th>Statut</th>
              <th>Prix</th>
              <th>Téléchargements</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubjects.map((subject) => (
              <tr key={subject.id}>
                <td>
                  <div className="subject-title">{subject.title}</div>
                </td>
                <td>{subject.exam}</td>
                <td>{subject.subject}</td>
                <td>{subject.year}</td>
                <td>{getStatusBadge(subject.status)}</td>
                <td>{subject.price === 0 ? 'Gratuit' : `${subject.price} FCFA`}</td>
                <td>{subject.downloads}</td>
                <td>
                  <div className="rating-cell">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {subject.rating.toFixed(1)}
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="action-icon-btn" title="Voir">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="action-icon-btn" title="Modifier">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="action-icon-btn action-icon-danger" title="Supprimer">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSubjects.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default SubjectManagement;