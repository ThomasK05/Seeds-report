import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hidden Harvest · Seeds Report',
  description: 'Vind de verborgen automatiseringskansen in je bedrijf',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="antialiased">{children}</body>
    </html>
  )
}