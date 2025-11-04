// src/pages/EmailVerified.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const EmailVerified: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setStatus('success');
      setMessage('Votre email a été vérifié avec succès !');
    } else if (error) {
      setStatus('error');
      setMessage(decodeURIComponent(error));
    } else {
      // Si aucun paramètre, rediriger vers la page de connexion
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [searchParams, navigate]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        {status === 'loading' && (
          <>
            <Loader size={48} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
            <h2 style={{ color: '#333', marginTop: '20px' }}>Vérification en cours...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle size={48} color="#4CAF50" />
            <h2 style={{ color: '#4CAF50', marginTop: '20px' }}>Email vérifié !</h2>
            <p style={{ color: '#666', margin: '20px 0' }}>{message}</p>
            <button
              onClick={handleLoginRedirect}
              style={{
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#5a67d8'}
              onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
            >
              Se connecter
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle size={48} color="#F44336" />
            <h2 style={{ color: '#F44336', marginTop: '20px' }}>Erreur de vérification</h2>
            <p style={{ color: '#666', margin: '20px 0' }}>{message}</p>
            <div>
              <button
                onClick={handleLoginRedirect}
                style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#5a67d8'}
                onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
              >
                Retour à la connexion
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerified;

// AJOUT dans votre App.tsx ou router
// import EmailVerified from './pages/EmailVerified';
// 
// <Route path="/auth/email-verified" element={<EmailVerified />} />