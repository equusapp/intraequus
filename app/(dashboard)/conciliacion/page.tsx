'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BankMovementsList from '@/components/conciliacion/bank-movements-list'
import UploadBankFile from '@/components/conciliacion/upload-bank-file'

export default function ConciliacionPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const stats = {
    total: 156,
    reconciled: 134,
    pending: 22,
    balance: 45230.50
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Conciliación Bancaria</h1>
          <p className="text-gray-600 mt-1">Vincula movimientos bancarios con tus facturas</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Subir Extracto Bancario
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Movimientos</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-equus-blue-soft" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conciliados</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.reconciled}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Actual</p>
              <p className="text-2xl font-bold text-equus-blue-soft mt-1">
                {stats.balance.toFixed(2)}€
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="reconciled">Conciliados</TabsTrigger>
            <TabsTrigger value="pending">Sin Conciliar</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avanzados
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <BankMovementsList filter={activeTab} />
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      {showUpload && (
        <UploadBankFile onClose={() => setShowUpload(false)} />
      )}
    </div>
  )
}
