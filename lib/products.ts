import productos from '@/data/productos.json'
import type { Product, Category } from '@/lib/types'

export function getAllProducts(): Product[] {
  return productos as Product[]
}

export function getProductBySlug(slug: string): Product | undefined {
  return (productos as Product[]).find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  return (productos as Product[]).filter(p =>
    p.categories.some(c => c.toLowerCase() === category.toLowerCase())
  )
}

export function getFeaturedProducts(): Product[] {
  return (productos as Product[])
    .filter(p => p.approved && p.stock > 0 && p.price > 5)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8)
}

export function getNewProducts(): Product[] {
  return (productos as Product[])
    .filter(p => p.approved && p.stock > 0)
    .slice(-8)
    .reverse()
}

export function getCategories(): Category[] {
  const catMap = new Map<string, number>()
  ;(productos as Product[]).forEach(p => {
    p.categories.forEach(c => {
      catMap.set(c, (catMap.get(c) || 0) + 1)
    })
  })
  return Array.from(catMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    }))
    .sort((a, b) => b.count - a.count)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return (productos as Product[]).filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.categories.some(c => c.toLowerCase().includes(q)) ||
    p.sku.toLowerCase().includes(q)
  )
}

export function getDashboardStats() {
  const prods = productos as Product[]
  const totalProducts = prods.length
  const inStockProducts = prods.filter(p => p.stock > 0).length
  const outOfStockProducts = totalProducts - inStockProducts
  const totalStockUnits = prods.reduce((acc, p) => acc + (p.stock || 0), 0)
  const inventoryValueWholesale = prods.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0)
  const inventoryValuePvp = prods.reduce((acc, p) => acc + ((p.priceSuggested || p.price || 0) * (p.stock || 0)), 0)
  const totalCategories = getCategories().length
  const withImageCount = prods.filter(p => p.hasImage && p.images && p.images.length > 0).length
  const withoutImageCount = totalProducts - withImageCount

  return {
    totalProducts,
    inStockProducts,
    outOfStockProducts,
    totalStockUnits,
    inventoryValueWholesale,
    inventoryValuePvp,
    totalCategories,
    withImageCount,
    withoutImageCount
  }
}

