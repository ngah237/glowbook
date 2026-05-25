'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// Données mockées des salons (à remplacer par BDD)
const salons = {
  'salon-elegance': { name: 'Salon Élégance', description: 'Salon de coiffure spécialisé dans les coiffures afro', services: [] }
}

export default function SalonPage() {
  const { slug } = useParams()
  const [salon, setSalon] = useState<any>(null)

  useEffect(() => {
    const found = salons[slug as keyof typeof salons]
    setSalon(found)
  }, [slug])

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif">Salon non trouvé</h1>
          <Link href="/" className="text-[#C2185B] mt-4 inline-block">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold">{salon.name}</h1>
        <p className="text-stone-500 mt-2">{salon.description}</p>
        <Link href="/" className="inline-block mt-4 text-[#C2185B]">← Voir le catalogue</Link>
      </div>
    </div>
  )
}