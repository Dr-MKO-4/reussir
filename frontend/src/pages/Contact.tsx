import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import styles from './Contact.module.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.phone && !/^[0-9\s\-\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Nous Contacter</h1>
            <p className={styles.subtitle}>
              Nous sommes là pour répondre à vos questions
            </p>
          </div>
        </section>

        <div className={styles.content}>
          {/* Contact Info */}
          <div className={styles.infoSection}>
            <h2>Comment Nous Contacter</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📍</div>
                <h3>Adresse</h3>
                <p>123 Rue de l'Éducation</p>
                <p>75000 Paris, France</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📧</div>
                <h3>Email</h3>
                <p>support@winplus.com</p>
                <p>info@winplus.com</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📞</div>
                <h3>Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
                <p>Lun-Ven: 9h-18h</p>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🕐</div>
                <h3>Horaires</h3>
                <p>Lun-Ven: 9h00 - 18h00</p>
                <p>Sam: 10h00 - 14h00</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formSection}>
            <h2>Envoyez-nous un Message</h2>
            {submitted && (
              <div className={styles.successMessage}>
                ✓ Votre message a été envoyé avec succès. Nous vous répondrons dans les 24h.
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nom *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? styles.error : ''}
                  placeholder="Votre nom complet"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.error : ''}
                  placeholder="votre.email@example.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? styles.error : ''}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Sujet *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? styles.error : ''}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="support">Support Technique</option>
                  <option value="billing">Facturation</option>
                  <option value="feedback">Retours</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
                {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? styles.error : ''}
                  placeholder="Décrivez votre message ici..."
                  rows={6}
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ CTA */}
        <section className={styles.ctaSection}>
          <h2>Des Questions Fréquentes ?</h2>
          <p>Consultez notre FAQ pour trouver des réponses rapides.</p>
          <a href="/faq" className={styles.ctaLink}>Voir la FAQ →</a>
        </section>
      </div>
    </MainLayout>
  );
};

export default Contact;
