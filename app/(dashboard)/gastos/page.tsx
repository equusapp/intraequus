'use client'

import { useState, useEffect } from 'react'
import { Plus, Wallet, TrendingDown, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ExpenseForm from '@/components/gastos/expense-form'
import ExpensesList from '@/components/gastos/expenses-list'
import { expensesService } from '@/lib/supabase/services/expenses'

export default function GastosPage() {
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState({
    totalMonth: 0,
    totalYear: 0,
    categories: 0,
    pending: 0
  })
  const [refreshKey, setRefreshKey] = useState(0)

  // Cargar estadísticas
  useEffect(() => {
    loadStats()
  }, [refreshKey])

  async function loadStats() {
    try {
      const expenses = await expensesService.getAll()
      
      // Calcular totales del mes actual
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.expense_date)
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
      })
      
      // Calcular totales del año actual
      const yearExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.expense_date)
        return expDate.getFullYear() === currentYear
      })
      
      // Contar categorías únicas
      const uniqueCategories = new Set(expenses.map(exp => exp.category)).size
      
      // Contar gastos sin clasificar (sin categoría)
      const pending = expenses.filter(exp => !exp.category || exp.category === '').length
      
      setStats({
        totalMonth: monthExpenses.reduce((sum, exp) => sum + exp.total_amount, 0),
        totalYear: yearExpenses.reduce((sum, exp) => sum + exp.total_amount, 0),
        categories: uniqueCategories,
        pending
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
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Gastos</h1>
          <p className="text-gray-600 mt-1">Organiza y controla tus gastos y tickets</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Gasto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gastos este Mes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalMonth.toFixed(2)}€
                </p>
              </div>
              <Calendar className="h-8 w-8 text-equus-blue-soft" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Año</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.totalYear.toFixed(2)}€
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
                <p className="text-sm font-medium text-gray-600">Categorías</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.categories}
                </p>
              </div>
              <Tag className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sin Clasificar</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos los Gastos</TabsTrigger>
          <TabsTrigger value="month">Este Mes</TabsTrigger>
          <TabsTrigger value="categories">Por Categoría</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ExpensesList key={`all-${refreshKey}`} filter="all" />
        </TabsContent>

        <TabsContent value="month" className="mt-6">
          <ExpensesList key={`month-${refreshKey}`} filter="month" />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <ExpensesList key={`categories-${refreshKey}`} filter="categories" />
        </TabsContent>
      </Tabs>

      {/* Expense Form Modal */}
      {showForm && (
        <ExpenseForm onClose={handleFormClose} />
      )}
    </div>
  )
}
