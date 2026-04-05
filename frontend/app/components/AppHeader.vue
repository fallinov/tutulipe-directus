<script setup lang="ts">
const navigation = [
  [
    { label: 'Accueil', to: '/', icon: 'i-lucide-home' },
    { label: 'Articles', to: '/articles', icon: 'i-lucide-newspaper' },
    { label: 'Produits', to: '/produits', icon: 'i-lucide-shopping-bag' },
    { label: 'À propos', to: '/a-propos', icon: 'i-lucide-info' },
    { label: 'Contact', to: '/contact', icon: 'i-lucide-mail' },
  ],
]

const mobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-brown-100">
    <UContainer>
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <UIcon name="i-lucide-flower-2" class="text-3xl text-lavender-400" />
          <span class="font-heading text-2xl text-brown-950 hidden sm:block">
            Tutulipe
          </span>
        </NuxtLink>

        <!-- Navigation desktop -->
        <nav class="hidden md:block">
          <UNavigationMenu :items="navigation" />
        </nav>

        <!-- Menu mobile -->
        <UButton
          class="md:hidden"
          icon="i-lucide-menu"
          variant="ghost"
          color="neutral"
          aria-label="Ouvrir le menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>

      <!-- Navigation mobile -->
      <nav v-if="mobileMenuOpen" class="md:hidden pb-4">
        <UNavigationMenu
          :items="navigation"
          orientation="vertical"
          class="w-full"
        />
      </nav>
    </UContainer>
  </header>
</template>
