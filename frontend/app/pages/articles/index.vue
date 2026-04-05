<script setup lang="ts">
import type { Article } from '~/plugins/directus'

const { $directus, $readItems } = useNuxtApp()

const { data: articles } = await useAsyncData('articles-list', () =>
  $directus.request($readItems<Article>('articles', {
    filter: { statut: { _eq: 'published' } },
    sort: ['-date_publication'],
  })),
)

useHead({
  title: 'Articles — Tutulipe',
})
</script>

<template>
  <div>
    <section class="py-16">
      <UContainer>
        <h1 class="font-heading text-5xl text-center text-brown-900 mb-10">
          Nos articles
        </h1>

        <div v-if="articles?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>

        <p v-else class="text-center text-brown-400 text-lg">
          Aucun article pour le moment.
        </p>
      </UContainer>
    </section>
  </div>
</template>
