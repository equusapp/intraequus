'use client'

import { useState } from 'react'
import { Link2, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'

interface BankMovementsListProps {
  filter: string
}

// Mock data
const mockMovements = [
  {
    id: '1',
    date: '2025-01-20',
    description: 'TRANSFERENCIA CLUB HIPICO MADRID',
    amount: 2964.50,
    balance: 45230.50,
    reconciled: true,
    invoice_id: '1',
    invoice_number: 'FAC-2025-001'
  },
  {
    id: '2',
    date: '2025-01-18',
    description: 'PAGO NOMINA ENERO',
    amount: -3500.00,
    balance: 42266.00,
    reconciled: false,
    invoice_id: null,
    invoice_number: null
  },
  {
    id: '3',
    date: '2025-01-15',
    description: 'DOMICILIACION LUZ Y AGUA',
    amount: -450.30,
    balance: 45766.00,
    reconciled: true,
    expense_id: '5',
    expense_description: 'Suministros'
  },
  {
    id: '4',
    date: '2025-01-12',
    description: 'PAGO VETERINARIA EQUINA',
    amount: -1028.50,
    balance: 46216.30,
    reconciled: true,
    invoice_id: '3',
    invoice_number: 'REC-2025-015'
  },
  {
    id: '5',
    date: '2025-01-10',
    description: 'TRANSFERENCIA RANCHO EL CABALLO',
    amount: 3872.00,
    balance: 47244.80,
    reconciled: false,
    invoice_id: null,
    invoice_number: null
  },
]

export default function BankMovementsList({ filter }: BankMovementsListProps) {
  const [selectedMovement, setSelectedMovement] = useState<string | null>(null)

  const filteredMovements = mockMovements.filter(movement => {
    if (filter === 'all') return true
    if (filter === 'reconciled') return movement.reconciled
    if (filter === 'pending') return !movement.reconciled
    return true
  })

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-equus-beige/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Importe
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                Saldo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Vinculado a
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovements.map((movement) => (
              <tr 
                key={movement.id}
                className={`hover:bg-equus-beige/30 transition-colors ${
                  selectedMovement === movement.id ? 'bg-equus-green-water/20' : ''
                }`}
                onClick={() => setSelectedMovement(movement.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {movement.reconciled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <Check className="h-3 w-3" />
                      Conciliado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatDate(movement.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {movement.description}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                  movement.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movement.amount > 0 ? '+' : ''}{formatCurrency(movement.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right font-medium">
                  {formatCurrency(movement.balance)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {movement.reconciled ? (
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-green-600" />
                      <span className="text-gray-800">
                        {movement.invoice_number || movement.expense_description || 'Vinculado'}
                      </span>
                    </div>
                  ) : (
                    <ReconcileDropdown movementId={movement.id} />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {!movement.reconciled && (
                    <div className="flex items-center justify-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Link2 className="h-3 w-3" />
                        Vincular
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Plus className="h-3 w-3" />
                        Nuevo
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function ReconcileDropdown({ movementId }: { movementId: string }) {
  return (
    <Select>
      <SelectTrigger className="w-[200px] h-8">
        <SelectValue placeholder="Buscar factura..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">FAC-2025-001</SelectItem>
        <SelectItem value="2">FAC-2025-002</SelectItem>
        <SelectItem value="3">REC-2025-015</SelectItem>
        <SelectItem value="new">+ Crear nuevo registro</SelectItem>
      </SelectContent>
    </Select>
  )
}
