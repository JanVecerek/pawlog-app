'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'

export function DeletePetButton({ petId }: { petId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('pets').delete().eq('id', petId)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:border-red-200" type="button">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Smazat mazlíčka?</DialogTitle>
          <DialogDescription>
            Tato akce je nevratná. Smaže se mazlíček i všechny jeho záznamy.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Zrušit</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Mažu...' : 'Smazat'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
