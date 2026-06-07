'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PetForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget
    const data = new FormData(form)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await supabase.from('pets').insert({
      user_id: user.id,
      name: data.get('name') as string,
      species: data.get('species') as string,
      breed: (data.get('breed') as string) || null,
      birth_date: (data.get('birth_date') as string) || null,
      weight_kg: data.get('weight_kg') ? parseFloat(data.get('weight_kg') as string) : null,
      chip_number: (data.get('chip_number') as string) || null,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Jméno *</Label>
            <Input id="name" name="name" placeholder="Např. Rex" required />
          </div>

          <div className="space-y-1">
            <Label htmlFor="species">Druh *</Label>
            <Select name="species" required>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte druh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pes">🐶 Pes</SelectItem>
                <SelectItem value="kočka">🐱 Kočka</SelectItem>
                <SelectItem value="králík">🐰 Králík</SelectItem>
                <SelectItem value="ptáček">🐦 Ptáček</SelectItem>
                <SelectItem value="plaz">🦎 Plaz</SelectItem>
                <SelectItem value="jiný">🐾 Jiný</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="breed">Plemeno / rasa</Label>
            <Input id="breed" name="breed" placeholder="Např. Zlatý retrívr" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="birth_date">Datum narození</Label>
              <Input id="birth_date" name="birth_date" type="date" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="weight_kg">Váha (kg)</Label>
              <Input id="weight_kg" name="weight_kg" type="number" step="0.1" min="0" placeholder="5.2" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="chip_number">Číslo čipu</Label>
            <Input id="chip_number" name="chip_number" placeholder="123456789012345" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
              Zrušit
            </Button>
            <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600" disabled={loading}>
              {loading ? 'Ukládám...' : 'Uložit mazlíčka'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
