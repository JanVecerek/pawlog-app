'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { PawPrint, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { User } from '@supabase/supabase-js'

export function NavBar({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-amber-600">
          <PawPrint className="h-6 w-6" />
          PawLog
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-amber-100 text-amber-700 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-gray-700">
            <LogOut className="h-4 w-4 mr-1" />
            Odhlásit
          </Button>
        </div>
      </div>
    </nav>
  )
}
