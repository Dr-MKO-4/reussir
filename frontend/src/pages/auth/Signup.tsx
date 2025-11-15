import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setErrorMessage('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nom requis';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir majuscule, minuscule et chiffre';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await signUp(formData.email, formData.password, formData.name);
    
    if (result.success) {
      setSuccessMessage(result.message);
      // Rediriger vers la page de confirmation après 2 secondes
      setTimeout(() => {
        navigate('/confirm-email', { 
          state: { email: formData.email } 
        });
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#gradient)" />
            <path d="M16 8L20 14H12L16 8Z" fill="white" />
            <path d="M16 24L12 18H20L16 24Z" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Inscription</h1>
          <p className="auth-subtitle">
            Créez votre compte pour commencer.
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="auth-alert auth-alert-error">
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert auth-alert-success">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="name"
            name="name"
            type="text"
            label="Nom complet"
            placeholder="Jean Dupont"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={<User size={20} />}
            fullWidth
            required
            autoComplete="name"
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={20} />}
            fullWidth
            required
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock size={20} />}
            helperText="8 caractères min. avec majuscule, minuscule et chiffre"
            fullWidth
            required
            autoComplete="new-password"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<Lock size={20} />}
            fullWidth
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            S'inscrire
          </Button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="auth-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;