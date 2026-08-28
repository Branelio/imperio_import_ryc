import { Suspense } from 'react'
import ProductosContent from './ProductosContent'

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8">
          <div className="h-10 w-64 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div className="aspect-square" style={{ backgroundColor: 'var(--bg-input)' }} />
              <div className="p-3.5">
                <div className="h-3 w-16 rounded mb-2" style={{ backgroundColor: 'var(--bg-input)' }} />
                <div className="h-4 w-full rounded mb-2" style={{ backgroundColor: 'var(--bg-input)' }} />
                <div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--gold-bg)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductosContent />
    </Suspense>
  )
}
