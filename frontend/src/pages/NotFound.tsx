import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, Search } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-code">404</div>
        
        <h1 className="notfound-title">Page non trouvée</h1>
        
        <p className="notfound-description">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="notfound-actions">
          <Link to="/">
            <Button variant="primary" icon={<Home size={20} />}>
              Retour à l'accueil
            </Button>
          </Link>
          
          <Link to="/discover">
            <Button variant="secondary" icon={<Search size={20} />}>
              Découvrir les sujets
            </Button>
          </Link>
        </div>
        
        <button
          className="notfound-back"
          onClick={() => navigate(-1)}
        >
          ← Retour à la page précédente
        </button>
      </div>
    </div>
  );
};

export default NotFound;