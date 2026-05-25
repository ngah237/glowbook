import type { Metadata } from 'next'
import Providers from './providers'          
import HelpButton from '@/components/HelpButton'
import './globals.css'

export const metadata: Metadata = {
  title: 'GlowBook - Gestion pour coiffeuses',
  description: 'La plateforme qui simplifie la gestion de votre salon de coiffure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <HelpButton />
        </Providers>
      </body>
    </html>
  )
}