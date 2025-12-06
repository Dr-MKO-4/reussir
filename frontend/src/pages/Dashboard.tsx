// src/pages/Dashboard.tsx
import React from 'react';
import useAuth from '../hooks/useAuth';
import { UserRole } from '../types/auth';
import UserDashboard from '../components/dashboard/UserDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Forcer la redirection même en cas d'erreur
      navigate('/login', { replace: true });
    }
  };

  // Afficher le dashboard admin pour les administrateurs
  if (user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Afficher le dashboard utilisateur par défaut
  return <UserDashboard onLogout={handleLogout} />;
};

export default Dashboard;

