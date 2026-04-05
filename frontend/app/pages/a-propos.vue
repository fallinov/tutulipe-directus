<script setup lang="ts">
import type { Page } from '~/plugins/directus'

const { $directus, $readItems, $setAttr } = useNuxtApp()

const { data: page, error } = await useAsyncData('page-a-propos', async () => {
  const pages = await $directus.request($readItems<Page>('pages', {
    filter: {
      slug: { _eq: 'a-propos' },
      statut: { _eq: 'published' },
    },
    limit: 1,
  }))
  return pages[0] || null
})

if (error.value || !page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page non trouvée' })
}

useHead({
  title: page.value.titre,
  meta: page.value.meta_description
    ? [{ name: 'description', content: page.value.meta_description }]
    : [],
})
</script>

<template>
  <div>
    <section class="py-16">
      <UContainer class="max-w-3xl">
        <h1
          class="font-heading text-5xl text-brown-900 mb-8"
          :data-directus="$setAttr({ collection: 'pages', item: page!.id, fields: 'titre', mode: 'popover' })"
        >
          {{ page!.titre }}
        </h1>
        <div
          v-if="page!.contenu"
          class="prose prose-brown max-w-none"
          :data-directus="$setAttr({ collection: 'pages', item: page!.id, fields: 'contenu', mode: 'modal' })"
          v-html="page!.contenu"
        />
      </UContainer>
    </section>
  </div>
</template>
