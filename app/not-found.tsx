import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display text-6xl font-bold text-gold-400 mb-4">404</h1>
      <p className="text-gray-400 text-lg mb-6">Producto o pagina no encontrada</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-imperial-black px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </Link>
    </div>
  )
}
