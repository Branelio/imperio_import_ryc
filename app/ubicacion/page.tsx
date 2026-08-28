import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Phone, MessageSquare, ShieldCheck, Truck, Globe, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Encuéntranos - Imperio Import RyC',
  description: 'Conoce nuestra ubicación, horarios de atención y canales de contacto de Imperio Import RyC en Ecuador.',
}

export default function UbicacionPage() {
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
            Visítanos en nuestras instalaciones o contáctate directamente con nuestro equipo de ventas para atención inmediata.
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
                Dirección Principal
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                Ecuador — Bodega y Centro de Distribución de Importaciones.
              </p>
              <div className="rounded-xl p-3 text-xs flex items-center gap-2 mb-4"
                style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}>
                <Truck size={16} className="shrink-0" style={{ color: 'var(--gold)' }} />
                <span>Despachos diarios a todas las provincias del Ecuador</span>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Ecuador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between text-xs font-semibold uppercase tracking-wider py-2 px-3 rounded-lg transition-colors hover:bg-[var(--gold-bg)]"
              style={{ color: 'var(--gold)' }}
            >
              <span>Ver en Google Maps</span>
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
                <li className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Lunes a Viernes:</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>08:30 AM – 06:30 PM</span>
                </li>
                <li className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sábados:</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>09:00 AM – 04:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Domingos:</span>
                  <span className="font-semibold" style={{ color: 'var(--gold)' }}>Atención vía WhatsApp</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t text-xs flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--green)' }} />
              <span>Respuesta rápida garantizada</span>
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
                Atención al Cliente
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                ¿Tienes dudas sobre un producto, pedido al por mayor o envíos? Escríbenos directamente.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <Phone size={16} style={{ color: 'var(--gold)' }} />
                  <span>0959883921</span>
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <Globe size={14} style={{ color: 'var(--gold)' }} />
                  <span>Importaciones de México, China y Colombia</span>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/593959883921?text=Hola,%20quisiera%20consultar%20sobre%20la%20ubicacion%20y%20horarios%20de%20atencion"
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
                Mapa de <span style={{ color: 'var(--gold)' }}>Ubicación</span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Coordinamos envíos a todo el territorio nacional ecuatoriano.
              </p>
            </div>
            <a
              href="https://wa.me/593959883921?text=Hola,%20necesito%20la%20ubicacion%20exacta%20para%20retirar%20un%20producto"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm shrink-0"
            >
              Solicitar ubicación exacta por GPS
            </a>
          </div>

          {/* Styled Map Container / Embed */}
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-[var(--border-default)] shadow-lg">
            <iframe
              title="Ubicacion Imperio Import RyC"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.887965415278!2d-78.48!3d-0.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMTAnNDguMCJTIDc4wrAyOCc0OC4wIlc!5e0!3m2!1ses!2sec!4v1650000000000!5m2!1ses!2sec"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.05)' }}
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
                Calidad &middot; Confianza &middot; Compromiso — Productos importados al mejor precio.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
