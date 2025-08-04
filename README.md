# reussir
# 🤝 Guide de contribution — Reussir API

Merci de contribuer à ce projet ! Voici les conventions à suivre :

---

## 🧱 Branches

* Branche principale : `master`
* Branche de développement : `dev`
* Crée une branche à partir de `dev` pour chaque fonctionnalité ou correction.

### 🔹 Convention de nommage des branches :

```
<type>/<scope>-<description-courte>
```

**Types** : `feature`, `fix`, `refactor`, `chore`, `test`, `hotfix`

**Exemples** :

* `feature/api-export-donnees`
* `fix/auth-token-expired`

### ✅ Commandes utiles :

```bash
# Se placer sur la branche de développement
git checkout dev

# Créer une branche de fonctionnalité
git checkout -b feature/api-export-donnees
```

---

## ✏️ Messages de commits (Conventional Commits)

Format :

```
<type>(<scope>): description concise
```
type est pris entre : [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]
**Exemples** :

* `feat(api): ajout de l’authentification JWT`
* `fix(models): correction null email`
* `docs(readme): ajout des instructions d’installation`

### ✅ Commande utile :

```bash
git commit -m "feat(api): ajout endpoint export des données"
```

---

## 🔀 Pull Requests

* Crée une PR vers `dev`
* Titre : même format que les commits, avec ID si possible :

```
feat(api): ajout endpoint export (#42)
```

### 📅 Checklist de PR :

* [ ] Description claire de la fonctionnalité ou correction
* [ ] Instructions de test
* [ ] Lien vers issue associée si existante

### ✅ Commandes utiles :

```bash
# Pousser la branche distante
git push origin feature/api-export-donnees

# Ouvrir une PR depuis GitHub
# (alternativement, utiliser GitHub CLI)
gh pr create --base dev --head feature/api-export-donnees --title "feat(api): ajout endpoint export (#42)" --body "Ajout d'un endpoint pour exporter les données. Fix #42."
```

---

## 🥪 Tests

* Inclure des tests unitaires pour chaque nouvelle fonctionnalité
* Exécuter les tests avant chaque PR

### ✅ Commandes utiles :

```bash
pytest
# ou si tests dans un dossier particulier\pytest tests/
```

---

## 🧼 Qualité du code

* Respecter le style PEP8
* Utiliser `black`, `flake8` ou `ruff`

### ✅ Commandes utiles :

```bash
# Formatter le code
black .

# Linter avec flake8
flake8 sda_api/

# Linter avec ruff (alternative moderne)
ruff sda_api/
```

---

## 📂 Structure du projet

* `sda_api/` : code principal
* `tests/` : tests automatisés
* `manage.py` : interface de gestion du projet Django
