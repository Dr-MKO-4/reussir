// ==================== AccountDeletion.tsx ====================
import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import Card from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import './Profile.css';

interface AccountDeletionProps {
  onDelete: (reason: string, password: string) => Promise<void>;
  className?: string;
}

const AccountDeletion: React.FC<AccountDeletionProps> = ({
  onDelete,
  className = '',
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const reasons = [
    'Je n\'utilise plus le service',
    'J\'ai trouv9 une meilleure alternative',
    'Trop cher',
    'Probl8mes de confidentialit9',
    'Interface difficile 0 utiliser',
    'Autre raison'
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(reason, password);
    } catch (error: any) {
      setErrorMessage(error.message || 'Une erreur est survenue');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showConfirmation) {
    return (
      <Card variant="outlined" className={`account-deletion ${className}`}>
        <div className="form-header danger-zone">
          <div>
            <h2 className="form-title">Supprimer le compte</h2>
            <p className="form-subtitle">Cette action est irréversible</p>
          </div>
          <div className="danger-badge">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Danger</span>
          </div>
        </div>

        <Alert variant="warning" title="Attention">
          La suppression de votre compte entraînera la perte définitive de toutes vos données :
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Tous vos sujets et progression</li>
            <li>Vos achievements et badges</li>
            <li>Votre historique d'achat</li>
            <li>Toutes vos informations personnelles</li>
          </ul>
        </Alert>

        <div className="deletion-info">
          <h3 className="info-title">Avant de partir...</h3>
          <p className="info-text">
            Nous serions ravis de savoir pourquoi vous souhaitez nous quitter. Vos retours nous aident à nous améliorer.
          </p>
          <p className="info-text">
            Si vous rencontrez des difficultés, notre équipe support est là pour vous aider. Contactez-nous avant de prendre cette décision finale.
          </p>
        </div>

        <div className="form-actions">
          <Button
            variant="danger"
            onClick={() => setShowConfirmation(true)}
            leftIcon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Continuer la suppression
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className={`account-deletion ${className}`}>
      <div className="form-header danger-zone">
        <div>
          <h2 className="form-title">Confirmation de suppression</h2>
          <p className="form-subtitle">Dernière étape avant la suppression définitive</p>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="error" title="Erreur" isDismissible onDismiss={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <div className="form-content">
        <div className="form-group">
          <label className="form-label">Pourquoi nous quittez-vous ? <span className="required">*</span></label>
          <select
            className="form-select"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Sélectionner une raison...</option>
            {reasons.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="deletePassword" className="form-label">
            Confirmer avec votre mot de passe <span className="required">*</span>
          </label>
          <input
            type="password"
            id="deletePassword"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>

        <Alert variant="error" title="Dernier avertissement">
          <strong>Cette action est irréversible.</strong> Toutes vos données seront définitivement supprimées et ne pourront pas être récupérées.
        </Alert>
      </div>

      <div className="form-actions">
        <Button
          variant="secondary"
          onClick={() => setShowConfirmation(false)}
          disabled={isDeleting}
        >
          Annuler
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
          disabled={!reason || !password}
          leftIcon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          }
        >
          Supprimer définitivement mon compte
        </Button>
      </div>
    </Card>
  );
};
export default AccountDeletion;