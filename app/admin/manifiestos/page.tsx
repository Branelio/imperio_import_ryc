'use client'

import React, { useState, useMemo } from 'react'
import { parseDropiCSV, DropiOrder } from '@/lib/dropi-parser'
import { generateManifestPDF } from '@/lib/manifest-pdf'
import {
  FileSpreadsheet,
  Upload,
  FileDown,
  Search,
  CheckSquare,
  Square,
  Truck,
  Filter,
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

// Default user Google Sheet link
const DEFAULT_DRIVE_URL = 'https://docs.google.com/spreadsheets/d/1jxI6QVim5wLNI7WkcVISPL4JBNuAtd7v3U9DWdPyvn0/edit?usp=sharing'

export default function AdminManifiestosPage() {
  const [orders, setOrders] = useState<DropiOrder[]>([])
  const [selectedCourier, setSelectedCourier] = useState<string>('ALL')
  const [search, setSearch] = useState<string>('')
  const [selectedGuiaIds, setSelectedGuiaIds] = useState<Set<string>>(new Set())
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Drive integration state
  const [driveUrl, setDriveUrl] = useState<string>(DEFAULT_DRIVE_URL)
  const [loadingDrive, setLoadingDrive] = useState<boolean>(false)
  const [driveError, setDriveError] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  // Fetch live CSV from Google Sheet URL
  const handleFetchDriveSheet = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || driveUrl
    if (!targetUrl) return

    setLoadingDrive(true)
    setDriveError(null)

    try {
      const res = await fetch('/api/admin/drive-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: targetUrl }),
      })

      const data = await res.json()

      if (data.success && data.csvText) {
        const parsed = parseDropiCSV(data.csvText)
        setOrders(parsed)
        setSelectedGuiaIds(new Set(parsed.map((o) => o.numeroGuia)))
        setLastSyncTime(new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      } else {
        setDriveError(data.message || 'No se pudo obtener la información de Google Drive.')
      }
    } catch (err: any) {
      setDriveError(err?.message || 'Error de conexión al obtener datos de Google Drive.')
    } finally {
      setLoadingDrive(false)
    }
  }

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const parsed = parseDropiCSV(content)
        setOrders(parsed)
        setSelectedGuiaIds(new Set(parsed.map((o) => o.numeroGuia)))
        setLastSyncTime(`Archivo local (${file.name})`)
      }
    }
    reader.readAsText(file, 'UTF-8')
  }

  // Couriers list
  const couriers = useMemo(() => {
    const set = new Set<string>()
    orders.forEach((o) => {
      if (o.transportadora) set.add(o.transportadora)
    })
    return Array.from(set).sort()
  }, [orders])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        o.numeroGuia.toLowerCase().includes(q) ||
        o.cliente.toLowerCase().includes(q) ||
        o.ciudad.toLowerCase().includes(q) ||
        o.producto.toLowerCase().includes(q) ||
        o.sku.toLowerCase().includes(q)

      const matchesCourier =
        selectedCourier === 'ALL' || o.transportadora === selectedCourier

      const matchesStatus =
        statusFilter === 'ALL' || o.estatus.toUpperCase() === statusFilter.toUpperCase()

      return matchesSearch && matchesCourier && matchesStatus
    })
  }, [orders, search, selectedCourier, statusFilter])

  // Toggle selection
  const toggleSelectGuia = (guia: string) => {
    const next = new Set(selectedGuiaIds)
    if (next.has(guia)) {
      next.delete(guia)
    } else {
      next.add(guia)
    }
    setSelectedGuiaIds(next)
  }

  const toggleSelectAll = () => {
    const currentFilteredGuias = filteredOrders.map((o) => o.numeroGuia)
    const allSelected = currentFilteredGuias.every((g) => selectedGuiaIds.has(g))

    const next = new Set(selectedGuiaIds)
    if (allSelected) {
      currentFilteredGuias.forEach((g) => next.delete(g))
    } else {
      currentFilteredGuias.forEach((g) => next.add(g))
    }
    setSelectedGuiaIds(next)
  }

  // Generate PDF Manifest
  const handleGeneratePDF = async () => {
    const selectedOrdersList = filteredOrders.filter((o) => selectedGuiaIds.has(o.numeroGuia))

    if (selectedOrdersList.length === 0) {
      alert('Por favor seleccioná al menos una guía para generar el manifiesto.')
      return
    }

    const courierLabel = selectedCourier === 'ALL' ? 'Servientrega / Varios' : selectedCourier
    const nowStr = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const manifestNo = `MAN-${nowStr}-${courierLabel.slice(0, 4)}`

    await generateManifestPDF(selectedOrdersList, courierLabel, manifestNo)
  }

  const selectedCount = useMemo(() => {
    return filteredOrders.filter((o) => selectedGuiaIds.has(o.numeroGuia)).length
  }, [filteredOrders, selectedGuiaIds])

  const selectedTotalRecaudo = useMemo(() => {
    return filteredOrders
      .filter((o) => selectedGuiaIds.has(o.numeroGuia))
      .reduce((acc, o) => acc + (o.totalOrden || 0), 0)
  }, [filteredOrders, selectedGuiaIds])

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Manifiestos de Entrega Couriers <Truck className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conexión directa con tu Google Sheet de Dropi para generar manifiestos de despacho para Servientrega, LaarCourier, etc.
          </p>
        </div>

        {orders.length > 0 && lastSyncTime && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 self-start md:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sincronizado: {lastSyncTime}
          </div>
        )}
      </div>

      {/* Google Drive Link Integration Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-amber-400" />
            Enlace de Google Sheet (Drive)
          </label>
          <a
            href={driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            Abrir en Google Drive <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/.../edit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 text-xs md:text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors"
          />

          <button
            onClick={() => handleFetchDriveSheet()}
            disabled={loadingDrive || !driveUrl}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all shrink-0"
          >
            {loadingDrive ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <RefreshCw className="w-4 h-4 text-slate-950" />
            )}
            Conectar & Cargar Google Sheet
          </button>
        </div>

        {driveError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            {driveError}
          </div>
        )}
      </div>

      {/* Upload Dropzone Backup / Empty State */}
      {orders.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/90 border-2 border-dashed border-slate-700/80 hover:border-amber-500/60 transition-colors text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">¿Tenés un archivo CSV de Dropi descargado?</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Hacé clic en <strong>"Conectar & Cargar Google Sheet"</strong> arriba para obtener los datos en vivo de tu hoja de Drive, o seleccioná un archivo CSV local.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs md:text-sm border border-slate-700 shadow-md transition-all">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              Seleccionar archivo CSV Local
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        /* Active Orders Workspace */
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm">
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Órdenes Cargadas</span>
                <strong className="text-white text-lg font-black">{orders.length}</strong>
              </div>
              <div className="w-px h-8 bg-slate-800 hidden sm:block" />
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Guías Seleccionadas</span>
                <strong className="text-amber-400 text-lg font-black">{selectedCount}</strong>
              </div>
              <div className="w-px h-8 bg-slate-800 hidden sm:block" />
              <div>
                <span className="text-slate-400 block text-[11px] font-semibold uppercase">Total Recaudo</span>
                <strong className="text-emerald-400 text-lg font-black">
                  ${selectedTotalRecaudo.toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => handleFetchDriveSheet()}
                disabled={loadingDrive}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-slate-700/80 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDrive ? 'animate-spin' : ''}`} />
                Re-sincronizar Drive
              </button>

              <button
                onClick={handleGeneratePDF}
                disabled={selectedCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs md:text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
              >
                <FileDown className="w-4 h-4" />
                Generar Manifiesto PDF ({selectedCount})
              </button>
            </div>
          </div>

          {/* Courier Selector Tabs & Filters */}
          <div className="space-y-4">
            {/* Courier Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setSelectedCourier('ALL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${
                  selectedCourier === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Truck className="w-4 h-4" />
                Todas las Transportadoras ({orders.length})
              </button>

              {couriers.map((courier) => {
                const count = orders.filter((o) => o.transportadora === courier).length
                const isActive = selectedCourier === courier

                return (
                  <button
                    key={courier}
                    onClick={() => setSelectedCourier(courier)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs md:text-sm transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {courier} ({count})
                  </button>
                )
              })}
            </div>

            {/* Search & Status Filters Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por guía, cliente, ciudad, SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-100 placeholder:text-slate-500 text-xs md:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs md:text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ALL">Todos los Estados</option>
                  <option value="GUIA_GENERADA">Guía Generada</option>
                  <option value="POR RECOLECTAR">Por Recolectar</option>
                  <option value="EN DISTRIBUCION">En Distribución</option>
                  <option value="CANCELADO">Cancelados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Checkbox Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="text-amber-400 hover:text-amber-300 transition-colors"
                        title="Seleccionar / Desmarcar todos"
                      >
                        {filteredOrders.length > 0 &&
                        filteredOrders.every((o) => selectedGuiaIds.has(o.numeroGuia)) ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3.5">N° Guía</th>
                    <th className="px-4 py-3.5">Transportadora</th>
                    <th className="px-4 py-3.5">Cliente Destinatario</th>
                    <th className="px-4 py-3.5">Destino</th>
                    <th className="px-4 py-3.5">Producto</th>
                    <th className="px-4 py-3.5 text-center">Estatus</th>
                    <th className="px-4 py-3.5 text-right">Recaudo ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                        No se encontraron guías para los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => {
                      const isSelected = selectedGuiaIds.has(o.numeroGuia)

                      return (
                        <tr
                          key={o.numeroGuia || o.id}
                          onClick={() => toggleSelectGuia(o.numeroGuia)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-amber-500/10 hover:bg-amber-500/15' : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleSelectGuia(o.numeroGuia)}
                              className="text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                            </button>
                          </td>

                          <td className="px-4 py-3 font-mono font-bold text-amber-400">
                            {o.numeroGuia}
                          </td>

                          <td className="px-4 py-3 font-bold text-slate-200">
                            {o.transportadora}
                          </td>

                          <td className="px-4 py-3 font-semibold text-slate-100">
                            <div>{o.cliente}</div>
                            {o.telefono && <span className="text-[10px] text-slate-400 font-mono">{o.telefono}</span>}
                          </td>

                          <td className="px-4 py-3 text-slate-300">
                            <div>{o.ciudad}</div>
                            <span className="text-[10px] text-slate-500">{o.departamento}</span>
                          </td>

                          <td className="px-4 py-3 text-slate-300 max-w-xs truncate">
                            {o.producto} <span className="text-amber-400 font-bold">(x{o.cantidad})</span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                o.estatus === 'GUIA_GENERADA' || o.estatus === 'POR RECOLECTAR'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : o.estatus === 'CANCELADO'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {o.estatus}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-right font-black text-white">
                            ${o.totalOrden.toFixed(2)}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Mostrando <strong>{filteredOrders.length}</strong> guías ({selectedCount} seleccionadas para manifiesto)
              </span>
              <span className="font-mono">Imperio Import R&C Logística</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
