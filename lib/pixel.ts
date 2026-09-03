import type { Product } from '@/lib/types'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

export function trackPixelEvent(eventName: string, data: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, data)
  }
}

export function trackViewContent(product: Product) {
  const price = product.priceSuggested && product.priceSuggested > 0 ? product.priceSuggested : product.price
  trackPixelEvent('ViewContent', {
    content_name: product.name,
    content_category: product.categories && product.categories.length > 0 ? product.categories[0] : 'General',
    content_ids: [product.sku || String(product.id)],
    content_type: 'product',
    value: price,
    currency: 'USD',
  })
}

export function trackAddToCart(product: Product) {
  const price = product.priceSuggested && product.priceSuggested > 0 ? product.priceSuggested : product.price
  trackPixelEvent('AddToCart', {
    content_name: product.name,
    content_ids: [product.sku || String(product.id)],
    content_type: 'product',
    value: price,
    currency: 'USD',
  })
}

export function trackLead(productName: string) {
  trackPixelEvent('Lead', {
    content_name: productName,
    currency: 'USD',
  })
}
