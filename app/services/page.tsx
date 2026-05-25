'use client'

import { useState } from 'react'
import Link from 'next/link'

const servicesList = [
  { id: 1, nom: 'Knotless Braids', description: 'Tresses sans noeuds pour un fini naturel.', prix: 'A partir de 120€', duree: '4h - 6h', image: '/images/services/knotless-braids.jpg', categorie: 'Tresses' },
  { id: 2, nom: 'Box Braids Classiques', description: 'Tresses carrees iconiques.', prix: 'A partir de 90€', duree: '3h - 5h', image: '/images/services/box-braids.jpg', categorie: 'Tresses' },
  { id: 3, nom: 'Butterfly Locs', description: 'Locs bohemes texturées.', prix: 'A partir de 150€', duree: '5h - 7h', image: '/images/services/butterfly-locs.jpg', categorie: 'Locks' },
  { id: 4, nom: 'Cornrows Artistiques', description: 'Nattes collées avec motifs.', prix: 'A partir de 60€', duree: '1h30 - 3h', image: '/images/services/cornrows.jpg', categorie: 'Nattes' },
  { id: 5, nom: 'Senegalese Twists', description: 'Torsades délicates.', prix: 'A partir de 110€', duree: '4h - 6h', image: '/images/services/senegalese-twists.jpg', categorie: 'Twists' },
  { id: 6, nom: 'Faux Locs', description: 'Locks synthétiques légères.', prix: 'A partir de 130€', duree: '5h - 8h', image: '/images/services/faux-locs.jpg', categorie: 'Locks' },
  { id: 7, nom: 'Silk Press Deluxe', description: 'Lissage thermique sans produits chimiques.', prix: 'A partir de 65€', duree: '2h - 3h', image: '/images/services/silk-press.jpg', categorie: 'Soins' }
]

const categories = ['Toutes', 'Tresses', 'Locks', 'Nattes', 'Twists', 'Soins']

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState('')

  const filteredServices = servicesList.filter(service => {
    const matchSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategorie = selectedCategorie === 'Toutes' || !selectedCategorie || service.categorie === selectedCategorie
    return matchSearch && matchCategorie
  })

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
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
          <Link href="/" className="px-4 py-2 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition shadow-sm">Réserver</Link>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-16 md:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Nos Services</h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">Decouvrez toute l'etendue de notre savoir-faire pour cheveux afro</p>
          </div>
        </section>

        <div className="sticky top-20 z-40 bg-white border-b border-stone-100 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                  <input type="text" placeholder="Rechercher une coiffure..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategorie(cat)} className={`px-4 py-1.5 rounded-full text-sm transition ${(selectedCategorie === cat || (cat === 'Toutes' && !selectedCategorie)) ? 'bg-[#C2185B] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>{cat}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16"><p className="text-stone-400">Aucun service trouve</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={service.image} alt={service.nom} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1c1b1b] mb-2">{service.nom}</h3>
                    <p className="text-stone-500 text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                      <div>
                        <p className="text-xs text-stone-400">A partir de</p>
                        <p className="text-xl font-bold text-[#C2185B]">{service.prix}</p>
                      </div>
                      <Link href={`/service/${service.id}`} className="px-4 py-2 bg-[#C2185B] text-white rounded-full text-sm font-medium hover:bg-[#9b0044] transition shadow-md">Voir détails</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-serif italic text-white mb-3 inline-block hover:text-pink-100 transition">GlowBook</Link>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/mentions-legales" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Mentions legales</Link>
            <Link href="/confidentialite" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Confidentialité</Link>
            <Link href="/contact" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Contact</Link>
          </div>
          <p className="text-white/60 text-xs">© 2026 GlowBook - Tous droits reserves</p>
        </div>
      </footer>
    </div>
  )
}