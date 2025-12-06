# Audit des fichiers frontend (Mise à jour 12/11/2025)

## 1. Fichiers dont la logique est déjà implémentée (COMPLETS)

- `components/common/ProtectedRoute.tsx` : Route protégée, accès auth/role, redirection, écran de chargement.
- `components/catalog/SubjectCard.tsx` : Carte sujet complète (image, titre, tags, favori, panier, badges, prix).
- `services/catalogService.ts` : Service catalogue (recherche, favoris, historique, IA, API REST).
- `contexts/CartContext.tsx` : Panier (items, codes promo, persistance, provider).
- `contexts/ToastContext.tsx` : Toast notifications (pile, provider).
- `pages/NotFound.tsx` : Page 404 complète (code, message, bouton retour).
- `pages/Login.tsx` : Connexion complète (formulaire, auth, Google, feedback, navigation, toast).
- `services/api.ts` : Service API TypeScript (Axios, interceptors, typage, gestion erreurs).
- `services/auth.ts` : Authentification (login, logout, inscription, token, récupération, vérification email).
- `services/storage.ts` : Stockage local sécurisé (localStorage, encryption, helpers).
- `types/catalog.ts` : Types catalogue (Subject, Filters, Search, etc.).
- `types/cart.ts` : Types panier (Cart, Order, Payment, etc.).
- `contexts/AuthContext.tsx` : AuthContext complet (état, méthodes, provider).
- `hooks/useAuth.ts` : Hook auth (helpers, accès context).
- `hooks/useCart.ts` : Hook panier (helpers, accès context).
- `components/common/Button.tsx` : Bouton UI complet (toutes variantes, accessibilité).
- `components/common/Input.tsx` : Champ de saisie complet (toutes variantes, accessibilité).
- `components/common/Card.tsx` : Carte UI générique complète.
- `components/common/Modal.tsx` : Modale complète (gestion focus, scroll, fermeture, accessibilité).
- `components/common/Select.tsx` : Sélecteur complet (menu déroulant, clavier, accessibilité).
- `components/common/Spinner.tsx` : Loader complet (plusieurs variantes).
- `components/common/Alert.tsx` : Message alerte complet (types, dismissible).
- `components/common/Badge.tsx` : Badge complet (types, couleurs).
- `components/common/Pagination.tsx` : Pagination dynamique complète.
- `components/common/Tabs.tsx` : Tabs navigation complète.
- `components/common/SearchBar.tsx` : Barre de recherche avec suggestions.
- `components/layout/Header.tsx` : En-tête responsive.
- `components/layout/Footer.tsx` : Pied de page responsive.
- `components/layout/MainLayout.tsx` : Layout principal responsive.

## 2. Fichiers vides ou partiellement implémentés (À COMPLÉTER)

- `components/common/EmptyState.tsx` : Affiche "Aucun résultat" (statique).
- `components/catalog/SubjectList.tsx` : Vue liste statique.
- `components/catalog/SubjectGrid.tsx` : Grille statique.
- `components/catalog/SubjectFilters.tsx` : Filtres statiques.
- `components/catalog/SortDropdown.tsx` : Menu de tri statique.
- `components/catalog/CategoryList.tsx` : Liste catégories statique.
- `components/cart/CartItem.tsx` : Item panier statique.
- `components/cart/CartSummary.tsx` : Résumé panier statique.
- `components/cart/PromoCodeInput.tsx` : Champ code promo statique.
- `components/cart/BundleSuggestions.tsx` : Suggestions bundles statiques.
- `pages/Profile.tsx` : Squelette, formulaire profil partiel.
- `pages/SubjectDetails.tsx` : Squelette, affiche juste "Détails du sujet".
- `pages/Signup.tsx` : Formulaire d’inscription, logique à vérifier/compléter.
- `pages/CompleteProfile.tsx` : Complétion profil, logique à enrichir.
- `pages/AdminDashboard.tsx` : Dashboard admin, logique à compléter.
- `pages/CartPage.tsx` : Squelette, logique panier à compléter.
- `pages/DashboardPage.tsx` : Squelette, logique utilisateur à compléter.
- `components/dashboard/UserDashboard.tsx` : Logique utilisateur partielle.
- `components/dashboard/AdminDashboard.tsx` : Logique admin partielle.

## 3. Fichiers avec homologues (DOUBLONS À NETTOYER)

- `services/api.ts` & `services/api.js` : Garder uniquement `.ts`.
- `contexts/AuthContext.tsx` & `contexts/AuthContext.jsx` : Garder `.ts`.
- `contexts/ThemeContext.tsx` & `contexts/ThemeContext.jsx` : Garder `.ts`.
- `pages/Profile.tsx` & `pages/Profile.jsx` : Garder `.ts`.
- `components/cart/CartItem.tsx` (doublon dans le dossier).
- `components/cart/CartSummary.tsx` (doublon dans le dossier).
- `components/cart/PromoCodeInput.tsx` (doublon dans le dossier).
- `components/cart/BundleSuggestions.tsx` (doublon dans le dossier).
- `components/catalog/SubjectList.tsx` (doublon dans le dossier).
- `components/catalog/SubjectGrid.tsx` (doublon dans le dossier).
- `components/catalog/SubjectFilters.tsx` (doublon dans le dossier).
- `components/catalog/SubjectCard.tsx` (doublon dans le dossier).
- `components/catalog/SortDropdown.tsx` (doublon dans le dossier).
- `components/catalog/CategoryList.tsx` (doublon dans le dossier).

---

## 4. Synthèse d'avancement (Sprints 1 & 2)

- **Fichiers complets (logique avancée) :** 30+ (Foundation, UI, services, hooks, contexts)
- **Fichiers partiels/squelettes :** ~15 (UI avancée, catalogue, panier, pages secondaires)
- **Doublons à supprimer :** 13 paires (26 fichiers)

**Sprints 1 & 2 :**
    - Foundation (services, types, contexts, hooks) : 100% fait
    - UI de base (Button, Input, Card, Modal, Select, Spinner, Alert, Badge, Pagination, Tabs, SearchBar, Header, Footer, MainLayout) : 100% fait

**Sprint 3 (en cours) :**
    - HomePage.tsx, SearchPage.tsx : faits
    - SubjectDetailsPage.tsx, CartPage.tsx, DashboardPage.tsx : à compléter

**Prochaines actions :**
    - Compléter les composants partiels (UI avancée, catalogue, panier)
    - Supprimer tous les doublons listés
    - Finaliser les pages critiques du Sprint 3

---

## 5. Récapitulatif des services, types, hooks, contexts (inchangé)

### Services principaux
- `services/api.ts` : Instance Axios, gestion erreurs, interceptors.
- `services/auth.ts` : Authentification, gestion token, inscription.
- `services/catalogService.ts` : Catalogue, recherche, favoris, historique.
- `services/storage.ts` : Stockage local sécurisé.
- `services/user.ts` : CRUD utilisateur.
- `services/googleAuth.ts` : Auth Google OAuth.
- `services/awsConfig.ts` : Config AWS.
- (À créer : `services/cartService.ts`, `services/favoriteService.ts`, etc.)

### Types principaux
- `types/api.ts` : Typage API.
- `types/auth.ts` : Typage auth/utilisateur.
- `types/catalog.ts` : Typage catalogue.
- `types/cart.ts` : Typage panier.
- `types/card.ts` : Typage UI Card.
- `types/theme.ts` : Typage thème.
- `types/user.ts` : Typage utilisateur.
- `types/index.ts` : Ré-export global.

### Hooks principaux
- `hooks/useApi.ts` : Hook API.
- `hooks/useAuth.ts` : Hook auth.
- `hooks/useCart.ts` : Hook panier.
- `hooks/useLocalStorage.ts` : Hook localStorage.
- `hooks/useTheme.ts` : Hook thème.
- `hooks/useToast.ts` : Hook toast.
- (À créer : `hooks/useDebounce.ts`, `hooks/useInfiniteScroll.ts`, etc.)

### Contexts principaux
- `contexts/AuthContext.tsx` : Auth global.
- `contexts/CartContext.tsx` : Panier global.
- `contexts/ThemeContext.tsx` : Thème global.
- `contexts/ToastContext.tsx` : Toast global.
- (À créer : `contexts/ModalContext.tsx`, `contexts/HistoryContext.tsx`, etc.)