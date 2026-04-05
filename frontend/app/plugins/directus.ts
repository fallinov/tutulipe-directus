import {
  createDirectus,
  rest,
  readItem,
  readItems,
  readSingleton,
} from '@directus/sdk'

/**
 * Types des collections Directus
 */
export interface Page {
  id: number
  titre: string
  slug: string
  contenu: string | null
  meta_description: string | null
  statut: 'published' | 'draft'
}

export interface Article {
  id: number
  titre: string
  slug: string
  contenu: string | null
  image: string | null
  date_publication: string | null
  meta_description: string | null
  statut: 'published' | 'draft'
}

export interface Produit {
  id: number
  nom: string
  slug: string
  description: string | null
  prix: number | null
  image: string | null
  categorie: 'bouquets' | 'plantes' | 'accessoires' | null
  en_stock: boolean
  statut: 'published' | 'draft'
}

export interface ParametresSite {
  id: number
  nom_du_site: string | null
  slogan: string | null
  description: string | null
  logo: string | null
  telephone: string | null
  email: string | null
  adresse: string | null
  couleur_principale: string | null
}

export interface DirectusSchema {
  pages: Page[]
  articles: Article[]
  produits: Produit[]
  parametres_site: ParametresSite
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const directus = createDirectus<DirectusSchema>(config.public.directusUrl)
    .with(rest())

  return {
    provide: { directus, readItem, readItems, readSingleton },
  }
})
