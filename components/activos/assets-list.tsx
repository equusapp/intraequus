'use client'

import { useState, useEffect } from 'react'
import { Eye, Edit, Trash2, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { assetsService } from '@/lib/supabase/services/assets'
import { useToast } from '@/components/ui/use-toast'

interface AssetsListProps {
  filter: string
}

// Los datos ahora vienen de Supabase

export default function AssetsList({ filter }: AssetsListProps) {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Cargar activos desde Supabase
  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    try {
      setLoading(true)
      console.log('🔄 Cargando activos...')
      
      const data = await assetsService.getAll()
      console.log('🏢 Activos cargados:', data)
      
      // Calcular valores actuales y amortización acumulada para cada activo
      const assetsWithCalculations = data.map(asset => {
        const accumulatedDepreciation = assetsService.calculateAccumulatedDepreciation(
          asset.purchase_date,
          asset.purchase_value,
          asset.useful_life_years
        )
        const currentValue = assetsService.calculateCurrentValue(
          asset.purchase_value,
          accumulatedDepreciation
        )
        
        return {
          ...asset,
          accumulated_depreciation: accumulatedDepreciation,
          current_value: currentValue
        }
      })
      
      setAssets(assetsWithCalculations || [])
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No se encontraron activos')
      }
    } catch (error) {
      console.error('❌ Error al cargar activos:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los activos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar activo
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este activo?')) {
      try {
        await assetsService.delete(id)
        await loadAssets()
        toast({
          title: 'Activo eliminado',
          description: 'El activo ha sido eliminado correctamente'
        })
      } catch (error) {
        console.error('Error al eliminar activo:', error)
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el activo',
          variant: 'destructive'
        })
      }
    }
  }

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true
    return asset.status === filter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-equus-blue-soft mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando activos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {filteredAssets.map((asset) => {
        const depreciationPercentage = (asset.accumulated_depreciation / asset.purchase_value) * 100
        const yearsElapsed = Math.floor(
          (new Date().getTime() - new Date(asset.purchase_date).getTime()) / (1000 * 60 * 60 * 24 * 365)
        )
        const remainingYears = Math.max(0, asset.useful_life_years - yearsElapsed)

        return (
          <Card key={asset.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {asset.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Comprado el {formatDate(asset.purchase_date)}
                </p>
              </div>
              <StatusBadge status={asset.status} />
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-equus-beige/30 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Valor Compra</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(asset.purchase_value)}
                </p>
              </div>
              <div className="bg-equus-green-water/20 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Valor Actual</p>
                <p className="text-lg font-bold text-green-700">
                  {formatCurrency(asset.current_value)}
                </p>
              </div>
            </div>

            {/* Depreciation Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Amortización: {depreciationPercentage.toFixed(1)}%</span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {formatCurrency(asset.accumulated_depreciation)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${depreciationPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Vida útil: {asset.useful_life_years} años • Restante: {remainingYears} años
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-equus-sand">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Eye className="h-4 w-4" />
                Detalles
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDelete(asset.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </Card>
        )
      })}

      {filteredAssets.length === 0 && (
        <div className="col-span-2 text-center py-12">
          <p className="text-gray-500">No hay activos en esta categoría</p>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Activo' },
    fully_depreciated: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Amortizado' },
    sold: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Vendido' },
    disposed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Dado de baja' },
  }

  const { bg, text, label } = config[status as keyof typeof config] || config.active

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>
      {label}
    </span>
  )
}
