import React from 'react';
import { Button } from '../components/common/Button';
import './CheckoutComponent.css';

interface ContactFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isLoading = false,
  className = '',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <form className={`contact-form ${className}`} onSubmit={handleSubmit}>
      <h3 className="contact-title">Informations de contact</h3>
      <div className="form-group">
        <label>Nom complet *</label>
        <input type="text" name="name" placeholder="Jean Dupont" required />
      </div>
      <div className="form-group">
        <label>Email *</label>
        <input type="email" name="email" placeholder="jean.dupont@email.com" required />
      </div>
      <div className="form-group">
        <label>Téléphone *</label>
        <input type="tel" name="phone" placeholder="+237 6XX XXX XXX" required />
      </div>
      <div className="form-group">
        <label>Ville</label>
        <input type="text" name="city" placeholder="Yaoundé" />
      </div>
      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        isLoading={isLoading}
      >
        Continuer
      </Button>
    </form>
  );
};

export default ContactForm;