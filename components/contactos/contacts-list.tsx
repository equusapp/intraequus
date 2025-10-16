'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { contactsService } from '@/lib/supabase/services/contacts'
import { useToast } from '@/components/ui/use-toast'

interface ContactsListProps {
  filter: string
  searchTerm: string
}

// Los datos ahora vienen de Supabase

export default function ContactsList({ filter, searchTerm }: ContactsListProps) {
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editContact, setEditContact] = useState<any>(null)
  const { toast } = useToast()

  // Cargar contactos desde Supabase
  useEffect(() => {
    loadContacts()
  }, [])

  async function loadContacts() {
    try {
      setLoading(true)
      console.log('🔄 Cargando contactos...')
      
      const data = await contactsService.getAll()
      console.log('👥 Contactos cargados:', data)
      setContacts(data || [])
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No se encontraron contactos')
      }
    } catch (error) {
      console.error('❌ Error al cargar contactos:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los contactos',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para eliminar contacto
  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      try {
        await contactsService.delete(id)
        await loadContacts()
        toast({
          title: 'Contacto eliminado',
          description: 'El contacto ha sido eliminado correctamente'
        })
      } catch (error) {
        console.error('Error al eliminar contacto:', error)
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el contacto',
          variant: 'destructive'
        })
      }
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesFilter = filter === 'all' || contact.type === filter || contact.type === 'both'
    const matchesSearch = searchTerm === '' || 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.tax_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-equus-blue-soft mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando contactos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {filteredContacts.map((contact) => (
        <Card key={contact.id} className="p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{contact.name}</h3>
              {contact.tax_id && (
                <p className="text-sm text-gray-500">CIF: {contact.tax_id}</p>
              )}
            </div>
            <TypeBadge type={contact.type} />
          </div>

          <div className="space-y-2 mb-4">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:text-equus-blue-soft">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <a href={`tel:${contact.phone}`} className="hover:text-equus-blue-soft">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{contact.address}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-equus-sand">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 gap-1"
              onClick={() => setEditContact(contact)}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDelete(contact.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </Card>
      ))}

      {filteredContacts.length === 0 && (
        <div className="col-span-2 text-center py-12">
          <p className="text-gray-500">No se encontraron contactos</p>
        </div>
      )}
    </div>
  )
}

function TypeBadge({ type }: { type: string }) {
  const config = {
    client: { bg: 'bg-green-100', text: 'text-green-700', label: 'Cliente' },
    supplier: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Proveedor' },
    both: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Ambos' },
  }

  const { bg, text, label } = config[type as keyof typeof config]

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>
      {label}
    </span>
  )
}
