import { getAllProducts } from '@/lib/products'

export function generateFacebookFeedXml(baseUrl: string): string {
  const products = getAllProducts()
  
  // Normalize base URL (no trailing slash)
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '')

  const itemsXml = products
    .filter(p => p.approved !== false && p.hasImage && p.images && p.images.length > 0)
    .map(p => {
      const id = p.sku || `IMP-${p.id}`
      const title = p.name ? p.name.trim() : 'Producto Imperio Import'
      const rawDescription = p.description && p.description.trim() ? p.description : title
      const link = `${cleanBaseUrl}/producto/${p.slug}`
      const mainImage = p.images[0]
      const additionalImages = p.images.slice(1, 10)
      
      const availability = p.stock > 0 ? 'in stock' : 'out of stock'
      const displayPrice = p.priceSuggested && p.priceSuggested > 0 ? p.priceSuggested : p.price
      const formattedPrice = `${displayPrice.toFixed(2)} USD`
      const category = p.categories && p.categories.length > 0 ? p.categories.join(' > ') : 'General'

      const additionalImagesXml = additionalImages
        .map(img => `        <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
        .join('\n')

      return `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title><![CDATA[${title}]]></g:title>
      <g:description><![CDATA[${rawDescription}]]></g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
${additionalImagesXml ? additionalImagesXml + '\n' : ''}      <g:brand>Imperio Import RyC</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${formattedPrice}</g:price>
      <g:product_type><![CDATA[${category}]]></g:product_type>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Imperio Import RyC - Catálogo de Productos</title>
    <link>${cleanBaseUrl}</link>
    <description>Catálogo dinámico de productos importados de Imperio Import RyC para Meta Commerce Manager</description>
${itemsXml}
  </channel>
</rss>`
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
