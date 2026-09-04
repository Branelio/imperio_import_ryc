import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, Truck, Shield, Phone, ChevronRight } from 'lucide-react'
import { getProductBySlug, getAllProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import ProductGallery from '@/components/ProductGallery'
import PixelProductTracker from '@/components/PixelProductTracker'
import WhatsAppBuyButton from '@/components/WhatsAppBuyButton'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado' }
  return {
    title: `${product.name} | Imperio Import RyC`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const related = getAllProducts()
    .filter(p => p.id !== product.id && p.categories.some(c => product.categories.includes(c)))
    .slice(0, 4)

  const hasDiscount = product.priceSuggested > product.price && product.priceSuggested > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <PixelProductTracker product={product} />
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-tertiary)' }}>Inicio</Link>
        <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
        <Link href="/productos" className="transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-tertiary)' }}>Catalogo</Link>
        <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
        <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Images */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div>
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.categories.map((cat) => (
              <Link
                key={cat}
                href={`/productos?cat=${cat}`}
                className="text-xs font-medium px-3 py-1 rounded-full transition-all hover:bg-[var(--gold-bg)]"
                style={{ color: 'var(--gold)', backgroundColor: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Name */}
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
            {product.name}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.isDropi && (
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--blue-bg)', color: 'var(--blue)', border: '1px solid rgba(37,99,235,0.2)' }}>
                PRODUCTO DROPI
              </span>
            )}
            {product.stock > 0 ? (
              <span className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)', border: '1px solid rgba(22,163,74,0.2)' }}>
                En stock ({product.stock} unidades)
              </span>
            ) : (
              <span className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-tertiary)', border: '1px solid var(--border-default)' }}>
                Agotado
              </span>
            )}
          </div>

          {/* Price card */}
          <div className="card-flat p-6 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--gold)' }}>
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg line-through" style={{ color: 'var(--text-tertiary)' }}>
                  ${product.priceSuggested.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Precio en USD</p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <WhatsAppBuyButton product={product} />
              <a
                href={`https://wa.me/593959883921?text=Hola,%20tengo%20una%20duda%20sobre%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 btn-secondary"
              >
                Tengo una duda
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, label: 'Envio', sub: 'A todo Ecuador' },
              { icon: Shield, label: 'Garantia', sub: 'Defecto de fabrica' },
              { icon: Package, label: 'Despacho', sub: '7 horas' },
            ].map((item) => (
              <div key={item.label} className="card-flat flex items-center gap-3 p-3.5">
                <item.icon size={18} className="shrink-0" style={{ color: 'var(--gold)' }} />
                <div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          {product.description && (
            <div className="card-flat p-6">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Descripcion</h3>
              <div
                className="prose-custom"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* SKU */}
          <div className="mt-5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            SKU: {product.sku}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="font-display text-2xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Productos <span style={{ color: 'var(--gold)' }}>relacionados</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
