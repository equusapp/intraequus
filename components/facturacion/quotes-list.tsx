'use client'

import { FileText, Send, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockQuotes = [
  {
    id: '1',
    quote_number: 'PRE-2025-001',
    client: 'Club Hípico Sevilla',
    issue_date: '2025-01-15',
    valid_until: '2025-02-15',
    total_amount: 5600.00,
    status: 'sent'
  },
  {
    id: '2',
    quote_number: 'PRE-2025-002',
    client: 'Rancho Los Olivos',
    issue_date: '2025-01-18',
    valid_until: '2025-02-18',
    total_amount: 3200.00,
    status: 'accepted'
  },
  {
    id: '3',
    quote_number: 'PRE-2025-003',
    client: 'Escuela Ecuestre Norte',
    issue_date: '2025-01-20',
    valid_until: '2025-02-20',
    total_amount: 4150.00,
    status: 'draft'
  },
]

export default function QuotesList() {
  return (
    <div className="space-y-4">
      {mockQuotes.map((quote) => (
        <Card key={quote.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 grid grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Número</p>
                <p className="font-semibold text-gray-800">{quote.quote_number}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Cliente</p>
                <p className="font-medium text-gray-800">{quote.client}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Fecha Emisión</p>
                <p className="text-gray-800">{formatDate(quote.issue_date)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Válido Hasta</p>
                <p className="text-gray-800">{formatDate(quote.valid_until)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Importe</p>
                <p className="font-bold text-lg text-gray-800">
                  {formatCurrency(quote.total_amount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <QuoteStatusBadge status={quote.status} />
              
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" title="Ver">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Enviar">
                  <Send className="h-4 w-4" />
                </Button>
                {quote.status === 'accepted' && (
                  <Button size="sm" className="gap-1">
                    <Check className="h-4 w-4" />
                    Convertir a Factura
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function QuoteStatusBadge({ status }: { status: string }) {
  const config = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Borrador' },
    sent: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Send, label: 'Enviado' },
    accepted: { bg: 'bg-green-100', text: 'text-green-700', icon: Check, label: 'Aceptado' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: X, label: 'Rechazado' },
    expired: { bg: 'bg-gray-200', text: 'text-gray-600', icon: Clock, label: 'Expirado' },
  }

  const { bg, text, icon: Icon, label } = config[status as keyof typeof config] || config.draft

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}
