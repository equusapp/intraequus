import Link from 'next/link'
import { ArrowRight, BarChart3, FileText, Receipt, Landmark, Wallet } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-equus-cream via-equus-beige to-equus-green-water">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            EQUUS Accounting
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma de gestión contable completa para centros ecuestres, 
            escuelas y clubes hípicos
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Contabilidad Automática"
            description="Registra facturas de forma manual con asientos contables automáticos"
            href="/contabilidad"
          />
          
          <FeatureCard
            icon={<Landmark className="w-8 h-8" />}
            title="Conciliación Bancaria"
            description="Sube extractos bancarios y concilia movimientos con tus facturas"
            href="/conciliacion"
          />
          
          <FeatureCard
            icon={<Receipt className="w-8 h-8" />}
            title="Facturación"
            description="Crea facturas y presupuestos profesionales en minutos"
            href="/facturacion"
          />
          
          <FeatureCard
            icon={<Wallet className="w-8 h-8" />}
            title="Gestión de Gastos"
            description="Organiza tus tickets y gastos con imágenes adjuntas"
            href="/gastos"
          />
          
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Activos e Inmovilizados"
            description="Controla amortizaciones y valor contable de tus bienes"
            href="/activos"
          />
          
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Dashboard"
            description="Vista general de tu situación financiera en tiempo real"
            href="/dashboard"
          />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-equus-blue-soft hover:bg-equus-blue-light text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Acceder al Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="equus-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
        <div className="text-equus-blue-soft mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </Link>
  )
}
