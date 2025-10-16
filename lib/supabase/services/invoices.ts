import { createClient } from '../client'
import { Database } from '../types'

type Invoice = Database['public']['Tables']['invoices']['Row']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

// ID temporal de la empresa (en producción vendrá del usuario autenticado)
const TEMP_COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000'

export const invoicesService = {
  // Obtener todas las facturas con información del contacto
  async getAll(companyId?: string, userId?: string, userRole?: string) {
    const supabase = createClient()
    
    console.log('🔍 Buscando facturas...')
    
    let query = supabase
      .from('invoices')
      .select(`
        *,
        contact:contacts(id, name, email, type)
      `)

    // Si es usuario comercial, filtrar por clientes permitidos
    if (userRole === 'comercial' && userId) {
      // Obtener IDs de clientes permitidos para este usuario
      const { data: permissions } = await supabase
        .from('user_client_permissions')
        .select('contact_id')
        .eq('user_id', userId)

      if (permissions && permissions.length > 0) {
        const allowedContactIds = permissions.map(p => p.contact_id)
        query = query.in('contact_id', allowedContactIds)
      } else {
        // Si no tiene permisos, devolver array vacío
        return []
      }
    }

    const { data, error } = await query.order('issue_date', { ascending: false })

    console.log('🔍 Facturas encontradas:', data?.length || 0)

    if (error) {
      console.error('❌ Error al obtener facturas:', error)
      throw error
    }

    return data || []
  },

  // Obtener una factura por ID
  async getById(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        contact:contacts(id, name, email, phone, address, type, tax_id)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener factura:', error)
      throw error
    }

    return data
  },

  // Crear nueva factura
  async create(invoice: InvoiceInsert) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        ...invoice,
        company_id: TEMP_COMPANY_ID
      })
      .select()
      .single()

    if (error) {
      console.error('Error al crear factura:', error)
      throw error
    }

    return data
  },

  // Actualizar factura
  async update(id: string, invoice: InvoiceUpdate) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('invoices')
      .update({
        ...invoice,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar factura:', error)
      throw error
    }

    return data
  },

  // Actualizar estado de pago
  async updateStatus(id: string, status: 'paid' | 'pending' | 'overdue' | 'cancelled') {
    const supabase = createClient()
    
    const updateData: InvoiceUpdate = {
      status,
      payment_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar estado:', error)
      throw error
    }

    return data
  },

  // Eliminar factura
  async delete(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar factura:', error)
      throw error
    }

    return true
  },

  // Duplicar factura
  async duplicate(id: string) {
    const supabase = createClient()
    
    // Obtener la factura original
    const { data: original, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error al obtener factura original:', fetchError)
      throw fetchError
    }

    // Crear copia sin id, created_at, updated_at
    const { id: _, created_at, updated_at, ...invoiceData } = original
    
    const newInvoice: InvoiceInsert = {
      ...invoiceData,
      invoice_number: `${original.invoice_number}-COPY`,
      status: 'draft',
      payment_date: null
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert(newInvoice)
      .select()
      .single()

    if (error) {
      console.error('Error al duplicar factura:', error)
      throw error
    }

    return data
  },

  // Filtrar facturas
  async filter(filters: {
    type?: 'issued' | 'received'
    status?: string
    searchTerm?: string
    companyId?: string
  }) {
    const supabase = createClient()
    let query = supabase
      .from('invoices')
      .select(`
        *,
        contact:contacts(id, name, email, type)
      `)
      .eq('company_id', filters.companyId || TEMP_COMPANY_ID)

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.searchTerm) {
      query = query.or(`invoice_number.ilike.%${filters.searchTerm}%,concept.ilike.%${filters.searchTerm}%`)
    }

    query = query.order('issue_date', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error al filtrar facturas:', error)
      throw error
    }

    return data
  }
}
