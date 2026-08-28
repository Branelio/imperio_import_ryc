import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, MessageSquare, ShieldCheck, Truck, Globe, ChevronRight, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Encuéntranos - Imperio Import RyC',
  description: 'Conoce nuestra ubicación, horarios de atención (Lunes a Viernes 9:30am a 5:00pm) y mapa de Imperio Import RyC en Ecuador.',
}

export default function UbicacionPage() {
  const mapLink = 'https://maps.app.goo.gl/nxhUdMvRFhgaRF5Y6'

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
            style={{ backgroundColor: 'var(--gold-bg)', border: '1px solid var(--gold-border)' }}>
            <MapPin size={14} style={{ color: 'var(--gold)' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--gold)' }}>
              Nuestra Ubicación & Contacto
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            ¿ Dónde <span style={{ color: 'var(--gold)' }}>Encontrarnos</span> ?
          </h1>
          <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
            Visítanos en nuestras instalaciones o contáctate directamente con nuestro equipo para envíos y entregas inmediatas.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Card 1: Ubicación */}
          <div className="card p-6 md:p-8 flex flex-col justify-between hover:border-[var(--gold-border)] transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--gold)' }}>
                <MapPin size={24} />
              </div>
              <h2 className="font-display text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Dirección Física
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Ecuador — Punto de distribución y atención al cliente. Haz clic abajo para abrir en Google Maps con el pin exacto.
              </p>
              <div className="rounded-xl p-3 text-xs flex items-center gap-2 mb-4"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}>
                <Truck size={16} className="shrink-0" style={{ color: 'var(--gold)' }} />
                <span>Despachos y envíos diarios a todo el Ecuador</span>
              </div>
            </div>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-xs font-semibold uppercase tracking-wider py-2.5 px-3.5 rounded-xl transition-all border"
              style={{ borderColor: 'var(--gold-border)', backgroundColor: 'var(--gold-bg)', color: 'var(--gold)' }}
            >
              <span className="flex items-center gap-1.5">
                <ExternalLink size={14} />
                Abrir Pin en Google Maps
              </span>
              <ChevronRight size={14} />
            </a>
          </div>

          {/* Card 2: Horarios */}
          <div className="card p-6 md:p-8 flex flex-col justify-between hover:border-[var(--gold-border)] transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--gold)' }}>
                <Clock size={24} />
              </div>
              <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Horario de Atención
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-2.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Lunes a Viernes:</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--gold)' }}>9:30 AM – 5:00 PM</span>
                </li>
                <li className="flex justify-between items-center pb-2.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sábados y Domingos:</span>
                  <span className="font-semibold text-xs" style={{ color: 'var(--text-tertiary)' }}>Atención vía WhatsApp</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t text-xs flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--green)' }} />
              <span>Atención rápida durante jornada laboral</span>
            </div>
          </div>

          {/* Card 3: Contacto Directo */}
          <div className="card p-6 md:p-8 flex flex-col justify-between hover:border-[var(--gold-border)] transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                style={{ backgroundColor: 'var(--green-bg)', color: 'var(--green)' }}>
                <MessageSquare size={24} />
              </div>
              <h2 className="font-display text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Atención Directa
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Escríbenos directamente por WhatsApp para consultas, cotizaciones o retirar tu producto.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <Phone size={16} style={{ color: 'var(--gold)' }} />
                  <span>0959883921</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <Globe size={14} style={{ color: 'var(--gold)' }} />
                  <span>Importaciones directas: México, China, Colombia</span>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/593959883921?text=Hola,%20quiero%20informacion%20sobre%20la%20ubicacion%20y%20productos"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center text-sm py-3"
              style={{ backgroundColor: 'var(--green)', borderColor: 'var(--green)', color: '#fff' }}
            >
              <Phone size={16} />
              Contactar por WhatsApp
            </a>
          </div>

        </div>

        {/* Map Section */}
        <div className="card p-6 md:p-10 mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Mapa Interactiva con <span style={{ color: 'var(--gold)' }}>Ubicación GPS</span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Hacé clic en el mapa o en el botón para abrir el punto de referencia directo en Google Maps.
              </p>
            </div>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm shrink-0"
            >
              <ExternalLink size={16} />
              Abrir GPS en Google Maps
            </a>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[380px] md:h-[480px] rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-xl">
            <iframe
              title="Ubicación exacta Imperio Import RyC"
              src="https://maps.google.com/maps?q=https://maps.app.goo.gl/nxhUdMvRFhgaRF5Y6&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Banner Logo */}
        <div className="card-flat p-8 md:p-12 text-center relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--gold)] shrink-0 shadow-lg">
              <Image src="/logo.jpg" alt="Imperio Import RyC" fill className="object-cover" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--gold)' }}>
                IMPERIO IMPORT RyC
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Calidad &middot; Confianza &middot; Compromiso — Productos importados al mejor precio en Ecuador.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
