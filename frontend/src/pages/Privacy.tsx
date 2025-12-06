import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import styles from './Privacy.module.css';

const Privacy: React.FC = () => {
  return (
    <MainLayout>
      <div className={styles.container}>
        {/* Header */}
        <section className={styles.header}>
          <h1>Politique de Confidentialité</h1>
          <p className={styles.lastUpdated}>Dernière mise à jour : Décembre 2025</p>
        </section>

        {/* Content */}
        <article className={styles.content}>
          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Chez Réussir, nous prenons la protection de vos données personnelles très au sérieux.
              Cette Politique de Confidentialité explique comment nous collectons, utilisons,
              divulguons et sauvegardons vos informations.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Informations que Nous Collectons</h2>
            <p>Nous collectons les informations suivantes :</p>
            <ul>
              <li>
                <strong>Données d'identification :</strong> nom, email, téléphone, adresse
              </li>
              <li>
                <strong>Données de compte :</strong> nom d'utilisateur, mot de passe (crypté)
              </li>
              <li>
                <strong>Données de profil :</strong> photo de profil, bio, préférences d'apprentissage
              </li>
              <li>
                <strong>Données d'utilisation :</strong> pages visitées, temps d'accès, cours suivis
              </li>
              <li>
                <strong>Données de paiement :</strong> informations de carte de crédit (traitées de manière sécurisée)
              </li>
              <li>
                <strong>Données techniques :</strong> adresse IP, type de navigateur, appareil utilisé
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Comment Nous Utilisons Vos Informations</h2>
            <ul>
              <li>Fournir et améliorer nos services</li>
              <li>Traiter vos paiements et gérer votre abonnement</li>
              <li>Envoyer des notifications liées à votre compte</li>
              <li>Vous envoyer des mises à jour et des offres promotionnelles</li>
              <li>Analyser l'utilisation pour améliorer notre plateforme</li>
              <li>Détecter et prévenir la fraude</li>
              <li>Respecter les obligations légales</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Partage de Vos Informations</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos
              informations dans les cas suivants :
            </p>
            <ul>
              <li>Avec les prestataires de services (paiement, hosting, support)</li>
              <li>Avec les enseignants ou autres utilisateurs (selon vos paramètres de confidentialité)</li>
              <li>Pour se conformer aux obligations légales</li>
              <li>Lors de fusions ou acquisitions (avec notification)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Sécurité des Données</h2>
            <p>
              Nous utilisons des mesures de sécurité robustes pour protéger vos données :
            </p>
            <ul>
              <li>Chiffrement SSL pour tous les transferts de données</li>
              <li>Stockage sécurisé en centre de données certifié</li>
              <li>Contrôle d'accès et authentification multi-facteurs</li>
              <li>Audits de sécurité réguliers</li>
              <li>Conformité RGPD et standards internationaux</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Vos Droits</h2>
            <p>Vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos données personnelles</li>
              <li>Corriger les informations inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander une portabilité des données</li>
              <li>Révoquer votre consentement à tout moment</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Cookies et Suivi</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience utilisateur.
              Vous pouvez contrôler les cookies via les paramètres de votre navigateur.
            </p>
            <ul>
              <li>
                <strong>Cookies essentiels :</strong> nécessaires pour le fonctionnement du site
              </li>
              <li>
                <strong>Cookies analytiques :</strong> nous aident à comprendre comment vous utilisez notre plateforme
              </li>
              <li>
                <strong>Cookies de marketing :</strong> pour personnaliser les publicités
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Données des Mineurs</h2>
            <p>
              Réussir ne s'adresse pas intentionnellement aux enfants de moins de 13 ans.
              Si nous apprenons qu'un mineur nous a fourni des données sans consentement
              parental, nous les supprimerons promptement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Modifications de Cette Politique</h2>
            <p>
              Nous pouvons modifier cette Politique de Confidentialité. Les modifications
              significatives seront communiquées par email.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Contact</h2>
            <p>
              Pour toute question concernant cette Politique de Confidentialité :
              <br />
              Email: privacy@reussir.com
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

export default Privacy;
