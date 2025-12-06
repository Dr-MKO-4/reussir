import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import styles from './Pricing.module.css';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

const Pricing: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      period: 'Pour toujours',
      description: 'Parfait pour explorer',
      features: [
        'Accès à 50 cours',
        '5 tests par mois',
        'Support communautaire',
        'Certificats basiques',
        'Accès mobile limité',
      ],
      popular: false,
      cta: 'Commencer Gratuitement',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingPeriod === 'monthly' ? 5.99 : 59.9,
      period: billingPeriod === 'monthly' ? '/mois' : '/an',
      description: 'Pour les apprenants sérieux',
      features: [
        'Accès illimité à tous les cours',
        'Tests illimités',
        'Support email prioritaire',
        'Certificats reconnus',
        'Accès offline aux vidéos',
        'Analytics de progression',
        'Groupe d\'étude privé',
      ],
      popular: true,
      cta: 'Essayer 30 jours Gratuit',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingPeriod === 'monthly' ? 19.99 : 199.9,
      period: billingPeriod === 'monthly' ? '/mois' : '/an',
      description: 'Pour les professionnels',
      features: [
        'Tout inclus dans Pro',
        'Tutoring 1:1 (5h/mois)',
        'Cours personnalisés',
        'Support 24/7 prioritaire',
        'Certificats premium',
        'Accès aux ressources exclusives',
        'Invitations aux webinaires',
        'Mentorat par experts',
        'Accès API pour intégration',
      ],
      popular: false,
      cta: 'Essayer Premium',
    },
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Plans de Tarification Simples et Transparents</h1>
            <p className={styles.subtitle}>
              Choisissez le plan qui correspond à vos besoins d'apprentissage
            </p>
          </div>
        </section>

        {/* Billing Toggle */}
        <section className={styles.billingToggle}>
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${billingPeriod === 'monthly' ? styles.active : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Facturation Mensuelle
            </button>
            <button
              className={`${styles.toggleBtn} ${billingPeriod === 'yearly' ? styles.active : ''}`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Facturation Annuelle
              <span className={styles.savings}>Économisez 17%</span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className={styles.pricingSection}>
          <div className={styles.pricingGrid}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}
              >
                {plan.popular && <span className={styles.badge}>Plus Populaire</span>}

                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDescription}>{plan.description}</p>

                <div className={styles.priceSection}>
                  <span className={styles.price}>
                    {plan.price === 0 ? 'Gratuit' : `${plan.price}€`}
                  </span>
                  <span className={styles.period}>{plan.period}</span>
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className={styles.ctaButton}
                >
                  {plan.cta}
                </Button>

                <div className={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <div key={index} className={styles.feature}>
                      <span className={styles.featureIcon}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className={styles.comparisonSection}>
          <h2>Comparaison Détaillée</h2>
          <div className={styles.tableContainer}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Fonctionnalité</th>
                  <th>Gratuit</th>
                  <th>Pro</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nombre de cours</td>
                  <td>50</td>
                  <td>Illimité</td>
                  <td>Illimité</td>
                </tr>
                <tr>
                  <td>Tests par mois</td>
                  <td>5</td>
                  <td>Illimité</td>
                  <td>Illimité</td>
                </tr>
                <tr>
                  <td>Support</td>
                  <td>Communauté</td>
                  <td>Email</td>
                  <td>24/7 Prioritaire</td>
                </tr>
                <tr>
                  <td>Certificats</td>
                  <td>Basiques</td>
                  <td>Reconnus</td>
                  <td>Premium</td>
                </tr>
                <tr>
                  <td>Contenu offline</td>
                  <td>❌</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Tutoring 1:1</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>5h/mois</td>
                </tr>
                <tr>
                  <td>Cours personnalisés</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>API Access</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <h2>Questions Fréquentes</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>Puis-je changer de plan ?</h4>
              <p>Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Y a-t-il une période d'essai ?</h4>
              <p>Les plans Pro et Premium bénéficient de 30 jours d'essai gratuit.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Comment puis-je annuler ?</h4>
              <p>Vous pouvez annuler votre abonnement depuis votre compte sans engagement.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Offrez-vous des réductions groupe ?</h4>
              <p>Oui, contactez-nous pour les tarifs pour les écoles et organisations.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Prêt à Commencer ?</h2>
          <p>Rejoignez des milliers d'apprenants qui réussissent avec Réussir</p>
          <Button>Créer un Compte Gratuitement</Button>
        </section>
      </div>
    </MainLayout>
  );
};

export default Pricing;
