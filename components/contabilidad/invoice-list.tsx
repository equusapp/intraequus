'use client'

import { useState, useEffect } from 'react'
import { Eye, Edit, Trash2, Download, Copy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import InvoiceDetailModal from './invoice-detail-modal'
import InvoiceForm from './invoice-form'
import { generateInvoicePDF } from '@/lib/pdf-generator'
import { invoicesService } from '@/lib/supabase/services/invoices'
import { useToast } from '@/components/ui/use-toast'
import { debugService } from '@/lib/supabase/debug'
import { seedData } from '@/lib/supabase/seed-data'
import { useAuth } from '@/contexts/AuthContext'

interface InvoiceListProps {
  filter: string
  searchTerm: string
}

// Los datos ahora vienen de Supabase

export default function InvoiceList({ filter, searchTerm }: InvoiceListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [viewDetailInvoice, setViewDetailInvoice] = useState<any>(null)
  const [editInvoice, setEditInvoice] = useState<any>(null)
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user, userProfile } = useAuth()

  // Cargar facturas desde Supabase
  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      setLoading(true)
      console.log('🔄 Cargando facturas...')
      
      const data = await invoicesService.getAll(
        undefined, // companyId
        user?.id,
        userProfile?.role
      )
      console.log('📋 Facturas cargadas:', data)
      console.log('📋 Número de facturas:', data?.length || 0)
      
      setInvoices(data || [])
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No se encontraron facturas')
        toast({
          title: 'Sin facturas',
          description: 'No hay facturas en la base de datos. Ve a /debug para insertar datos de prueba.'
        })
      } else {
        console.log('✅ Facturas cargadas correctamente')
      }
    } catch (error) {
      console.error('❌ Error al cargar facturas:', error)
      toast({
        title: 'Error',
        description: `Error al cargar facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar facturas
  const filteredInvoices = invoices.filter(invoice => {
    const contactName = invoice.contact?.name || ''
    const matchesSearch = searchTerm === '' || 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.concept.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filter === 'all' ||
      (filter === 'issued' && invoice.type === 'issued') ||
      (filter === 'received' && invoice.type === 'received') ||
      (filter === 'pending' && invoice.status === 'pending') ||
      (filter === 'paid' && invoice.status === 'paid')

    return matchesSearch && matchesFilter
  })

  // Función para actualizar el estado de una factura
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await invoicesService.updateStatus(id, status as any)
      await loadInvoices()
      setViewDetailInvoice(null)
      toast({
        title: 'Estado actualizado',
        description: `Factura marcada como ${status === 'paid' ? 'pagada' : 'pendiente'}`
      })
    } catch (error) {
      console.error('Error al actualizar estado:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado',
        variant: 'destructive'
      })
    }
  }

  // Función para duplicar factura
  const handleDuplicate = async (invoice: any) => {
    try {
      await invoicesService.duplicate(invoice.id)
      await loadInvoices()
      toast({
        title: 'Factura duplicada',
        description: 'Se ha creado una copia de la factura'
      })
    } catch (error) {
      console.error('Error al duplicar factura:', error)
      toast({
        title: 'Error',
        description: 'No se pudo duplicar la factura',
        variant: 'destructive'
      })
    }
  }

  // Función para eliminar factura
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
      try {
        await invoicesService.delete(id)
        await loadInvoices()
        toast({
          title: 'Factura eliminada',
          description: 'La factura ha sido eliminada correctamente'
        })
      } catch (error) {
        console.error('Error al eliminar factura:', error)
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la factura',
          variant: 'destructive'
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-equus-blue-soft mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando facturas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredInvoices.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No se encontraron facturas</p>
        </Card>
      ) : (
        filteredInvoices.map((invoice) => (
          <Card 
            key={invoice.id} 
            className={`p-6 hover:shadow-md transition-shadow cursor-pointer ${
              selectedInvoice === invoice.id ? 'ring-2 ring-equus-green-water' : ''
            }`}
            onClick={() => setSelectedInvoice(invoice.id)}
          >
            <div className="flex items-center justify-between">
              {/* Left side - Invoice info */}
              <div className="flex-1 grid grid-cols-5 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Número</p>
                  <p className="font-semibold text-gray-800">{invoice.invoice_number}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                    invoice.type === 'issued' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {invoice.type === 'issued' ? 'Emitida' : 'Recibida'}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {invoice.type === 'issued' ? 'Cliente' : 'Proveedor'}
                  </p>
                  <p className="font-medium text-gray-800">{invoice.contact?.name || 'Sin contacto'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Fecha</p>
                  <p className="text-gray-800">{formatDate(invoice.issue_date)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Concepto</p>
                  <p className="text-gray-800 truncate" title={invoice.concept}>
                    {invoice.concept}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Importe</p>
                  <p className="font-bold text-lg text-gray-800">
                    {formatCurrency(invoice.total_amount)}
                  </p>
                </div>
              </div>

              {/* Right side - Status and actions */}
              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <StatusBadge status={invoice.status} />
                  {invoice.payment_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Pagado: {formatDate(invoice.payment_date)}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Ver detalles"
                    onClick={(e) => {
                      e.stopPropagation()
                      setViewDetailInvoice(invoice)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Editar"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditInvoice(invoice)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Duplicar"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDuplicate(invoice)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Descargar PDF"
                    onClick={(e) => {
                      e.stopPropagation()
                      generateInvoicePDF(invoice)
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Eliminar"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(invoice.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                  {invoice.status !== 'paid' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Marcar como Pagada"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUpdateStatus(invoice.id, 'paid')
                      }}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* Modal de Detalles */}
      {viewDetailInvoice && (
        <InvoiceDetailModal
          invoice={viewDetailInvoice}
          onClose={() => setViewDetailInvoice(null)}
          onEdit={(inv) => {
            setViewDetailInvoice(null)
            setEditInvoice(inv)
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Modal de Edición */}
      {editInvoice && (
        <InvoiceForm
          invoice={editInvoice}
          onClose={() => {
            setEditInvoice(null)
            loadInvoices()
          }}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-gray-200 text-gray-600',
  }

  const labels = {
    paid: 'Pagada',
    pending: 'Pendiente',
    overdue: 'Vencida',
    draft: 'Borrador',
    cancelled: 'Cancelada',
  }

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
}
