import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import styles from './Terms.module.css';

const Terms: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Header */}
        <section className={styles.header}>
          <h1>Conditions d'Utilisation</h1>
          <p className={styles.lastUpdated}>Dernière mise à jour : Décembre 2025</p>
        </section>

        {/* Content */}
        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. Acceptation des Conditions</h2>
            <p>
              En accédant à et en utilisant la plateforme Réussir, vous acceptez de respecter
              ces conditions d'utilisation. Si vous n'êtes pas d'accord avec ces termes, veuillez
              ne pas utiliser notre plateforme.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Compte Utilisateur</h2>
            <p>
              Vous êtes responsable de maintenir la confidentialité de vos identifiants de
              connexion et du mot de passe. Vous acceptez de être responsable de toutes les
              activités qui se produisent sur votre compte.
            </p>
            <ul>
              <li>Vous devez fournir des informations exactes et complètes lors de la création du compte</li>
              <li>Vous êtes responsable de la sécurité de votre compte</li>
              <li>Vous notifierez immédiatement Réussir de tout accès non autorisé</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Utilisation Acceptable</h2>
            <p>Vous acceptez de n'utiliser la plateforme que pour des fins légales et légitimes :</p>
            <ul>
              <li>Pas d'utilisation pour l'harassment ou les menaces</li>
              <li>Pas de contenu illégal ou offensant</li>
              <li>Pas de tentatives de piratage ou de fraude</li>
              <li>Pas de téléchargement ou distribution de contenu protégé sans autorisation</li>
              <li>Pas de spam ou de contenu malveillant</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Propriété Intellectuelle</h2>
            <p>
              Tous les contenus, cours, matériaux et ressources disponibles sur Réussir sont
              protégés par les droits d'auteur et la propriété intellectuelle.
            </p>
            <ul>
              <li>Vous pouvez accéder aux contenus pour votre apprentissage personnel</li>
              <li>Vous ne pouvez pas reproduire ou distribuer les contenus sans permission</li>
              <li>Les cours et matériaux demeurent la propriété de Réussir ou de ses créateurs</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Abonnements et Paiements</h2>
            <ul>
              <li>Les abonnements se renouvellent automatiquement chaque mois</li>
              <li>Vous devez disposer de moyens de paiement valides</li>
              <li>Réussir se réserve le droit de modifier les prix avec notification préalable</li>
              <li>Les remboursements sont soumis à notre politique de remboursement</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Limitation de Responsabilité</h2>
            <p>
              Réussir est fourni "tel quel" sans garanties de quelque nature que ce soit. Nous ne
              sommes pas responsables des dommages indirects, spéciaux ou consécutifs.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Modifications des Services</h2>
            <p>
              Réussir se réserve le droit de modifier, suspendre ou discontinuer tout service
              avec ou sans préavis. Nous nous efforçons de maintenir une continuité de service
              optimale.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Résiliation du Compte</h2>
            <p>
              Vous pouvez résilier votre compte à tout moment en contactant notre support.
              Réussir peut résilier les comptes en cas de violation des conditions d'utilisation.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Confidentialité</h2>
            <p>
              Notre traitement des données personnelles est régi par notre Politique de Confidentialité.
              En utilisant Réussir, vous consentez à notre collecte et utilisation des données
              conformément à cette politique.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Droit Applicable</h2>
            <p>
              Ces conditions sont régies par les lois de la France. Tout différend sera résolu
              selon la juridiction compétente.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant ces conditions, veuillez nous contacter à :
              <br />
              Email: legal@reussir.com
              <br />
              Adresse: 123 Rue de l'Éducation, 75000 Paris, France
            </p>
          </section>
        </article>

        {/* Footer CTA */}
        <section className={styles.footer}>
          <p>© 2025 Réussir. Tous droits réservés.</p>
        </section>
      </div>
    </MainLayout>
  );
};

export default Terms;
