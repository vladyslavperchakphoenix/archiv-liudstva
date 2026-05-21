import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Архів Людства',
  description: 'Інтерактивна енциклопедія національних архетипів',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Navigation />
        <main style={{ paddingBottom: '80px', paddingLeft: 0 }}>
          {children}
        </main>
      </body>
    </html>
  )
}