# Tutulipe — Directus 11 + Nuxt 4

Site vitrine pour un fleuriste fictif. Architecture headless CMS (Directus 11) + frontend SSG (Nuxt 4).

## Stack

| Service | Technologie | Rôle |
|---------|------------|------|
| **CMS** | Directus 11 + PostgreSQL 16 | API REST + admin + Visual Editor |
| **Frontend** | Nuxt 4 + Nuxt UI v4 | Site statique (SSG) |
| **Images** | @nuxt/image + provider Directus | Optimisation et transformation |
| **Visual Editor** | @directus/visual-editing | Édition in-place du contenu |
| **Polices** | @nuxt/fonts (locales) | Dancing Script + Open Sans |
| **Tests** | Playwright | 12 tests e2e |

## Démarrage rapide

### Prérequis

- Docker / Podman + Compose
- Node.js 22+
- npm

### Backend (Directus)

```bash
cd directus
docker compose up -d       # ou : podman-compose up -d
```

Directus est accessible sur **http://localhost:8055**
- Email : `admin@tutulipe.ch`
- Mot de passe : `admin-dev-123`

#### Appliquer le schéma

```bash
# Docker
docker compose exec directus npx directus schema apply /directus/snapshot.json --yes

# Podman
podman cp snapshot.json directus_directus_1:/directus/snapshot.json
podman exec directus_directus_1 npx directus schema apply /directus/snapshot.json --yes
```

#### Configurer les permissions

```bash
# Obtenir un token admin
curl -X POST http://localhost:8055/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@tutulipe.ch","password":"admin-dev-123"}'

# Exécuter le script de seed
./seed-permissions.sh http://localhost:8055 <TOKEN>
```

### Frontend (Nuxt)

```bash
cd frontend
npm install
npm run dev
```

Le site est accessible sur **http://localhost:3000**

### Tests

```bash
cd frontend
npx playwright test
```

### Visual Editor

1. Dans Directus : **Settings → Modules** → activer **Visual Editor**
2. **Settings → Visual Editor** → ajouter l'URL `http://localhost:3000`
3. Ouvrir le module Visual Editor → survoler et cliquer les éléments éditables

## Structure

```
tutulipe-directus/
├── directus/
│   ├── docker-compose.yml    # Directus 11 + PostgreSQL 16
│   ├── snapshot.json         # Schéma exporté (collections/champs/relations)
│   ├── seed-permissions.sh   # Rôles et permissions
│   ├── .env.example          # Variables d'environnement
│   └── uploads/              # Fichiers uploadés
└── frontend/
    ├── app/
    │   ├── pages/            # Routes (accueil, articles, produits, etc.)
    │   ├── components/       # AppHeader, AppFooter, ArticleCard, ProduitCard
    │   ├── composables/      # useDirectusImage
    │   ├── layouts/          # Layout par défaut
    │   ├── plugins/          # Directus SDK + Visual Editor
    │   ├── providers/        # Provider @nuxt/image pour Directus
    │   └── assets/css/       # Palette + polices
    ├── e2e/                  # Tests Playwright
    ├── public/fonts/         # Polices locales (woff2)
    └── nuxt.config.ts        # Configuration
```

## Collections Directus

| Collection | Type | Description |
|------------|------|-------------|
| `pages` | Standard | Pages statiques (à propos, contact) |
| `articles` | Standard | Articles de blog (groupes accordion) |
| `produits` | Standard | Catalogue de produits |
| `parametres_site` | Singleton | Configuration du site + services (repeater) |

## Déploiement production

1. Copier `directus/.env.example` → `directus/.env` et configurer les secrets
2. Adapter `PUBLIC_URL`, `CORS_ORIGIN` (URL exacte du frontend) et `FRAME_SRC`
3. `docker compose up -d`
4. Appliquer le schéma et les permissions
5. `cd frontend && npm run generate` → déployer `.output/public/`
