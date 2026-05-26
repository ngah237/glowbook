'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Service {
  id: string
  nom: string
  categorie: string
  prixBase: number
  dureeBase: number
  description: string
  photos?: { url: string }[]
  populaire?: boolean
  nouveaute?: boolean
}

const categories = ['Toutes', 'Tresses', 'Locks', 'Nattes', 'Twists', 'Soins']

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState('Toutes')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (!response.ok) throw new Error('Erreur chargement')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement des services')
    } finally {
      setLoading(false)
    }
  }

  const formatDuree = (minutes: number) => {
    const heures = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (heures === 0) return `${mins}min`
    if (mins === 0) return `${heures}h`
    return `${heures}h${mins}`
  }

  const filteredServices = services.filter(service => {
    const matchSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategorie = selectedCategorie === 'Toutes' || service.categorie === selectedCategorie
    return matchSearch && matchCategorie
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C2185B] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FDFBF9]/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
        <Link href="/" className="text-2xl font-serif italic text-[#C2185B] hover:opacity-80 transition">GlowBook</Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="font-serif text-stone-600 hover:text-[#C2185B] transition text-sm">Catalogue</Link>
          <Link href="/services" className="font-serif text-[#C2185B] border-b-2 border-[#C2185B] font-semibold text-sm">Services</Link>
          <Link href="/tarifs" className="font-serif text-stone-600 hover:text-[#C2185B] transition text-sm">Tarifs</Link>
          <Link href="/a-propos" className="font-serif text-stone-600 hover:text-[#C2185B] transition text-sm">À propos</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition">Connexion</Link>
          <Link href="/register" className="px-4 py-2 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition shadow-sm">Réserver</Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-16 md:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Nos Services</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">Découvrez toute l'étendue de notre savoir-faire pour cheveux afro</p>
          </div>
        </section>

        {/* Filtres */}
        <div className="sticky top-20 z-40 bg-white border-b border-stone-100 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                  <input 
                    type="text" 
                    placeholder="Rechercher une coiffure..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none" 
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategorie(cat)} 
                    className={`px-4 py-1.5 rounded-full text-sm transition ${selectedCategorie === cat ? 'bg-[#C2185B] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grille des services */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-400">Aucun service trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.photos?.[0]?.url || '/images/placeholder.jpg'} 
                      alt={service.nom} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                    />
                    {service.populaire && (
                      <span className="absolute top-3 right-3 bg-[#C2185B] text-white text-xs px-2 py-1 rounded-full">Populaire</span>
                    )}
                    {service.nouveaute && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Nouveau</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1c1b1b] mb-2">{service.nom}</h3>
                    <p className="text-stone-500 text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                      <div>
                        <p className="text-xs text-stone-400">À partir de</p>
                        <p className="text-xl font-bold text-[#C2185B]">{Number(service.prixBase)}€</p>
                        <p className="text-xs text-stone-400">{formatDuree(service.dureeBase)}</p>
                      </div>
                      <Link href={`/service/${service.id}`} className="px-4 py-2 bg-[#C2185B] text-white rounded-full text-sm font-medium hover:bg-[#9b0044] transition shadow-md">
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-serif italic text-white mb-3 inline-block hover:text-pink-100 transition">GlowBook</Link>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/mentions-legales" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Mentions légales</Link>
            <Link href="/confidentialite" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Confidentialité</Link>
            <Link href="/contact" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Contact</Link>
          </div>
          <p className="text-white/60 text-xs">© 2026 GlowBook - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}