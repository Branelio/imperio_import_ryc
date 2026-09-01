'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, Facebook, Instagram } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="border-t transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}>
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--gold)]/40 shrink-0 shadow-md">
                <Image src="/logo.jpg" alt="Imperio Import RyC Logo" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--gold)' }}>IMPERIO</h3>
                <p className="text-[10px] tracking-[0.2em] font-medium" style={{ color: 'var(--text-tertiary)' }}>IMPORT RyC</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
              Importadora de confianza en Ecuador. Productos de calidad importados de Mexico, China y Colombia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-[var(--gold-bg)]"
                style={{ color: 'var(--gold)' }}>
                <Facebook size={17} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-[var(--gold-bg)]"
                style={{ color: 'var(--gold)' }}>
                <Instagram size={17} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--gold)' }}>Navegacion</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Inicio</Link></li>
              <li><Link href="/productos" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Catálogo completo</Link></li>
              <li><Link href="/ubicacion" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Encuéntranos / Ubicación</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--gold)' }}>Categorias</h4>
            <ul className="space-y-2.5">
              <li><Link href="/productos?cat=Tecnologia" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Tecnologia</Link></li>
              <li><Link href="/productos?cat=Hogar" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Hogar</Link></li>
              <li><Link href="/productos?cat=Vehiculos" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Vehiculos</Link></li>
              <li><Link href="/productos?cat=Salud" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Salud y Belleza</Link></li>
              <li><Link href="/productos?cat=Deportes" className="text-sm transition-colors hover:text-[var(--gold)]" style={{ color: 'var(--text-secondary)' }}>Deportes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--gold)' }}>Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>0959883921</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>WhatsApp disponible</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ecuador</p>
              </li>
            </ul>
            <a
              href="https://wa.me/593959883921?text=Hola,%20quiero%20informacion%20sobre%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--green)', color: '#fff' }}
            >
              <Phone size={15} />
              Escribenos
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            &copy; 2026 Imperio Import RyC. Todos los derechos reservados.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Calidad &middot; Confianza &middot; Compromiso
          </p>
        </div>
      </div>
    </footer>
  )
}
