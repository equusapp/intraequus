'use client'

import { useState } from 'react'
import { Plus, FileText, DollarSign, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InvoiceGenerator from '@/components/facturacion/invoice-generator'
import QuotesList from '@/components/facturacion/quotes-list'

export default function FacturacionPage() {
  const [showGenerator, setShowGenerator] = useState(false)
  const [generatorMode, setGeneratorMode] = useState<'invoice' | 'quote'>('invoice')

  const stats = {
    totalInvoiced: 87450.00,
    pending: 12340.50,
    overdue: 3872.00,
    quotes: 8
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Facturación y Presupuestos</h1>
          <p className="text-gray-600 mt-1">Crea facturas y presupuestos profesionales</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setGeneratorMode('quote')
              setShowGenerator(true)
            }}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Nuevo Presupuesto
          </Button>
          <Button 
            onClick={() => {
              setGeneratorMode('invoice')
              setShowGenerator(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Facturado</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalInvoiced.toFixed(2)}€
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente Cobro</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pending.toFixed(2)}€
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Facturas Vencidas</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.overdue.toFixed(2)}€
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Presupuestos</p>
                <p className="text-2xl font-bold text-equus-blue-soft mt-1">
                  {stats.quotes}
                </p>
              </div>
              <FileText className="h-8 w-8 text-equus-blue-soft" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="quotes">Presupuestos</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-6">
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-equus-sand">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Las facturas se gestionan desde el módulo de Contabilidad
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/contabilidad'}>
              Ir a Contabilidad
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="quotes" className="mt-6">
          <QuotesList />
        </TabsContent>
      </Tabs>

      {/* Generator Modal */}
      {showGenerator && (
        <InvoiceGenerator 
          mode={generatorMode}
          onClose={() => setShowGenerator(false)} 
        />
      )}
    </div>
  )
}
