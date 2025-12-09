import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FullPageSpinner } from '../components/ui/LoadingSpinner';
import useAuth from '../hooks/useAuth';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const token = searchParams.get('token');
        const code = searchParams.get('code');

        if (token) {
          // Si un token est fourni, l'utiliser directement
          localStorage.setItem('token', token);
          navigate('/dashboard');
        } else if (code) {
          // Si un code est fourni, l'envoyer au backend pour obtenir un token
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/google/callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
          } else {
            navigate('/login?error=google_auth_failed');
          }
        } else {
          navigate('/login?error=no_auth_code');
        }
      } catch (error) {
        console.error('Erreur lors du callback Google:', error);
        navigate('/login?error=google_callback_error');
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  return (
    <FullPageSpinner
      message="Authentification Google"
      submessage="Connexion en cours..."
      size="large"
      variant="orbital"
      color="primary"
    />
  );
};

export default GoogleCallback;
