# Audit des fichiers frontend

## 1. Fichiers dont la logique est déjà implémentée

- components/common/ProtectedRoute.tsx : Route protégée, gère l'accès selon l'authentification et le rôle utilisateur, redirige si non autorisé.
- components/catalog/SubjectCard.tsx : Carte de sujet, affiche image, titre, description, tags, favori, bouton panier, badge difficulté, prix, etc.
- services/catalogService.ts : Service d'accès au catalogue, recherche, favoris, historique, prédiction IA, appels API REST.
- contexts/CartContext.tsx : Contexte panier, gestion des items, codes promo, persistance localStorage, provider React.
- contexts/ToastContext.tsx : Contexte pour afficher des notifications toast, gestion de la pile, provider React.
- pages/NotFound.tsx : Page 404, affiche code, message, bouton retour, navigation.
- pages/Login.tsx : Page de connexion, gère formulaire, authentification, Google, feedback, navigation, toast.

## 2. Fichiers vides ou partiellement implémentés

- components/common/Tabs.tsx : Squelette, affiche juste "Navigation tabs".
- components/common/Spinner.tsx : Squelette, affiche juste "Spinner" ou loader basique.
- components/common/Select.tsx : Squelette, menu déroulant sans logique avancée.
- components/common/SearchBar.tsx : Squelette, barre de recherche sans logique.
- components/common/Pagination.tsx : Squelette, pagination sans logique.
- components/common/Modal.tsx : Squelette, fenêtre modale sans gestion d'état.
- components/common/Badge.tsx : Squelette, badge statique.
- components/common/Alert.tsx : Squelette, message alerte statique.
- components/common/EmptyState.tsx : Squelette, affiche "Aucun résultat".
- components/catalog/SubjectList.tsx : Squelette, vue liste statique.
- components/catalog/SubjectGrid.tsx : Squelette, grille statique.
- components/catalog/SubjectFilters.tsx : Squelette, filtres statiques.
- components/catalog/SortDropdown.tsx : Squelette, menu de tri statique.
- components/catalog/CategoryList.tsx : Squelette, liste catégories statique.
- components/cart/CartItem.tsx : Squelette, item panier statique.
- components/cart/CartSummary.tsx : Squelette, résumé panier statique.
- components/cart/PromoCodeInput.tsx : Squelette, champ code promo statique.
- components/cart/BundleSuggestions.tsx : Squelette, suggestions bundles statiques.
- pages/Profile.jsx : Squelette, affiche juste "Profil utilisateur".
- pages/SubjectDetails.tsx : Squelette, affiche juste "Détails du sujet".

## 3. Fichiers avec homologues (doublons)

- services/api.ts & services/api.js : Deux versions du service API.
- contexts/AuthContext.tsx & contexts/AuthContext.jsx : Deux versions du contexte d'authentification.
- contexts/ThemeContext.tsx & contexts/ThemeContext.jsx : Deux versions du contexte thème.
- pages/Profile.tsx & pages/Profile.jsx : Deux versions de la page profil.
- components/cart/CartItem.tsx (doublon dans le dossier).
- components/cart/CartSummary.tsx (doublon dans le dossier).
- components/cart/PromoCodeInput.tsx (doublon dans le dossier).
- components/cart/BundleSuggestions.tsx (doublon dans le dossier).
- components/catalog/SubjectList.tsx (doublon dans le dossier).
- components/catalog/SubjectGrid.tsx (doublon dans le dossier).
- components/catalog/SubjectFilters.tsx (doublon dans le dossier).
- components/catalog/SubjectCard.tsx (doublon dans le dossier).
- components/catalog/SortDropdown.tsx (doublon dans le dossier).
- components/catalog/CategoryList.tsx (doublon dans le dossier).

---

## Résumés des fichiers complets

### components/common/ProtectedRoute.tsx
Gère l'accès aux routes selon l'état d'authentification et le rôle utilisateur. Redirige vers la page de login si l'utilisateur n'est pas connecté ou n'a pas le bon rôle. Affiche un écran de chargement si l'état d'authentification est en attente.

### components/catalog/SubjectCard.tsx
Affiche une carte détaillée d'un sujet : image, titre, description, tags, badge de difficulté, année, thème, favori, bouton "Ajouter au panier", prix, badge "Gratuit". Utilise le contexte panier pour ajouter l'item, gère l'état favori, et propose une navigation vers la page de détails du sujet.

### services/catalogService.ts
Service centralisé pour interagir avec le backend catalogue. Permet la recherche de sujets, la gestion des favoris, l'historique d'achat, la prédiction de réussite via IA, et la communication avec l'API REST. Regroupe toutes les méthodes liées au catalogue.

### contexts/CartContext.tsx
Contexte React pour le panier d'achat. Gère l'ajout, la suppression, la persistance des items (localStorage), les codes promo, le calcul du total, et expose un provider pour l'application.

### contexts/ToastContext.tsx
Contexte React pour les notifications toast. Permet d'afficher des messages d'information, d'erreur ou de succès, gère la pile de toasts, et propose un provider pour l'application.

### pages/NotFound.tsx
Page d'erreur 404. Affiche le code d'erreur, un message explicite, et propose un bouton pour revenir à l'accueil ou à la page précédente. Utilise la navigation React Router.

### pages/Login.tsx
Page de connexion complète : formulaire, gestion de l'état, authentification classique et Google, feedback utilisateur (erreur, succès), navigation, et intégration avec le contexte d'authentification et de toast.

## Résumés des services

### services/api.js & services/api.ts
Service d’accès à l’API backend. Fournit une instance Axios configurée (baseURL, headers, interceptors) pour les appels HTTP. La version TypeScript ajoute typage et sécurité sur les réponses.

### services/auth.ts
Service d’authentification : gère login, logout, inscription, récupération de mot de passe, vérification email, et stockage du token. Utilise Axios pour communiquer avec le backend.

### services/awsConfig.ts
Configuration AWS Amplify/Cognito pour l’authentification et le stockage. Centralise les clés, endpoints et options pour l’intégration cloud.

### services/catalogService.ts
Service pour le catalogue de sujets : recherche, favoris, historique, prédiction IA, gestion des appels API REST pour les sujets et utilisateurs.

### services/googleAuth.ts
Service d’authentification Google OAuth. Gère la redirection, l’échange de token, et l’intégration avec le backend pour la connexion sociale.

### services/storage.ts
Service utilitaire pour le stockage local (localStorage, sessionStorage). Fournit des méthodes pour sauvegarder, récupérer et supprimer des données côté client.

### services/user.ts
Service utilisateur : récupération des infos profil, mise à jour, gestion des préférences, et communication avec l’API utilisateur.

## Résumés des types

### types/api.ts
Définit les types pour les réponses et requêtes API (payloads, statuts, erreurs, etc.). Permet de typer les appels et les données échangées.

### types/auth.ts
Définit les types liés à l’authentification : utilisateur, rôles, token, statuts, payloads d’inscription et de login.

### types/card.ts
Définit les types pour le composant Card : props, variantes, sections, image, typage des sous-composants.

### types/index.ts
Regroupe et ré-exporte les types principaux du projet pour simplifier les imports.

### types/theme.ts
Définit les types pour la gestion des thèmes (clair/sombre, couleurs, préférences utilisateur).

### types/user.ts
Définit les types pour l’utilisateur : profil, préférences, historique, favoris, etc.

## Résumés des hooks

### hooks/useApi.ts
Hook personnalisé pour effectuer des appels API. Gère l’état de chargement, les erreurs, et le typage des réponses. Simplifie l’utilisation d’Axios dans les composants.

### hooks/useAuth.ts
Hook pour accéder au contexte d’authentification. Permet de récupérer l’état utilisateur, les méthodes de login/logout, et les statuts d’authentification.

### hooks/useLocalStorage.ts
Hook utilitaire pour synchroniser un état React avec localStorage. Permet de persister des données entre les sessions navigateur.

### hooks/useTheme.ts
Hook pour accéder et modifier le thème de l’application (clair/sombre). Permet de changer dynamiquement le style global.

### hooks/useToast.ts
Hook pour afficher des notifications toast via le contexte dédié. Permet de déclencher des messages d’erreur, succès ou info depuis n’importe quel composant.

## Résumés des contextes

### contexts/AuthContext.jsx & AuthContext.tsx
Contexte React pour l’authentification. Gère l’état utilisateur, les méthodes de login/logout, la persistance du token, et expose ces fonctionnalités à toute l’application.

### contexts/CartContext.tsx
Contexte React pour le panier d’achat. Gère les items, le total, les codes promo, la persistance, et expose les méthodes d’ajout/suppression.

### contexts/ThemeContext.jsx & ThemeContext.tsx
Contexte pour la gestion du thème (clair/sombre). Permet de changer le style global et de mémoriser la préférence utilisateur.

### contexts/ToastContext.tsx
Contexte pour les notifications toast. Gère la pile de messages, l’affichage, et propose des méthodes pour déclencher des toasts depuis n’importe quel composant.
