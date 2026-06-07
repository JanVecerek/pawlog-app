import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, PawPrint } from 'lucide-react'
import type { Pet } from '@/lib/types'

const speciesEmoji: Record<string, string> = {
  pes: '🐶',
  kočka: '🐱',
  králík: '🐰',
  ptáček: '🐦',
  plaz: '🦎',
  jiný: '🐾',
}

function calcAge(birthDate: string | null): string {
  if (!birthDate) return ''
  const birth = new Date(birthDate)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  const months = now.getMonth() - birth.getMonth()
  const totalMonths = years * 12 + months
  if (totalMonths < 12) return `${totalMonths} měs.`
  const y = Math.floor(totalMonths / 12)
  return `${y} ${y === 1 ? 'rok' : y < 5 ? 'roky' : 'let'}`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moji mazlíčci</h1>
          <p className="text-sm text-gray-500 mt-0.5">Zdravotní záznamy vašich miláčků</p>
        </div>
        <Link href="/dashboard/pets/new">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Plus className="h-4 w-4 mr-1" />
            Přidat mazlíčka
          </Button>
        </Link>
      </div>

      {!pets || pets.length === 0 ? (
        <div className="text-center py-20">
          <PawPrint className="h-16 w-16 text-amber-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Zatím žádní mazlíčci</h2>
          <p className="text-gray-400 mb-6">Přidejte svého prvního mazlíčka a začněte vést záznamy</p>
          <Link href="/dashboard/pets/new">
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Plus className="h-4 w-4 mr-1" />
              Přidat mazlíčka
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(pets as Pet[]).map((pet) => (
            <Link key={pet.id} href={`/dashboard/pets/${pet.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{speciesEmoji[pet.species] ?? '🐾'}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                        {pet.breed && <p className="text-sm text-gray-500">{pet.breed}</p>}
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {pet.species}
                    </Badge>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm text-gray-500">
                    {pet.birth_date && (
                      <span>Věk: <span className="font-medium text-gray-700">{calcAge(pet.birth_date)}</span></span>
                    )}
                    {pet.weight_kg && (
                      <span>Váha: <span className="font-medium text-gray-700">{pet.weight_kg} kg</span></span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
