import { useState, useEffect } from 'react'

export function usePreloadImage(src: string | undefined) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setIsLoaded(true)
      return
    }

    setIsLoaded(false)
    setError(null)

    const img = new Image()
    img.src = src

    img.onload = () => {
      setIsLoaded(true)
    }

    img.onerror = () => {
      setError(`Failed to load image: ${src}`)
      setIsLoaded(true) // We still want to show the page even if background fails
    }
  }, [src])

  return { isLoaded, error }
}
