import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PawLog — Zdravotní knížka mazlíčků',
  description: 'Digitální zdravotní knížka pro vašeho mazlíčka',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
