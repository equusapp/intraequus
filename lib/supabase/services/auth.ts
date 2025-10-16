import { createClient } from '../client-typed'

// Temporary interfaces for deployment
interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  role: 'admin' | 'comercial' | 'viewer'
  company_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

type UserProfileInsert = {
  id: string
  company_id: string
  email: string
  full_name?: string
  role?: 'admin' | 'comercial'
  is_active?: boolean
}

export const authService = {
  // Obtener perfil del usuario actual
  async getCurrentUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error al obtener perfil de usuario:', error)
      return null
    }

    return data
  },

  // Crear perfil de usuario (solo admin puede hacer esto)
  async createUserProfile(profile: UserProfileInsert): Promise<UserProfile | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error('Error al crear perfil de usuario:', error)
      throw error
    }

    return data
  },

  // Obtener clientes permitidos para un usuario comercial
  async getUserAllowedClients(userId: string): Promise<string[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_client_permissions')
      .select('contact_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Error al obtener clientes permitidos:', error)
      return []
    }

    return data.map(permission => permission.contact_id)
  },

  // Asignar cliente a usuario comercial (solo admin)
  async assignClientToUser(userId: string, contactId: string): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('user_client_permissions')
      .insert({
        user_id: userId,
        contact_id: contactId
      })

    if (error) {
      console.error('Error al asignar cliente:', error)
      return false
    }

    return true
  },

  // Remover cliente de usuario comercial (solo admin)
  async removeClientFromUser(userId: string, contactId: string): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('user_client_permissions')
      .delete()
      .eq('user_id', userId)
      .eq('contact_id', contactId)

    if (error) {
      console.error('Error al remover cliente:', error)
      return false
    }

    return true
  },

  // Verificar si un usuario tiene acceso a un cliente específico
  async hasAccessToClient(userId: string, contactId: string, userRole: string): Promise<boolean> {
    // Admin tiene acceso a todo
    if (userRole === 'admin') {
      return true
    }

    // Usuario comercial solo tiene acceso a clientes asignados
    if (userRole === 'comercial') {
      const allowedClients = await this.getUserAllowedClients(userId)
      return allowedClients.includes(contactId)
    }

    return false
  },

  // Obtener todos los usuarios (solo admin)
  async getAllUsers(): Promise<UserProfile[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener usuarios:', error)
      return []
    }

    return data
  },

  // Activar/desactivar usuario (solo admin)
  async toggleUserStatus(userId: string, isActive: boolean): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error al cambiar estado de usuario:', error)
      return false
    }

    return true
  }
}
