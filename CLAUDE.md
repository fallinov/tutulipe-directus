# Tutulipe Directus — Guide Claude Code

## Stack

- **CMS** : Directus 11 (image custom via `directus/Dockerfile`) + PostgreSQL 16
- **Page builder** : M2A Builder (champ `blocks` sur `pages`) + 2 extensions :
  - `directus-extension-expandable-blocks` — édition inline accordéon
  - `@directus-labs/experimental-m2a-interface` — sélecteur visuel en grille
- **Frontend** : Nuxt 4 (v4.4) + Nuxt UI v4 (Tailwind CSS v4 + Reka UI)
- **SDK** : @directus/sdk (client REST typé)
- **Visual Editor** : @directus/visual-editing (édition in-place dans l'iframe Directus)
- **Images** : @nuxt/image + provider custom `defineProvider` dans `app/providers/`
- **Polices** : Dancing Script (titres) + Open Sans (corps) — locales dans `public/fonts/`
- **Icônes** : Lucide (via Nuxt UI)
- **Tests** : Playwright (17 tests e2e dont page builder + console propre)
- **Conteneurs** : Podman (pas Docker sur cette machine)
- **Déploiement** : Self-hosted Docker (Infomaniak, Suisse)

## Commandes

```bash
# Backend (Podman) — image custom à builder une fois
cd directus && podman-compose build directus && podman-compose up -d
# → http://localhost:8055 — admin@tutulipe.ch / admin-dev-123

# Appliquer le schéma (première fois)
podman cp directus/snapshot.json directus_directus_1:/directus/snapshot.json
podman exec directus_directus_1 npx directus schema apply /directus/snapshot.json --yes

# Seed des collections du page builder (création des 7 block_*)
./seed-blocks.sh http://localhost:8055 <TOKEN>

# Configurer les permissions (publique + éditeur, blocs inclus)
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
  Dockerfile                   # Image custom (extensions M2A page builder)
  docker-compose.yml          # build: . + PostgreSQL 16 (CSP frame-src + cache auto-purge)
  snapshot.json                # Schéma exporté (collections/champs/relations)
  seed-blocks.sh               # Crée les 7 collections block_* + champ M2A sur pages
  seed-permissions.sh          # Rôles + policies + permissions (incluant blocs)
  .env.example                 # Template variables

frontend/
  app/
    components/
      AppHeader.vue            # Navigation dynamique (useNavPages)
      AppFooter.vue            # Coordonnées + nav dynamique
      ArticleCard.vue
      ProduitCard.vue
      blocks/                  # Composants de blocs M2A
        BlockHero.vue          # Bannière (titre + image + CTA)
        BlockRichtext.vue      # Texte riche WYSIWYG
        BlockGallery.vue       # Grille d'images (M2M)
        BlockProducts.vue      # Vitrine produits (avec filtre catégorie)
        BlockArticles.vue      # Liste d'articles récents
        BlockServices.vue      # Services avec icônes Lucide
        BlockCta.vue           # Appel à l'action (variantes primary/secondary)
        index.ts               # Mapping explicite collection → composant
    composables/
      useDirectusImage.ts
      useNavPages.ts           # Fetch nav CMS + buildNavLinks helper
    layouts/default.vue        # Header sticky + Footer dynamique
    pages/
      index.vue                # Page Accueil (rend les blocs de slug=accueil)
      [...slug].vue            # Catch-all dynamique (rend les blocs de n'importe quelle page)
      contact.vue              # Conservée (formulaire hardcodé)
      articles/                # Listing + détail (collection séparée)
      produits/                # Listing + détail (collection séparée)
    plugins/
      directus.ts              # Client SDK + types (incl. BlockHero, BlockItem, etc.)
      visual-editing.ts        # Visual Editor (setAttr universel, apply client-only)
    providers/directus-image.ts # Provider @nuxt/image (defineProvider)
    assets/css/main.css        # Palette custom + polices @font-face
  e2e/tutulipe.spec.ts         # 17 tests Playwright (page builder + console clean)
  public/fonts/                # Polices locales (woff2)
```

## Architecture des données

| Collection | Type | Champs clés |
|------------|------|-------------|
| `pages` | Standard | titre, slug, **ordre, afficher_dans_menu, blocks (M2A)**, meta_description, statut |
| `articles` | Standard | titre, slug, contenu, image, date_publication, statut — groupes accordion |
| `produits` | Standard | nom, slug, description, prix, image, categorie, en_stock, statut |
| `parametres_site` | Singleton | nom_du_site, slogan, description, logo, telephone, email, adresse, services (repeater JSON) |
| **`pages_blocks`** | Junction M2A | id, pages_id, collection, item, sort |
| `block_hero` | Bloc | titre, sous_titre, image, bouton_label, bouton_lien |
| `block_richtext` | Bloc | titre, contenu (WYSIWYG) |
| `block_gallery` | Bloc | titre, images (M2M files) |
| `block_products` | Bloc | titre, nombre_max, categorie (filtre optionnel) |
| `block_articles` | Bloc | titre, nombre_max |
| `block_services` | Bloc | titre, services (repeater JSON) |
| `block_cta` | Bloc | titre, texte, bouton_label, bouton_lien, variante |

### Page builder M2A

L'éditrice compose chaque page en empilant des blocs via un sélecteur visuel
en grille (extension `@directus-labs/experimental-m2a-interface`) puis édite
les blocs en accordéon inline (`directus-extension-expandable-blocks`).

**Ajouter un nouveau type de bloc** :
1. Créer `block_xxx` dans Directus + ajouter à `seed-blocks.sh` + permissions
2. Ajouter le type dans `frontend/app/plugins/directus.ts` (interface + union)
3. Créer `frontend/app/components/blocks/BlockXxx.vue`
4. L'enregistrer dans `frontend/app/components/blocks/index.ts`
5. L'ajouter à la requête `fields` dans `[...slug].vue` ET `index.vue`
6. **Limite : 8-12 blocs max** (au-delà, bug INVALID_QUERY de Directus 11.15+)
7. **block_gallery** : ne PAS utiliser `block_gallery: ['*']` car le M2M `images`
   plante avec wildcard. Utiliser `['id', 'titre', { images: [...] }]`

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
- **M2A `resolveComponent`** : ne PAS l'utiliser avec une variable (Nuxt 4 exige une string littérale). Toujours passer par le mapping explicite `blockComponents` dans `components/blocks/index.ts`.
- **M2A `block_gallery.*`** : le wildcard sur une collection avec champ M2M (`images`) plante (INTERNAL_SERVER_ERROR). Lister explicitement les champs : `block_gallery: ['id', 'titre', { images: [...] }]`.
- **Ajouter un champ après seed** : les permissions Directus avec `fields: ["*"]` n'incluent PAS automatiquement les nouveaux champs ajoutés après — vérifier que la requête publique fonctionne après chaque ajout.

## Conventions

- **Code** : anglais (variables, composants)
- **Commits** : français, prefix `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- **Zéro CDN** : tout servi localement (polices, icônes)
- **Images** : toujours `<NuxtImg provider="directus">`, jamais d'URL brute
- **Fetch** : `useAsyncData()` avec clé explicite + filtre `statut=published`
- **MCP** : serveur `directus-mcp-server` configuré dans `.claude/settings.json`
