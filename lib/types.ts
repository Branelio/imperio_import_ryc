export interface Product {
  id: number
  sku: string
  name: string
  slug: string
  type: string
  description: string
  stock: number
  price: number
  priceSuggested: number
  categories: string[]
  approved: boolean
  inBodega: string | null
  hasImage: boolean
  images: string[]
  isDropi: boolean
}

export interface Category {
  name: string
  count: number
  slug: string
}
