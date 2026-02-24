# HiPay Fraud Management — Tests E2E

Projet de tests End-to-End pour la page [HiPay Fraud Management](https://hipay.com/en/our-solutions/fraud-management/), réalisé dans le cadre du test technique QA Analyst HiPay.

---

## Partie 1 — Analyse & Stratégie de test

### Page analysée

**URL** : https://hipay.com/en/our-solutions/fraud-management/

La page HiPay Fraud Management est une page marketing présentant la solution anti-fraude HiPay Sentinel. Elle cible les marchands potentiels et vise à les convertir via une demande de démo.

### Composants UI identifiés

| Zone | Éléments |
|---|---|
| **Header** | Logo HiPay, navigation principale, bouton "Sign in", lien "Contact us" |
| **Hero** | Titre h1, texte métrique "+7pts", CTA "Request a tool demo" (ancre `#contact`) |
| **Feature cards** | 6 cartes décrivant les fonctionnalités anti-fraude |
| **Section contact** | Formulaire HubSpot (prénom, nom, email, société, téléphone) — ancre `#contact` |
| **Section FAQ** | Accordéons avec questions/réponses fréquentes |
| **Footer** | Liens légaux, réseaux sociaux, navigation |
| **Bandeau cookies** | Consentement RGPD (non-déterministe selon géolocalisation) |

### Périmètre de test automatisé

Deux scénarios E2E ont été identifiés comme **prioritaires** car ils couvrent les parcours utilisateur à plus forte valeur business :

#### Scénario 1 — CTA → Formulaire de contact
**Pourquoi ?** Le bouton "Request a tool demo" est le principal point de conversion de la page. Une rupture de ce parcours a un impact direct sur les leads commerciaux.

**Ce qui est testé :**
- Le CTA scrolle bien vers la section `#contact` (même page, pas de navigation)
- Le formulaire HubSpot se charge correctement
- Tous les champs peuvent être remplis (prénom, nom, email, société, téléphone)
- Le bouton de soumission est présent mais **jamais cliqué** (environnement de production)

#### Scénario 2 — Section FAQ
**Pourquoi ?** La FAQ est un point d'auto-assistance critique pour les marchands hésitants. Un accordéon cassé signifie une information bloquée.

**Ce qui est testé :**
- La section FAQ est visible
- Au moins une question est affichée
- Cliquer une question ouvre sa réponse (accordéon fonctionne)
- Un deuxième accordéon peut être ouvert indépendamment

### Stratégie de test

**Risk-Based Testing** — les tests sont priorisés par impact business :

| Priorité | Zone | Raison |
|---|---|---|
| `@critical` | CTA → formulaire | Impact direct sur les leads commerciaux |
| `@smoke` | Chargement formulaire | Gate rapide sur chaque commit |
| `@regression` | Remplissage form + FAQ | Couverture complète |

**Hors périmètre** (page externe sans accès aux données internes) :
- Tests de soumission du formulaire (production)
- Tests de performance / Lighthouse
- Tests cross-browser complets
- Tests d'accessibilité WCAG approfondis

---

## Partie 2 — Automatisation

### Prérequis

- **Node.js ≥ 18**
- **Java ≥ 17** (uniquement pour générer les rapports Allure)
- Accès internet (tests sur site externe hipay.com)

### Installation

```bash
npm ci
npx playwright install --with-deps chromium
```

### Commandes de test

| Commande | Description |
|---|---|
| `npm test` | Lance tous les tests (2 workers en parallèle) |
| `npm run test:smoke` | Lance uniquement les tests `@smoke` |
| `npm run test:regression` | Lance les tests `@regression` |
| `npm run test:critical` | Lance les tests `@critical` |
| `npm run test:debug` | Lance avec sortie détaillée pas-à-pas |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs ESLint |
| `npm run clean` | Supprime les artefacts générés |

### Rapports Allure

```bash
# Générer le rapport HTML depuis les résultats
npm run report:generate

# Ouvrir le rapport dans le navigateur
npm run report:open
```

> **Note** : `allure-commandline` est un outil Java. `JAVA_HOME` doit être configuré.

---

## Structure du projet

```
test-technique-hipay/
├── .github/
│   └── workflows/
│       └── e2e.yml                     # Pipeline CI GitHub Actions
├── features/
│   ├── cta_contact_form.feature        # Scénario 1 : CTA → formulaire de contact
│   └── faq.feature                     # Scénario 2 : Section FAQ
├── step_definitions/
│   ├── common_steps.js                 # Steps partagés (Background, navigation)
│   ├── cta_form_steps.js               # Steps formulaire de contact
│   └── faq_steps.js                    # Steps section FAQ
├── pages/
│   ├── FraudManagementPage.js          # Page Object principal (form + FAQ)
│   └── CookieConsentPage.js           # Gestion bandeau RGPD
├── support/
│   └── custom_steps.js                 # Extension de l'acteur I
├── .eslintrc.json                      # Configuration ESLint
├── .gitignore
├── codecept.conf.js                    # Configuration CodeceptJS + Playwright + Allure
├── package.json
└── README.md
```

---

## Stratégie de tags

| Tag | Périmètre | Quand exécuter |
|---|---|---|
| `@smoke` | Chargement formulaire — suite la plus rapide | Chaque commit, gate PR |
| `@critical` | Parcours CTA → formulaire | Chaque commit, bloque le merge |
| `@regression` | Couverture complète (remplissage form + FAQ) | Push sur main/develop |
| `@functional` | Comportements et interactions | Push sur main/develop |

---

## Pipeline CI (GitHub Actions)

```
Lint → Smoke Tests → Regression → Allure Report
 ↓          ↓              ↓             ↓
Fast      PR gate     main/develop    Always
gate      ~30s        push only        runs
```

1. **lint** — ESLint, bloque si le code est invalide
2. **e2e-smoke** — `@smoke @critical` sur chaque push et PR
3. **e2e-regression** — `@regression` uniquement sur push `main`/`develop`
4. **allure-report** — Rapport HTML consolidé (toujours exécuté, même en cas d'échec)

---

## Décisions techniques

| Décision | Justification |
|---|---|
| **CTA = ancre interne** | Le bouton scrolle vers `#contact` sur la même page — pas de navigation Playwright |
| **Formulaire jamais soumis** | Environnement de production, pas de données de test côté serveur |
| **HubSpot `input[name]`** | Les attributs `name` HubSpot sont stables contrairement aux classes CSS générées |
| **`waitForElement(hsForm, 15)`** | Le formulaire HubSpot est injecté de façon asynchrone par le SDK |
| **`retryFailedStep: 2`** | Latence réseau variable sur hipay.com (CDN, géo-routing) |
| **ESLint v8 + `.eslintrc.json`** | Compatibilité maximale avec `eslint-plugin-codeceptjs` |
