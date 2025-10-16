'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SupabaseTest() {
  const [status, setStatus] = useState('Verificando...')
  const [invoices, setInvoices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    try {
      console.log('🧪 Iniciando test de conexión...')
      setStatus('Conectando...')
      setError(null)

      const supabase = createClient()
      console.log('🧪 Cliente creado:', supabase)

      // Test 1: Conexión básica
      const { data: testData, error: testError } = await supabase
        .from('companies')
        .select('count')
        .limit(1)

      if (testError) {
        console.error('❌ Error en test básico:', testError)
        setError(`Error de conexión: ${testError.message}`)
        setStatus('Error de conexión')
        return
      }

      console.log('✅ Conexión básica OK')

      // Test 2: Obtener facturas (TODAS)
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')

      if (invoicesError) {
        console.error('❌ Error al obtener facturas:', invoicesError)
        setError(`Error al obtener facturas: ${invoicesError.message}`)
        setStatus('Error al obtener facturas')
        return
      }

      // Test 3: Obtener contactos
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')

      console.log('👥 Contactos encontrados:', contactsData)

      if (contactsError) {
        console.error('❌ Error al obtener contactos:', contactsError)
      }

      console.log('📋 Facturas obtenidas:', invoicesData)
      setInvoices(invoicesData || [])
      setStatus(`✅ Conexión OK - ${invoicesData?.length || 0} facturas encontradas`)

    } catch (err) {
      console.error('❌ Error inesperado:', err)
      setError(`Error inesperado: ${err instanceof Error ? err.message : 'Error desconocido'}`)
      setStatus('Error inesperado')
    }
  }

  const insertTestData = async () => {
    try {
      console.log('🌱 Insertando datos de prueba...')
      const supabase = createClient()

      // Insertar empresa
      const { error: companyError } = await supabase
        .from('companies')
        .upsert({
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'EQUUS THE HORSING APP, S.L.',
          tax_id: 'B22810535',
          address: 'Calle Ejemplo 123',
          city: 'Madrid',
          postal_code: '28001',
          country: 'España'
        } as any)

      if (companyError) {
        console.error('❌ Error al insertar empresa:', companyError)
        return
      }

      // Insertar contacto
      const { error: contactError } = await supabase
        .from('contacts')
        .upsert({
          id: 'contact-test-1',
          company_id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Cliente de Prueba',
          tax_id: 'B11111111',
          email: 'test@test.com',
          type: 'client'
        } as any)

      if (contactError) {
        console.error('❌ Error al insertar contacto:', contactError)
        return
      }

      // Insertar factura
      const { error: invoiceError } = await supabase
        .from('invoices')
        .upsert({
          id: 'invoice-test-1',
          company_id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'issued',
          invoice_number: 'TEST-001',
          contact_id: 'contact-test-1',
          issue_date: new Date().toISOString().split('T')[0],
          concept: 'Factura de prueba',
          base_amount: 100,
          vat_rate: 21,
          vat_amount: 21,
          total_amount: 121,
          status: 'pending'
        } as any)

      if (invoiceError) {
        console.error('❌ Error al insertar factura:', invoiceError)
        return
      }

      console.log('✅ Datos de prueba insertados')
      await testConnection() // Recargar datos
    } catch (err) {
      console.error('❌ Error al insertar datos:', err)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Test de Conexión Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection}>🔄 Probar Conexión</Button>
          <Button onClick={insertTestData} variant="outline">🌱 Insertar Datos de Prueba</Button>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <strong>Estado:</strong> {status}
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div>
          <h3 className="font-bold mb-2">📋 Facturas Encontradas ({invoices.length}):</h3>
          {invoices.length === 0 ? (
            <p className="text-gray-500">No hay facturas</p>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="p-3 border rounded">
                  <div className="font-semibold">{invoice.invoice_number}</div>
                  <div className="text-sm text-gray-600">
                    Cliente: {invoice.contact?.name || 'Sin contacto'} | 
                    Total: €{invoice.total_amount} | 
                    Estado: {invoice.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
