import SupabaseTest from '@/components/debug/supabase-test'

export default function DebugPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔧 Debug de Supabase</h1>
      <SupabaseTest />
    </div>
  )
}
