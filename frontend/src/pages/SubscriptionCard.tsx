
// ==================== SubscriptionCard.tsx ====================
interface Subscription {
  plan: 'free' | 'premium' | 'ultimate';
  status: 'active' | 'canceled' | 'expired';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

interface SubscriptionCardProps {
  subscription: Subscription;
  onUpgrade: () => void;
  onCancel: () => void;
  onRenew: () => void;
  className?: string;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onUpgrade,
  onCancel,
  onRenew,
  className = '',
}) => {
  const plans = {
    free: { name: 'Gratuit', price: '0', color: 'neutral', icon: '📚' },
    premium: { name: 'Premium', price: '2500', color: 'primary', icon: '⭐' },
    ultimate: { name: 'Ultimate', price: '5000', color: 'warning', icon: '👑' },
  };

  const currentPlan = plans[subscription.plan];

  return (
    <Card variant="outlined" className={`subscription-card ${className}`}>
      <div className="subscription-header">
        <div className="subscription-badge">
          <span className="plan-icon">{currentPlan.icon}</span>
          <div>
            <div className="plan-name">{currentPlan.name}</div>
            {subscription.plan !== 'free' && (
              <div className="plan-price">{currentPlan.price} FCFA/mois</div>
            )}
          </div>
        </div>
        <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
          {subscription.status === 'active' ? 'Actif' : subscription.status === 'canceled' ? 'Annulé' : 'Expiré'}
        </Badge>
      </div>

      <div className="subscription-details">
        <div className="detail-row">
          <span>Date de début</span>
          <span>{new Date(subscription.startDate).toLocaleDateString('fr-FR')}</span>
        </div>
        {subscription.endDate && (
          <div className="detail-row">
            <span>Date de fin</span>
            <span>{new Date(subscription.endDate).toLocaleDateString('fr-FR')}</span>
          </div>
        )}
        {subscription.plan !== 'free' && (
          <div className="detail-row">
            <span>Renouvellement auto</span>
            <span>{subscription.autoRenew ? 'Activé' : 'Désactivé'}</span>
          </div>
        )}
      </div>

      <div className="subscription-actions">
        {subscription.plan !== 'ultimate' && (
          <Button variant="primary" fullWidth onClick={onUpgrade}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Mettre à niveau
          </Button>
        )}
        {subscription.plan !== 'free' && subscription.status === 'active' && (
          <Button variant="danger" fullWidth onClick={onCancel}>
            Annuler l'abonnement
          </Button>
        )}
        {subscription.status !== 'active' && subscription.plan !== 'free' && (
          <Button variant="success" fullWidth onClick={onRenew}>
            Réactiver
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SubscriptionCard;