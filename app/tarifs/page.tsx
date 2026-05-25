'use client'
import Link from 'next/link'
import { useState } from 'react'

interface TarifItem {
  nom: string
  prix: string
  prixMin: number | null
  prixMax: number | null
  duree: string
  popularite: number
  slug: string
  nouveau?: boolean
}

interface TarifCategorie {
  categorie: string
  icon: string
  description: string
  color: string
  image: string
  items: TarifItem[]
}

const priceList: TarifCategorie[] = [
  { 
    categorie: 'Tresses', 
    icon: 'content_cut',
    description: 'Coiffures protectrices tendance',
    color: 'from-pink-500/20 to-pink-500/5',
    image: '/images/tarifs/tresses.jpg',
    items: [
      { nom: 'Knotless Braids', prix: '80€ - 160€', prixMin: 80, prixMax: 160, duree: '3h - 7h', popularite: 95, slug: 'knotless-braids' },
      { nom: 'Box Braids', prix: '70€ - 140€', prixMin: 70, prixMax: 140, duree: '2h - 5h', popularite: 90, slug: 'box-braids' },
      { nom: 'Crochet Braids', prix: '60€ - 120€', prixMin: 60, prixMax: 120, duree: '2h - 4h', popularite: 85, slug: 'crochet-braids' }
    ] 
  },
  { 
    categorie: 'Locks', 
    icon: 'style',
    description: 'Looks bohèmes et texturés',
    color: 'from-purple-500/20 to-purple-500/5',
    image: '/images/tarifs/locks.jpg',
    items: [
      { nom: 'Butterfly Locs', prix: '120€ - 200€', prixMin: 120, prixMax: 200, duree: '4h - 8h', popularite: 92, nouveau: true, slug: 'butterfly-locs' },
      { nom: 'Faux Locs', prix: '100€ - 180€', prixMin: 100, prixMax: 180, duree: '3h - 6h', popularite: 88, slug: 'faux-locs' }
    ] 
  },
  { 
    categorie: 'Soins & Lissages', 
    icon: 'spa',
    description: 'Soins professionnels pour cheveux',
    color: 'from-emerald-500/20 to-emerald-500/5',
    image: '/images/tarifs/soins.jpg',
    items: [
      { nom: 'Silk Press', prix: '65€', prixMin: 65, prixMax: 65, duree: '1h30', popularite: 88, slug: 'silk-press' },
      { nom: 'Soin Kératine', prix: '85€', prixMin: 85, prixMax: 85, duree: '2h', popularite: 90, slug: 'soin-keratine' }
    ] 
  },
  { 
    categorie: 'Coiffures événementielles', 
    icon: 'celebration', 
    description: 'Pour vos occasions spéciales',
    color: 'from-amber-500/20 to-amber-500/5',
    image: '/images/tarifs/evenementiel.jpg',
    items: [
      { nom: 'Coiffure Mariage', prix: 'Sur devis', prixMin: null, prixMax: null, duree: '2h - 4h', popularite: 85, slug: 'mariage' },
      { nom: 'Coiffure Soirée', prix: 'Sur devis', prixMin: null, prixMax: null, duree: '1h30 - 3h', popularite: 80, slug: 'soiree' }
    ] 
  },
]

const infos = [
  { label: 'Acompte', value: '30% à la réservation', icon: 'credit_card', detail: 'Remboursable en cas d\'annulation 24h avant' },
  { label: 'Annulation', value: 'Gratuite jusqu\'à 24h avant', icon: 'event_available', detail: 'Frais de 50% après ce délai' },
  { label: 'Paiement', value: 'CB, espèces, PayPal', icon: 'payments', detail: 'Paiement sécurisé' },
  { label: 'Déplacement', value: '+15€ (Paris)', icon: 'local_taxi', detail: 'Paris intra-muros uniquement' },
]

const faqs = [
  { q: 'Pourquoi les prix sont-ils donnés "à partir de" ?', a: 'Les prix varient selon la longueur des cheveux, la grosseur des tresses et le temps de réalisation. Un devis personnalisé vous sera fourni avant chaque prestation.' },
  { q: 'Le supplément domicile est-il obligatoire ?', a: 'Non, vous pouvez choisir de venir au salon. Le supplément s\'applique uniquement si vous optez pour le déplacement à domicile.' },
  { q: 'Les prix incluent-ils les produits ?', a: 'Oui, tous les produits (shampoing, mèches, soins) sont inclus dans le prix indiqué.' },
]

export default function TarifsPage() {
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showMode, setShowMode] = useState<'min' | 'max'>('min')

  const filteredCategories = selectedCategorie 
    ? priceList.filter(cat => cat.categorie === selectedCategorie)
    : priceList

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 via-white to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-serif italic text-[#C2185B] hover:opacity-80 transition">GlowBook</Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-stone-600 hover:text-[#C2185B] transition text-sm">Catalogue</Link>
            <Link href="/services" className="text-stone-600 hover:text-[#C2185B] transition text-sm">Services</Link>
            <Link href="/tarifs" className="text-[#C2185B] border-b-2 border-[#C2185B] font-semibold text-sm">Tarifs</Link>
            <Link href="/a-propos" className="text-stone-600 hover:text-[#C2185B] transition text-sm">À propos</Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition">Connexion</Link>
            <Link href="/" className="px-4 py-1.5 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition shadow-sm">Réserver</Link>
          </div>
        </div>
      </header>

      <div className="pt-16"></div>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-4">
              <span className="material-symbols-outlined text-sm">euro</span>
              <span className="text-sm font-medium">Tarifs transparents</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">Nos Tarifs</h1>
            <p className="text-white/90 text-base max-w-2xl mx-auto">
              Des prix clairs et adaptés à toutes les envies.
            </p>
          </div>
        </section>

        {/* Navigation par catégories */}
        <div className="sticky top-16 z-20 bg-white border-b border-stone-100 shadow-sm">
          <div className="w-full px-4">
            <div className="flex justify-center gap-2 py-3 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategorie(null)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  !selectedCategorie 
                    ? 'bg-[#C2185B] text-white shadow-md' 
                    : 'text-stone-600 hover:bg-pink-50'
                }`}
              >
                Tous les services
              </button>
              {priceList.map((cat) => (
                <button
                  key={cat.categorie}
                  onClick={() => setSelectedCategorie(cat.categorie)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                    selectedCategorie === cat.categorie 
                      ? 'bg-[#C2185B] text-white shadow-md' 
                      : 'text-stone-600 hover:bg-pink-50'
                  }`}
                >
                  {cat.categorie}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION TARIFS */}
        <div className="w-full px-4 py-8 md:py-12">
          <div className="max-w-[2000px] mx-auto mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-sm text-[#C2185B] uppercase font-semibold tracking-wider bg-[#C2185B]/10 px-4 py-1 rounded-full">
                  Grille tarifaire
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mt-2">
                  Tarifs indicatifs
                </h2>
              </div>
              
              {/* Sélecteur Prix min/max */}
              <div className="bg-white rounded-full shadow-sm border border-stone-200 p-1 flex text-sm">
                <button 
                  onClick={() => setShowMode('min')} 
                  className={`px-4 py-1.5 rounded-full transition ${
                    showMode === 'min' 
                      ? 'bg-[#C2185B] text-white' 
                      : 'text-stone-500 hover:text-[#C2185B]'
                  }`}
                >
                  Prix mini
                </button>
                <button 
                  onClick={() => setShowMode('max')} 
                  className={`px-4 py-1.5 rounded-full transition ${
                    showMode === 'max' 
                      ? 'bg-[#C2185B] text-white' 
                      : 'text-stone-500 hover:text-[#C2185B]'
                  }`}
                >
                  Prix maxi
                </button>
              </div>
            </div>
          </div>

          {/* Grille responsive */}
          <div className="w-full max-w-[2000px] mx-auto">
            <div className={`grid gap-6 ${
              filteredCategories.length === 1 
                ? 'grid-cols-1 max-w-4xl mx-auto' 
                : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3'
            }`}>
              {filteredCategories.map((cat) => (
                <div key={cat.categorie} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 h-full flex flex-col">
                  {/* En-tête de catégorie avec image locale */}
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img 
                      src={cat.image} 
                      alt={cat.categorie} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-5 right-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-2xl">{cat.icon}</span>
                        </div>
                        <div>
                          <h2 className="text-white font-bold text-xl">{cat.categorie}</h2>
                          <p className="text-white/80 text-xs">{cat.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liste des services */}
                  <div className="divide-y divide-stone-100 flex-1">
                    {cat.items.map((item) => (
                      <div 
                        key={item.nom} 
                        className="relative group transition-all duration-300 hover:bg-pink-50/50"
                        onMouseEnter={() => setHoveredItem(`${cat.categorie}-${item.nom}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="flex items-center justify-between p-5">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-[#1c1b1b] text-base">{item.nom}</h3>
                              {item.nouveau && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Nouveau</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-stone-400 text-xs">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                {item.duree}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                  <span 
                                    key={j} 
                                    className={`material-symbols-outlined text-xs ${
                                      j < Math.floor(item.popularite / 20) 
                                        ? 'text-amber-400' 
                                        : 'text-stone-200'
                                    }`} 
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[#C2185B] font-bold text-xl">
                              {showMode === 'min' 
                                ? (item.prixMin ? `${item.prixMin}€` : item.prix) 
                                : (item.prixMax ? `${item.prixMax}€` : item.prix)
                              }
                            </span>
                            {item.prixMin && item.prixMax && item.prixMin !== item.prixMax && (
                              <p className="text-stone-400 text-xs">
                                {showMode === 'min' ? 'minimum' : 'maximum'}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Bouton Voir détails au survol */}
                        <div className={`absolute right-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                          hoveredItem === `${cat.categorie}-${item.nom}` 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 translate-x-4 pointer-events-none'
                        }`}>
                          <Link 
                            href={`/service/${item.slug}`} 
                            className="bg-[#C2185B] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#9b0044] transition shadow-md whitespace-nowrap flex items-center gap-1"
                          >
                            Voir détails
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="w-full bg-white border-t border-stone-100">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-pink-50 to-white rounded-2xl p-6 md:p-8 border border-pink-100 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {infos.map((info) => (
                  <div key={info.label} className="text-center group">
                    <div className="w-12 h-12 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#C2185B]/20 transition">
                      <span className="material-symbols-outlined text-[#C2185B] text-2xl">{info.icon}</span>
                    </div>
                    <p className="font-semibold text-[#1c1b1b] text-sm">{info.label}</p>
                    <p className="text-stone-500 text-xs mt-1">{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="w-full bg-stone-50/50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <span className="text-sm text-[#C2185B] uppercase font-semibold tracking-wider bg-[#C2185B]/10 px-4 py-1 rounded-full">
                Questions fréquentes
              </span>
              <h2 className="text-3xl font-serif font-bold mt-4">Vous avez des questions ?</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group bg-white rounded-xl shadow-sm border border-stone-100 p-5 cursor-pointer hover:shadow-md transition">
                  <summary className="font-semibold text-[#1c1b1b] flex justify-between items-center">
                    {faq.q}
                    <span className="material-symbols-outlined text-stone-400 group-open:rotate-180 transition">expand_more</span>
                  </summary>
                  <p className="text-stone-500 text-sm mt-3 pt-3 border-t border-stone-100">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Note importante et CTA */}
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-amber-50 rounded-2xl p-5 border-l-4 border-amber-400">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-amber-500 shrink-0">info</span>
                <div>
                  <p className="font-semibold text-amber-800 text-sm">Note importante</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Les prix peuvent varier selon la longueur, la grosseur et la complexité. 
                    Un devis personnalisé vous sera fourni avant chaque prestation. 
                    Supplément de 15€ pour les déplacements à domicile (Paris intra-muros).
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#C2185B] text-white rounded-full font-semibold hover:bg-[#9b0044] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Découvrir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-serif italic text-white mb-3 inline-block hover:text-pink-100 transition">
            GlowBook
          </Link>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link href="/mentions-legales" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Mentions légales</Link>
            <Link href="/confidentialite" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Confidentialité</Link>
            <Link href="/contact" className="text-white/70 text-xs hover:text-white transition underline underline-offset-4">Contact</Link>
          </div>
          <div className="flex justify-center gap-4 mb-3">
            <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-sm">📷</a>
            <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-sm">📘</a>
            <a href="#" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-sm">📌</a>
          </div>
          <p className="text-white/60 text-xs">© 2026 GlowBook - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}