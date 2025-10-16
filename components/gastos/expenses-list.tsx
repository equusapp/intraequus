'use client'

import { useState, useEffect } from 'react'
import { Eye, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { expensesService } from '@/lib/supabase/services/expenses'
import { useToast } from '@/components/ui/use-toast'

interface ExpensesListProps {
  filter: string
}

// Los datos ahora vienen de Supabase

const categoryColors = {
  alimentacion: 'bg-green-100 text-green-700',
  veterinaria: 'bg-blue-100 text-blue-700',
  mantenimiento: 'bg-yellow-100 text-yellow-700',
  suministros: 'bg-purple-100 text-purple-700',
  nominas: 'bg-red-100 text-red-700',
  seguros: 'bg-indigo-100 text-indigo-700',
  transporte: 'bg-pink-100 text-pink-700',
  otros: 'bg-gray-100 text-gray-700',
}

const categoryLabels = {
  alimentacion: 'Alimentación',
  veterinaria: 'Veterinaria',
  mantenimiento: 'Mantenimiento',
  suministros: 'Suministros',
  nominas: 'Nóminas',
  seguros: 'Seguros',
  transporte: 'Transporte',
  otros: 'Otros',
}

export default function ExpensesList({ filter }: ExpensesListProps) {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Cargar gastos desde Supabase
  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    try {
      setLoading(true)
      console.log('🔄 Cargando gastos...')
      
      const data = await expensesService.getAll()
      console.log('💰 Gastos cargados:', data)
      setExpenses(data || [])
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No se encontraron gastos')
      }
    } catch (error) {
      console.error('❌ Error al cargar gastos:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los gastos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar gasto
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      try {
        await expensesService.delete(id)
        await loadExpenses()
        toast({
          title: 'Gasto eliminado',
          description: 'El gasto ha sido eliminado correctamente'
        })
      } catch (error) {
        console.error('Error al eliminar gasto:', error)
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el gasto',
          variant: 'destructive'
        })
      }
    }
  }

  // Filtrar gastos según el filtro
  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'month') {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const expenseDate = new Date(expense.expense_date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    }
    return true // 'all' muestra todos
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-equus-blue-soft mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando gastos...</p>
        </div>
      </div>
    )
  }

  if (filter === 'categories') {
    return <ExpensesByCategory expenses={filteredExpenses} />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredExpenses.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No se encontraron gastos</p>
        </div>
      ) : (
        filteredExpenses.map((expense) => (
        <Card 
          key={expense.id} 
          className="p-5 hover:shadow-md transition-all group"
        >
          {/* Receipt Preview */}
          {expense.receipt_url && (
            <div className="mb-4 relative h-32 bg-equus-beige/30 rounded-lg flex items-center justify-center overflow-hidden">
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="ghost" className="text-white">
                  Ver Ticket
                </Button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-1">{expense.concept}</p>
                <p className="text-sm text-gray-600">{expense.supplier?.name || 'Sin proveedor'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                categoryColors[expense.category as keyof typeof categoryColors]
              }`}>
                {categoryLabels[expense.category as keyof typeof categoryLabels]}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-equus-sand">
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(expense.expense_date)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(expense.total_amount)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 pt-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDelete(expense.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        </Card>
        ))
      )}
    </div>
  )
}

function ExpensesByCategory({ expenses }: { expenses: any[] }) {
  const groupedByCategory = expenses.reduce((acc: Record<string, any[]>, expense: any) => {
    const category = expense.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(expense)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedByCategory).map(([category, categoryExpenses]) => {
        const total = (categoryExpenses as any[]).reduce((sum: number, exp: any) => sum + exp.total_amount, 0)
        
        return (
          <Card key={category} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-lg font-medium ${
                  categoryColors[category as keyof typeof categoryColors]
                }`}>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
                <span className="text-sm text-gray-500">
                  {(categoryExpenses as any[]).length} gasto{(categoryExpenses as any[]).length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Categoría</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {(categoryExpenses as any[]).map((expense: any) => (
                <div 
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-equus-beige/20 rounded-lg hover:bg-equus-beige/40 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{expense.concept}</p>
                    <p className="text-sm text-gray-600">{expense.supplier?.name || 'Sin proveedor'} • {formatDate(expense.expense_date)}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(expense.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
