'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Send,
  ArrowLeft,
  Crown,
  Sparkles,
  Menu,
  X,
  Truck,
  LogOut
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Si estamos en la página de login, no validar auth
    if (pathname === '/admin/login') {
      setAuthenticated(true)
      return
    }

    // Comprobar autenticación en cliente
    const isAuthCookie = typeof document !== 'undefined' && document.cookie.includes('admin_auth=true')
    const isAuthStorage = typeof window !== 'undefined' && localStorage.getItem('admin_auth') === 'true'

    if (isAuthCookie || isAuthStorage) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
      router.push('/admin/login')
    }
  }, [pathname, router])

  const handleLogout = () => {
    document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  // Si estamos en /admin/login, renderizar directamente los hijos sin el sidebar del Admin
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Mientras valida la sesión
  if (authenticated === null || authenticated === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans text-xs">
        Verificando credenciales de administración...
      </div>
    )
  }

  const navItems = [
    {
      label: 'Dashboard Overview',
      href: '/admin',
      icon: LayoutDashboard,
      description: 'Métricas clave e inventario'
    },
    {
      label: 'Catálogo & Exportar PDF',
      href: '/admin/productos',
      icon: Package,
      description: 'Gestión de productos y descargas'
    },
    {
      label: 'Manifiestos Couriers',
      href: '/admin/manifiestos',
      icon: Truck,
      description: 'Manifiestos de despacho Dropi'
    },
    {
      label: 'Telegram Broadcast',
      href: '/admin/telegram',
      icon: Send,
      description: 'Publicación directa al canal'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-slate-100">IMPERIO IMPORT</span>
            <span className="text-[10px] block font-medium text-amber-400 -mt-1">ADMIN CONTROL</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-72 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between p-5 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                IMPERIO IMPORT
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <Sparkles className="w-3 h-3 animate-pulse" /> Panel de Control
              </div>
            </div>
          </div>

          <hr className="border-slate-800/60" />

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">{item.label}</div>
                    <div className="text-[11px] text-slate-500 group-hover:text-slate-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Back to Catalog & Logout */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 text-xs font-semibold transition-all group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver a la Tienda Pública
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>

          <div className="text-center text-[10px] text-slate-600 font-mono">
            Imperio Import R&C v1.0 • Admin Mode
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
