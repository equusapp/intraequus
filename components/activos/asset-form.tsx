'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { assetsService } from '@/lib/supabase/services/assets'
import { useToast } from '@/components/ui/use-toast'

interface AssetFormProps {
  onClose: () => void
  asset?: any
}

export default function AssetForm({ onClose, asset }: AssetFormProps) {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    purchaseDate: asset?.purchase_date || new Date().toISOString().split('T')[0],
    purchaseValue: asset?.purchase_value || 0,
    usefulLifeYears: asset?.useful_life_years || 10,
    depreciationMethod: asset?.depreciation_method || 'linear',
    notes: asset?.notes || '',
  })

  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(asset?.image_url || null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Calcular amortización anual
  const annualDepreciation = formData.purchaseValue / formData.usefulLifeYears
  const monthlyDepreciation = annualDepreciation / 12

  // Calcular valor actual (simplificado - en producción se calcularía desde la fecha de compra)
  const yearsElapsed = Math.floor(
    (new Date().getTime() - new Date(formData.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365)
  )
  const accumulatedDepreciation = Math.min(annualDepreciation * yearsElapsed, formData.purchaseValue)
  const currentValue = formData.purchaseValue - accumulatedDepreciation

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del activo es obligatorio',
        variant: 'destructive'
      })
      return
    }

    if (!formData.purchaseValue || formData.purchaseValue <= 0) {
      toast({
        title: 'Error',
        description: 'El valor de compra debe ser mayor que 0',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const assetData = {
        name: formData.name.trim(),
        purchase_date: formData.purchaseDate,
        purchase_value: Number(formData.purchaseValue),
        useful_life_years: Number(formData.usefulLifeYears),
        depreciation_method: formData.depreciationMethod as 'linear' | 'declining',
        current_value: Number(currentValue),
        accumulated_depreciation: Number(accumulatedDepreciation),
        status: currentValue <= 0 ? 'fully_depreciated' as const : 'active' as const,
        notes: formData.notes.trim() || null,
        image_url: null // TODO: Implementar subida de imágenes
      }

      if (asset?.id) {
        // Actualizar activo existente
        await assetsService.update(asset.id, assetData)
        toast({
          title: 'Activo actualizado',
          description: 'El activo se ha actualizado correctamente'
        })
      } else {
        // Crear nuevo activo
        await assetsService.create(assetData as any)
        toast({
          title: 'Activo creado',
          description: 'El activo se ha creado correctamente'
        })
      }

      onClose()
    } catch (error) {
      console.error('Error al guardar activo:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el activo',
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
            {asset ? 'Editar Activo' : 'Nuevo Activo'}
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
              {/* Name */}
              <div>
                <Label>Nombre del Activo *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Tractor agrícola, Sistema de riego..."
                  required
                />
              </div>

              {/* Purchase Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha de Compra *</Label>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Valor de Compra *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.purchaseValue}
                    onChange={(e) => setFormData({...formData, purchaseValue: parseFloat(e.target.value) || 0})}
                    required
                  />
                </div>
              </div>

              {/* Depreciation Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vida Útil (años) *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.usefulLifeYears}
                    onChange={(e) => setFormData({...formData, usefulLifeYears: parseInt(e.target.value) || 1})}
                    required
                  />
                </div>
                <div>
                  <Label>Método de Amortización *</Label>
                  <Select 
                    value={formData.depreciationMethod} 
                    onValueChange={(value) => setFormData({...formData, depreciationMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Lineal</SelectItem>
                      <SelectItem value="declining">Decreciente</SelectItem>
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
                  placeholder="Información adicional sobre el activo..."
                />
              </div>

              {/* Upload Image */}
              <div>
                <Label>Imagen del Activo (opcional)</Label>
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
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Calculations */}
            <div className="space-y-4">
              {/* Depreciation Summary */}
              <Card className="bg-equus-cream border-equus-sand">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="h-5 w-5 text-equus-blue-soft" />
                    <h3 className="font-semibold text-gray-800">Amortización</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Anual:</span>
                      <span className="font-semibold">{formatCurrency(annualDepreciation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mensual:</span>
                      <span className="font-semibold">{formatCurrency(monthlyDepreciation)}</span>
                    </div>
                  </div>

                  <div className="border-t border-equus-sand pt-3 mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Vida útil restante:</span>
                      <span className="font-semibold">
                        {Math.max(0, formData.usefulLifeYears - yearsElapsed)} años
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-equus-blue-soft h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (yearsElapsed / formData.usefulLifeYears) * 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Value */}
              <Card className="bg-white border-equus-sand">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-gray-800 mb-4">Valor Actual</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor compra:</span>
                      <span className="font-semibold">{formatCurrency(formData.purchaseValue)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Amortizado:</span>
                      <span className="font-semibold">-{formatCurrency(accumulatedDepreciation)}</span>
                    </div>
                  </div>

                  <div className="border-t border-equus-sand pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold">Valor Contable:</span>
                      <span className="text-lg font-bold text-equus-blue-soft">
                        {formatCurrency(currentValue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Box */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-xs text-blue-800">
                    <strong>Nota:</strong> La amortización se calcula automáticamente cada mes. 
                    Puedes generar el asiento contable desde la vista de detalle del activo.
                  </p>
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
            {loading ? 'Guardando...' : 'Guardar Activo'}
          </Button>
        </div>
      </div>
    </div>
  )
}
