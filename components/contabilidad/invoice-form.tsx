'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateIVA, calculateTotal, formatCurrency } from '@/lib/utils'
import { invoicesService } from '@/lib/supabase/services/invoices'
import { contactsService } from '@/lib/supabase/services/contacts'
import { useToast } from '@/components/ui/use-toast'

interface InvoiceFormProps {
  onClose: () => void
  invoice?: any
}

export default function InvoiceForm({ onClose, invoice }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    type: invoice?.type || 'issued',
    invoiceNumber: invoice?.invoice_number || `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    issueDate: invoice?.issue_date || new Date().toISOString().split('T')[0],
    operationDate: invoice?.operation_date || '',
    dueDate: invoice?.due_date || '',
    contact: invoice?.contact_id || '',
    concept: invoice?.concept || '',
    baseAmount: invoice?.base_amount || 0,
    vatRate: invoice?.vat_rate || 21,
    paymentMethod: invoice?.payment_method || '',
    paymentDate: invoice?.payment_date || '',
    accountCode: invoice?.account_code || '',
    notes: invoice?.notes || '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Cargar contactos
  useEffect(() => {
    loadContacts()
  }, [formData.type])

  async function loadContacts() {
    try {
      const type = formData.type === 'issued' ? 'client' : 'supplier'
      const data = await contactsService.getByType(type as any)
      setContacts(data)
    } catch (error) {
      console.error('Error al cargar contactos:', error)
    }
  }

  const vatAmount = calculateIVA(formData.baseAmount, formData.vatRate)
  const totalAmount = calculateTotal(formData.baseAmount, formData.vatRate)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.contact) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un contacto',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const invoiceData = {
        type: formData.type as 'issued' | 'received',
        invoice_number: formData.invoiceNumber,
        contact_id: formData.contact,
        issue_date: formData.issueDate,
        operation_date: formData.operationDate || null,
        due_date: formData.dueDate || null,
        concept: formData.concept,
        base_amount: Number(formData.baseAmount),
        vat_rate: Number(formData.vatRate),
        vat_amount: Number(vatAmount),
        total_amount: Number(totalAmount),
        payment_method: formData.paymentMethod || null,
        payment_date: formData.paymentDate || null,
        status: formData.paymentDate ? 'paid' as const : 'pending' as const,
        account_code: formData.accountCode || null,
        notes: formData.notes || null,
        file_url: null
      }

      if (invoice?.id) {
        // Actualizar factura existente
        await invoicesService.update(invoice.id, invoiceData)
        toast({
          title: 'Factura actualizada',
          description: 'La factura se ha actualizado correctamente'
        })
      } else {
        // Crear nueva factura
        await invoicesService.create(invoiceData as any)
        toast({
          title: 'Factura creada',
          description: 'La factura se ha creado correctamente'
        })
      }

      onClose()
    } catch (error) {
      console.error('Error al guardar factura:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar la factura',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-equus-sand">
          <h2 className="text-2xl font-bold text-gray-800">
            {invoice ? 'Editar Factura' : 'Nueva Factura'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Form Fields */}
            <div className="md:col-span-2 space-y-4">
              {/* Tipo de Factura */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Factura *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="issued">Emitida</SelectItem>
                      <SelectItem value="received">Recibida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nº Factura *</Label>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                    placeholder="FAC-2025-001"
                    required
                  />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Fecha Emisión *</Label>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Fecha Operación</Label>
                  <Input
                    type="date"
                    value={formData.operationDate}
                    onChange={(e) => setFormData({...formData, operationDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Fecha Vencimiento</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Cliente/Proveedor */}
              <div>
                <Label>{formData.type === 'issued' ? 'Cliente' : 'Proveedor'} *</Label>
                <Select value={formData.contact} onValueChange={(value) => setFormData({...formData, contact: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500">No hay contactos disponibles</div>
                    ) : (
                      contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Concepto */}
              <div>
                <Label>Concepto *</Label>
                <Input
                  value={formData.concept}
                  onChange={(e) => setFormData({...formData, concept: e.target.value})}
                  placeholder="Descripción del servicio o producto"
                  required
                />
              </div>

              {/* Importes */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Base Imponible *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.baseAmount}
                    onChange={(e) => setFormData({...formData, baseAmount: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label>Tipo IVA (%) *</Label>
                  <Select 
                    value={formData.vatRate.toString()} 
                    onValueChange={(value) => setFormData({...formData, vatRate: parseFloat(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="4">4%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="21">21%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cuota IVA</Label>
                  <Input value={vatAmount.toFixed(2)} disabled />
                </div>
              </div>

              {/* Pago */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Forma de Pago</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="domiciliacion">Domiciliación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha de Pago</Label>
                  <Input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Cuenta Contable */}
              <div>
                <Label>Cuenta Contable</Label>
                <Select value={formData.accountCode} onValueChange={(value) => setFormData({...formData, accountCode: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cuenta..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="430">430 - Clientes</SelectItem>
                    <SelectItem value="400">400 - Proveedores</SelectItem>
                    <SelectItem value="700">700 - Ventas</SelectItem>
                    <SelectItem value="600">600 - Compras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Observaciones */}
              <div>
                <Label>Observaciones</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Notas adicionales..."
                />
              </div>

              {/* Upload File */}
              <div>
                <Label>Adjuntar Factura (PDF/Imagen)</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-equus-sand rounded-lg cursor-pointer hover:bg-equus-beige/30 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="text-sm text-gray-600">
                        {file ? file.name : 'Haz clic para subir o arrastra el archivo'}
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Accounting Entry */}
            <div className="space-y-4">
              {/* Resumen */}
              <Card className="bg-equus-cream border-equus-sand">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Resumen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Imponible:</span>
                    <span className="font-semibold">{formatCurrency(formData.baseAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA ({formData.vatRate}%):</span>
                    <span className="font-semibold">{formatCurrency(vatAmount)}</span>
                  </div>
                  <div className="border-t border-equus-sand pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold text-equus-blue-soft">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Asiento Contable Preview */}
              <Card className="bg-white border-equus-sand">
                <CardHeader>
                  <CardTitle className="text-lg">Asiento Contable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between font-medium border-b pb-2">
                      <span>Cuenta</span>
                      <span className="flex gap-4">
                        <span className="w-20 text-right">Debe</span>
                        <span className="w-20 text-right">Haber</span>
                      </span>
                    </div>
                    {formData.type === 'issued' ? (
                      <>
                        <div className="flex justify-between">
                          <span>430 Clientes</span>
                          <span className="flex gap-4">
                            <span className="w-20 text-right">{totalAmount.toFixed(2)}</span>
                            <span className="w-20 text-right">-</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>700 Ventas</span>
                          <span className="flex gap-4">
                            <span className="w-20 text-right">-</span>
                            <span className="w-20 text-right">{formData.baseAmount.toFixed(2)}</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>477 IVA Rep.</span>
                          <span className="flex gap-4">
                            <span className="w-20 text-right">-</span>
                            <span className="w-20 text-right">{vatAmount.toFixed(2)}</span>
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>600 Compras</span>
                          <span className="flex gap-4">
                            <span className="w-20 text-right">{formData.baseAmount.toFixed(2)}</span>
                            <span className="w-20 text-right">-</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>472 IVA Sop.</span>
                          <span className="flex gap-4">
                            <span className="w-20 text-right">{vatAmount.toFixed(2)}</span>
                            <span className="w-20 text-right">-</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>400 Proveed.</span>
                          <span className="flex gap-4">
                            <span className="w-20 text-right">-</span>
                            <span className="w-20 text-right">{totalAmount.toFixed(2)}</span>
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-equus-sand bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Factura'}
          </Button>
        </div>
      </div>
    </div>
  )
}
