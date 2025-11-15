import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import './CheckoutComponent.css';
type CheckoutStep = 'contact' | 'payment' | 'confirm';

interface CheckoutFlowProps {
  onComplete: () => void;
  className?: string;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  onComplete,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');

  const steps = [
    { id: 'contact', label: 'Coordonnées', icon: '1' },
    { id: 'payment', label: 'Paiement', icon: '2' },
    { id: 'confirm', label: 'Confirmation', icon: '3' },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className={`checkout-flow ${className}`}>
      <div className="checkout-steps">
        {steps.map((step, index) => (
          <div key={step.id} className="checkout-step-wrapper">
            <div className={`checkout-step checkout-step-${getStepStatus(step.id)}`}>
              <div className="step-indicator">
                {getStepStatus(step.id) === 'completed' ? (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector step-connector-${getStepStatus(step.id)}`} />
            )}
          </div>
        ))}
      </div>

      <div className="checkout-content">
        {currentStep === 'contact' && (
          <div className="checkout-section">
            <h3>Informations de contact</h3>
            <p>Contenu du formulaire de contact...</p>
            <Button variant="primary" onClick={() => setCurrentStep('payment')}>
              Continuer vers le paiement
            </Button>
          </div>
        )}
        {currentStep === 'payment' && (
          <div className="checkout-section">
            <h3>Informations de paiement</h3>
            <p>Contenu du formulaire de paiement...</p>
            <div className="checkout-actions">
              <Button variant="secondary" onClick={() => setCurrentStep('contact')}>
                Retour
              </Button>
              <Button variant="primary" onClick={() => setCurrentStep('confirm')}>
                Confirmer
              </Button>
            </div>
          </div>
        )}
        {currentStep === 'confirm' && (
          <div className="checkout-section">
            <h3>Confirmation</h3>
            <p>Récapitulatif de la commande...</p>
            <Button variant="primary" onClick={onComplete}>
              Valider la commande
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutFlow;