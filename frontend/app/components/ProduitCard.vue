<script setup lang="ts">
import type { Produit } from '~/plugins/directus'

defineProps<{
  produit: Produit
}>()

const categorieLabels: Record<string, string> = {
  bouquets: 'Bouquets',
  plantes: 'Plantes',
  accessoires: 'Accessoires',
}
</script>

<template>
  <UCard
    as="NuxtLink"
    :to="`/produits/${produit.slug}`"
    variant="outline"
    class="hover:shadow-lg transition-shadow"
  >
    <NuxtImg
      v-if="produit.image"
      provider="directus"
      :src="produit.image"
      :alt="produit.nom"
      width="600"
      height="400"
      format="webp"
      quality="85"
      class="w-full h-48 object-cover rounded-lg mb-4"
    />
    <div v-else class="w-full h-48 bg-lavender-50 rounded-lg mb-4 flex items-center justify-center">
      <UIcon name="i-lucide-flower" class="text-4xl text-lavender-200" />
    </div>

    <div class="flex items-start justify-between gap-2 mb-2">
      <h3 class="font-heading text-2xl text-brown-900">
        {{ produit.nom }}
      </h3>
      <UBadge
        v-if="produit.categorie"
        color="neutral"
        variant="subtle"
      >
        {{ categorieLabels[produit.categorie] || produit.categorie }}
      </UBadge>
    </div>

    <div class="flex items-center justify-between">
      <p v-if="produit.prix" class="text-lg font-semibold text-terracotta-500">
        {{ Number(produit.prix).toFixed(2) }} CHF
      </p>
      <UBadge
        v-if="!produit.en_stock"
        color="error"
        variant="subtle"
      >
        Rupture de stock
      </UBadge>
    </div>
  </UCard>
</template>
