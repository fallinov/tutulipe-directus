# Tutulipe Directus — Guide Claude Code

## Stack

- **CMS** : Directus 11 (Docker) + PostgreSQL 16
- **Frontend** : Nuxt 4 (v4.4) + Nuxt UI v4 (Tailwind CSS v4 + Reka UI)
- **SDK** : @directus/sdk (client REST typé)
- **Images** : @nuxt/image + provider custom Directus
- **Polices** : Dancing Script (titres) + Open Sans (corps) — locales dans `public/fonts/`
- **Icônes** : Lucide (via Nuxt UI)
- **Déploiement** : Self-hosted Docker (Infomaniak, Suisse)

## Commandes

```bash
# Backend
cd directus && docker compose up -d
# → http://localhost:8055 — admin@tutulipe.ch / admin-dev-123

# Frontend
cd frontend && npm run dev      # Dev (http://localhost:3000)
cd frontend && npm run generate # Build SSG
cd frontend && npm run preview  # Preview du build
```

## Structure

```
directus/
  docker-compose.yml          # Directus 11 + PostgreSQL 16
  snapshot.yaml               # Schéma collections/champs/relations
  seed-permissions.sh          # Rôles + policies + permissions
  .env.example                 # Template variables

frontend/
  app/
    components/                # AppHeader, AppFooter, ArticleCard, ProduitCard
    composables/               # useDirectusImage
    layouts/default.vue        # Header + Footer
    pages/                     # Routes SSG
    plugins/directus.ts        # Client SDK + types TypeScript
    assets/css/main.css        # Palette custom + polices @font-face
  providers/directus-image.ts  # Provider @nuxt/image
  public/fonts/                # Polices locales (woff2)
```

## Architecture des données

| Collection | Type | Champs clés |
|------------|------|-------------|
| `pages` | Standard | titre, slug, contenu (WYSIWYG), meta_description, statut |
| `articles` | Standard | titre, slug, contenu, image (→ files), date_publication, statut |
| `produits` | Standard | nom, slug, description, prix, image, categorie, en_stock, statut |
| `parametres_site` | Singleton | nom_du_site, slogan, description, logo, telephone, email, adresse |

## Palette de couleurs

| Nom | HEX | Usage |
|---|---|---|
| lavender | #9BB3DB | Primary (boutons, liens) |
| olive | #6D7400 | Secondary |
| peach | #F5AC6D | Accent (décorations) |
| terracotta | #D67057 | CTA, prix |
| brown | #3B2523 | Neutral (texte, footer) |

Définies dans `frontend/app/assets/css/main.css` via `@theme`.

## Permissions

- **Public** : lecture seule sur contenu publié (statut=published) + fichiers
- **Éditeur** : CRUD sans delete sur contenu + fichiers
- Configuré via `directus/seed-permissions.sh`

## Conventions

- **Code** : anglais (variables, composants)
- **Commits** : français, prefix `feat:`, `fix:`, `docs:`, `chore:`
- **Zéro CDN** : tout servi localement (polices, icônes)
- **Images** : toujours `<NuxtImg provider="directus">`, jamais d'URL brute
- **Fetch** : `useAsyncData()` avec clé explicite + filtre `statut=published`
