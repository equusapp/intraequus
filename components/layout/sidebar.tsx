'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Landmark, 
  Receipt, 
  Wallet, 
  BarChart3,
  Settings,
  Users,
  LogOut,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contabilidad', href: '/contabilidad', icon: FileText },
  { name: 'Conciliación', href: '/conciliacion', icon: Landmark },
  { name: 'Facturación', href: '/facturacion', icon: Receipt },
  { name: 'Gastos', href: '/gastos', icon: Wallet },
  { name: 'Activos', href: '/activos', icon: BarChart3 },
  { name: 'Contactos', href: '/contactos', icon: Users },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()

  // Filtrar navegación según el rol del usuario
  const getFilteredNavigation = () => {
    if (!userProfile) return navigation

    // Admin tiene acceso a todo
    if (userProfile.role === 'admin') {
      return navigation
    }

    // Usuario comercial solo tiene acceso limitado
    if (userProfile.role === 'comercial') {
      return navigation.filter(item => 
        ['Dashboard', 'Contabilidad', 'Contactos'].includes(item.name)
      )
    }

    return navigation
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-equus-sand">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-equus-sand">
        <h1 className="text-xl font-bold text-gray-800">
          EQUUS <span className="text-equus-blue-soft">Accounting</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {getFilteredNavigation().map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-equus-green-water text-gray-900'
                  : 'text-gray-600 hover:bg-equus-beige hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-equus-sand space-y-3">
        {userProfile && (
          <div className="flex items-center gap-3 px-3 py-2 bg-equus-beige/50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-equus-blue-soft rounded-full">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile.full_name || userProfile.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userProfile.role === 'admin' ? 'Administrador' : 'Comercial'}
              </p>
            </div>
          </div>
        )}
        
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          © 2025 EQUUS APP
        </p>
      </div>
    </div>
  )
}
