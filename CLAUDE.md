# Tutulipe Directus — Guide Claude Code

## Stack

- **CMS** : Directus 11 (Docker/Podman) + PostgreSQL 16
- **Frontend** : Nuxt 4 (v4.4) + Nuxt UI v4 (Tailwind CSS v4 + Reka UI)
- **SDK** : @directus/sdk (client REST typé)
- **Visual Editor** : @directus/visual-editing (édition in-place dans l'iframe Directus)
- **Images** : @nuxt/image + provider custom `defineProvider` dans `app/providers/`
- **Polices** : Dancing Script (titres) + Open Sans (corps) — locales dans `public/fonts/`
- **Icônes** : Lucide (via Nuxt UI)
- **Tests** : Playwright (12 tests e2e)
- **Conteneurs** : Podman (pas Docker sur cette machine)
- **Déploiement** : Self-hosted Docker (Infomaniak, Suisse)

## Commandes

```bash
# Backend (Podman)
cd directus && podman-compose up -d
# → http://localhost:8055 — admin@tutulipe.ch / admin-dev-123

# Appliquer le schéma (première fois)
podman cp directus/snapshot.json directus_directus_1:/directus/snapshot.json
podman exec directus_directus_1 npx directus schema apply /directus/snapshot.json --yes

# Configurer les permissions
./seed-permissions.sh http://localhost:8055 <TOKEN>

# Frontend
cd frontend && npm run dev      # Dev (http://localhost:3000)
cd frontend && npm run generate # Build SSG
cd frontend && npm run preview  # Preview du build

# Tests
cd frontend && npx playwright test
```

## Structure

```
directus/
  docker-compose.yml          # Directus 11 + PostgreSQL 16 (CSP frame-src + cache auto-purge)
  snapshot.json                # Schéma exporté (collections/champs/relations)
  seed-permissions.sh          # Rôles + policies + permissions (API Directus 11)
  .env.example                 # Template variables

frontend/
  app/
    components/                # AppHeader, AppFooter, ArticleCard, ProduitCard
    composables/               # useDirectusImage
    layouts/default.vue        # Header sticky + Footer dynamique
    pages/                     # Routes SSG (7 pages)
    plugins/
      directus.ts              # Client SDK + types TypeScript
      visual-editing.ts        # Visual Editor (setAttr universel, apply client-only)
    providers/directus-image.ts # Provider @nuxt/image (defineProvider)
    assets/css/main.css        # Palette custom + polices @font-face
  e2e/tutulipe.spec.ts         # 12 tests Playwright
  public/fonts/                # Polices locales (woff2)
```

## Architecture des données

| Collection | Type | Champs clés |
|------------|------|-------------|
| `pages` | Standard | titre, slug (readonly), contenu (WYSIWYG), meta_description, statut |
| `articles` | Standard | titre, slug, contenu, image, date_publication, statut — groupes accordion |
| `produits` | Standard | nom, slug, description, prix, image, categorie, en_stock, statut |
| `parametres_site` | Singleton | nom_du_site, slogan, description, logo, telephone, email, adresse, services (repeater JSON) |

### Interfaces UX notables

- **Accordion** sur les groupes articles (Contenu, Publication, SEO)
- **Repeater** `services` sur parametres_site : `[{ titre, description, icone }]`
- **Notes contextuelles** sur slug, statut, images, prix
- **Restrictions MIME** sur les images : JPG/PNG/WebP uniquement
- **Visual Editor** : attributs `data-directus` sur titres, contenus, prix (popover/modal)

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

## Pièges connus

- **CORS** : `CORS_ORIGIN: true` en dev (tous les ports). En prod, restreindre à l'URL exacte du frontend.
- **Provider image** : utiliser `defineProvider()` de `@nuxt/image/runtime` (pas un export brut).
- **Visual Editor** : le plugin doit être universel (`.ts`, pas `.client.ts`) pour que `setAttr` soit disponible au SSR. Seul `apply()` est client-only.
- **Prix decimal** : Directus retourne les champs `decimal` en string — toujours `Number(prix)` avant `.toFixed()`.
- **UButton couleurs custom** : les props `variant`/`color` ne fonctionnent pas bien avec les couleurs Tailwind custom (lavender). Utiliser des `<button>` HTML natifs pour les interactions critiques (filtres).

## Conventions

- **Code** : anglais (variables, composants)
- **Commits** : français, prefix `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- **Zéro CDN** : tout servi localement (polices, icônes)
- **Images** : toujours `<NuxtImg provider="directus">`, jamais d'URL brute
- **Fetch** : `useAsyncData()` avec clé explicite + filtre `statut=published`
- **MCP** : serveur `directus-mcp-server` configuré dans `.claude/settings.json`
