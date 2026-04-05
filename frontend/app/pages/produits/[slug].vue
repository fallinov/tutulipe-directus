<script setup lang="ts">
import type { Produit } from '~/plugins/directus'

const route = useRoute()
const { $directus, $readItems, $setAttr } = useNuxtApp()

const { data: produit, error } = await useAsyncData(
  `produit-${route.params.slug}`,
  async () => {
    const produits = await $directus.request($readItems<Produit>('produits', {
      filter: {
        slug: { _eq: route.params.slug as string },
        statut: { _eq: 'published' },
      },
      limit: 1,
    }))
    return produits[0] || null
  },
)

if (error.value || !produit.value) {
  throw createError({ statusCode: 404, statusMessage: 'Produit non trouvé' })
}

useHead({
  title: `${produit.value.nom} — Tutulipe`,
})

const categorieLabels: Record<string, string> = {
  bouquets: 'Bouquets',
  plantes: 'Plantes',
  accessoires: 'Accessoires',
}
</script>

<template>
  <div>
    <section class="py-16">
      <UContainer class="max-w-3xl">
        <!-- Image -->
        <NuxtImg
          v-if="produit!.image"
          provider="directus"
          :src="produit!.image"
          :alt="produit!.nom"
          width="1200"
          height="800"
          format="webp"
          quality="85"
          class="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        />

        <!-- En-tête -->
        <div class="flex items-start justify-between gap-4 mb-6">
          <h1
            class="font-heading text-5xl text-brown-900"
            :data-directus="$setAttr({ collection: 'produits', item: produit!.id, fields: 'nom', mode: 'popover' })"
          >
            {{ produit!.nom }}
          </h1>
          <div class="flex flex-col items-end gap-2 shrink-0">
            <UBadge
              v-if="produit!.categorie"
              color="neutral"
              variant="subtle"
              size="lg"
            >
              {{ categorieLabels[produit!.categorie] || produit!.categorie }}
            </UBadge>
            <UBadge
              v-if="!produit!.en_stock"
              color="error"
              variant="subtle"
              size="lg"
            >
              Rupture de stock
            </UBadge>
          </div>
        </div>

        <!-- Prix -->
        <p
          v-if="produit!.prix"
          class="text-2xl font-semibold text-terracotta-500 mb-8"
          :data-directus="$setAttr({ collection: 'produits', item: produit!.id, fields: 'prix', mode: 'popover' })"
        >
          {{ Number(produit!.prix).toFixed(2) }} CHF
        </p>

        <!-- Description -->
        <div
          v-if="produit!.description"
          class="prose prose-brown max-w-none"
          :data-directus="$setAttr({ collection: 'produits', item: produit!.id, fields: 'description', mode: 'modal' })"
          v-html="produit!.description"
        />

        <!-- Retour -->
        <div class="mt-12">
          <UButton
            to="/produits"
            label="← Tous les produits"
            variant="ghost"
            color="primary"
          />
        </div>
      </UContainer>
    </section>
  </div>
</template>
