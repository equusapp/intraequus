'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Building2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ContactForm from '@/components/contactos/contact-form'
import ContactsList from '@/components/contactos/contacts-list'
import { contactsService } from '@/lib/supabase/services/contacts'

export default function ContactosPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSuppliers: 0,
    both: 0
  })
  const [refreshKey, setRefreshKey] = useState(0)

  // Cargar estadísticas
  useEffect(() => {
    loadStats()
  }, [refreshKey])

  async function loadStats() {
    try {
      const contacts = await contactsService.getAll()
      const totalClients = contacts.filter(c => c.type === 'client' || c.type === 'both').length
      const totalSuppliers = contacts.filter(c => c.type === 'supplier' || c.type === 'both').length
      const both = contacts.filter(c => c.type === 'both').length
      
      setStats({
        totalClients,
        totalSuppliers,
        both
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
          <h1 className="text-3xl font-bold text-gray-800">Contactos</h1>
          <p className="text-gray-600 mt-1">Gestiona tus clientes y proveedores</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Contacto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Proveedores</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalSuppliers}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ambos</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.both}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, CIF o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="client">Clientes</TabsTrigger>
          <TabsTrigger value="supplier">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ContactsList key={`all-${refreshKey}`} filter="all" searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          <ContactsList key={`client-${refreshKey}`} filter="client" searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="supplier" className="mt-6">
          <ContactsList key={`supplier-${refreshKey}`} filter="supplier" searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>

      {/* Contact Form Modal */}
      {showForm && (
        <ContactForm onClose={handleFormClose} />
      )}
    </div>
  )
}
