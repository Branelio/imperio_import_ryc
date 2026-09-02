'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCategories } from '@/lib/products'
import type { Category } from '@/lib/types'
import {
  ArrowLeft,
  PackagePlus,
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Boxes,
  Tag,
  Warehouse,
  FileText,
  RefreshCw,
  Eye
} from 'lucide-react'

export default function AdminNuevoProductoPage() {
  const router = useRouter()

  // Form State
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState('simple')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState<number | ''>(10)
  const [price, setPrice] = useState<number | ''>('')
  const [priceSuggested, setPriceSuggested] = useState<number | ''>('')
  const [inBodega, setInBodega] = useState('')
  const [approved, setApproved] = useState(true)
  const [isDropi, setIsDropi] = useState(false)
  const [images, setImages] = useState<string[]>([''])

  // Categories State
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [newCategoryInput, setNewCategoryInput] = useState('')

  // UI / Action State
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    // Load categories from existing products catalog
    const cats = getCategories()
    setAvailableCategories(cats)
  }, [])

  // Auto-generate slug when name changes (if slug hasn't been manually edited)
  const handleNameChange = (val: string) => {
    setName(val)
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    setSlug(generatedSlug)
  }

  // Quick SKU Generator
  const handleGenerateSku = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    setSku(`IMP-${randomCode}`)
  }

  // Image input handlers
  const handleAddImageField = () => {
    setImages(prev => [...prev, ''])
  }

  const handleImageChange = (index: number, value: string) => {
    setImages(prev => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const handleRemoveImageField = (index: number) => {
    setImages(prev => {
      if (prev.length === 1) return ['']
      return prev.filter((_, i) => i !== index)
    })
  }

  // Category toggle handler
  const toggleCategory = (catName: string) => {
    setSelectedCategories(prev =>
      prev.includes(catName)
        ? prev.filter(c => c !== catName)
        : [...prev, catName]
    )
  }

  const handleAddNewCategory = () => {
    const trimmed = newCategoryInput.trim()
    if (!trimmed) return
    if (!selectedCategories.includes(trimmed)) {
      setSelectedCategories(prev => [...prev, trimmed])
    }
    if (!availableCategories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setAvailableCategories(prev => [...prev, { name: trimmed, count: 0, slug: trimmed.toLowerCase().replace(/\s+/g, '-') }])
    }
    setNewCategoryInput('')
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent, createAnother: boolean = false) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    // Form validations
    if (!name.trim()) {
      setErrorMsg('Ingresá el nombre del producto.')
      setLoading(false)
      return
    }

    if (price === '' || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('Ingresá un precio mayorista válido mayor a 0.')
      setLoading(false)
      return
    }

    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0) {
      setErrorMsg('Ingresá una cantidad de stock válida.')
      setLoading(false)
      return
    }

    const filteredImages = images.map(img => img.trim()).filter(img => img !== '')

    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      slug: slug.trim(),
      type,
      description: description.trim(),
      stock: Number(stock),
      price: Number(price),
      priceSuggested: priceSuggested !== '' ? Number(priceSuggested) : Number(price),
      categories: selectedCategories.length > 0 ? selectedCategories : ['General'],
      approved,
      inBodega: inBodega.trim() || null,
      hasImage: filteredImages.length > 0,
      images: filteredImages,
      isDropi,
    }

    try {
      const res = await fetch('/api/admin/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Error al agregar el producto.')
      }

      setSuccessMsg(`¡Producto "${data.product.name}" agregado con éxito (SKU: ${data.product.sku})!`)

      if (createAnother) {
        // Reset form for next product
        setName('')
        setSku('')
        setSlug('')
        setDescription('')
        setPrice('')
        setPriceSuggested('')
        setStock(10)
        setInBodega('')
        setImages([''])
        setSelectedCategories([])
        setLoading(false)
      } else {
        // Redirect back to catalog list after short delay
        setTimeout(() => {
          router.push('/admin/productos')
        }, 1200)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Productos
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Agregar Nuevo Producto <PackagePlus className="w-7 h-7 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Completá la información para incluir un nuevo artículo en tu catálogo general.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Error al guardar</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">¡Éxito!</span>
            <span>{successMsg}</span>
          </div>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
        {/* Section 1: Información Básica */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Información Principal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nombre del Producto <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ej. Audífonos Bluetooth Pro TWS M10"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* SKU */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  SKU / Código único
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Auto-generar SKU
                </button>
              </div>
              <input
                type="text"
                placeholder="ej. IMP-1045 (se auto-genera si queda vacío)"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 font-mono placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Slug URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Slug URL (amigable para navegador)
              </label>
              <input
                type="text"
                placeholder="audifonos-bluetooth-pro-tws-m10"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Tipo de Producto */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Artículo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                <option value="simple">Simple / Estándar</option>
                <option value="variable">Variable / Con Variaciones</option>
                <option value="Físico">Físico</option>
              </select>
            </div>

            {/* Ubicación / Bodega */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Warehouse className="w-3.5 h-3.5 text-slate-400" /> Bodega / Ubicación en Almacén
              </label>
              <input
                type="text"
                placeholder="ej. Bodega Principal - Estante B3"
                value={inBodega}
                onChange={(e) => setInBodega(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Precios e Inventario */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Precios e Inventario</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Precio Mayorista */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Precio Mayorista ($ USD) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* PVP Sugerido */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                PVP Sugerido ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={priceSuggested}
                  onChange={(e) => setPriceSuggested(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stock Disponible (Unidades) <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Boxes className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 font-bold text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Categorías */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Categorías del Producto</h2>
          </div>

          <div>
            <p className="text-xs text-slate-400 mb-3">
              Seleccioná una o más categorías existentes o agregá una nueva categoría.
            </p>

            {/* Selected Categories Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {availableCategories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.name)
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:border-slate-600 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {cat.name}
                  </button>
                )
              })}
            </div>

            {/* Custom Category Input */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Nueva categoría..."
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Imágenes */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Imágenes del Producto</h2>
            </div>
            <button
              type="button"
              onClick={handleAddImageField}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Añadir Otra URL
            </button>
          </div>

          <div className="space-y-3">
            {images.map((imgUrl, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                  {imgUrl.trim() ? (
                    <img
                      src={imgUrl}
                      alt={`Vista previa ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback icon if image fails to load
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg o enlace directo de CDN / Google Drive"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(index)}
                    className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    title="Eliminar campo de imagen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Descripción y Opciones */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Descripción y Visibilidad</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Descripción Detallada del Producto
              </label>
              <textarea
                rows={4}
                placeholder="Especificaciones técnicas, detalles del empaque, características principales..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 text-xs leading-relaxed focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Checkboxes / Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={approved}
                  onChange={(e) => setApproved(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Aprobado para Catálogo Público</span>
                  <span className="text-[11px] text-slate-400">Si está activo, se mostrará a los clientes.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={isDropi}
                  onChange={(e) => setIsDropi(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Producto de Integración Dropi</span>
                  <span className="text-[11px] text-slate-400">Identifica si proviene de plataforma Dropi.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/productos"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm text-center border border-slate-700 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs sm:text-sm border border-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Guardar y Crear Otro
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <CheckCircle2 className="w-4 h-4" />}
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  )
}
