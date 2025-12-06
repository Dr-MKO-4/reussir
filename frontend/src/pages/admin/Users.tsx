// src/pages/admin/Users.tsx
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import styles from './AdminPage.module.css';

// ==================== TYPES ====================
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  courseCount: number;
}

interface AdminUser extends User {
  actions?: boolean;
}

// ==================== COMPOSANT ====================
const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const { get, put, delete: deleteRequest } = useApi();

  const [users, setUsers] = useState<AdminUser[]>([
    { id: '1', firstName: 'Alice', lastName: 'Martin', email: 'alice@example.com', role: 'teacher', status: 'active', createdAt: '2024-01-15', lastLogin: '2024-12-06', courseCount: 12 },
    { id: '2', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', role: 'student', status: 'active', createdAt: '2024-02-20', lastLogin: '2024-12-05', courseCount: 5 },
    { id: '3', firstName: 'Carol', lastName: 'Smith', email: 'carol@example.com', role: 'parent', status: 'inactive', createdAt: '2024-03-10', lastLogin: '2024-11-20', courseCount: 2 },
    { id: '4', firstName: 'David', lastName: 'Brown', email: 'david@example.com', role: 'student', status: 'active', createdAt: '2024-04-05', lastLogin: '2024-12-06', courseCount: 8 },
    { id: '5', firstName: 'Emma', lastName: 'Davis', email: 'emma@example.com', role: 'teacher', status: 'active', createdAt: '2024-05-12', lastLogin: '2024-12-04', courseCount: 15 },
  ]);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(u => {
    const matchSearch = u.firstName.toLowerCase().includes(search.toLowerCase()) ||
                       u.lastName.toLowerCase().includes(search.toLowerCase()) ||
                       u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    const matchStatus = !filterStatus || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setLoading(true);
    try {
      await put(`/admin/users/${userId}`, { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
      success('Succès', 'Statut de l\'utilisateur mis à jour');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de mettre à jour le statut');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      await put(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
      success('Succès', 'Rôle de l\'utilisateur mis à jour');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de mettre à jour le rôle');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    setLoading(true);
    try {
      await deleteRequest(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      success('Succès', 'Utilisateur supprimé');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de supprimer l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: '#ef4444',
      teacher: '#3b82f6',
      parent: '#f59e0b',
      student: '#10b981'
    };
    return colors[role] || '#6b7280';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#10b981',
      inactive: '#6b7280',
      suspended: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <MainLayout>
      <div className={styles.adminPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>👥 Gestion des Utilisateurs</h1>
            <Button variant="primary">+ Ajouter un utilisateur</Button>
          </div>

          <Card>
            <div className={styles.filters}>
              <SearchBar 
                placeholder="Rechercher par nom, email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="teacher">Enseignant</option>
                <option value="parent">Parent</option>
                <option value="student">Étudiant</option>
              </select>

              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Inscription</th>
                    <th>Dernière visite</th>
                    <th>Courses</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.firstName} {u.lastName}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span style={{ color: getRoleColor(u.role) }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: getStatusColor(u.status) }}>
                          {u.status}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>{new Date(u.lastLogin).toLocaleDateString('fr-FR')}</td>
                      <td>{u.courseCount}</td>
                      <td className={styles.actions}>
                        <Button variant="secondary" size="sm">✏️</Button>
                        <Button variant="secondary" size="sm" onClick={() => handleStatusChange(u.id, 'suspended')}>🔒</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id)}>🗑️</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UsersPage;
