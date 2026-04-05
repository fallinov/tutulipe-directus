<script setup lang="ts">
import type { Article } from '~/plugins/directus'

defineProps<{
  article: Article
}>()
</script>

<template>
  <UCard
    as="NuxtLink"
    :to="`/articles/${article.slug}`"
    variant="outline"
    class="hover:shadow-lg transition-shadow"
  >
    <NuxtImg
      v-if="article.image"
      provider="directus"
      :src="article.image"
      :alt="article.titre"
      width="600"
      height="400"
      format="webp"
      quality="85"
      class="w-full h-48 object-cover rounded-lg mb-4"
    />
    <div v-else class="w-full h-48 bg-lavender-50 rounded-lg mb-4 flex items-center justify-center">
      <UIcon name="i-lucide-image" class="text-4xl text-lavender-200" />
    </div>

    <h3 class="font-heading text-2xl text-brown-900 mb-2">
      {{ article.titre }}
    </h3>

    <p v-if="article.date_publication" class="text-sm text-brown-400">
      {{ new Date(article.date_publication).toLocaleDateString('fr-CH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) }}
    </p>
  </UCard>
</template>
