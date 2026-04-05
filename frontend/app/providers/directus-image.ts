import { joinURL } from 'ufo'
import type { ProviderGetImageOptions } from '@nuxt/image'

function getImage(
  src: string,
  { modifiers = {} }: ProviderGetImageOptions,
  { options: { baseURL } }: { options: { baseURL: string } },
) {
  const params = new URLSearchParams()

  if (modifiers.width) params.set('width', String(modifiers.width))
  if (modifiers.height) params.set('height', String(modifiers.height))
  if (modifiers.format) params.set('format', String(modifiers.format))
  if (modifiers.quality) params.set('quality', String(modifiers.quality))
  if (modifiers.fit) params.set('fit', String(modifiers.fit))

  const query = params.toString()
  const url = joinURL(baseURL, 'assets', src)

  return {
    url: query ? `${url}?${query}` : url,
  }
}

export default {
  getImage,
}
