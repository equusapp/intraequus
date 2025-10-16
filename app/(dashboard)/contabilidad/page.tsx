'use client'

import { useState } from 'react'
import { Plus, Upload, FileText, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InvoiceForm from '@/components/contabilidad/invoice-form'
import InvoiceList from '@/components/contabilidad/invoice-list'

export default function ContabilidadPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Contabilidad Automática</h1>
          <p className="text-gray-600 mt-1">Gestiona facturas emitidas y recibidas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Facturas" value="124" />
        <StatCard label="Pendientes de Pago" value="18" color="yellow" />
        <StatCard label="Pagadas este Mes" value="32" color="green" />
        <StatCard label="Vencidas" value="3" color="red" />
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número, cliente o concepto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              Filtros Avanzados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="issued">Emitidas</TabsTrigger>
          <TabsTrigger value="received">Recibidas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="paid">Pagadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <InvoiceList filter={activeTab} searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>

      {/* Invoice Form Modal */}
      {showForm && (
        <InvoiceForm onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

function StatCard({ 
  label, 
  value, 
  color = 'blue' 
}: { 
  label: string
  value: string
  color?: string
}) {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-3xl font-bold mt-2 ${colors[color as keyof typeof colors]?.split(' ')[0]}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
