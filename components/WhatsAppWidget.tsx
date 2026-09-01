'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function WhatsAppWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (pathname?.startsWith('/admin')) {
    return null
  }

  const phoneNumber = '593959883921'
  const defaultMessage = 'Hola, quiero informacion sobre sus productos'

  const handleSend = (message: string) => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat popup */}
      {isOpen && (
        <div className="mb-4 w-80 rounded-2xl overflow-hidden animate-scale-in"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Header */}
          <div className="p-4 flex items-center justify-between" style={{ backgroundColor: '#16a34a' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Imperio Import RyC</h4>
                <p className="text-white/70 text-xs">En linea ahora</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 min-h-[120px]"
            style={{ backgroundColor: themeChatBg() }}>
            <div className="rounded-xl p-3 max-w-[85%]"
              style={{
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-sm)',
              }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Hola! Bienvenido a Imperio Import RyC. Como podemos ayudarte?
              </p>
              <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--text-tertiary)' }}>Ahora</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-3 border-t" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-card)' }}>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSend(defaultMessage)}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ backgroundColor: 'var(--green)', color: '#fff' }}
              >
                Consultar productos
              </button>
              <button
                onClick={() => handleSend('Hola, quiero hacer un pedido')}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ backgroundColor: 'var(--red)', color: '#fff' }}
              >
                Hacer un pedido
              </button>
              <button
                onClick={() => handleSend('Hola, necesito soporte tecnico')}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
              >
                Soporte tecnico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all whatsapp-bounce"
        style={{
          backgroundColor: '#25d366',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
        }}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>
    </div>
  )
}

function themeChatBg(): string {
  if (typeof document === 'undefined') return '#e5ddd5'
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'light' ? '#f0e6d3' : '#1a1a1a'
}
