'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingDown, DollarSign, Package, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AssetForm from '@/components/activos/asset-form'
import AssetsList from '@/components/activos/assets-list'
import DepreciationChart from '@/components/activos/depreciation-chart'
import { assetsService } from '@/lib/supabase/services/assets'

export default function ActivosPage() {
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState({
    totalValue: 0,
    currentValue: 0,
    totalDepreciation: 0,
    activeAssets: 0
  })
  const [refreshKey, setRefreshKey] = useState(0)

  // Cargar estadísticas
  useEffect(() => {
    loadStats()
  }, [refreshKey])

  async function loadStats() {
    try {
      const assets = await assetsService.getAll()
      
      // Calcular valores con amortización actualizada
      const assetsWithCalculations = assets.map(asset => {
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
      
      // Calcular totales
      const totalValue = assetsWithCalculations.reduce((sum, asset) => sum + asset.purchase_value, 0)
      const currentValue = assetsWithCalculations.reduce((sum, asset) => sum + asset.current_value, 0)
      const totalDepreciation = assetsWithCalculations.reduce((sum, asset) => sum + asset.accumulated_depreciation, 0)
      const activeAssets = assetsWithCalculations.filter(asset => asset.current_value > 0).length
      
      setStats({
        totalValue,
        currentValue,
        totalDepreciation,
        activeAssets
      })
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1) // Forzar recarga
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Activos e Inmovilizados</h1>
          <p className="text-gray-600 mt-1">Gestiona y amortiza tus bienes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Activo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total Compra</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalValue.toFixed(2)}€
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-equus-blue-soft" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Contable Neto</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.currentValue.toFixed(2)}€
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Amortización Acumulada</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.totalDepreciation.toFixed(2)}€
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos Activos</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.activeAssets}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Depreciation Chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Evolución de Amortizaciones
          </h3>
          <DepreciationChart />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos los Activos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="depreciated">Amortizados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AssetsList key={`all-${refreshKey}`} filter="all" />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <AssetsList key={`active-${refreshKey}`} filter="active" />
        </TabsContent>

        <TabsContent value="depreciated" className="mt-6">
          <AssetsList key={`depreciated-${refreshKey}`} filter="fully_depreciated" />
        </TabsContent>
      </Tabs>

      {/* Asset Form Modal */}
      {showForm && (
        <AssetForm onClose={handleFormClose} />
      )}
    </div>
  )
}
