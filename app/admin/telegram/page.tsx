'use client'

import React, { useState } from 'react'
import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Radio
} from 'lucide-react'

export default function AdminTelegramPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [outputLog, setOutputLog] = useState('')

  const handlePublish = async (testMode: boolean) => {
    setLoading(true)
    setStatus('running')
    setMessage(testMode ? 'Publicando 1 producto de prueba...' : 'Iniciando publicación de todo el catálogo...')
    setOutputLog(testMode ? '> python scripts/publish_catalog.py --test\n...' : '> python scripts/publish_catalog.py\n...')

    try {
      const res = await fetch('/api/telegram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testMode }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setOutputLog(data.output || 'Finalizado sin salida adicional.')
      } else {
        setStatus('error')
        setMessage(data.message || 'Ocurrió un error durante la ejecución.')
        setOutputLog(data.output || 'No se recibió detalle del error.')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err?.message || 'Error de conexión con el servidor.')
      setOutputLog(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Telegram Broadcast Center <Send className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Transmití productos de tu tienda directo al canal oficial de Telegram.
          </p>
        </div>

        <a
          href="https://t.me/imporimperioshort"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs md:text-sm border border-slate-700/80 shadow-md transition-all self-start md:self-auto"
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          Abrir Canal @imporimperioshort
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Info Card Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Automatización Integrada
            </div>
            <h2 className="text-lg font-bold text-white">Canal Objetivo: Impor Imperio Short🗡️</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cada publicación envía la foto formateada del producto con su SKU, categoría, precio mayorista, PVP sugerido, stock disponible y descripción limpia.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
            <button
              onClick={() => handlePublish(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs md:text-sm border border-slate-700/80 shadow-lg disabled:opacity-50 transition-all"
            >
              {loading && status === 'running' ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <Zap className="w-4 h-4 text-amber-400" />
              )}
              Probar Envío (1 Producto)
            </button>

            <button
              onClick={() => handlePublish(false)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs md:text-sm shadow-xl shadow-amber-500/25 disabled:opacity-50 transition-all"
            >
              {loading && status === 'running' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Publicar Catálogo Completo
            </button>
          </div>
        </div>
      </div>

      {/* Execution Console Output */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <Terminal className="w-4 h-4 text-amber-400" />
            Consola de Ejecución Telegram API
          </div>

          {status === 'running' && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Procesando envíos...
            </span>
          )}
          {status === 'success' && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Éxito
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> Error
            </span>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              status === 'error'
                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                : status === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-slate-800/80 text-amber-300 border border-amber-500/20'
            }`}
          >
            {message}
          </div>
        )}

        <pre className="p-4 rounded-xl bg-slate-900/90 text-slate-300 font-mono text-xs overflow-x-auto min-h-[160px] max-h-[380px] leading-relaxed border border-slate-800/80 whitespace-pre-wrap">
          {outputLog || '// Los registros de envío a Telegram aparecerán acá al ejecutar una prueba o publicación.'}
        </pre>
      </div>
    </div>
  )
}
