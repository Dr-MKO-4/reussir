// src/pages/admin/Subjects.tsx
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import useApi from '../../hooks/useApi';
import { useToast } from '../../components/ui/Toast';
import styles from './AdminPage.module.css';

// ==================== TYPES ====================
interface Subject {
  id: string;
  title: string;
  category: string;
  instructor: string;
  studentCount: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  price: number;
}

// ==================== COMPOSANT ====================
const SubjectsPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const { get, put, delete: deleteRequest } = useApi();

  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', title: 'Mathématiques Avancées', category: 'Mathématiques', instructor: 'Alice Martin', studentCount: 456, rating: 4.8, status: 'published', createdAt: '2024-01-15', updatedAt: '2024-12-01', price: 9999 },
    { id: '2', title: 'Anglais Conversationnel', category: 'Langues', instructor: 'Bob Johnson', studentCount: 234, rating: 4.6, status: 'published', createdAt: '2024-02-20', updatedAt: '2024-12-03', price: 7999 },
    { id: '3', title: 'Chimie Organique', category: 'Sciences', instructor: 'Carol Smith', studentCount: 89, rating: 4.5, status: 'draft', createdAt: '2024-03-10', updatedAt: '2024-12-05', price: 8999 },
    { id: '4', title: 'Histoire Moderne', category: 'Histoire', instructor: 'David Brown', studentCount: 345, rating: 4.7, status: 'published', createdAt: '2024-04-05', updatedAt: '2024-12-02', price: 6999 },
    { id: '5', title: 'Programmation Python', category: 'Informatique', instructor: 'Emma Davis', studentCount: 678, rating: 4.9, status: 'published', createdAt: '2024-05-12', updatedAt: '2024-12-06', price: 12999 },
  ]);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Filtrer les sujets
  const filteredSubjects = subjects.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                       s.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || s.category === filterCategory;
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (subjectId: string, newStatus: string) => {
    setLoading(true);
    try {
      await put(`/admin/subjects/${subjectId}`, { status: newStatus });
      setSubjects(subjects.map(s => s.id === subjectId ? { ...s, status: newStatus as any } : s));
      success('Succès', 'Statut du sujet mis à jour');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de mettre à jour le statut');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) return;
    
    setLoading(true);
    try {
      await deleteRequest(`/admin/subjects/${subjectId}`);
      setSubjects(subjects.filter(s => s.id !== subjectId));
      success('Succès', 'Sujet supprimé');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de supprimer le sujet');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: '#10b981',
      draft: '#f59e0b',
      archived: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const categories = ['Mathématiques', 'Langues', 'Sciences', 'Histoire', 'Informatique'];

  return (
    <MainLayout>
      <div className={styles.adminPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>📚 Gestion des Sujets/Cours</h1>
            <Button variant="primary">+ Créer un nouveau sujet</Button>
          </div>

          <Card>
            <div className={styles.filters}>
              <SearchBar 
                placeholder="Rechercher par titre, instructeur..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="draft">Brouillon</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Instructeur</th>
                    <th>Étudiants</th>
                    <th>Rating</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Créé</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubjects.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.title}</strong></td>
                      <td>{s.category}</td>
                      <td>{s.instructor}</td>
                      <td>{s.studentCount}</td>
                      <td>⭐ {s.rating.toFixed(1)}</td>
                      <td>{(s.price / 100).toFixed(2)} €</td>
                      <td>
                        <span style={{ color: getStatusColor(s.status) }}>
                          {s.status}
                        </span>
                      </td>
                      <td>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td className={styles.actions}>
                        <Button variant="secondary" size="sm">✏️</Button>
                        <Button variant="secondary" size="sm" onClick={() => handleStatusChange(s.id, 'published')}>📤</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteSubject(s.id)}>🗑️</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredSubjects.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubjectsPage;
