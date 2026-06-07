import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RecordForm } from '@/components/RecordForm'

export default async function NewRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pet } = await supabase.from('pets').select('id, name').eq('id', id).eq('user_id', user.id).single()
  if (!pet) notFound()

  return (
    <div className="max-w-lg mx-auto">
      <Link href={`/dashboard/pets/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Zpět na {pet.name}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Přidat záznam pro {pet.name}</h1>
      <RecordForm petId={id} />
    </div>
  )
}
