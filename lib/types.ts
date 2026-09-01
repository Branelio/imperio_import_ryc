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

export interface DashboardStats {
  totalProducts: number
  inStockProducts: number
  outOfStockProducts: number
  totalStockUnits: number
  inventoryValueWholesale: number
  inventoryValuePvp: number
  totalCategories: number
  withImageCount: number
  withoutImageCount: number
}

export interface TelegramPublishLog {
  timestamp: string
  status: 'idle' | 'running' | 'success' | 'error'
  message: string
  processedCount?: number
  totalCount?: number
}

