interface ImageOptions {
  width?: number
  height?: number
  format?: 'webp' | 'jpg' | 'png' | 'avif'
  quality?: number
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
}

export function useDirectusImage() {
  const config = useRuntimeConfig()

  function getImageUrl(fileId: string | null, options: ImageOptions = {}) {
    if (!fileId) return ''

    const params = new URLSearchParams()
    if (options.width) params.set('width', String(options.width))
    if (options.height) params.set('height', String(options.height))
    params.set('format', options.format || 'webp')
    params.set('quality', String(options.quality || 85))
    if (options.fit) params.set('fit', options.fit)

    return `${config.public.directusUrl}/assets/${fileId}?${params.toString()}`
  }

  return { getImageUrl }
}
