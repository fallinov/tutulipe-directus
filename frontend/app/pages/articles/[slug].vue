<script setup lang="ts">
import type { Article } from '~/plugins/directus'

const route = useRoute()
const { $directus, $readItems, $setAttr } = useNuxtApp()

const { data: article, error } = await useAsyncData(
  `article-${route.params.slug}`,
  async () => {
    const articles = await $directus.request($readItems<Article>('articles', {
      filter: {
        slug: { _eq: route.params.slug as string },
        statut: { _eq: 'published' },
      },
      limit: 1,
    }))
    return articles[0] || null
  },
)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article non trouvé' })
}

useHead({
  title: `${article.value.titre} — Tutulipe`,
  meta: article.value.meta_description
    ? [{ name: 'description', content: article.value.meta_description }]
    : [],
})
</script>

<template>
  <div>
    <section class="py-16">
      <UContainer class="max-w-3xl">
        <!-- Image -->
        <NuxtImg
          v-if="article!.image"
          provider="directus"
          :src="article!.image"
          :alt="article!.titre"
          width="1200"
          height="600"
          format="webp"
          quality="85"
          class="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        />

        <!-- En-tête -->
        <h1
          class="font-heading text-5xl text-brown-900 mb-4"
          :data-directus="$setAttr({ collection: 'articles', item: article!.id, fields: 'titre', mode: 'popover' })"
        >
          {{ article!.titre }}
        </h1>

        <p v-if="article!.date_publication" class="text-brown-400 mb-8">
          {{ new Date(article!.date_publication).toLocaleDateString('fr-CH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) }}
        </p>

        <!-- Contenu -->
        <div
          v-if="article!.contenu"
          class="prose prose-brown max-w-none"
          :data-directus="$setAttr({ collection: 'articles', item: article!.id, fields: 'contenu', mode: 'modal' })"
          v-html="article!.contenu"
        />

        <!-- Retour -->
        <div class="mt-12">
          <UButton
            to="/articles"
            label="← Tous les articles"
            variant="ghost"
            color="primary"
          />
        </div>
      </UContainer>
    </section>
  </div>
</template>
