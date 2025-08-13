# Guide d’architecture & usage du dépôt GitHub

Ce document explique la structure du dépôt, le rôle de chaque dossier/fichier, ainsi que des conseils pratiques pour les utiliser efficacement.

---

## 1. Racine du dépôt

### `.github/`
- **Contenu** : workflows CI/CD (`ci.yml`, `cd.yml`), templates d’issues, PR, etc.
- **Importance** : Automatisation des pipelines (tests, builds, déploiement) et uniformisation des contributions.
- **Utilisation** : Ne modifie pas sans validation, mais tu peux créer/modifier des workflows pour améliorer CI/CD.

### `docs/`
- **Contenu** : documentation générale, diagrammes, guides d’onboarding (`architecture.md`, `er_diagram.png`, `onboarding.md`).
- **Importance** : Source de vérité pour comprendre le système.
- **Utilisation** : Mets à jour la doc à chaque grosse évolution ; idéal pour la formation des nouveaux arrivants.

### `db/`
- **Contenu** : scripts SQL (migrations, seeds), schéma initial (`schema/001_init.sql`).
- **Importance** : Modèle de données officiel. Toute modification structurelle doit passer par ici.
- **Utilisation** :  
  - Place les scripts de migration dans `db/migrations/` pour gérer les versions DB.  
  - Utilise `db/seeds/` pour insérer données de test/dev.  
  - Applique les migrations via Flyway/Alembic.

### `infra/`
- **Contenu** : infrastructure as code (Terraform, Kubernetes manifests).
- **Importance** : Définit l’environnement d’exécution (cloud, cluster).
- **Utilisation** : Modifie ici pour gérer les ressources cloud, déploiements, monitoring.

### `services/`
- **Contenu** : backend, microservices, API, workers, chacun dans son dossier (`auth-svc/`, `content-svc/`, `payments-svc/`, etc.).
- **Importance** : Code métier, logique métier répartie par modules.
- **Utilisation** :  
  - Chaque service a son propre `src/`, `tests/`, `DELIVERY.md`.  
  - Respecte le découpage fonctionnel pour maintenir la clarté et l’isolation.  
  - Utilise le fichier `DELIVERY.md` pour documenter ce qui est livré (endpoints, migrations, tests).

### `web/` & `mobile/`
- **Contenu** : frontend web (Next.js/React) et mobile (React Native) si présents.
- **Importance** : Interface utilisateur principale.
- **Utilisation** :  
  - Organise les composants, pages et tests ici.  
  - Mets à jour `DELIVERY.md` avec les features livrées, endpoints API utilisés.

### `packages/`
- **Contenu** : librairies partagées (UI, SDK, utils).
- **Importance** : Favorise la réutilisation et la cohérence entre services/clients.
- **Utilisation** : Publie et versionne les libs ici. Utilise dans services et frontends.

### `tools/`
- **Contenu** : scripts de développement, outils maison, générateurs.
- **Importance** : Facilite les tâches répétitives (migration, génération docs).
- **Utilisation** : Ajoute les scripts utiles, documente leur usage.

### `tests/`
- **Contenu** : tests end-to-end, tests de performance.
- **Importance** : Garantit la qualité et la robustesse de l’application globale.
- **Utilisation** :  
  - Place ici les tests qui couvrent plusieurs modules/services.  
  - Utilise Playwright, Cypress, etc.

---

## 2. Fichiers importants à la racine

### `.env.example`
- Template pour variables d’environnement.
- Ne pas commiter de secrets ici, juste la structure.

### `README.md`
- Présentation du projet.
- Contient instructions d’installation, usage rapide.

### `CONTRIBUTING.md`
- Guide pour contribuer.
- Explique règles de code, PR, style.

### `CODE_OF_CONDUCT.md`
- Règles de bonne conduite pour la communauté.

### `COMMIT_POLICY.md`
- Politique de commits (Conventional Commits).
- Important pour garder un historique clair.

### `DELIVERY.md`
- Document modèle à placer dans chaque service/module.
- Explique ce qui est livré, endpoints, migrations, tests.

### `SECURITY.md`
- Politique sécurité, procédure pour signaler des vulnérabilités.

---

## 3. Bonnes pratiques d’usage

- **Pour modifier la base de données :**  
  Toujours ajouter une migration SQL dans `db/migrations/`. Ne modifie pas directement `001_init.sql` en prod.

- **Pour ajouter une feature dans un service :**  
  Place le code dans `services/<nom>/src/`, tests dans `services/<nom>/tests/`, documente dans `services/<nom>/DELIVERY.md`.

- **Pour les commits :**  
  Respecte la politique `COMMIT_POLICY.md` pour faciliter la relecture et l’intégration.

- **Pour la recherche et la sécurité :**  
  Utilise les index et RLS comme défini dans les migrations et la base.

- **Pour les tests :**  
  Écris d’abord les tests unitaires/integration dans le module, puis les tests e2e dans `tests/e2e`.

- **Pour les déploiements :**  
  CI automatisée déclenchée sur chaque PR, CD vers staging puis prod via `.github/workflows`.

---

## 4. Résumé rapide des dossiers clés

| Dossier       | Rôle principal                           | À faire / À ne pas faire               |
|---------------|----------------------------------------|---------------------------------------|
| `.github/`    | Pipelines CI/CD, templates issues PR   | Modifier avec prudence                  |
| `docs/`       | Documentation & diagrammes              | Mettre à jour régulièrement            |
| `db/`         | Scripts SQL, migrations, seeds          | Toujours versionner les changements DB |
| `infra/`      | Infrastructure cloud & K8s              | Gérer déploiements, monitoring          |
| `services/`   | Code backend/service par module         | Respecter isolation et tests            |
| `web/`, `mobile/` | Frontends web et mobile             | Suivre architectures frontend           |
| `packages/`   | Libs partagées                          | Versionner, documenter                   |
| `tools/`      | Scripts utilitaires                     | Documenter leur usage                    |
| `tests/`      | Tests e2e et performance                | Couvrir les scénarios transversaux      |

---

Si tu souhaites, je peux aussi te fournir un script bash pour générer cette arborescence avec les fichiers modèles (`COMMIT_POLICY.md`, `DELIVERY.md`) automatiquement.  

N’hésite pas à me demander !

