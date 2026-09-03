'use client'

import { useEffect } from 'react'
import type { Product } from '@/lib/types'
import { trackViewContent } from '@/lib/pixel'

export default function PixelProductTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewContent(product)
  }, [product])

  return null
}
