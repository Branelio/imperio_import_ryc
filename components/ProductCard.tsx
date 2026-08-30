'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images[0] || null
  const hasDiscount = product.priceSuggested > product.price && product.priceSuggested > 0

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="product-card group block rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--bg-input)' }}>
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="product-card-img w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} style={{ color: 'var(--text-tertiary)' }} />
          </div>
        )}

        {/* Badges - top left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isDropi && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: 'var(--blue)', color: '#fff' }}>
              Dropi
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'var(--red)', color: '#fff' }}>
              OFERTA
            </span>
          )}
        </div>

        {/* Stock badge - top right */}
        {product.stock > 0 ? (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(22,163,74,0.2)' }}>
            En stock
          </span>
        ) : (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-tertiary)', border: '1px solid var(--border-default)' }}>
            Agotado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md"
              style={{ color: 'var(--gold)', backgroundColor: 'var(--gold-bg)' }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium line-clamp-2 mb-2.5 min-h-[40px] transition-colors group-hover:text-[var(--gold)]"
          style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: 'var(--gold)' }}>
            ${product.price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs line-through" style={{ color: 'var(--text-tertiary)' }}>
              ${product.priceSuggested.toFixed(2)}
            </span>
          )}
        </div>

        {/* Bodega */}
        {product.inBodega && (
          <p className="text-[10px] mt-2 font-medium tracking-wide uppercase" style={{ color: 'var(--text-tertiary)' }}>
            {product.inBodega.replace(/RUBY/gi, 'IMPERIO')}
          </p>
        )}
      </div>
    </Link>
  )
}
