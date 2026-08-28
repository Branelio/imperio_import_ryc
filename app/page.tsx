import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Star, Globe, Package, Clock, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { getFeaturedProducts, getCategories, getNewProducts } from '@/lib/products'

const categoryIcons: Record<string, string> = {
  Tecnologia: '💻',
  Hogar: '🏠',
  Moda: '👗',
  Vehiculos: '🚗',
  Salud: '💊',
  Deportes: '⚽',
  Bebes: '👶',
  Mascotas: '🐾',
  Belleza: '✨',
  Ropa: '👕',
}

export default function HomePage() {
  const featured = getFeaturedProducts()
  const newProducts = getNewProducts()
  const categories = getCategories()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center hero-pattern overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'var(--gold-bg)' }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(139,0,0,0.04)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 animate-fade-in-up"
                style={{ backgroundColor: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}>
                <Globe size={14} style={{ color: 'var(--gold)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>Importamos de Mexico, China y Colombia</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-gold-gradient">IMPERIO</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>IMPORT RyC</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed animate-fade-in-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.2s' }}>
                Productos de calidad importados directamente para ti.
                <span className="font-medium" style={{ color: 'var(--gold)' }}> Calidad, Confianza, Compromiso.</span>
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link href="/productos" className="btn-primary">
                  Ver Catalogo
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/593959883921?text=Hola,%20quiero%20informacion%20sobre%20sus%20productos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ borderColor: 'var(--green)', color: 'var(--green)' }}
                >
                  Escribenos al WhatsApp
                </a>
              </div>
            </div>

            {/* Right Logo Banner Emblem */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden border-2 border-[var(--gold-border)] shadow-2xl group transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/logo.jpg"
                  alt="Imperio Import RyC Logo Oficial"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Envios', sub: 'Todo Ecuador' },
              { icon: Shield, label: 'Garantia', sub: 'Por defecto de fabrica' },
              { icon: Star, label: 'Calidad', sub: '93% entregas exitosas' },
              { icon: Clock, label: 'Rapidez', sub: 'Despacho en 7 horas' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: 'var(--gold-bg)' }}>
                  <item.icon size={20} style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Nuestras <span style={{ color: 'var(--gold)' }}>Categorias</span>
            </h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>Encuentra lo que buscas</p>
          </div>
          <Link href="/productos" className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--gold)' }}>
            Ver todo <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger-children">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/productos?cat=${cat.name}`}
              className="card group p-5 text-center hover:border-[var(--gold-border)] transition-all"
            >
              <span className="text-3xl block mb-3">{categoryIcons[cat.name] || '📦'}</span>
              <p className="text-sm font-medium transition-colors group-hover:text-[var(--gold)]" style={{ color: 'var(--text-primary)' }}>
                {cat.name}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{cat.count} productos</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Productos <span style={{ color: 'var(--gold)' }}>Destacados</span>
            </h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>Los mas populares de nuestro catalogo</p>
          </div>
          <Link href="/productos" className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--gold)]"
            style={{ color: 'var(--gold)' }}>
            Ver todo <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--gold)' }}>Nuevos</span> Productos
              </h2>
              <p className="text-sm mt-1.5" style={{ color: 'var(--text-tertiary)' }}>Lo ultimo que llego a nuestro catalogo</p>
            </div>
            <Link href="/productos" className="hidden sm:flex items-center gap-1 text-sm font-medium transition-colors hover:text-[var(--gold)]"
              style={{ color: 'var(--gold)' }}>
              Ver todo <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="card-flat p-10 md:p-14 text-center relative overflow-hidden">
          {/* Subtle bg glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl" style={{ backgroundColor: 'var(--gold-bg)' }} />
          </div>
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              &iquest;Listo para comprar?
            </h2>
            <p className="max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
              Escribenos por WhatsApp y te atendemos al instante. Pedidos, cotizaciones y consultas.
            </p>
            <a
              href="https://wa.me/593959883921?text=Hola,%20quiero%20hacer%20un%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all"
              style={{ backgroundColor: 'var(--green)', color: '#fff' }}
            >
              <Package size={18} />
              Contactar ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
