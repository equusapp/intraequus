import { createClient } from '../client'
import { Database } from '../types'

type Expense = Database['public']['Tables']['expenses']['Row']
type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
type ExpenseUpdate = Database['public']['Tables']['expenses']['Update']

const TEMP_COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000'

export const expensesService = {
  // Obtener todos los gastos
  async getAll(companyId: string = TEMP_COMPANY_ID) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        supplier:contacts(id, name)
      `)
      .eq('company_id', companyId)
      .order('expense_date', { ascending: false })

    if (error) {
      console.error('Error al obtener gastos:', error)
      throw error
    }

    return data
  },

  // Obtener gasto por ID
  async getById(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        supplier:contacts(id, name, email, phone)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener gasto:', error)
      throw error
    }

    return data
  },

  // Crear gasto
  async create(expense: ExpenseInsert) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        company_id: TEMP_COMPANY_ID
      })
      .select()
      .single()

    if (error) {
      console.error('Error al crear gasto:', error)
      throw error
    }

    return data
  },

  // Actualizar gasto
  async update(id: string, expense: ExpenseUpdate) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...expense,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar gasto:', error)
      throw error
    }

    return data
  },

  // Eliminar gasto
  async delete(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar gasto:', error)
      throw error
    }

    return true
  },

  // Filtrar por categoría
  async getByCategory(category: string, companyId: string = TEMP_COMPANY_ID) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        supplier:contacts(id, name)
      `)
      .eq('company_id', companyId)
      .eq('category', category)
      .order('expense_date', { ascending: false })

    if (error) {
      console.error('Error al filtrar gastos:', error)
      throw error
    }

    return data
  }
}
