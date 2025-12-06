import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { SearchBar } from '../../components/common/SearchBar';
import './AdminDashboard.css';

// ==================== OrderManagement ====================
interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  paymentMethod: string;
}

export const OrderManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const orders: Order[] = Array.from({ length: 60 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderNumber: `ORD-${10000 + i}`,
    customer: `Client ${i + 1}`,
    items: Math.floor(Math.random() * 5) + 1,
    total: Math.floor(Math.random() * 50000) + 5000,
    status: ['pending', 'processing', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as any,
    date: new Date(2024, 10, Math.floor(Math.random() * 15)).toISOString(),
    paymentMethod: ['Mobile Money', 'Carte bancaire'][Math.floor(Math.random() * 2)],
  }));

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: Order['status']) => {
    const variants = { pending: 'warning', processing: 'info', completed: 'success', cancelled: 'danger' };
    const labels = { pending: 'En attente', processing: 'En cours', completed: 'Complétée', cancelled: 'Annulée' };
    return <Badge variant={variants[status] as any}>{labels[status]}</Badge>;
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une commande..."
        />
        <div className="management-actions">
          <Button variant="secondary">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtrer
          </Button>
          <Button variant="secondary">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporter
          </Button>
        </div>
      </div>

      <Card variant="outlined" className="data-table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Commande</th>
              <th>Client</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Paiement</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id}>
                <td className="order-number">{order.orderNumber}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td className="order-total">{new Intl.NumberFormat('fr-FR').format(order.total)} FCFA</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-icon-btn" title="Voir">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="action-icon-btn" title="Imprimer">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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
          totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};

export default OrderManagement;