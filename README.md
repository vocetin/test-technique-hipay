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
| **Carousel** | 7 slides Swiper.js présentant les capacités de la solution |
| **Section contact** | Formulaire HubSpot (prénom, nom, email, téléphone, site, message) — ancre `#contact` |
| **Footer** | Liens légaux, réseaux sociaux, navigation |
| **Bandeau cookies** | Consentement RGPD (non-déterministe selon géolocalisation) |

### Périmètre de test automatisé

Trois scénarios E2E couvrent les parcours utilisateur à plus forte valeur business et la conformité WCAG :

#### Scénario 1 — CTA → Formulaire de contact
**Pourquoi ?** Le bouton "Request a tool demo" est le principal point de conversion de la page. Une rupture de ce parcours a un impact direct sur les leads commerciaux.

**Ce qui est testé :**
- Le CTA scrolle vers la section `#contact` (même page, pas de navigation)
- Le formulaire HubSpot se charge correctement (injection asynchrone SDK)
- Tous les champs peuvent être remplis (prénom, nom, email, téléphone, site, message)
- Le bouton de soumission est présent mais **jamais cliqué** (environnement de production)

#### Scénario 2 — Navigation carousel
**Pourquoi ?** Le carousel Swiper.js présente les 7 capacités clés de la solution. Un carousel cassé signifie une partie du discours commercial inaccessible.

**Ce qui est testé :**
- Le carousel est visible au chargement
- Le slide actif affiche le bon contenu ("Device fingerprint" par défaut)
- Le bouton "suivant" avance correctement vers le slide suivant
- Le bouton "précédent" devient actif après navigation et revient au slide initial

#### Scénario 3 — Accessibilité WCAG 2.1
**Pourquoi ?** Une page de conversion doit être accessible à tous les utilisateurs, y compris ceux utilisant des technologies d'assistance.

**Ce qui est testé :**
- Audit axe-core (WCAG 2.1 AA) sur la page complète — aucune violation critique ou sérieuse de structure
- Audit axe-core scoped sur le formulaire HubSpot — champs correctement labellisés
- Navigation clavier sur les boutons du carousel — éléments focusables au clavier

> **Note** : La page HiPay présente des violations `image-alt` / `svg-img-alt` (images sans texte alternatif) qui sont exclues de l'audit structurel car elles relèvent du contenu éditorial et non de la structure interactive testée.

### Stratégie de test

**Risk-Based Testing** — les tests sont priorisés par impact business :

| Priorité | Zone | Raison |
|---|---|---|
| `@smoke` | CTA → formulaire | Parcours de conversion principal, gate rapide sur chaque commit |
| `@regression` | Formulaire complet + carousel + accessibilité | Couverture fonctionnelle et WCAG complète |

**Hors périmètre** (page externe sans accès aux données internes) :
- Tests de soumission du formulaire (production)
- Tests de performance / Lighthouse
- Tests cross-browser complets

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
| `npm run test:regression` | Lance les tests `@regression` (fonctionnel + accessibilité) |
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
│       └── e2e.yml                       # Pipeline CI GitHub Actions
├── features/
│   ├── cta_contact_form.feature          # Scénario 1 : CTA → formulaire de contact
│   ├── carousel.feature                  # Scénario 2 : Navigation carousel Swiper.js
│   └── accessibility.feature             # Scénario 3 : Accessibilité WCAG 2.1
├── step_definitions/
│   ├── common_steps.js                   # Steps partagés (Background, navigation)
│   ├── cta_form_steps.js                 # Steps formulaire de contact
│   ├── carousel_steps.js                 # Steps carousel
│   └── accessibility_steps.js            # Steps audit axe-core + clavier
├── pages/
│   ├── FraudManagementPage.js            # Page Object principal
│   └── CookieConsentPage.js              # Gestion bandeau RGPD
├── .eslintrc.json                        # Configuration ESLint
├── .gitignore
├── codecept.conf.js                      # Configuration CodeceptJS + Playwright + Allure
├── package.json
└── README.md
```

---

## Stratégie de tags

| Tag | Périmètre | Quand exécuter |
|---|---|---|
| `@smoke` | Parcours CTA → formulaire — suite la plus rapide | Chaque commit, gate PR |
| `@regression` | Couverture complète (formulaire + carousel + accessibilité) | Push sur main/develop |

---

## Pipeline CI (GitHub Actions)

```
Lint → Smoke Tests → Regression → Allure Report
 ↓          ↓              ↓             ↓
Fast      PR gate     main/develop    Always
gate      ~30s        push only        runs
```

1. **lint** — ESLint, bloque si le code est invalide
2. **e2e-smoke** — `@smoke` sur chaque push et PR
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
| **Carousel `aria-label`** | Les boutons Swiper exposent des `aria-label` stables ("slider next" / "slider previous") |
| **axe-core via `configureAxe`** | Permet de désactiver des règles spécifiques (images éditoriales) sans altérer l'audit structurel |
| **`retryFailedStep: 2`** | Latence réseau variable sur hipay.com (CDN, géo-routing) |
| **ESLint v8 + `.eslintrc.json`** | Compatibilité maximale avec `eslint-plugin-codeceptjs` |
