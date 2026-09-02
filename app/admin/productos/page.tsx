'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getAllProducts, getCategories } from '@/lib/products'
import { generateProductsPDF } from '@/lib/pdf-generator'
import type { Product } from '@/lib/types'
import {
  Package,
  Search,
  FileDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  DollarSign,
  Boxes,
  Sparkles,
  Plus
} from 'lucide-react'

export default function AdminProductosPage() {
  const initialProducts = useMemo(() => getAllProducts(), [])
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // Fetch updated products list from API on mount
  useEffect(() => {
    fetch('/api/admin/productos')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      })
      .catch(err => {
        console.error('Error fetching updated products:', err)
      })
  }, [])

  const categories = useMemo(() => {
    const catMap = new Map<string, number>()
    products.forEach(p => {
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
  }, [products])

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'>('ALL')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search text filter
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))

      // Category filter
      const matchesCategory =
        selectedCategory === 'ALL' ||
        p.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())

      // Stock filter
      const matchesStock =
        stockFilter === 'ALL' ||
        (stockFilter === 'IN_STOCK' && p.stock > 0) ||
        (stockFilter === 'OUT_OF_STOCK' && p.stock === 0)

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, search, selectedCategory, stockFilter])

  const handleDownloadFullPDF = async () => {
    await generateProductsPDF(products, 'Catálogo Completo')
  }

  const handleDownloadFilteredPDF = async () => {
    const label = selectedCategory === 'ALL' ? 'Selección Filtrada' : selectedCategory
    await generateProductsPDF(filteredProducts, label)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Gestión de Productos & Catálogo PDF <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explorá, filtrá, agregá y exportá en PDF la lista completa de {products.length} productos de tu tienda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs md:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Agregar Producto
          </Link>

          <button
            onClick={handleDownloadFilteredPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs md:text-sm border border-slate-700 shadow-md hover:shadow-lg transition-all"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            Descargar Vista ({filteredProducts.length}) PDF
          </button>

          <button
            onClick={handleDownloadFullPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm border border-slate-700 hover:border-slate-600 transition-all"
          >
            <FileDown className="w-4 h-4" />
            Descargar Todo PDF ({products.length})
          </button>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, SKU o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-100 placeholder:text-slate-500 text-xs md:text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">Todas las Categorías ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                stockFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStockFilter('IN_STOCK')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                stockFilter === 'IN_STOCK'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              En Stock
            </button>
            <button
              onClick={() => setStockFilter('OUT_OF_STOCK')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                stockFilter === 'OUT_OF_STOCK'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agotados
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Imagen</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Nombre del Producto</th>
                <th className="px-5 py-4">Categoría</th>
                <th className="px-5 py-4 text-center">Stock</th>
                <th className="px-5 py-4 text-right">P. Mayorista</th>
                <th className="px-5 py-4 text-right">PVP Sugerido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id || p.sku} className="hover:bg-slate-800/40 transition-colors">
                    {/* Image Thumbnail */}
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/60 overflow-hidden flex items-center justify-center">
                        {p.hasImage && p.images && p.images.length > 0 ? (
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-3 font-mono font-bold text-amber-400 text-xs">
                      {p.sku}
                    </td>

                    {/* Name */}
                    <td className="px-5 py-3 font-semibold text-slate-100 max-w-xs truncate">
                      {p.name}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3 text-slate-400">
                      {(p.categories && p.categories.length > 0) ? p.categories.join(', ') : 'General'}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          p.stock > 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {p.stock} uds.
                      </span>
                    </td>

                    {/* Price Wholesale */}
                    <td className="px-5 py-3 text-right font-bold text-white">
                      ${p.price.toFixed(2)}
                    </td>

                    {/* PVP Suggested */}
                    <td className="px-5 py-3 text-right text-slate-400 font-medium">
                      {p.priceSuggested ? `$${p.priceSuggested.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Stats */}
        <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos</span>
          <span className="hidden sm:inline">Imperio Import R&C Control Panel</span>
        </div>
      </div>
    </div>
  )
}
