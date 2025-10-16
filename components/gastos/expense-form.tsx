'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { calculateIVA, calculateTotal, formatCurrency } from '@/lib/utils'
import { expensesService } from '@/lib/supabase/services/expenses'
import { contactsService } from '@/lib/supabase/services/contacts'
import { useToast } from '@/components/ui/use-toast'

interface ExpenseFormProps {
  onClose: () => void
  expense?: any
}

const categories = [
  { value: 'alimentacion', label: 'Alimentación Caballos', color: 'bg-green-100 text-green-700' },
  { value: 'veterinaria', label: 'Veterinaria', color: 'bg-blue-100 text-blue-700' },
  { value: 'mantenimiento', label: 'Mantenimiento', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'suministros', label: 'Suministros', color: 'bg-purple-100 text-purple-700' },
  { value: 'nominas', label: 'Nóminas', color: 'bg-red-100 text-red-700' },
  { value: 'seguros', label: 'Seguros', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'transporte', label: 'Transporte', color: 'bg-pink-100 text-pink-700' },
  { value: 'otros', label: 'Otros', color: 'bg-gray-100 text-gray-700' },
]

export default function ExpenseForm({ onClose, expense }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    supplier: expense?.supplier_id || '',
    date: expense?.expense_date || new Date().toISOString().split('T')[0],
    concept: expense?.concept || '',
    amount: expense?.amount || 0,
    vatRate: expense?.vat_rate || 21,
    category: expense?.category || '',
    accountCode: expense?.account_code || '',
    notes: expense?.notes || '',
  })

  const [receipt, setReceipt] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(expense?.receipt_url || null)
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Cargar proveedores
  useEffect(() => {
    loadSuppliers()
  }, [])

  async function loadSuppliers() {
    try {
      const data = await contactsService.getByType('supplier')
      setSuppliers(data)
    } catch (error) {
      console.error('Error al cargar proveedores:', error)
    }
  }

  const vatAmount = calculateIVA(formData.amount, formData.vatRate)
  const totalAmount = calculateTotal(formData.amount, formData.vatRate)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.concept.trim()) {
      toast({
        title: 'Error',
        description: 'El concepto es obligatorio',
        variant: 'destructive'
      })
      return
    }

    if (!formData.amount || formData.amount <= 0) {
      toast({
        title: 'Error',
        description: 'El importe debe ser mayor que 0',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const expenseData = {
        supplier_id: formData.supplier || null,
        expense_date: formData.date,
        concept: formData.concept.trim(),
        amount: Number(formData.amount),
        vat_rate: Number(formData.vatRate),
        vat_amount: Number(vatAmount),
        total_amount: Number(totalAmount),
        category: formData.category,
        account_code: formData.accountCode.trim() || null,
        notes: formData.notes.trim() || null,
        receipt_url: null // TODO: Implementar subida de archivos
      }

      if (expense?.id) {
        // Actualizar gasto existente
        await expensesService.update(expense.id, expenseData)
        toast({
          title: 'Gasto actualizado',
          description: 'El gasto se ha actualizado correctamente'
        })
      } else {
        // Crear nuevo gasto
        await expensesService.create(expenseData as any)
        toast({
          title: 'Gasto creado',
          description: 'El gasto se ha creado correctamente'
        })
      }

      onClose()
    } catch (error) {
      console.error('Error al guardar gasto:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el gasto',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-equus-sand">
          <h2 className="text-2xl font-bold text-gray-800">
            {expense ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="md:col-span-2 space-y-4">
              {/* Supplier and Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Proveedor</Label>
                  <Select value={formData.supplier} onValueChange={(value) => setFormData({...formData, supplier: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">No hay proveedores disponibles</div>
                      ) : (
                        suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fecha *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Concept */}
              <div>
                <Label>Concepto *</Label>
                <Input
                  value={formData.concept}
                  onChange={(e) => setFormData({...formData, concept: e.target.value})}
                  placeholder="Descripción del gasto"
                  required
                />
              </div>

              {/* Amount and VAT */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Importe Base *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
                <div>
                  <Label>IVA (%) *</Label>
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

              {/* Category and Account */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cuenta Contable</Label>
                  <Select value={formData.accountCode} onValueChange={(value) => setFormData({...formData, accountCode: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="600">600 - Compras</SelectItem>
                      <SelectItem value="621">621 - Arrendamientos</SelectItem>
                      <SelectItem value="622">622 - Reparaciones</SelectItem>
                      <SelectItem value="628">628 - Suministros</SelectItem>
                      <SelectItem value="640">640 - Sueldos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Notas</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Información adicional..."
                />
              </div>

              {/* Upload Receipt */}
              <div>
                <Label>Adjuntar Ticket/Factura</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-48 px-4 border-2 border-dashed border-equus-sand rounded-lg cursor-pointer hover:bg-equus-beige/30 transition-colors">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-44 object-contain"
                      />
                    ) : (
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          Haz clic para subir o arrastra la imagen
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-4">
              {/* Total */}
              <Card className="bg-equus-cream border-equus-sand">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-4">Resumen</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Imponible:</span>
                    <span className="font-semibold">{formatCurrency(formData.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA ({formData.vatRate}%):</span>
                    <span className="font-semibold">{formatCurrency(vatAmount)}</span>
                  </div>
                  <div className="border-t border-equus-sand pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold text-red-600">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Badge */}
              {formData.category && (
                <Card>
                  <CardContent className="pt-6">
                    <Label className="text-xs text-gray-500">Categoría</Label>
                    <div className="mt-2">
                      {categories.find(c => c.value === formData.category) && (
                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                          categories.find(c => c.value === formData.category)!.color
                        }`}>
                          {categories.find(c => c.value === formData.category)!.label}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-equus-sand bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Gasto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
