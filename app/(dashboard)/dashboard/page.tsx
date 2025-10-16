'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, TrendingUp, FileText, Receipt, Wallet } from 'lucide-react'
import { invoicesService } from '@/lib/supabase/services/invoices'
import { expensesService } from '@/lib/supabase/services/expenses'
import { assetsService } from '@/lib/supabase/services/assets'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    ingresos: 0,
    gastos: 0,
    beneficio: 0,
    facturasPendientes: 0,
    gastosMes: 0,
    activosTotal: 0
  })
  const [recentInvoices, setRecentInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      console.log('📋 Cargando datos del dashboard...')

      // Cargar facturas
      const invoices = await invoicesService.getAll()
      console.log('📊 Facturas cargadas:', invoices.length)

      // Cargar gastos
      const expenses = await expensesService.getAll()
      console.log('💰 Gastos cargados:', expenses.length)

      // Cargar activos
      const assets = await assetsService.getAll()
      console.log('🏢 Activos cargados:', assets.length)

      // Calcular ingresos (facturas emitidas pagadas)
      const ingresos = invoices
        .filter(inv => inv.type === 'issued' && inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total_amount, 0)

      // Calcular gastos totales
      const gastos = expenses.reduce((sum, exp) => sum + exp.total_amount, 0)

      // Calcular beneficio
      const beneficio = ingresos - gastos

      // Facturas pendientes
      const facturasPendientes = invoices
        .filter(inv => inv.type === 'issued' && inv.status === 'pending').length

      // Gastos del mes actual
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const gastosMes = expenses
        .filter(exp => {
          const expDate = new Date(exp.expense_date)
          return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
        })
        .reduce((sum, exp) => sum + exp.total_amount, 0)

      // Valor total de activos
      const activosTotal = assets.reduce((sum, asset) => sum + asset.purchase_value, 0)

      setStats({
        ingresos,
        gastos,
        beneficio,
        facturasPendientes,
        gastosMes,
        activosTotal
      })

      // Facturas recientes (las últimas 5)
      const recent = invoices
        .filter(inv => inv.type === 'issued')
        .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
        .slice(0, 5)
        .map(inv => ({
          id: inv.id,
          number: inv.invoice_number,
          client: inv.contact?.name || 'Sin cliente',
          amount: inv.total_amount,
          status: inv.status
        }))

      setRecentInvoices(recent)

    } catch (error) {
      console.error('❌ Error al cargar datos del dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-equus-blue-soft mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen de tu actividad contable</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Ingresos Totales"
          value={stats.ingresos}
          icon={<ArrowUpRight className="h-5 w-5 text-green-600" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Gastos Totales"
          value={stats.gastos}
          icon={<ArrowDownRight className="h-5 w-5 text-red-600" />}
          trend="+8.2%"
          trendUp={false}
        />
        <StatCard
          title="Beneficio Neto"
          value={stats.beneficio}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          trend="+15.3%"
          trendUp={true}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickActionCard
          title="Facturas Pendientes"
          value={stats.facturasPendientes}
          icon={<FileText className="h-6 w-6" />}
          href="/facturacion"
        />
        <QuickActionCard
          title="Gastos este Mes"
          value={`${stats.gastosMes.toFixed(2)}€`}
          icon={<Wallet className="h-6 w-6" />}
          href="/gastos"
        />
        <QuickActionCard
          title="Valor Activos"
          value={`${stats.activosTotal.toLocaleString()}€`}
          icon={<Receipt className="h-6 w-6" />}
          href="/activos"
        />
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas Recientes</CardTitle>
          <CardDescription>Últimas facturas emitidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border border-equus-sand rounded-lg hover:bg-equus-beige/50 transition-colors">
                <div>
                  <p className="font-medium text-gray-800">{invoice.number}</p>
                  <p className="text-sm text-gray-600">{invoice.client}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{invoice.amount.toFixed(2)}€</p>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendUp 
}: { 
  title: string
  value: number
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">
          {value.toFixed(2)}€
        </div>
        <p className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
          {trend} vs mes anterior
        </p>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ 
  title, 
  value, 
  icon, 
  href 
}: { 
  title: string
  value: string | number
  icon: React.ReactNode
  href: string
}) {
  return (
    <a href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <div className="text-equus-blue-soft">
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  }

  const labels = {
    paid: 'Pagada',
    pending: 'Pendiente',
    overdue: 'Vencida',
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
}
