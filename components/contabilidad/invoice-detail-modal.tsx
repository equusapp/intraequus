'use client'

import { X, Download, Edit, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { EQUUS_COMPANY_DATA } from '@/lib/company-data'
import { generateInvoicePDF } from '@/lib/pdf-generator'

interface InvoiceDetailModalProps {
  invoice: any
  onClose: () => void
  onEdit: (invoice: any) => void
  onUpdateStatus: (id: string, status: string) => void
}

export default function InvoiceDetailModal({ 
  invoice, 
  onClose, 
  onEdit,
  onUpdateStatus 
}: InvoiceDetailModalProps) {
  const handleDownloadPDF = () => {
    generateInvoicePDF(invoice)
  }

  const handleMarkAsPaid = () => {
    onUpdateStatus(invoice.id, 'paid')
  }

  const handleMarkAsPending = () => {
    onUpdateStatus(invoice.id, 'pending')
  }

  const isIssued = invoice.type === 'issued'
  const isPaid = invoice.status === 'paid'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-equus-sand bg-equus-beige/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Factura {invoice.invoice_number}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isIssued ? 'Factura Emitida' : 'Factura Recibida'}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Company Data */}
            <Card>
              <CardHeader className="bg-equus-beige/30">
                <CardTitle className="text-lg">
                  {isIssued ? 'Datos del Emisor' : 'Proveedor'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isIssued ? (
                  <div className="space-y-2">
                    <p className="font-bold text-lg text-gray-800">{EQUUS_COMPANY_DATA.name}</p>
                    <p className="text-gray-600">CIF: {EQUUS_COMPANY_DATA.taxId}</p>
                    <p className="text-gray-600">{EQUUS_COMPANY_DATA.address}</p>
                    <p className="text-gray-600">{EQUUS_COMPANY_DATA.postalCode} {EQUUS_COMPANY_DATA.city}, {EQUUS_COMPANY_DATA.country}</p>
                    <p className="text-gray-600">{EQUUS_COMPANY_DATA.email}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-bold text-lg text-gray-800">{invoice.contact}</p>
                    <p className="text-gray-600">Proveedor de servicios</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client/Supplier Data */}
            <Card>
              <CardHeader className="bg-equus-beige/30">
                <CardTitle className="text-lg">
                  {isIssued ? 'Datos del Cliente' : 'Datos del Destinatario'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <p className="font-bold text-lg text-gray-800">
                    {invoice.contact?.name || invoice.contact || 'Sin contacto'}
                  </p>
                  {invoice.contact?.tax_id && (
                    <p className="text-gray-600">CIF: {invoice.contact.tax_id}</p>
                  )}
                  {invoice.contact?.email && (
                    <p className="text-gray-600">Email: {invoice.contact.email}</p>
                  )}
                  {invoice.contact?.phone && (
                    <p className="text-gray-600">Teléfono: {invoice.contact.phone}</p>
                  )}
                  {invoice.contact?.address && (
                    <p className="text-gray-600">{invoice.contact.address}</p>
                  )}
                  {!isIssued && (
                    <>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-500 mb-2">Destinatario:</p>
                        <p className="font-semibold">{EQUUS_COMPANY_DATA.name}</p>
                        <p className="text-gray-600">CIF: {EQUUS_COMPANY_DATA.taxId}</p>
                        <p className="text-gray-600">{EQUUS_COMPANY_DATA.address}</p>
                        <p className="text-gray-600">{EQUUS_COMPANY_DATA.postalCode} {EQUUS_COMPANY_DATA.city}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card>
              <CardHeader className="bg-equus-beige/30">
                <CardTitle className="text-lg">Detalles de la Factura</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Número de Factura</p>
                    <p className="font-semibold text-gray-800">{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de Emisión</p>
                    <p className="font-semibold text-gray-800">{formatDate(invoice.issue_date)}</p>
                  </div>
                  {invoice.due_date && (
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Vencimiento</p>
                      <p className="font-semibold text-gray-800">{formatDate(invoice.due_date)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isPaid ? 'Pagada' : 'Pendiente de Pago'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concept */}
            <Card>
              <CardHeader className="bg-equus-beige/30">
                <CardTitle className="text-lg">Concepto</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-800">{invoice.concept}</p>
              </CardContent>
            </Card>

            {/* Amounts */}
            <Card className="bg-equus-cream border-equus-sand">
              <CardHeader>
                <CardTitle className="text-lg">Importes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Imponible:</span>
                    <span className="font-semibold">{formatCurrency(invoice.base_amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA ({invoice.vat_rate}%):</span>
                    <span className="font-semibold">{formatCurrency(invoice.base_amount * invoice.vat_rate / 100)}</span>
                  </div>
                  <div className="border-t-2 border-equus-sand pt-3">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-xl font-bold text-equus-blue-soft">
                        {formatCurrency(invoice.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            {invoice.payment_date && (
              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-lg text-green-700">Información de Pago</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span>Pagada el {formatDate(invoice.payment_date)}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-equus-sand bg-gray-50">
          <div className="flex gap-2">
            {!isPaid ? (
              <Button 
                onClick={handleMarkAsPaid}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Marcar como Pagada
              </Button>
            ) : (
              <Button 
                onClick={handleMarkAsPending}
                variant="outline"
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                Marcar como Pendiente
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit(invoice)} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
