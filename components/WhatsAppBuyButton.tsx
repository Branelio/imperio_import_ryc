'use client'

import { Phone } from 'lucide-react'
import type { Product } from '@/lib/types'
import { trackAddToCart, trackLead } from '@/lib/pixel'

export default function WhatsAppBuyButton({ product }: { product: Product }) {
  const handleClick = () => {
    trackAddToCart(product)
    trackLead(product.name)
  }

  const message = encodeURIComponent(`Hola, quiero comprar ${product.name} - $${product.price}`)
  const url = `https://wa.me/593959883921?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all shadow-md hover:opacity-95"
      style={{ backgroundColor: 'var(--green)', color: '#fff' }}
    >
      <Phone size={18} />
      Comprar por WhatsApp
    </a>
  )
}
