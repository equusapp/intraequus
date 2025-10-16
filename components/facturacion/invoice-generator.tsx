'use client'

import { useState } from 'react'
import { X, Download, Send, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { calculateIVA, calculateTotal, formatCurrency } from '@/lib/utils'

interface InvoiceGeneratorProps {
  mode: 'invoice' | 'quote'
  onClose: () => void
}

export default function InvoiceGenerator({ mode, onClose }: InvoiceGeneratorProps) {
  const [formData, setFormData] = useState({
    number: mode === 'invoice' ? 'FAC-2025-' : 'PRE-2025-',
    client: '',
    date: new Date().toISOString().split('T')[0],
    validUntil: '',
    items: [
      { description: '', quantity: 1, unitPrice: 0, vatRate: 21 }
    ]
  })

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, vatRate: 21 }]
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const calculateTotals = () => {
    let subtotal = 0
    let totalVAT = 0
    
    formData.items.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice
      subtotal += itemTotal
      totalVAT += calculateIVA(itemTotal, item.vatRate)
    })

    return {
      subtotal,
      totalVAT,
      total: subtotal + totalVAT
    }
  }

  const totals = calculateTotals()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-equus-sand">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'invoice' ? 'Nueva Factura' : 'Nuevo Presupuesto'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Preview */}
            <div className="md:col-span-2">
              {/* Company & Client Info */}
              <div className="bg-white border border-equus-sand rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">EQUUS Club</h3>
                    <p className="text-sm text-gray-600">CIF: B-12345678</p>
                    <p className="text-sm text-gray-600">Calle Principal, 123</p>
                    <p className="text-sm text-gray-600">28001 Madrid, España</p>
                  </div>
                  <div>
                    <Label>Cliente</Label>
                    <Select value={formData.client} onValueChange={(value) => setFormData({...formData, client: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Club Hípico Madrid</SelectItem>
                        <SelectItem value="2">Escuela Los Pinos</SelectItem>
                        <SelectItem value="3">Rancho El Caballo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="bg-white border border-equus-sand rounded-lg p-6 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Número</Label>
                    <Input 
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Fecha</Label>
                    <Input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  {mode === 'quote' && (
                    <div>
                      <Label>Válido hasta</Label>
                      <Input 
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-white border border-equus-sand rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Conceptos</h3>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        <Label className="text-xs">Descripción</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Concepto..."
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Cantidad</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Precio/u</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">IVA</Label>
                        <Select 
                          value={item.vatRate.toString()}
                          onValueChange={(value) => updateItem(index, 'vatRate', parseFloat(value))}
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
                      <div className="col-span-1">
                        <Label className="text-xs">Total</Label>
                        <p className="text-sm font-semibold text-gray-800 mt-2">
                          {(item.quantity * item.unitPrice).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addItem}
                  className="mt-4"
                >
                  + Añadir Línea
                </Button>
              </div>
            </div>

            {/* Right Column - Totals */}
            <div className="space-y-4">
              <Card className="bg-equus-cream border-equus-sand">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-4">Resumen</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA:</span>
                    <span className="font-semibold">{formatCurrency(totals.totalVAT)}</span>
                  </div>
                  <div className="border-t border-equus-sand pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold text-equus-blue-soft">
                        {formatCurrency(totals.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-4">Acciones</h3>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    Enviar por Email
                  </Button>
                  {mode === 'quote' && (
                    <Button variant="outline" className="w-full gap-2">
                      <FileText className="h-4 w-4" />
                      Convertir a Factura
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-equus-sand bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button>
            Guardar {mode === 'invoice' ? 'Factura' : 'Presupuesto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
