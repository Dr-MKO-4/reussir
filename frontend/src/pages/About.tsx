import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>À Propos de Réussir</h1>
            <p className={styles.subtitle}>
              Transformez votre apprentissage en succès
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className={styles.section}>
          <div className={styles.sectionContent}>
            <h2>Notre Mission</h2>
            <p>
              Chez Réussir, nous croyons que l'éducation est la clé du succès. Notre mission
              est de rendre l'apprentissage accessible, engageant et efficace pour tous.
            </p>
            <p>
              Nous fournissons une plateforme moderne où étudiants, parents et enseignants
              peuvent collaborer pour atteindre des objectifs éducatifs communs.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <h2>Nos Valeurs</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>📚</div>
              <h3>Excellence</h3>
              <p>Nous proposons du contenu de qualité créé par des experts en éducation.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🤝</div>
              <h3>Collaboration</h3>
              <p>Nous encourageons le travail d'équipe entre étudiants et enseignants.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🚀</div>
              <h3>Innovation</h3>
              <p>Nous utilisons la technologie pour transformer l'éducation traditionnelle.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌟</div>
              <h3>Inclusivité</h3>
              <p>Nous croyons que chacun mérite une chance d'apprendre et de réussir.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.section}>
          <h2>Notre Équipe</h2>
          <p>
            Composée de pédagogues expérimentés, de développeurs passionnés et de designers
            talentueux, notre équipe travaille chaque jour pour améliorer votre expérience
            d'apprentissage.
          </p>
          <div className={styles.teamGrid}>
            {[
              { name: 'Dr. Fatima', role: 'Directrice Pédagogique', emoji: '👩‍🏫' },
              { name: 'Ahmed', role: 'Directeur Technique', emoji: '👨‍💻' },
              { name: 'Leila', role: 'Responsable Contenu', emoji: '✍️' },
              { name: 'Hassan', role: 'Chef de Produit', emoji: '📊' },
            ].map((member, index) => (
              <div key={index} className={styles.teamMember}>
                <div className={styles.memberAvatar}>{member.emoji}</div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>50K+</div>
              <div className={styles.statLabel}>Étudiants actifs</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Cours disponibles</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1000+</div>
              <div className={styles.statLabel}>Instructeurs</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Taux de satisfaction</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2>Rejoignez Réussir Aujourd'hui</h2>
          <p>Commencez votre parcours vers le succès éducatif maintenant.</p>
          <button className={styles.ctaButton}>Commencer Gratuitement</button>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
