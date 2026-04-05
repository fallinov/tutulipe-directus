# Tutulipe — Directus 11 + Nuxt 4

Site vitrine pour un fleuriste fictif. Architecture headless CMS (Directus 11) + frontend SSG (Nuxt 4).

## Stack

| Service | Technologie | Rôle |
|---------|------------|------|
| **CMS** | Directus 11 + PostgreSQL 16 | API REST + interface d'administration |
| **Frontend** | Nuxt 4 + Nuxt UI v4 | Site statique (SSG) |
| **Images** | @nuxt/image + provider Directus | Optimisation et transformation |
| **Polices** | @nuxt/fonts (locales) | Dancing Script + Open Sans |

## Démarrage rapide

### Prérequis

- Docker + Docker Compose
- Node.js 22+
- npm

### Backend (Directus)

```bash
cd directus
docker compose up -d
```

Directus est accessible sur **http://localhost:8055**
- Email : `admin@tutulipe.ch`
- Mot de passe : `admin-dev-123`

#### Appliquer le schéma

```bash
docker compose exec directus npx directus schema apply /directus/snapshot.yaml
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

### Générer le site statique

```bash
cd frontend
npm run generate
npm run preview
```

## Structure

```
tutulipe-directus/
├── directus/
│   ├── docker-compose.yml    # Directus 11 + PostgreSQL 16
│   ├── snapshot.yaml         # Schéma des collections
│   ├── seed-permissions.sh   # Rôles et permissions
│   ├── .env.example          # Variables d'environnement
│   └── uploads/              # Fichiers uploadés
└── frontend/
    ├── app/
    │   ├── pages/            # Routes (accueil, articles, produits, etc.)
    │   ├── components/       # AppHeader, AppFooter, ArticleCard, ProduitCard
    │   ├── composables/      # useDirectusImage
    │   ├── layouts/          # Layout par défaut
    │   ├── plugins/          # Client Directus SDK
    │   └── assets/css/       # Palette + polices
    ├── providers/            # Provider @nuxt/image pour Directus
    ├── public/fonts/         # Polices locales (woff2)
    └── nuxt.config.ts        # Configuration
```

## Collections Directus

| Collection | Type | Description |
|------------|------|-------------|
| `pages` | Standard | Pages statiques (à propos, contact) |
| `articles` | Standard | Articles de blog |
| `produits` | Standard | Catalogue de produits |
| `parametres_site` | Singleton | Configuration générale du site |

## Déploiement production

1. Copier `directus/.env.example` → `directus/.env` et configurer les secrets
2. Adapter `PUBLIC_URL` et `CORS_ORIGIN`
3. `docker compose up -d`
4. Appliquer le schéma et les permissions
5. `cd frontend && npm run generate` → déployer `.output/public/`
