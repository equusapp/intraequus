import { createClient } from './client'

const COMPANY_ID = '123e4567-e89b-12d3-a456-426614174000'

export const seedData = {
  // Insertar datos de prueba
  async insertTestData() {
    const supabase = createClient()
    
    try {
      console.log('🌱 Insertando datos de prueba...')
      
      // 1. Insertar empresa EQUUS
      const { error: companyError } = await supabase
        .from('companies')
        .upsert({
          id: COMPANY_ID,
          name: 'EQUUS THE HORSING APP, S.L.',
          tax_id: 'B22810535',
          address: 'Calle Ginzo de Limia 53, Piso 17 Puerta A',
          city: 'Madrid',
          postal_code: '28034',
          country: 'España'
        } as any)
      
      if (companyError) {
        console.error('❌ Error al insertar empresa:', companyError)
        return false
      }
      console.log('✅ Empresa EQUUS insertada')
      
      // 2. Insertar contactos
      const contacts = [
        {
          id: 'contact-1',
          company_id: COMPANY_ID,
          name: 'Club Hípico Madrid',
          tax_id: 'B11111111',
          email: 'info@clubhipicomadrid.com',
          phone: '+34 911 222 333',
          type: 'client' as const
        },
        {
          id: 'contact-2',
          company_id: COMPANY_ID,
          name: 'Veterinaria Equina S.L.',
          tax_id: 'B22222222',
          email: 'contacto@veterinariaequina.es',
          phone: '+34 622 333 444',
          type: 'supplier' as const
        },
        {
          id: 'contact-3',
          company_id: COMPANY_ID,
          name: 'Escuela Los Pinos',
          tax_id: 'B33333333',
          email: 'escuela@lospinos.com',
          phone: '+34 633 444 555',
          type: 'client' as const
        }
      ]
      
      const { error: contactsError } = await supabase
        .from('contacts')
        .upsert(contacts as any)
      
      if (contactsError) {
        console.error('❌ Error al insertar contactos:', contactsError)
        return false
      }
      console.log('✅ Contactos insertados')
      
      // 3. Insertar facturas
      const invoices = [
        {
          id: 'invoice-1',
          company_id: COMPANY_ID,
          type: 'issued' as const,
          invoice_number: 'FAC-2025-001',
          contact_id: 'contact-1',
          issue_date: '2025-01-15',
          concept: 'Clases de equitación - Enero 2025',
          base_amount: 2450.00,
          vat_rate: 21,
          vat_amount: 514.50,
          total_amount: 2964.50,
          status: 'paid' as const,
          payment_date: '2025-01-20'
        },
        {
          id: 'invoice-2',
          company_id: COMPANY_ID,
          type: 'issued' as const,
          invoice_number: 'FAC-2025-002',
          contact_id: 'contact-3',
          issue_date: '2025-01-18',
          concept: 'Alquiler de instalaciones',
          base_amount: 1890.50,
          vat_rate: 21,
          vat_amount: 397.01,
          total_amount: 2287.51,
          status: 'pending' as const
        },
        {
          id: 'invoice-3',
          company_id: COMPANY_ID,
          type: 'received' as const,
          invoice_number: 'REC-2025-015',
          contact_id: 'contact-2',
          issue_date: '2025-01-10',
          concept: 'Revisión veterinaria caballos',
          base_amount: 850.00,
          vat_rate: 21,
          vat_amount: 178.50,
          total_amount: 1028.50,
          status: 'paid' as const,
          payment_date: '2025-01-12'
        }
      ]
      
      const { error: invoicesError } = await supabase
        .from('invoices')
        .upsert(invoices as any)
      
      if (invoicesError) {
        console.error('❌ Error al insertar facturas:', invoicesError)
        return false
      }
      console.log('✅ Facturas insertadas')
      
      console.log('🎉 Datos de prueba insertados correctamente')
      return true
      
    } catch (error) {
      console.error('❌ Error general:', error)
      return false
    }
  },

  // Limpiar todos los datos
  async clearAllData() {
    const supabase = createClient()
    
    try {
      console.log('🧹 Limpiando datos...')
      
      // Eliminar en orden (por las foreign keys)
      await supabase.from('invoices').delete().eq('company_id', COMPANY_ID)
      await supabase.from('contacts').delete().eq('company_id', COMPANY_ID)
      await supabase.from('companies').delete().eq('id', COMPANY_ID)
      
      console.log('✅ Datos limpiados')
      return true
    } catch (error) {
      console.error('❌ Error al limpiar:', error)
      return false
    }
  },

  // Verificar datos existentes
  async checkExistingData() {
    const supabase = createClient()
    
    try {
      const { data: companies } = await supabase.from('companies').select('*')
      const { data: contacts } = await supabase.from('contacts').select('*')
      const { data: invoices } = await supabase.from('invoices').select('*')
      
      console.log('📊 Datos existentes:')
      console.log('  Empresas:', companies?.length || 0)
      console.log('  Contactos:', contacts?.length || 0)
      console.log('  Facturas:', invoices?.length || 0)
      
      return {
        companies: companies?.length || 0,
        contacts: contacts?.length || 0,
        invoices: invoices?.length || 0
      }
    } catch (error) {
      console.error('❌ Error al verificar datos:', error)
      return null
    }
  }
}

// Hacer disponible en el navegador para debug
if (typeof window !== 'undefined') {
  (window as any).seedData = seedData
  console.log('🌱 Seed data disponible: window.seedData.insertTestData()')
}
