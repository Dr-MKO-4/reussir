// src/pages/admin/Orders.tsx
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import useApi from '../../hooks/useApi';
import { useToast } from '../../contexts/ToastContext';
import styles from './AdminPage.module.css';

// ==================== TYPES ====================
interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  itemCount: number;
}

// ==================== COMPOSANT ====================
const OrdersPage: React.FC = () => {
  const { success, error: showError } = useToast();
  const { get, put, delete: deleteRequest } = useApi();

  const [orders, setOrders] = useState<Order[]>([
    { id: '1', orderNumber: 'ORD-001', customer: 'Alice Martin', email: 'alice@example.com', total: 19999, status: 'completed', paymentMethod: 'Stripe', createdAt: '2024-12-05', itemCount: 2 },
    { id: '2', orderNumber: 'ORD-002', customer: 'Bob Johnson', email: 'bob@example.com', total: 9999, status: 'pending', paymentMethod: 'PayPal', createdAt: '2024-12-06', itemCount: 1 },
    { id: '3', orderNumber: 'ORD-003', customer: 'Carol Smith', email: 'carol@example.com', total: 29998, status: 'completed', paymentMethod: 'Carte bancaire', createdAt: '2024-12-04', itemCount: 3 },
    { id: '4', orderNumber: 'ORD-004', customer: 'David Brown', email: 'david@example.com', total: 14999, status: 'failed', paymentMethod: 'Stripe', createdAt: '2024-12-03', itemCount: 2 },
    { id: '5', orderNumber: 'ORD-005', customer: 'Emma Davis', email: 'emma@example.com', total: 12999, status: 'refunded', paymentMethod: 'PayPal', createdAt: '2024-12-01', itemCount: 1 },
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Filtrer les commandes
  const filteredOrders = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                       o.customer.toLowerCase().includes(search.toLowerCase()) ||
                       o.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoading(true);
    try {
      await put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      success('Succès', 'Statut de la commande mis à jour');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de mettre à jour le statut');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rembourser cette commande ?')) return;
    
    setLoading(true);
    try {
      await put(`/admin/orders/${orderId}/refund`, {});
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'refunded' } : o));
      success('Succès', 'Remboursement traité');
    } catch (error: any) {
      showError('Erreur', error?.message || 'Impossible de traiter le remboursement');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: '#10b981',
      pending: '#f59e0b',
      failed: '#ef4444',
      refunded: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Complétée',
      pending: 'En attente',
      failed: 'Échouée',
      refunded: 'Remboursée'
    };
    return labels[status] || status;
  };

  // Calculs de statistiques
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);
  
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const refundedTotal = orders
    .filter(o => o.status === 'refunded')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <MainLayout>
      <div className={styles.adminPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>📦 Gestion des Commandes</h1>
          </div>

          <div className={styles.statsGrid}>
            <Card>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Revenus totaux</span>
                <span className={styles.statValue}>{(totalRevenue / 100).toFixed(2)} €</span>
                <span className={styles.statSubtext}>{completedOrders} commandes complétées</span>
              </div>
            </Card>
            <Card>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Commandes en attente</span>
                <span className={styles.statValue}>{pendingOrders}</span>
                <span className={styles.statSubtext}>À traiter</span>
              </div>
            </Card>
            <Card>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Remboursements</span>
                <span className={styles.statValue}>{(refundedTotal / 100).toFixed(2)} €</span>
                <span className={styles.statSubtext}>{orders.filter(o => o.status === 'refunded').length} remboursées</span>
              </div>
            </Card>
          </div>

          <Card>
            <div className={styles.filters}>
              <SearchBar 
                placeholder="Rechercher par numéro, client, email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Complétée</option>
                <option value="failed">Échouée</option>
                <option value="refunded">Remboursée</option>
              </select>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Montant</th>
                    <th>Méthode</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Éléments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>{o.customer}</td>
                      <td>{o.email}</td>
                      <td>{(o.total / 100).toFixed(2)} €</td>
                      <td>{o.paymentMethod}</td>
                      <td>
                        <span style={{ color: getStatusColor(o.status) }}>
                          {getStatusLabel(o.status)}
                        </span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>{o.itemCount}</td>
                      <td className={styles.actions}>
                        <Button variant="secondary" size="sm">👁️</Button>
                        {o.status === 'completed' && (
                          <Button variant="secondary" size="sm" onClick={() => handleRefund(o.id)}>💰</Button>
                        )}
                        <Button variant="secondary" size="sm">✏️</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination 
              currentPage={currentPage}
              totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
