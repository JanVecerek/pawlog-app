import { PetForm } from '@/components/PetForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewPetPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Zpět na přehled
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Přidat mazlíčka</h1>
      <PetForm />
    </div>
  )
}
