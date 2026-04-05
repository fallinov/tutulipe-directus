import { setAttr } from '@directus/visual-editing'

export default defineNuxtPlugin((nuxtApp) => {
  // setAttr est disponible côté serveur ET client (génère juste une string)
  // apply() ne doit tourner que côté client, dans l'iframe Directus

  if (import.meta.client) {
    // Attendre que l'app soit montée pour que les éléments DOM existent
    nuxtApp.hook('app:mounted', async () => {
      // Ne charger que dans l'iframe Directus
      if (window.self === window.top) return

      const { apply } = await import('@directus/visual-editing')
      const config = useRuntimeConfig()

      await apply({
        directusUrl: config.public.directusUrl,
        onSaved: () => {
          refreshNuxtData()
        },
      })
    })

    // Re-apply après chaque navigation côté client
    const router = useRouter()
    router.afterEach(async () => {
      if (window.self === window.top) return

      // Attendre le prochain tick pour que le DOM soit mis à jour
      await nextTick()

      const { apply } = await import('@directus/visual-editing')
      const config = useRuntimeConfig()

      await apply({
        directusUrl: config.public.directusUrl,
        onSaved: () => {
          refreshNuxtData()
        },
      })
    })
  }

  return {
    provide: {
      setAttr,
    },
  }
})
