import { apply, setAttr } from '@directus/visual-editing'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  // Ne charger que dans l'iframe Directus (window.self !== window.top)
  if (window.self === window.top) {
    return {
      provide: {
        setAttr: () => undefined,
      },
    }
  }

  const { disable, enable, remove } = await apply({
    directusUrl: config.public.directusUrl,
    onSaved: () => {
      // Rafraîchir les données après sauvegarde dans l'éditeur
      refreshNuxtData()
    },
  })

  return {
    provide: {
      setAttr,
      visualEditing: { disable, enable, remove },
    },
  }
})
