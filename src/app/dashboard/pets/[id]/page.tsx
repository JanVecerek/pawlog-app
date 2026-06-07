import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Plus, Calendar, Stethoscope, Syringe, Bug } from 'lucide-react'
import type { Pet, VetVisit, Vaccination, Deworming } from '@/lib/types'
import { DeletePetButton } from '@/components/DeletePetButton'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatCurrency(n: number | null) {
  if (!n) return ''
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n)
}

const speciesEmoji: Record<string, string> = {
  pes: '🐶', kočka: '🐱', králík: '🐰', ptáček: '🐦', plaz: '🦎', jiný: '🐾',
}

export default async function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: pet }, { data: visits }, { data: vaccinations }, { data: dewormings }] = await Promise.all([
    supabase.from('pets').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('vet_visits').select('*').eq('pet_id', id).order('date', { ascending: false }),
    supabase.from('vaccinations').select('*').eq('pet_id', id).order('date_given', { ascending: false }),
    supabase.from('dewormings').select('*').eq('pet_id', id).order('date_given', { ascending: false }),
  ])

  if (!pet) notFound()

  const p = pet as Pet
  const v = (visits ?? []) as VetVisit[]
  const vac = (vaccinations ?? []) as Vaccination[]
  const dew = (dewormings ?? []) as Deworming[]

  return (
    <div>
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Zpět na přehled
      </Link>

      {/* Pet header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{speciesEmoji[p.species] ?? '🐾'}</div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="capitalize">{p.species}</Badge>
              {p.breed && <span className="text-sm text-gray-500">{p.breed}</span>}
            </div>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              {p.birth_date && <span><Calendar className="inline h-3.5 w-3.5 mr-1" />{formatDate(p.birth_date)}</span>}
              {p.weight_kg && <span>Váha: {p.weight_kg} kg</span>}
              {p.chip_number && <span>Čip: {p.chip_number}</span>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/pets/${id}/records/new`}>
            <Button className="bg-amber-500 hover:bg-amber-600">
              <Plus className="h-4 w-4 mr-1" />
              Přidat záznam
            </Button>
          </Link>
          <DeletePetButton petId={id} />
        </div>
      </div>

      {/* Records tabs */}
      <Tabs defaultValue="visits">
        <TabsList className="mb-4">
          <TabsTrigger value="visits" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Návštěvy vetu ({v.length})
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="gap-2">
            <Syringe className="h-4 w-4" />
            Vakcinace ({vac.length})
          </TabsTrigger>
          <TabsTrigger value="dewormings" className="gap-2">
            <Bug className="h-4 w-4" />
            Odčervení ({dew.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visits">
          {v.length === 0 ? (
            <EmptyState icon={<Stethoscope className="h-10 w-10" />} text="Žádné návštěvy vetu" />
          ) : (
            <div className="space-y-3">
              {v.map((visit) => (
                <Card key={visit.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{formatDate(visit.date)}</span>
                          {visit.vet_name && <span className="text-sm text-gray-500">· {visit.vet_name}</span>}
                        </div>
                        {visit.diagnosis && <p className="text-sm text-gray-700"><span className="font-medium">Diagnóza:</span> {visit.diagnosis}</p>}
                        {visit.treatment && <p className="text-sm text-gray-700"><span className="font-medium">Léčba:</span> {visit.treatment}</p>}
                        {visit.notes && <p className="text-sm text-gray-500 mt-1">{visit.notes}</p>}
                      </div>
                      {visit.cost != null && (
                        <Badge variant="outline" className="ml-4 shrink-0">{formatCurrency(visit.cost)}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vaccinations">
          {vac.length === 0 ? (
            <EmptyState icon={<Syringe className="h-10 w-10" />} text="Žádné vakcinace" />
          ) : (
            <div className="space-y-3">
              {vac.map((v) => (
                <Card key={v.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{v.name}</p>
                        <p className="text-sm text-gray-500">Podáno: {formatDate(v.date_given)}</p>
                        {v.notes && <p className="text-sm text-gray-500 mt-1">{v.notes}</p>}
                      </div>
                      {v.next_due && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Příští dávka</p>
                          <Badge variant={new Date(v.next_due) < new Date() ? 'destructive' : 'secondary'}>
                            {formatDate(v.next_due)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="dewormings">
          {dew.length === 0 ? (
            <EmptyState icon={<Bug className="h-10 w-10" />} text="Žádná odčervení" />
          ) : (
            <div className="space-y-3">
              {dew.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{d.product}</p>
                        <p className="text-sm text-gray-500">Podáno: {formatDate(d.date_given)}</p>
                      </div>
                      {d.next_due && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Příští odčervení</p>
                          <Badge variant={new Date(d.next_due) < new Date() ? 'destructive' : 'secondary'}>
                            {formatDate(d.next_due)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="text-gray-200 flex justify-center mb-3">{icon}</div>
        <p className="text-gray-400">{text}</p>
      </CardContent>
    </Card>
  )
}
