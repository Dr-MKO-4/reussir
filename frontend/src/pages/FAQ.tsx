import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import styles from './FAQ.module.css';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    {
      id: 1,
      category: 'General',
      question: 'Qu\'est-ce que Réussir ?',
      answer:
        'Réussir est une plateforme d\'apprentissage en ligne qui connecte étudiants, parents et enseignants. Elle propose des cours, des tests, et un système de suivi de progression pour optimiser les résultats éducatifs.',
    },
    {
      id: 2,
      category: 'General',
      question: 'Qui peut utiliser Réussir ?',
      answer:
        'Réussir est destinée à tous : étudiants de tous les niveaux, parents souhaitant suivre le parcours de leurs enfants, et enseignants désirant enrichir leur pédagogie.',
    },
    {
      id: 3,
      category: 'Subscription',
      question: 'Quel est le coût de l\'abonnement ?',
      answer:
        'Nous offrons plusieurs plans : Gratuit (accès limité), Pro (5,99€/mois) et Premium (19,99€/mois). Consultez notre page de tarification pour plus de détails.',
    },
    {
      id: 4,
      category: 'Subscription',
      question: 'Y a-t-il une période d\'essai gratuit ?',
      answer:
        'Oui ! Vous disposez de 30 jours d\'essai gratuit avec accès complet aux fonctionnalités Premium, sans engagement.',
    },
    {
      id: 5,
      category: 'Account',
      question: 'Comment créer un compte ?',
      answer:
        'Cliquez sur "S\'inscrire" en haut de la page, remplissez le formulaire avec vos informations, choisissez votre rôle (étudiant, parent ou enseignant) et confirmez votre email.',
    },
    {
      id: 6,
      category: 'Account',
      question: 'Comment réinitialiser mon mot de passe ?',
      answer:
        'Sur la page de connexion, cliquez sur "Mot de passe oublié", entrez votre email, et suivez les instructions envoyées à votre boîte mail.',
    },
    {
      id: 7,
      category: 'Courses',
      question: 'Comment choisir un cours ?',
      answer:
        'Utilisez la barre de recherche ou les filtres pour trouver des cours par sujet, niveau ou instructeur. Lisez les avis et les détails avant de vous inscrire.',
    },
    {
      id: 8,
      category: 'Courses',
      question: 'Puis-je télécharger les cours ?',
      answer:
        'Oui, avec un abonnement Premium, vous pouvez télécharger les contenus pour une consultation hors ligne.',
    },
    {
      id: 9,
      category: 'Payment',
      question: 'Quels modes de paiement acceptez-vous ?',
      answer:
        'Nous acceptons les cartes de crédit/débit, PayPal, Apple Pay, Google Pay et les virement bancaires pour les entreprises.',
    },
    {
      id: 10,
      category: 'Payment',
      question: 'Puis-je annuler mon abonnement ?',
      answer:
        'Oui, vous pouvez annuler votre abonnement à tout moment depuis vos paramètres de compte. L\'annulation prend effet à la fin de votre période de facturation.',
    },
    {
      id: 11,
      category: 'Technical',
      question: 'Quels appareils supportez-vous ?',
      answer:
        'Réussir est compatible avec tous les appareils : ordinateurs de bureau, tablettes et smartphones. Utilisez simplement votre navigateur web ou notre application mobile.',
    },
    {
      id: 12,
      category: 'Technical',
      question: 'Quelle est la vitesse Internet minimale requise ?',
      answer:
        'Une connexion Internet de 1-2 Mbps est suffisante pour une expérience fluide. Pour les vidéos HD, nous recommandons 5 Mbps minimum.',
    },
  ];

  const categories = ['all', 'General', 'Subscription', 'Account', 'Courses', 'Payment', 'Technical'];

  const filteredFAQ =
    selectedCategory === 'all' ? faqData : faqData.filter(item => item.category === selectedCategory);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Questions Fréquemment Posées</h1>
            <p className={styles.subtitle}>Trouvez des réponses à vos questions en quelques secondes</p>
          </div>
        </section>

        {/* Search Section */}
        <section className={styles.searchSection}>
          <input
            type="text"
            placeholder="Rechercher une réponse..."
            className={styles.searchInput}
          />
        </section>

        {/* Category Filter */}
        <section className={styles.categorySection}>
          <h2>Catégories</h2>
          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryBtn} ${
                  selectedCategory === category ? styles.active : ''
                }`}
              >
                {category === 'all' ? 'Toutes' : category}
              </button>
            ))}
          </div>
        </section>

        {/* FAQ Items */}
        <section className={styles.faqSection}>
          <div className={styles.faqList}>
            {filteredFAQ.map(item => (
              <div
                key={item.id}
                className={`${styles.faqItem} ${expandedId === item.id ? styles.expanded : ''}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleExpand(item.id)}
                >
                  <span>{item.question}</span>
                  <span className={styles.icon}>
                    {expandedId === item.id ? '−' : '+'}
                  </span>
                </button>
                {expandedId === item.id && (
                  <div className={styles.faqAnswer}>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className={styles.ctaSection}>
          <h2>Vous n\'avez pas trouvé la réponse ?</h2>
          <p>Notre équipe de support est prête à vous aider.</p>
          <a href="/contact" className={styles.ctaButton}>Nous Contacter</a>
        </section>
      </div>
    </MainLayout>
  );
};

export default FAQ;
