'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Stethoscope, Syringe, Bug } from 'lucide-react'

export function RecordForm({ petId }: { petId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVisitSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data = new FormData(e.currentTarget)

    const { error: err } = await supabase.from('vet_visits').insert({
      pet_id: petId,
      date: data.get('date') as string,
      vet_name: (data.get('vet_name') as string) || null,
      diagnosis: (data.get('diagnosis') as string) || null,
      treatment: (data.get('treatment') as string) || null,
      cost: data.get('cost') ? parseFloat(data.get('cost') as string) : null,
      notes: (data.get('notes') as string) || null,
    })

    if (err) { setError(err.message); setLoading(false) }
    else { router.push(`/dashboard/pets/${petId}`); router.refresh() }
  }

  const handleVaccinationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data = new FormData(e.currentTarget)

    const { error: err } = await supabase.from('vaccinations').insert({
      pet_id: petId,
      name: data.get('name') as string,
      date_given: data.get('date_given') as string,
      next_due: (data.get('next_due') as string) || null,
      notes: (data.get('notes') as string) || null,
    })

    if (err) { setError(err.message); setLoading(false) }
    else { router.push(`/dashboard/pets/${petId}`); router.refresh() }
  }

  const handleDewormingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data = new FormData(e.currentTarget)

    const { error: err } = await supabase.from('dewormings').insert({
      pet_id: petId,
      product: data.get('product') as string,
      date_given: data.get('date_given') as string,
      next_due: (data.get('next_due') as string) || null,
    })

    if (err) { setError(err.message); setLoading(false) }
    else { router.push(`/dashboard/pets/${petId}`); router.refresh() }
  }

  return (
    <Tabs defaultValue="visit">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="visit" className="flex-1 gap-1.5">
          <Stethoscope className="h-4 w-4" />
          Návštěva vetu
        </TabsTrigger>
        <TabsTrigger value="vaccination" className="flex-1 gap-1.5">
          <Syringe className="h-4 w-4" />
          Vakcinace
        </TabsTrigger>
        <TabsTrigger value="deworming" className="flex-1 gap-1.5">
          <Bug className="h-4 w-4" />
          Odčervení
        </TabsTrigger>
      </TabsList>

      <TabsContent value="visit">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="date">Datum *</Label>
                  <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vet_name">Veterinář</Label>
                  <Input id="vet_name" name="vet_name" placeholder="MVDr. Novák" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="diagnosis">Diagnóza</Label>
                <Input id="diagnosis" name="diagnosis" placeholder="Popis diagnózy" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="treatment">Léčba</Label>
                <Input id="treatment" name="treatment" placeholder="Předepsaná léčba" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cost">Cena (Kč)</Label>
                <Input id="cost" name="cost" type="number" min="0" step="1" placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Poznámky</Label>
                <Textarea id="notes" name="notes" placeholder="Další poznámky..." rows={3} />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <FormButtons loading={loading} backPath={`/dashboard/pets/${petId}`} />
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vaccination">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleVaccinationSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="vac-name">Název vakcíny *</Label>
                <Input id="vac-name" name="name" placeholder="Např. Rabisin" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="vac-date">Datum podání *</Label>
                  <Input id="vac-date" name="date_given" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vac-next">Příští dávka</Label>
                  <Input id="vac-next" name="next_due" type="date" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="vac-notes">Poznámky</Label>
                <Textarea id="vac-notes" name="notes" placeholder="Další poznámky..." rows={3} />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <FormButtons loading={loading} backPath={`/dashboard/pets/${petId}`} />
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="deworming">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleDewormingSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="product">Přípravek *</Label>
                <Input id="product" name="product" placeholder="Např. Milbemax" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="dew-date">Datum podání *</Label>
                  <Input id="dew-date" name="date_given" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dew-next">Příští odčervení</Label>
                  <Input id="dew-next" name="next_due" type="date" />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <FormButtons loading={loading} backPath={`/dashboard/pets/${petId}`} />
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function FormButtons({ loading, backPath }: { loading: boolean; backPath: string }) {
  const router = useRouter()
  return (
    <div className="flex gap-3 pt-2">
      <Button type="button" variant="outline" className="flex-1" onClick={() => router.push(backPath)}>
        Zrušit
      </Button>
      <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600" disabled={loading}>
        {loading ? 'Ukládám...' : 'Uložit záznam'}
      </Button>
    </div>
  )
}
