'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getAllProducts } from '@/lib/products'
import { generateProductsPDF } from '@/lib/pdf-generator'
import type { Product, Category } from '@/lib/types'
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
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Tag,
  Warehouse,
  FileText
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

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))

      const matchesCategory =
        selectedCategory === 'ALL' ||
        p.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())

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

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}" (${product.sku})? Esta acción no se puede deshacer.`)) {
      return
    }

    setDeletingId(product.id)
    try {
      const res = await fetch(`/api/admin/productos?id=${product.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.success) {
        setProducts(prev => prev.filter(p => p.id !== product.id))
        setToastMsg({ type: 'success', text: `Producto "${product.name}" eliminado correctamente.` })
      } else {
        throw new Error(data.message || 'Error al eliminar.')
      }
    } catch (err: any) {
      setToastMsg({ type: 'error', text: err.message || 'No se pudo eliminar el producto.' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-semibold animate-bounce ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
              : 'bg-rose-950 text-rose-300 border-rose-500/50'
          }`}
        >
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Gestión de Productos & Catálogo PDF <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explorá, editá, filtrá, agregá y exportá en PDF los {products.length} productos de tu tienda.
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
                <th className="px-5 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
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

                    {/* Actions */}
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                          title="Editar producto"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={deletingId === p.id}
                          onClick={() => handleDeleteProduct(p)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          title="Eliminar producto"
                        >
                          {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          allCategories={categories.map(c => c.name)}
          onClose={() => setEditingProduct(null)}
          onSaved={(updatedProduct) => {
            setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)))
            setEditingProduct(null)
            setToastMsg({ type: 'success', text: `Producto "${updatedProduct.name}" actualizado correctamente.` })
          }}
        />
      )}
    </div>
  )
}

// Modal Component for Editing Product
function EditProductModal({
  product,
  allCategories,
  onClose,
  onSaved,
}: {
  product: Product
  allCategories: string[]
  onClose: () => void
  onSaved: (p: Product) => void
}) {
  const [name, setName] = useState(product.name)
  const [sku, setSku] = useState(product.sku)
  const [stock, setStock] = useState<number | ''>(product.stock)
  const [price, setPrice] = useState<number | ''>(product.price)
  const [priceSuggested, setPriceSuggested] = useState<number | ''>(product.priceSuggested || '')
  const [description, setDescription] = useState(product.description || '')
  const [inBodega, setInBodega] = useState(product.inBodega || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(product.categories || [])
  const [images, setImages] = useState<string[]>(product.images && product.images.length > 0 ? product.images : [''])
  const [newCatInput, setNewCatInput] = useState('')

  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleAddCategory = () => {
    const trimmed = newCatInput.trim()
    if (!trimmed) return
    if (!selectedCategories.includes(trimmed)) {
      setSelectedCategories(prev => [...prev, trimmed])
    }
    setNewCatInput('')
  }

  const handleImageChange = (index: number, val: string) => {
    setImages(prev => {
      const copy = [...prev]
      copy[index] = val
      return copy
    })
  }

  const handleAddImageField = () => {
    setImages(prev => [...prev, ''])
  }

  const handleRemoveImageField = (index: number) => {
    setImages(prev => (prev.length === 1 ? [''] : prev.filter((_, i) => i !== index)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('El nombre es obligatorio.')
      setSaving(false)
      return
    }

    const filteredImages = images.map(img => img.trim()).filter(img => img !== '')

    const payload = {
      id: product.id,
      sku: sku.trim(),
      name: name.trim(),
      stock: Number(stock),
      price: Number(price),
      priceSuggested: priceSuggested !== '' ? Number(priceSuggested) : Number(price),
      description: description.trim(),
      inBodega: inBodega.trim() || null,
      categories: selectedCategories.length > 0 ? selectedCategories : ['General'],
      images: filteredImages,
    }

    try {
      const res = await fetch('/api/admin/productos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al guardar los cambios.')
      }

      onSaved(data.product)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-scaleIn">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Editar Producto (#{product.id})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Producto</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stock (Unidades)</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Wholesale Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Mayorista ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* PVP Suggested */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">PVP Sugerido ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={priceSuggested}
                onChange={e => setPriceSuggested(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Ubicación Bodega */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5 text-slate-400" /> Bodega / Ubicación
              </label>
              <input
                type="text"
                placeholder="ej. IMPERIO BODEGA MAYORISTA"
                value={inBodega}
                onChange={e => setInBodega(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Categorías</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {allCategories.map(cat => {
                const isSel = selectedCategories.includes(cat)
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isSel
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSel ? '✓ ' : '+ '}
                    {cat}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Nueva categoría..."
                value={newCatInput}
                onChange={e => setNewCatInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700"
              >
                + Agregar
              </button>
            </div>
          </div>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Imágenes (URLs)</label>
              <button
                type="button"
                onClick={handleAddImageField}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" /> Añadir URL
              </button>
            </div>
            <div className="space-y-2">
              {images.map((imgUrl, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 shrink-0 overflow-hidden flex items-center justify-center">
                    {imgUrl.trim() ? (
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imgUrl}
                    onChange={e => handleImageChange(i, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageField(i)}
                      className="p-1.5 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <CheckCircle2 className="w-4 h-4" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
