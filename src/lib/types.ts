export type Species = 'pes' | 'kočka' | 'králík' | 'ptáček' | 'plaz' | 'jiný'

export interface Pet {
  id: string
  user_id: string
  name: string
  species: Species
  breed: string | null
  birth_date: string | null
  weight_kg: number | null
  chip_number: string | null
  photo_url: string | null
  created_at: string
}

export interface VetVisit {
  id: string
  pet_id: string
  date: string
  vet_name: string | null
  diagnosis: string | null
  treatment: string | null
  cost: number | null
  notes: string | null
  created_at: string
}

export interface Vaccination {
  id: string
  pet_id: string
  name: string
  date_given: string
  next_due: string | null
  notes: string | null
  created_at: string
}

export interface Deworming {
  id: string
  pet_id: string
  product: string
  date_given: string
  next_due: string | null
  created_at: string
}
