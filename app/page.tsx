'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Données des services (à terme, remplacer par appel API)
const servicesData = [
  { id: '1', nom: 'Knotless Braids', categorie: 'Tresses', prix: 120, duree: '4h 30m', taille: 'Long', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD25MRzt-4wmsQDAR7JrY8N7HZAGYY8IUGQY06IRs05g4_4YFWQvmnbt58T8gvDkKBays6gjM_KQ-g4zttjmI53YX3baelwy_LUk6OeI53bHAvTXAn51Zf6FXNWPZV_K66xnszVQJdcSCLY8iYg-YVCwcNcJCG0mwsJlfvAMfj15-lwpda_7id9u18TSrlTuX671Azy_DifWXaz0CdJeTMWo5CUaAQ2Y1nqpj_-zvjaarC_6fosckeuDWcTNEUP95yX9cWhlW0BUA', badge: 'Populaire' },
  { id: '2', nom: 'Box Braids Classiques', categorie: 'Tresses', prix: 90, duree: '3h 00m', taille: 'Moyen', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsnloSSIHauqTMgEuYeHUHCrxLgdkaed2p70fM4lmJWMsnl6KFwM5NeDJ0IwgfHwiWBq75UT6mlKEhaCPPxIP-eGb71YnTK-WJbqrvxcn8epHRhFDdKDFHsrrb_DU_Qsc2qCiDSyErApOnaC5oOCwHJ9HM0yfXUh5YCFC4FE3mJRdB8p40cWYzTDEMAevdWQVfZqBa19eSizm7dHl1AJIdaF3wfC1DTNF0jw1xrw9GFyyMGC1snZiHpO6nvGHaOsqmIpngBt_wlg' },
  { id: '3', nom: 'Butterfly Locs', categorie: 'Locks', prix: 150, duree: '5h 00m', taille: 'Long', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4caRXnQAnPSgTmECx3yownpMeuLco_mcOMoOK6PRW34HIknpKRu1xFkHjaWqjW4m-f0LCXxv3pwiavDfX5rW-6_zyjnu4Toox_c-HHqh5GnC0GzOeC2BDt30SFBECYqkGxrErOYPDbxLP5AEacuua5V_5s37VDNpXmNcFjW8N5Dz2rVpsWnOGwBt9Xque7IIPyPuU6Sg06I4pJeqQ9V9naD5hv6yHa_q7Cc4PFNQH3JMtaBnJT5rzA9b_25iAs8oWF39B0X39w', badge: 'Nouveau' },
  { id: '4', nom: 'Cornrows Artistiques', categorie: 'Nattes', prix: 60, duree: '1h 30m', taille: 'Court', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFNCzY9Sxedhw3lvL_xIda-I8vb6hKUHZUogHDr1EDDn4stXSqKmzy92h3k6I2RuqTDyg2mzOeu_VNsGC7mjSBZWLiRKebHwv9j4Z760_j1yp0d-ShKwDDKjLFRsOIE3qblMT_zaB7ix0AngONCw6aWOj_FMD2VNew1NRgPA72H6tXcmdz8wgvF3dz3a-bHWmwpMJx-KdHpVpvhB_RrhzFKlfYXHrgMa8jKQ4j5iXnZZAJLDPJ1PM0qwfk17omf0x7Hj_1KMmdgA' },
]

// Catégories disponibles (pour les filtres)
const categories = ['Toutes', 'Tresses', 'Nattes', 'Locks']

// Tailles disponibles
const tailles = ['Toutes', 'Court', 'Moyen', 'Long']

// Grosseurs disponibles
const grosseurs = ['Toutes', 'Petite', 'Moyenne', 'Grosse']

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState('Toutes')
  const [selectedTaille, setSelectedTaille] = useState('Toutes')
  const [selectedGrosseur, setSelectedGrosseur] = useState('Toutes')
  const [prixMax, setPrixMax] = useState(250)
  const [filteredServices, setFilteredServices] = useState(servicesData)

  useEffect(() => {
    let filtered = [...servicesData]
    if (searchTerm) filtered = filtered.filter(s => s.nom.toLowerCase().includes(searchTerm.toLowerCase()) || s.categorie.toLowerCase().includes(searchTerm.toLowerCase()))
    if (selectedCategorie !== 'Toutes') filtered = filtered.filter(s => s.categorie === selectedCategorie)
    if (selectedTaille !== 'Toutes') filtered = filtered.filter(s => s.taille === selectedTaille)
    if (selectedGrosseur !== 'Toutes') {}
    filtered = filtered.filter(s => s.prix <= prixMax)
    setFilteredServices(filtered)
  }, [searchTerm, selectedCategorie, selectedTaille, selectedGrosseur, prixMax])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategorie('Toutes')
    setSelectedTaille('Toutes')
    setSelectedGrosseur('Toutes')
    setPrixMax(250)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FDFBF9] border-b border-stone-200 shadow-sm shadow-pink-900/5">
        <Link href="/" className="text-2xl font-serif italic tracking-tight text-[#C2185B]">GlowBook</Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="font-serif text-[#C2185B] border-b-2 border-[#C2185B] font-semibold">Catalogue</Link>
          <Link href="/services" className="font-serif text-stone-600 hover:text-[#C2185B] transition-colors">Services</Link>
          <Link href="/tarifs" className="font-serif text-stone-600 hover:text-[#C2185B] transition-colors">Tarifs</Link>
          <Link href="/a-propos" className="font-serif text-stone-600 hover:text-[#C2185B] transition-colors">À propos</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login" className="px-6 py-2 rounded-full border border-stone-200 hover:bg-stone-50 text-sm transition">Connexion</Link>
          <Link href="/register" className="px-6 py-2 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition">Réserver</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover brightness-[0.4]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGfA-aq5XXH9Vl3dg23ZPli378tO1fTVFxzSH86kMnylsuqCTuz6Yh7Gz4lLJr4ZNt3KZZjSzGxFU2F5KLp_vo6YH1VDbefmFGkf-RJpvZmfxJltw8v5msEv1e9bTYcoMNO6g435-1fGFEXAgEpHBbFTbvPXiaKgKLfu6YeYFXl6XsY5lGjGLUHo4PyYTWyCzihtFVWUhWVG0Cer2VwVmaAdAmrh754giP3QfkbQxhmZl9UGxgu4jEoEM6aNonJbF_MhvWhyAv4A" alt="Hero" />
        </div>
        <div className="relative text-center px-4 max-w-2xl">
          <h1 className="font-serif text-5xl text-white mb-4">Élégance Afro</h1>
          <p className="text-white/90 text-lg italic">Bienvenue ! Je suis spécialisée dans les tresses et coiffures afro.</p>
        </div>
      </section>

      {/* BANDEAU PROMOTIONNEL 1 - OFFRE DE BIENVENUE (couleur primaire) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-5 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎁</span>
            <div>
              <span className="font-bold text-lg">Offre de bienvenue !</span>
              <span className="text-white/90 text-sm ml-2">-15% sur votre première réservation</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <code className="font-mono font-bold tracking-wider">GLOW15</code>
            <span className="text-xs">Code promo</span>
          </div>
        </div>
      </div>

      {/* Catalogue avec sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filtres */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Recherche</h3>
              <input type="text" placeholder="Box braids, locks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Catégories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="categorie" checked={selectedCategorie === cat} onChange={() => setSelectedCategorie(cat)} className="text-[#C2185B] focus:ring-[#C2185B]/20" />
                    <span className="text-stone-600">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Taille</h3>
              <div className="flex flex-wrap gap-2">
                {tailles.map((t) => (
                  <button key={t} onClick={() => setSelectedTaille(t)} className={`px-3 py-1 rounded-full text-sm transition ${selectedTaille === t ? 'border-2 border-[#C2185B] bg-[#C2185B]/5 text-[#C2185B]' : 'border border-stone-200 hover:border-[#C2185B] hover:text-[#C2185B]'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Grosseur</h3>
              <div className="space-y-2">
                {grosseurs.map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="grosseur" checked={selectedGrosseur === g} onChange={() => setSelectedGrosseur(g)} className="text-[#C2185B] focus:ring-[#C2185B]/20" />
                    <span className="text-stone-600">{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Prix Max</h3>
              <input type="range" min="0" max="350" value={prixMax} onChange={(e) => setPrixMax(Number(e.target.value))} className="w-full accent-[#C2185B]" />
              <div className="flex justify-between mt-2"><span className="text-sm text-stone-500">0€</span><span className="text-sm font-semibold text-[#C2185B]">{prixMax}€</span><span className="text-sm text-stone-500">350€</span></div>
            </div>
            <button onClick={resetFilters} className="w-full py-2 border border-[#C2185B]/30 text-[#C2185B] rounded-full text-sm font-medium hover:bg-pink-50 transition">Réinitialiser les filtres</button>
          </div>
        </aside>

        {/* Grille produits */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div><span className="text-sm text-[#C2185B] uppercase font-semibold">Notre Collection</span><h2 className="text-3xl font-serif font-bold">Coiffures Signature</h2></div>
            <span className="text-stone-500">{filteredServices.length} styles</span>
          </div>
          
          {/* BANDEAU PROMOTIONNEL 2 - NOUVEAUTÉ (couleur secondaire) */}
          {filteredServices.length > 0 && (
            <div className="mb-6 bg-gradient-to-r from-[#C2185B]/10 to-[#C2185B]/5 rounded-xl p-4 border border-[#C2185B]/20">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-pulse">✨</span>
                  <div>
                    <p className="font-semibold text-[#C2185B]">✨ Nouveauté exclusive !</p>
                    <p className="text-sm text-stone-600">Découvrez notre nouvelle collection Butterfly Locs</p>
                  </div>
                </div>
                <Link href="/service/3" className="px-5 py-2 bg-[#C2185B] text-white rounded-full text-sm font-semibold hover:bg-[#9b0044] transition shadow-md">Découvrir →</Link>
              </div>
            </div>
          )}

          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-stone-500">Aucune coiffure ne correspond à vos critères</p>
              <button onClick={resetFilters} className="mt-4 text-[#C2185B] font-semibold">Voir toutes les coiffures</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                  <div className="relative h-80 overflow-hidden">
                    <img src={service.image} className="w-full h-full object-cover group-hover:scale-105 transition" alt={service.nom} />
                    {service.badge && (
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${service.badge === 'Populaire' ? 'bg-white/90 backdrop-blur text-[#C2185B]' : 'bg-[#C2185B] text-white'}`}>{service.badge}</div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-[#C2185B] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">-10%</div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg">{service.nom}</h3>
                      <div className="text-right">
                        <span className="text-[#C2185B] font-bold">{service.prix}€</span>
                        <span className="text-stone-400 text-xs line-through ml-1">{Math.round(service.prix * 1.15)}€</span>
                      </div>
                    </div>
                    <p className="text-stone-500 text-sm mt-1">{service.categorie}</p>
                    <div className="flex gap-4 mt-3 text-stone-400 text-sm">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{service.duree}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">straighten</span>{service.taille}</span>
                    </div>
                    <Link href={`/service/${service.id}`} className="w-full mt-4 py-2 bg-[#C2185B] text-white rounded-full block text-center font-semibold hover:bg-[#9b0044] transition">Réserver</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ROSE (comme avant) */}
      <footer className="py-10 px-4 text-center bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white mt-8">
        <Link href="/" className="text-2xl font-serif italic text-white mb-4 inline-block hover:text-pink-100 transition">GlowBook</Link>
        <div className="flex flex-wrap justify-center gap-6 mb-4 mt-4">
          <Link href="/mentions-legales" className="text-white/80 text-xs hover:text-white transition">Mentions légales</Link>
          <Link href="/confidentialite" className="text-white/80 text-xs hover:text-white transition">Confidentialité</Link>
          <Link href="/contact" className="text-white/80 text-xs hover:text-white transition">Contact</Link>
        </div>
        <div className="flex justify-center gap-3 mb-2">
          <a href="#" className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-xs">📷</a>
          <a href="#" className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-xs">📘</a>
          <a href="#" className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition text-xs">📌</a>
        </div>
        <p className="text-white/70 text-sm">© 2026 GlowBook - Tous droits réservés</p>
      </footer>
    </div>
  )
}