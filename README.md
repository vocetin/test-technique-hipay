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
- La navigation avant/arrière fonctionne correctement

#### Scénario 3 — Accessibilité WCAG 2.1
**Pourquoi ?** La page de conversion doit être accessible à tous les utilisateurs.

**Ce qui est testé :**
- Audit axe-core (WCAG 2.1 AA) — aucune violation critique ou sérieuse de structure

> **Note** : La page présente des violations `image-alt` / `svg-img-alt` (images sans texte alternatif). Ces violations de contenu éditorial sont documentées et exclues de l'audit structurel.

### Stratégie de test

**Risk-Based Testing** — les tests sont priorisés par impact business :

| Tag | Zone | Quand exécuter |
|---|---|---|
| `@smoke` | CTA → formulaire | Chaque commit, gate PR |
| `@regression` | Formulaire complet + carousel + accessibilité | Push sur main/develop |

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
| `npm run test:regression` | Lance les tests `@regression` sur Chrome, Chrome mobile et Safari |
| `npm run test:debug` | Lance avec sortie détaillée pas-à-pas |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run clean` | Supprime les artefacts générés |

### Rapports Allure

```bash
npm run report:generate
npm run report:open
```

> **Note** : `allure-commandline` est un outil Java. `JAVA_HOME` doit être configuré.

---

## Structure du projet

```
test-technique-hipay/
├── .github/
│   └── workflows/
│       └── e2e.yml
├── features/
│   ├── cta_contact_form.feature
│   ├── carousel.feature
│   └── accessibility.feature
├── step_definitions/
│   ├── common_steps.js
│   ├── cta_form_steps.js
│   ├── carousel_steps.js
│   └── accessibility_steps.js
├── pages/
│   ├── FraudManagementPage.js
│   └── CookieConsentPage.js
├── codecept.conf.js
├── package.json
└── README.md
```

---

## Pipeline CI (GitHub Actions)

```
Lint → Smoke Tests → Regression → Allure Report
```

1. **lint** — ESLint, bloque si le code est invalide
2. **e2e-smoke** — `@smoke` sur chaque push et PR
3. **e2e-regression** — `@regression` sur Chrome + Chrome mobile + Safari (push `main`/`develop`)
4. **allure-report** — Rapport HTML consolidé (toujours exécuté)

---

## Décisions techniques

| Décision | Justification |
|---|---|
| **CTA = ancre interne** | Le bouton scrolle vers `#contact` sur la même page — pas de navigation Playwright |
| **Formulaire jamais soumis** | Environnement de production, pas de données de test côté serveur |
| **HubSpot `input[name]`** | Les attributs `name` HubSpot sont stables contrairement aux classes CSS générées |
| **`waitForElement(hsForm, 15)`** | Le formulaire HubSpot est injecté de façon asynchrone par le SDK |
| **Carousel `aria-label`** | Les boutons Swiper exposent des `aria-label` stables ("slider next" / "slider previous") |
| **axe-core + `configureAxe`** | Audit WCAG 2.1 AA avec exclusion des violations de contenu éditorial tiers |
| **`retryFailedStep: 2`** | Latence réseau variable sur hipay.com (CDN, géo-routing) |
