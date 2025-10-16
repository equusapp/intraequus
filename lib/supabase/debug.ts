import { createClient } from './client'

export const debugService = {
  // Verificar conexión básica
  async testConnection() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('companies').select('*').limit(1)
      
      if (error) {
        console.error('❌ Error de conexión:', error)
        return false
      }
      
      console.log('✅ Conexión exitosa con Supabase')
      console.log('📊 Datos de prueba:', data)
      return true
    } catch (err) {
      console.error('❌ Error inesperado:', err)
      return false
    }
  },

  // Verificar facturas
  async checkInvoices() {
    try {
      const supabase = createClient()
      
      // Obtener todas las facturas sin filtro de empresa
      const { data: allInvoices, error: allError } = await supabase
        .from('invoices')
        .select('*')
      
      if (allError) {
        console.error('❌ Error al obtener todas las facturas:', allError)
        return
      }
      
      console.log('📋 Total de facturas en la BD:', allInvoices?.length || 0)
      console.log('📋 Facturas encontradas:', allInvoices)
      
      // Obtener facturas con el ID de empresa específico
      const TEMP_COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000'
      const { data: companyInvoices, error: companyError } = await supabase
        .from('invoices')
        .select('*')
        .eq('company_id', TEMP_COMPANY_ID)
      
      if (companyError) {
        console.error('❌ Error al obtener facturas de la empresa:', companyError)
        return
      }
      
      console.log(`📋 Facturas de la empresa ${TEMP_COMPANY_ID}:`, companyInvoices?.length || 0)
      console.log('📋 Datos:', companyInvoices)
      
      return { allInvoices, companyInvoices }
    } catch (err) {
      console.error('❌ Error inesperado:', err)
    }
  },

  // Verificar contactos
  async checkContacts() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('contacts').select('*')
      
      if (error) {
        console.error('❌ Error al obtener contactos:', error)
        return
      }
      
      console.log('👥 Total de contactos:', data?.length || 0)
      console.log('👥 Contactos:', data)
      return data
    } catch (err) {
      console.error('❌ Error inesperado:', err)
    }
  },

  // Verificar empresas
  async checkCompanies() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('companies').select('*')
      
      if (error) {
        console.error('❌ Error al obtener empresas:', error)
        return
      }
      
      console.log('🏢 Total de empresas:', data?.length || 0)
      console.log('🏢 Empresas:', data)
      return data
    } catch (err) {
      console.error('❌ Error inesperado:', err)
    }
  },

  // Ejecutar todos los checks
  async runAllChecks() {
    console.log('🔍 === DEBUG SUPABASE ===')
    
    await this.testConnection()
    await this.checkCompanies()
    await this.checkContacts()
    await this.checkInvoices()
    
    console.log('🔍 === FIN DEBUG ===')
  }
}

// Ejecutar automáticamente en desarrollo
if (typeof window !== 'undefined') {
  // Solo en el navegador
  (window as any).debugSupabase = debugService
  console.log('🔧 Debug disponible: window.debugSupabase.runAllChecks()')
}
