<script setup lang="ts">
import type { Article, Produit, ParametresSite } from '~/plugins/directus'

const { $directus, $readItems, $readSingleton, $setAttr } = useNuxtApp()

const { data: settings } = await useAsyncData('parametres-site', () =>
  $directus.request($readSingleton<ParametresSite>('parametres_site')),
)

const { data: articles } = await useAsyncData('accueil-articles', () =>
  $directus.request($readItems<Article>('articles', {
    filter: { statut: { _eq: 'published' } },
    sort: ['-date_publication'],
    limit: 3,
  })),
)

const { data: produits } = await useAsyncData('accueil-produits', () =>
  $directus.request($readItems<Produit>('produits', {
    filter: { statut: { _eq: 'published' } },
    limit: 4,
  })),
)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden bg-brown-900">
      <div class="absolute inset-0 bg-gradient-to-r from-brown-950/70 to-brown-950/30" />
      <UContainer class="relative z-10 text-center text-white">
        <h1
          class="font-heading text-5xl md:text-7xl mb-6 drop-shadow-lg"
          :data-directus="$setAttr?.({ collection: 'parametres_site', item: settings?.id, fields: 'nom_du_site', mode: 'popover' })"
        >
          {{ settings?.nom_du_site || 'Tutulipe' }}
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 text-lavender-100 max-w-2xl mx-auto"
          :data-directus="$setAttr?.({ collection: 'parametres_site', item: settings?.id, fields: 'slogan', mode: 'popover' })"
        >
          {{ settings?.slogan || 'L\'art floral au naturel' }}
        </p>
        <UButton
          to="/produits"
          label="Découvrir nos créations"
          size="lg"
          color="primary"
          variant="solid"
          class="shadow-lg"
        />
      </UContainer>
    </section>

    <!-- Articles récents -->
    <section v-if="articles?.length" class="py-16">
      <UContainer>
        <h2 class="font-heading text-4xl text-center text-brown-900 mb-10">
          Dernières actualités
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>
        <div class="text-center mt-8">
          <UButton
            to="/articles"
            label="Voir tous les articles"
            variant="ghost"
            color="primary"
          />
        </div>
      </UContainer>
    </section>

    <!-- Produits vedettes -->
    <section v-if="produits?.length" class="py-16 bg-brown-50">
      <UContainer>
        <h2 class="font-heading text-4xl text-center text-brown-900 mb-10">
          Nos créations
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProduitCard
            v-for="produit in produits"
            :key="produit.id"
            :produit="produit"
          />
        </div>
        <div class="text-center mt-8">
          <UButton
            to="/produits"
            label="Voir tout le catalogue"
            variant="ghost"
            color="primary"
          />
        </div>
      </UContainer>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-lavender-50">
      <UContainer class="text-center">
        <h2 class="font-heading text-4xl text-brown-900 mb-4">
          Envie d'une composition sur mesure ?
        </h2>
        <p class="text-lg text-brown-600 mb-8 max-w-2xl mx-auto">
          Contactez-nous pour discuter de vos envies. Chaque création est unique.
        </p>
        <UButton
          to="/contact"
          label="Nous contacter"
          size="lg"
          color="primary"
          variant="solid"
        />
      </UContainer>
    </section>
  </div>
</template>
