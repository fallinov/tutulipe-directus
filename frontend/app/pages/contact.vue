<script setup lang="ts">
import type { Page, ParametresSite } from '~/plugins/directus'

const { $directus, $readItems, $readSingleton } = useNuxtApp()

const { data: page } = await useAsyncData('page-contact', async () => {
  const pages = await $directus.request($readItems<Page>('pages', {
    filter: {
      slug: { _eq: 'contact' },
      statut: { _eq: 'published' },
    },
    limit: 1,
  }))
  return pages[0] || null
})

const { data: settings } = await useAsyncData('parametres-site-contact', () =>
  $directus.request($readSingleton<ParametresSite>('parametres_site')),
)

useHead({
  title: 'Contact — Tutulipe',
})

const form = reactive({
  nom: '',
  email: '',
  message: '',
})

function handleSubmit() {
  // Le formulaire est statique (SSG) — pas de backend
  // En production, connecter à un service d'envoi d'e-mails
  alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.')
}
</script>

<template>
  <div>
    <section class="py-16">
      <UContainer class="max-w-3xl">
        <h1 class="font-heading text-5xl text-brown-900 mb-8">
          {{ page?.titre || 'Contact' }}
        </h1>

        <div
          v-if="page?.contenu"
          class="prose prose-brown max-w-none mb-12"
          v-html="page.contenu"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <!-- Formulaire -->
          <div>
            <h2 class="font-heading text-3xl text-brown-900 mb-6">
              Écrivez-nous
            </h2>
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <UFormField label="Nom">
                <UInput
                  v-model="form.nom"
                  placeholder="Votre nom"
                  required
                />
              </UFormField>

              <UFormField label="E-mail">
                <UInput
                  v-model="form.email"
                  type="email"
                  placeholder="votre@email.ch"
                  required
                />
              </UFormField>

              <UFormField label="Message">
                <UTextarea
                  v-model="form.message"
                  placeholder="Votre message..."
                  :rows="5"
                  required
                />
              </UFormField>

              <UButton
                type="submit"
                label="Envoyer"
                color="primary"
                size="lg"
              />
            </form>
          </div>

          <!-- Coordonnées -->
          <div>
            <h2 class="font-heading text-3xl text-brown-900 mb-6">
              Nos coordonnées
            </h2>
            <ul class="space-y-4 text-brown-700">
              <li v-if="settings?.adresse" class="flex items-start gap-3">
                <UIcon name="i-lucide-map-pin" class="text-xl text-lavender-400 mt-1 shrink-0" />
                <span class="whitespace-pre-line">{{ settings.adresse }}</span>
              </li>
              <li v-if="settings?.telephone" class="flex items-center gap-3">
                <UIcon name="i-lucide-phone" class="text-xl text-lavender-400 shrink-0" />
                <a :href="`tel:${settings.telephone}`" class="hover:text-lavender-600 transition-colors">
                  {{ settings.telephone }}
                </a>
              </li>
              <li v-if="settings?.email" class="flex items-center gap-3">
                <UIcon name="i-lucide-mail" class="text-xl text-lavender-400 shrink-0" />
                <a :href="`mailto:${settings.email}`" class="hover:text-lavender-600 transition-colors">
                  {{ settings.email }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
