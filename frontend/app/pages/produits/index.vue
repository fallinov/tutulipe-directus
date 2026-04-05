<script setup lang="ts">
import type { Produit } from '~/plugins/directus'

const { $directus, $readItems } = useNuxtApp()

const { data: produits } = await useAsyncData('produits-list', () =>
  $directus.request($readItems<Produit>('produits', {
    filter: { statut: { _eq: 'published' } },
    sort: ['nom'],
  })),
)

useHead({
  title: 'Produits — Tutulipe',
})

// Filtre catégorie côté client
const categorieActive = ref('tous')

const categories = [
  { label: 'Tous', value: 'tous' },
  { label: 'Bouquets', value: 'bouquets' },
  { label: 'Plantes', value: 'plantes' },
  { label: 'Accessoires', value: 'accessoires' },
]

const produitsFiltres = computed(() => {
  if (!produits.value) return []
  if (categorieActive.value === 'tous') return produits.value
  return produits.value.filter(p => p.categorie === categorieActive.value)
})
</script>

<template>
  <div>
    <section class="py-16">
      <UContainer>
        <h1 class="font-heading text-5xl text-center text-brown-900 mb-10">
          Nos produits
        </h1>

        <!-- Filtres -->
        <div class="flex justify-center mb-10">
          <UButtonGroup>
            <UButton
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :variant="categorieActive === cat.value ? 'solid' : 'outline'"
              color="primary"
              @click="categorieActive = cat.value"
            />
          </UButtonGroup>
        </div>

        <!-- Grille produits -->
        <div v-if="produitsFiltres.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProduitCard
            v-for="produit in produitsFiltres"
            :key="produit.id"
            :produit="produit"
          />
        </div>

        <p v-else class="text-center text-brown-400 text-lg">
          Aucun produit dans cette catégorie.
        </p>
      </UContainer>
    </section>
  </div>
</template>
