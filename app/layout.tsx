import type { Metadata } from 'next'
import { Playfair_Display, Open_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Keita Immobilier - Votre reference en immobilier depuis 1995',
  description: "Agence immobiliere en Cote d'Ivoire. Vente, Location, Syndic, Gestion locative.",
}

export default function RootLayout({  
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${openSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
