import { createClient } from '../client-typed'

// Temporary types for deployment
interface Contact {
  id: string
  company_id: string
  name: string
  tax_id: string | null
  email: string | null
  phone: string | null
  address: string | null
  type: 'client' | 'supplier' | 'both'
  created_at: string
  updated_at: string
}

interface ContactInsert {
  id?: string
  company_id?: string
  name: string
  tax_id?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  type?: 'client' | 'supplier' | 'both'
  created_at?: string
  updated_at?: string
}

interface ContactUpdate {
  id?: string
  company_id?: string
  name?: string
  tax_id?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  type?: 'client' | 'supplier' | 'both'
  created_at?: string
  updated_at?: string
}

// ID temporal de la empresa
const TEMP_COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000'

export const contactsService = {
  // Obtener todos los contactos
  async getAll(companyId: string = TEMP_COMPANY_ID, userId?: string, userRole?: string): Promise<Contact[]> {
    const supabase = createClient()
    
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)

    // Si es usuario comercial, filtrar por clientes permitidos
    if (userRole === 'comercial' && userId) {
      const { data: permissions } = await supabase
        .from('user_client_permissions')
        .select('contact_id')
        .eq('user_id', userId)

      if (permissions && permissions.length > 0) {
        const allowedContactIds = permissions.map(p => p.contact_id)
        query = query.in('id', allowedContactIds)
      } else {
        return []
      }
    }

    const { data, error } = await query.order('name', { ascending: true })

    if (error) {
      console.error('Error al obtener contactos:', error)
      throw error
    }

    return data
  },

  // Obtener contacto por ID
  async getById(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error al obtener contacto:', error)
      throw error
    }

    return data
  },

  // Obtener contactos por tipo
  async getByType(type: 'client' | 'supplier' | 'both', companyId: string = TEMP_COMPANY_ID) {
    const supabase = createClient()
    
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('company_id', companyId)

    if (type !== 'both') {
      query = query.or(`type.eq.${type},type.eq.both`)
    }

    query = query.order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener contactos por tipo:', error)
      throw error
    }

    return data
  },

  // Crear contacto
  async create(contact: ContactInsert) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        ...contact,
        company_id: TEMP_COMPANY_ID
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error al crear contacto:', error)
      throw error
    }

    return data
  },

  // Actualizar contacto
  async update(id: string, contact: ContactUpdate) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('contacts')
      .update({
        ...contact,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error al actualizar contacto:', error)
      throw error
    }

    return data
  },

  // Eliminar contacto
  async delete(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error al eliminar contacto:', error)
      throw error
    }

    return true
  }
}
