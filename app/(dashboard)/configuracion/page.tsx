'use client'

import { Building2, User, Shield, Palette, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
        <p className="text-gray-600 mt-1">Personaliza tu cuenta y preferencias</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-equus-blue-soft" />
                <div>
                  <CardTitle>Datos de la Empresa</CardTitle>
                  <CardDescription>Información fiscal y de contacto</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre de la Empresa *</Label>
                  <Input defaultValue="EQUUS Club Ecuestre" />
                </div>
                <div>
                  <Label>CIF / NIF *</Label>
                  <Input defaultValue="B12345678" />
                </div>
              </div>

              <div>
                <Label>Dirección</Label>
                <Input defaultValue="Calle Principal, 123" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Ciudad</Label>
                  <Input defaultValue="Madrid" />
                </div>
                <div>
                  <Label>Código Postal</Label>
                  <Input defaultValue="28001" />
                </div>
                <div>
                  <Label>País</Label>
                  <Input defaultValue="España" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" defaultValue="info@equusclub.com" />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input defaultValue="+34 911 222 333" />
                </div>
              </div>

              <div>
                <Label>Logo de la Empresa</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-24 h-24 bg-equus-beige rounded-lg flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button variant="outline">Subir Logo</Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-equus-blue-soft" />
                <div>
                  <CardTitle>Mi Perfil</CardTitle>
                  <CardDescription>Gestiona tu información personal</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nombre Completo</Label>
                <Input defaultValue="Juan Pérez García" />
              </div>

              <div>
                <Label>Email</Label>
                <Input type="email" defaultValue="juan.perez@equusclub.com" />
              </div>

              <div>
                <Label>Rol</Label>
                <Input defaultValue="Administrador" disabled />
              </div>

              <div>
                <Label>Cambiar Contraseña</Label>
                <div className="space-y-3 mt-2">
                  <Input type="password" placeholder="Contraseña actual" />
                  <Input type="password" placeholder="Nueva contraseña" />
                  <Input type="password" placeholder="Confirmar contraseña" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Actualizar Perfil</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-equus-blue-soft" />
                  <div>
                    <CardTitle>Usuarios y Roles</CardTitle>
                    <CardDescription>Gestiona el acceso de tu equipo</CardDescription>
                  </div>
                </div>
                <Button>Invitar Usuario</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <UserRow 
                  name="Juan Pérez" 
                  email="juan.perez@equusclub.com" 
                  role="Administrador"
                  active={true}
                />
                <UserRow 
                  name="María González" 
                  email="maria.gonzalez@equusclub.com" 
                  role="Contable"
                  active={true}
                />
                <UserRow 
                  name="Carlos Ruiz" 
                  email="carlos.ruiz@equusclub.com" 
                  role="Colaborador"
                  active={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-equus-blue-soft" />
                <div>
                  <CardTitle>Apariencia</CardTitle>
                  <CardDescription>Personaliza el aspecto de la aplicación</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Esquema de Color</Label>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <ColorScheme name="EQUUS Original" selected={true} />
                  <ColorScheme name="Modo Oscuro" selected={false} />
                  <ColorScheme name="Alto Contraste" selected={false} />
                </div>
              </div>

              <div>
                <Label>Formato de Moneda</Label>
                <Input defaultValue="EUR (€)" disabled />
              </div>

              <div>
                <Label>Formato de Fecha</Label>
                <Input defaultValue="DD/MM/YYYY" />
              </div>

              <div className="flex justify-end pt-4">
                <Button>Guardar Preferencias</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-equus-blue-soft" />
                <div>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura cómo quieres recibir avisos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationToggle 
                title="Facturas Vencidas" 
                description="Recibe un aviso cuando una factura esté próxima a vencer"
                enabled={true}
              />
              <NotificationToggle 
                title="Nuevos Movimientos Bancarios" 
                description="Notificación al subir un nuevo extracto bancario"
                enabled={true}
              />
              <NotificationToggle 
                title="Resumen Mensual" 
                description="Recibe un resumen contable al final de cada mes"
                enabled={false}
              />
              <NotificationToggle 
                title="Actualizaciones del Sistema" 
                description="Información sobre nuevas funcionalidades"
                enabled={true}
              />

              <div className="flex justify-end pt-4">
                <Button>Guardar Configuración</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UserRow({ name, email, role, active }: { name: string, email: string, role: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 border border-equus-sand rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-equus-green-water rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-gray-700" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{name}</p>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{role}</span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {active ? 'Activo' : 'Inactivo'}
        </span>
        <Button variant="ghost" size="sm">Editar</Button>
      </div>
    </div>
  )
}

function ColorScheme({ name, selected }: { name: string, selected: boolean }) {
  return (
    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
      selected ? 'border-equus-blue-soft bg-equus-beige/30' : 'border-equus-sand hover:border-equus-green-water'
    }`}>
      <div className="flex gap-2 mb-2">
        <div className="w-6 h-6 bg-equus-green-water rounded" />
        <div className="w-6 h-6 bg-equus-blue-soft rounded" />
        <div className="w-6 h-6 bg-equus-beige rounded" />
      </div>
      <p className="text-sm font-medium text-gray-800">{name}</p>
    </div>
  )
}

function NotificationToggle({ title, description, enabled }: { title: string, description: string, enabled: boolean }) {
  return (
    <div className="flex items-start justify-between p-4 border border-equus-sand rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <label className="relative inline-block w-12 h-6 cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
        <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-equus-blue-soft"></div>
      </label>
    </div>
  )
}
