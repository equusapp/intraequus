import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import { Toaster } from '@/components/ui/toaster'

// Force dynamic rendering for all dashboard pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-equus-cream to-equus-beige">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  )
}
