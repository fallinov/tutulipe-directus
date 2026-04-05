<script setup lang="ts">
import type { ParametresSite } from '~/plugins/directus'

const { $directus, $readSingleton } = useNuxtApp()

const { data: settings } = await useAsyncData('parametres-site-footer', () =>
  $directus.request($readSingleton<ParametresSite>('parametres_site')),
)
</script>

<template>
  <footer class="bg-brown-950 text-brown-100 py-12">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="font-heading text-2xl text-white mb-4">
            {{ settings?.nom_du_site || 'Tutulipe' }}
          </h3>
          <p class="text-brown-300">
            {{ settings?.slogan || 'L\'art floral au naturel' }}
          </p>
        </div>

        <div>
          <h4 class="font-semibold text-white mb-4">Navigation</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="hover:text-peach-300 transition-colors">Accueil</NuxtLink></li>
            <li><NuxtLink to="/articles" class="hover:text-peach-300 transition-colors">Articles</NuxtLink></li>
            <li><NuxtLink to="/produits" class="hover:text-peach-300 transition-colors">Produits</NuxtLink></li>
            <li><NuxtLink to="/a-propos" class="hover:text-peach-300 transition-colors">À propos</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-peach-300 transition-colors">Contact</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-white mb-4">Contact</h4>
          <ul class="space-y-2 text-brown-300">
            <li v-if="settings?.adresse" class="flex items-start gap-2">
              <UIcon name="i-lucide-map-pin" class="mt-1 shrink-0" />
              <span class="whitespace-pre-line">{{ settings.adresse }}</span>
            </li>
            <li v-if="settings?.telephone" class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" />
              <a :href="`tel:${settings.telephone}`" class="hover:text-peach-300 transition-colors">
                {{ settings.telephone }}
              </a>
            </li>
            <li v-if="settings?.email" class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" />
              <a :href="`mailto:${settings.email}`" class="hover:text-peach-300 transition-colors">
                {{ settings.email }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <USeparator class="my-8" />

      <p class="text-center text-sm text-brown-400">
        &copy; {{ new Date().getFullYear() }} {{ settings?.nom_du_site || 'Tutulipe' }}. Tous droits réservés.
      </p>
    </UContainer>
  </footer>
</template>
