import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Imperio Import RyC | Importadora de Confianza en Ecuador',
  description: 'Importadora Imperial RyC - Productos de calidad importados de Mexico, China, Colombia. Tecnologia, hogar, moda y mas. Envios a todo el Ecuador.',
  keywords: 'importadora, ecuador, productos importados, china, mexico, colombia, tecnologia, hogar, dropshipping',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Imperio Import RyC',
    description: 'Calidad, Confianza, Compromiso - Productos importados de Mexico, China, Colombia',
    type: 'website',
    locale: 'es_EC',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 800,
        alt: 'Imperio Import RyC Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" data-theme="dark">
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
