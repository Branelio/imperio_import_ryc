import type { Product } from '@/lib/types'

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

export function trackPixelEvent(eventName: string, data: Record<string, any> = {}) {
  // 1. Browser Pixel tracking
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, data)
  }

  // 2. Server-side Conversions API (CAPI) tracking
  if (typeof window !== 'undefined') {
    fetch('/api/pixel/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventSourceUrl: window.location.href,
        customData: data,
      }),
    }).catch((err) => {
      console.error('Error triggering CAPI route:', err)
    })
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
