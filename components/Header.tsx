'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Phone, Sun, Moon, Lock } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, toggle } = useTheme()

  if (pathname?.startsWith('/admin')) {
    return null
  }


  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/productos', label: 'Catálogo' },
    { href: '/ubicacion', label: 'Encuéntranos' },
  ]

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
        borderColor: 'var(--border-default)',
      }}
    >
      {/* Top bar */}
      <div
        className="text-xs py-1.5 transition-colors duration-300"
        style={{ backgroundColor: 'var(--red)', color: '#fff' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Envios a todo el Ecuador</span>
            <span className="hidden md:inline opacity-40">|</span>
            <span className="hidden md:inline">Importamos de Mexico, China, Colombia</span>
          </div>
          <a
            href="https://wa.me/593959883921"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Phone size={12} />
            <span>0959883921</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full overflow-hidden border border-[var(--gold)]/40 transition-transform group-hover:scale-105 shrink-0 shadow-md">
              <Image src="/logo.jpg" alt="Imperio Import RyC Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-display text-base sm:text-lg md:text-xl font-bold leading-tight"
                style={{ color: 'var(--gold)' }}
              >
                IMPERIO
              </h1>
              <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.18em] font-medium"
                style={{ color: 'var(--text-tertiary)' }}
              >
                IMPORT RyC
              </p>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 py-2.5"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--gold-bg)]"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[var(--gold-bg)]"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Login Link */}
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-[var(--gold)]/30 hover:border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-bg)]"
              title="Panel de Administración"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acceso Admin</span>
            </Link>

            {/* WhatsApp */}
            <a
              href="https://wa.me/593959883921?text=Hola,%20quiero%20informacion%20sobre%20sus%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: 'var(--green)', color: '#fff' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--green-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--green)')}
            >
              <Phone size={15} />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[var(--gold-bg)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t animate-slide-down" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-secondary)' }}>
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="py-3 px-4 rounded-xl text-sm font-medium transition-all hover:bg-[var(--gold-bg)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl mt-2 text-sm font-semibold border border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold-bg)] transition-all"
            >
              <Lock className="w-4 h-4" />
              Acceso Panel Admin
            </Link>
            <a
              href="https://wa.me/593959883921?text=Hola,%20quiero%20informacion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: 'var(--green)', color: '#fff' }}
            >
              <Phone size={16} />
              Contactar por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
