'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { getAllProducts, getCategories } from '@/lib/products'

export default function ProductosContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('cat') || ''

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('default')
  const [showOnlyStock, setShowOnlyStock] = useState(false)

  const allProducts = getAllProducts()
  const categories = getCategories()

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    if (selectedCategory) {
      products = products.filter(p =>
        p.categories.some(c => c.toLowerCase() === selectedCategory.toLowerCase())
      )
    }

    if (search) {
      const q = search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categories.some(c => c.toLowerCase().includes(q))
      )
    }

    if (showOnlyStock) {
      products = products.filter(p => p.stock > 0)
    }

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'stock':
        products.sort((a, b) => b.stock - a.stock)
        break
    }

    return products
  }, [allProducts, selectedCategory, search, sortBy, showOnlyStock])

  const hasActiveFilters = selectedCategory || search || showOnlyStock

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {selectedCategory ? (
            <span style={{ color: 'var(--gold)' }}>{selectedCategory}</span>
          ) : (
            <>Nuestro <span style={{ color: 'var(--gold)' }}>Catalogo</span></>
          )}
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>
          {filteredProducts.length} productos disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="card-flat p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 pr-4 py-2.5"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select px-4 py-2.5"
          >
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name">Nombre A-Z</option>
            <option value="stock">Mayor stock</option>
          </select>

          {/* Stock filter */}
          <button
            onClick={() => setShowOnlyStock(!showOnlyStock)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
            style={{
              backgroundColor: showOnlyStock ? 'var(--gold)' : 'transparent',
              color: showOnlyStock ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border: showOnlyStock ? 'none' : '1px solid var(--border-default)',
            }}
          >
            <SlidersHorizontal size={14} />
            En stock
          </button>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedCategory('')}
            className={`pill ${!selectedCategory ? 'pill-active' : 'pill-inactive'}`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
              className={`pill ${selectedCategory === cat.name ? 'pill-active' : 'pill-inactive'}`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Filtros activos:</span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}
            >
              {selectedCategory}
              <X size={12} />
            </button>
          )}
          {showOnlyStock && (
            <button
              onClick={() => setShowOnlyStock(false)}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(22,163,74,0.2)' }}
            >
              En stock
              <X size={12} />
            </button>
          )}
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); setShowOnlyStock(false) }}
            className="text-xs font-medium transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Limpiar todo
          </button>
        </div>
      )}

      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>No se encontraron productos</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>Intenta con otros filtros</p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); setShowOnlyStock(false) }}
            className="btn-secondary text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
