'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import {
  getDashboardStats,
  getAllProducts,
  getCategories
} from '@/lib/products'
import { generateProductsPDF } from '@/lib/pdf-generator'
import {
  Package,
  Boxes,
  DollarSign,
  TrendingUp,
  Tags,
  AlertTriangle,
  FileDown,
  Send,
  CheckCircle2,
  ImageOff,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react'

export default function AdminDashboardPage() {
  const stats = useMemo(() => getDashboardStats(), [])
  const products = useMemo(() => getAllProducts(), [])
  const categories = useMemo(() => getCategories(), [])

  // Productos con stock bajo (<= 3 o sin stock)
  const lowStockProducts = useMemo(() => {
    return products
      .filter((p) => p.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6)
  }, [products])

  const handleDownloadPDF = async () => {
    await generateProductsPDF(products, 'Todos los Productos')
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with welcome & quick actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Dashboard General <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Resumen en tiempo real del inventario, catálogo y publicaciones de Imperio Import.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs md:text-sm border border-slate-700 shadow-md hover:shadow-lg transition-all"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
            Descargar PDF Catálogo
          </button>

          <Link
            href="/admin/telegram"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs md:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all"
          >
            <Send className="w-4 h-4" />
            Publicar en Telegram
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Productos</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{stats.totalProducts}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {stats.withImageCount} con imagen
            </div>
          </div>
        </div>

        {/* In Stock */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Disponibles</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{stats.inStockProducts}</div>
            <div className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {stats.outOfStockProducts} agotados
            </div>
          </div>
        </div>

        {/* Total Units */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Total</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{stats.totalStockUnits.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400 mt-1">Unidades en depósito</div>
          </div>
        </div>

        {/* Wholesale Value */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor Mayorista</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-400">
              ${stats.inventoryValueWholesale.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Costo total inventario</div>
          </div>
        </div>

        {/* PVP Value */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-violet-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor PVP</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-violet-400">
              ${stats.inventoryValuePvp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Estimado a precio público</div>
          </div>
        </div>

        {/* Categories */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categorías</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Tags className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white">{stats.totalCategories}</div>
            <div className="text-[11px] text-slate-400 mt-1">Líneas activas</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Category Distribution + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Breakdown (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Tags className="w-5 h-5 text-amber-400" />
                Distribución por Categorías
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Top líneas con mayor volumen de productos</p>
            </div>
            <Link
              href="/admin/productos"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {categories.slice(0, 6).map((cat) => {
              const percentage = Math.round((cat.count / stats.totalProducts) * 100)
              return (
                <div key={cat.slug} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{cat.name}</span>
                    <span className="text-slate-400">
                      <strong className="text-amber-400">{cat.count}</strong> productos ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Alertas de Stock Bajo
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Productos críticos o agotados</p>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id || p.sku}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between gap-3 hover:border-slate-600 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{p.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      p.stock === 0
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {p.stock === 0 ? 'Agotado' : `${p.stock} uds.`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
