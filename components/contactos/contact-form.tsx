'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { contactsService } from '@/lib/supabase/services/contacts'
import { useToast } from '@/components/ui/use-toast'

interface ContactFormProps {
  onClose: () => void
  contact?: any
}

export default function ContactForm({ onClose, contact }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    taxId: contact?.tax_id || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    address: contact?.address || '',
    type: contact?.type || 'client',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre es obligatorio',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      const contactData = {
        name: formData.name.trim(),
        tax_id: formData.taxId.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        type: formData.type as 'client' | 'supplier' | 'both'
      }

      if (contact?.id) {
        // Actualizar contacto existente
        await contactsService.update(contact.id, contactData)
        toast({
          title: 'Contacto actualizado',
          description: 'El contacto se ha actualizado correctamente'
        })
      } else {
        // Crear nuevo contacto
        await contactsService.create(contactData as any)
        toast({
          title: 'Contacto creado',
          description: 'El contacto se ha creado correctamente'
        })
      }

      onClose()
    } catch (error) {
      console.error('Error al guardar contacto:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el contacto',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {contact ? 'Editar Contacto' : 'Nuevo Contacto'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo de Contacto *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="supplier">Proveedor</SelectItem>
                <SelectItem value="both">Cliente y Proveedor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Nombre / Razón Social *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nombre completo o empresa"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CIF / NIF</Label>
              <Input
                value={formData.taxId}
                onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                placeholder="B12345678"
              />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+34 600 000 000"
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="contacto@ejemplo.com"
            />
          </div>

          <div>
            <Label>Dirección</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Calle, número, ciudad"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Contacto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
