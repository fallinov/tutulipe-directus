# Lessons Learned

## 2026-04-05 — CORS bloque la navigation client-side mais pas le SSR

**Contexte** : navigation entre pages du site Nuxt
**Erreur** : le contenu ne se chargeait pas en navigation client-side, mais fonctionnait au refresh
**Correction** : `CORS_ORIGIN: true` en dev (au lieu de `http://localhost:3000` alors que le dev server tournait sur `3099`)
**Règle** : en SSR, les requêtes passent par le serveur Nuxt (pas de CORS). En navigation client, le navigateur fait les requêtes directement → CORS s'applique. Toujours vérifier le port.

## 2026-04-05 — Plugin .client.ts empêche le rendu SSR des attributs

**Contexte** : intégration du Visual Editor Directus
**Erreur** : les attributs `data-directus` n'apparaissaient pas dans le HTML — le plugin `.client.ts` ne fournissait pas `$setAttr` côté serveur, donc `:data-directus="$setAttr?.(...)"` retournait `undefined` pendant le SSR
**Correction** : plugin universel `.ts` qui fournit `setAttr` partout, mais n'appelle `apply()` que côté client
**Règle** : si un plugin doit fournir des valeurs utilisées dans les templates SSR, il DOIT être universel. Seule la logique browser (DOM, window) reste conditionnelle avec `import.meta.client`.

## 2026-04-05 — @nuxt/image v2 requiert defineProvider

**Contexte** : provider custom pour les assets Directus
**Erreur** : `setup is not a function` — l'export `{ getImage }` ne fonctionnait pas
**Correction** : utiliser `defineProvider()` de `@nuxt/image/runtime`
**Règle** : depuis @nuxt/image v2, les providers custom doivent utiliser `defineProvider()`. L'ancien format `export const getImage = ...` est obsolète.

## 2026-04-05 — Directus retourne les decimal en string

**Contexte** : affichage des prix produits
**Erreur** : `$props.produit.prix.toFixed is not a function` — le champ `decimal` PostgreSQL est retourné en string par l'API Directus
**Correction** : `Number(prix).toFixed(2)` avant affichage
**Règle** : toujours convertir les champs `decimal` Directus avec `Number()` avant les opérations numériques.

## 2026-04-05 — UButton avec couleurs Tailwind custom ne rend pas correctement

**Contexte** : boutons de filtre catégorie produits
**Erreur** : les `UButton` avec `color="primary"` (mapped à `lavender`) ne rendaient pas le style solid/outline, le bouton "Tous" n'apparaissait pas
**Correction** : utiliser des `<button>` HTML natifs avec classes Tailwind
**Règle** : les couleurs custom Tailwind v4 (via `@theme`) ne sont pas toujours bien supportées par les props `color` de Nuxt UI v4. Pour les interactions critiques, préférer des boutons natifs avec classes directes.
