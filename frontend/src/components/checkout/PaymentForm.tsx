import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import './CheckoutComponent.css';

interface PaymentFormProps {
  onSubmit: (paymentData: any) => void;
  isLoading?: boolean;
  className?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  isLoading = false,
  className = '',
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('mobile');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ paymentMethod });
  };

  return (
    <form className={`payment-form ${className}`} onSubmit={handleSubmit}>
      <h3 className="payment-title">Mode de paiement</h3>
      <div className="payment-methods">
        <label className={`payment-method ${paymentMethod === 'mobile' ? 'active' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="mobile"
            checked={paymentMethod === 'mobile'}
            onChange={() => setPaymentMethod('mobile')}
          />
          <div className="payment-method-content">
            <svg className="payment-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Mobile Money</span>
          </div>
        </label>
        <label className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          <div className="payment-method-content">
            <svg className="payment-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Carte bancaire</span>
          </div>
        </label>
      </div>
      {paymentMethod === 'mobile' && (
        <div className="payment-fields">
          <div className="form-group">
            <label>Numéro de téléphone</label>
            <input type="tel" placeholder="+237 6XX XXX XXX" required />
          </div>
          <p className="payment-note">
            Vous recevrez une notification pour valider le paiement
          </p>
        </div>
      )}
      {paymentMethod === 'card' && (
        <div className="payment-fields">
          <div className="form-group">
            <label>Numéro de carte</label>
            <input type="text" placeholder="1234 5678 9012 3456" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date d'expiration</label>
              <input type="text" placeholder="MM/AA" required />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="text" placeholder="123" required />
            </div>
          </div>
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        isLoading={isLoading}
      >
        Payer maintenant
      </Button>
      <div className="payment-security">
        <svg className="security-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Paiement 100% sécurisé</span>
      </div>
    </form>
  );
};

export default PaymentForm;