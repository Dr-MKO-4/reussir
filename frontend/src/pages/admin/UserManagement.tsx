import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { SearchBar } from '../../components/common/SearchBar';
import './AdminDashboard.css';

// ==================== UserManagement ====================
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'suspended' | 'deleted';
  joinedDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
}

export const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Données mockées
  const users: User[] = Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `Utilisateur ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['student', 'teacher', 'admin'][Math.floor(Math.random() * 3)] as any,
    status: ['active', 'suspended'][Math.floor(Math.random() * 2)] as any,
    joinedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    lastActive: new Date(2024, 10, Math.floor(Math.random() * 15)).toISOString(),
    totalOrders: Math.floor(Math.random() * 50),
    totalSpent: Math.floor(Math.random() * 100000),
  }));

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const variants = { student: 'primary', teacher: 'success', admin: 'danger' };
    const labels = { student: 'Étudiant', teacher: 'Enseignant', admin: 'Admin' };
    return <Badge variant={variants[role] as any}>{labels[role]}</Badge>;
  };

  const getStatusBadge = (status: User['status']) => {
    const variants = { active: 'success', suspended: 'warning', deleted: 'danger' };
    const labels = { active: 'Actif', suspended: 'Suspendu', deleted: 'Supprimé' };
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher par nom ou email..."
        />
        <div className="management-actions">
          <Button variant="secondary">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter
          </Button>
          <Button variant="primary">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedUsers.length} utilisateur(s) sélectionné(s)</span>
          <div className="bulk-actions-buttons">
            <Button variant="secondary" size="sm">Suspendre</Button>
            <Button variant="danger" size="sm">Supprimer</Button>
          </div>
        </div>
      )}

      <Card variant="outlined" className="data-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(paginatedUsers.map(u => u.id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Inscrit le</th>
              <th>Dernière activité</th>
              <th>Commandes</th>
              <th>Total dépensé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(user.role)}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>{new Date(user.joinedDate).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(user.lastActive).toLocaleDateString('fr-FR')}</td>
                <td>{user.totalOrders}</td>
                <td>{new Intl.NumberFormat('fr-FR').format(user.totalSpent)} FCFA</td>
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
          totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default UserManagement;