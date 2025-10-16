import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'EQUUS Accounting - Gestión Contable Ecuestre',
  description: 'Sistema contable completo para centros ecuestres, escuelas y clubes hípicos. Gestión de facturas, gastos, activos y contabilidad en tiempo real.',
  keywords: 'contabilidad ecuestre, gestión hípica, facturas caballos, EQUUS, software ecuestre',
  authors: [{ name: 'EQUUS Team' }],
  icons: {
    icon: '/equus-logo-small.svg',
    shortcut: '/equus-logo-small.svg',
    apple: '/equus-logo.svg',
  },
  openGraph: {
    title: 'EQUUS Accounting - Sistema Contable Ecuestre',
    description: 'Gestión contable profesional para centros ecuestres',
    images: ['/equus-logo.svg'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={montserrat.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
