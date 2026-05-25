'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

// 📦 DONNÉES SIMULÉES (en attendant la base de données)
const servicesSimules = [
  {
    id: '1',
    nom: 'Knotless Braids',
    description: 'Tresses sans nœuds pour un fini naturel et une tension réduite sur le cuir chevelu.',
    prixBase: 120,
    dureeBase: 270,
    categorie: 'Tresses',
    photos: [{ url: 'https://images.pexels.com/photos/3998420/pexels-photo-3998420.jpeg?w=400', ordre: 0 }],
    variantes: [
      { taille: 'Court', grosseur: 'Petite', prixSupplement: -40, dureeSupplement: -90 },
      { taille: 'Moyen', grosseur: 'Moyenne', prixSupplement: 0, dureeSupplement: 0 },
      { taille: 'Long', grosseur: 'Grosse', prixSupplement: 40, dureeSupplement: 90 }
    ]
  },
  {
    id: '2',
    nom: 'Box Braids Classiques',
    description: 'Le style iconique indémodable. Réalisé avec des sections précises.',
    prixBase: 90,
    dureeBase: 180,
    categorie: 'Tresses',
    photos: [{ url: 'https://images.pexels.com/photos/3997369/pexels-photo-3997369.jpeg?w=400', ordre: 0 }],
    variantes: []
  },
  {
    id: '3',
    nom: 'Butterfly Locs',
    description: 'Look bohème et texturé avec des boucles douces.',
    prixBase: 150,
    dureeBase: 300,
    categorie: 'Locks',
    photos: [{ url: 'https://images.pexels.com/photos/3998389/pexels-photo-3998389.jpeg?w=400', ordre: 0 }],
    variantes: []
  },
  {
    id: '4',
    nom: 'Cornrows Artistiques',
    description: 'Nattes collées avec motifs géométriques personnalisés.',
    prixBase: 60,
    dureeBase: 90,
    categorie: 'Nattes',
    photos: [{ url: 'https://images.pexels.com/photos/3998421/pexels-photo-3998421.jpeg?w=400', ordre: 0 }],
    variantes: []
  },
  {
    id: '5',
    nom: 'Senegalese Twists',
    description: 'Torsades délicates et légères, idéales pour un look bohème chic.',
    prixBase: 110,
    dureeBase: 240,
    categorie: 'Twists',
    photos: [{ url: 'https://images.pexels.com/photos/3997353/pexels-photo-3997353.jpeg?w=400', ordre: 0 }],
    variantes: []
  },
  {
    id: '6',
    nom: 'Faux Locs',
    description: 'Locks synthétiques légères, parfaites pour un style protecteur.',
    prixBase: 130,
    dureeBase: 360,
    categorie: 'Locks',
    photos: [{ url: 'https://images.pexels.com/photos/3998406/pexels-photo-3998406.jpeg?w=400', ordre: 0 }],
    variantes: []
  },
  {
    id: '7',
    nom: 'Silk Press Deluxe',
    description: 'Lissage thermique professionnel sans produits chimiques.',
    prixBase: 65,
    dureeBase: 120,
    categorie: 'Soins',
    photos: [{ url: 'https://images.pexels.com/photos/3998422/pexels-photo-3998422.jpeg?w=400', ordre: 0 }],
    variantes: []
  }
]

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTaille, setSelectedTaille] = useState('Moyen')
  const [selectedGrosseur, setSelectedGrosseur] = useState('Moyenne')
  const [prixFinal, setPrixFinal] = useState(0)

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      const found = servicesSimules.find(s => s.id === serviceId)
      setService(found || null)
      if (found) {
        setPrixFinal(found.prixBase)
      }
      setLoading(false)
    }, 500)
  }, [serviceId])

  useEffect(() => {
    if (!service) return
    let prix = service.prixBase
    const variante = service.variantes?.find(v => v.taille === selectedTaille && v.grosseur === selectedGrosseur)
    if (variante) {
      prix += variante.prixSupplement
    }
    setPrixFinal(Math.max(prix, 35))
  }, [selectedTaille, selectedGrosseur, service])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C2185B]"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Service non trouvé</h1>
          <p className="text-gray-600 mb-4">ID recherché: {serviceId}</p>
          <p className="text-sm text-gray-500 mb-4">Services disponibles : {servicesSimules.map(s => s.id).join(', ')}</p>
          <Link href="/" className="text-[#C2185B] hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const photoPrincipale = service.photos?.[0]?.url
  const tailles = ['Court', 'Moyen', 'Long']
  const grosseurs = ['Petite', 'Moyenne', 'Grosse']

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-serif italic text-[#C2185B] hover:opacity-80 transition">GlowBook</Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-stone-600 hover:text-[#C2185B] transition text-sm">Catalogue</Link>
            <Link href="/services" className="text-stone-600 hover:text-[#C2185B] transition text-sm">Services</Link>
            <Link href="/tarifs" className="text-stone-600 hover:text-[#C2185B] transition text-sm">Tarifs</Link>
            <Link href="/a-propos" className="text-stone-600 hover:text-[#C2185B] transition text-sm">À propos</Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-1.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm transition">Connexion</Link>
            <Link href="/" className="px-4 py-1.5 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition shadow-sm">Réserver</Link>
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Fil d'Ariane */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-stone-500 hover:text-[#C2185B] transition">Accueil</Link>
            <span className="material-symbols-outlined text-sm text-stone-400">chevron_right</span>
            <Link href="/services" className="text-stone-500 hover:text-[#C2185B] transition">Services</Link>
            <span className="material-symbols-outlined text-sm text-stone-400">chevron_right</span>
            <span className="text-[#C2185B] font-medium">{service.nom}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Colonne image */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 shadow-lg border border-stone-100 aspect-square">
                <img 
                  src={photoPrincipale || 'https://placehold.co/600x400/FFB6C1/C2185B?text=Image+non+disponible'} 
                  alt={service.nom} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </div>
            </div>

            {/* Colonne informations */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#C2185B]/10 text-[#C2185B] mb-3">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  Populaire
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#1c1b1b]">{service.nom}</h1>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="text-stone-500 text-sm ml-2">(128 avis)</span>
                </div>
                <span className="text-stone-300">|</span>
                <div className="flex items-center gap-1 text-stone-500">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="text-sm">Durée: {Math.floor(service.dureeBase / 60)}h{service.dureeBase % 60 > 0 ? ` ${service.dureeBase % 60}min` : ''}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#C2185B]">{prixFinal}€</span>
                {service.prixBase > 0 && (
                  <>
                    <span className="text-stone-400 line-through text-lg">{service.prixBase}€</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">-20%</span>
                  </>
                )}
              </div>

              <p className="text-stone-600 leading-relaxed border-l-4 border-[#C2185B] pl-4 italic">{service.description}</p>

              {/* Sélection taille et grosseur */}
              {service.variantes && service.variantes.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-100">
                  <div className="mb-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#C2185B]">straighten</span>
                      Taille / Longueur
                    </h3>
                    <div className="flex gap-3">
                      {tailles.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTaille(t)}
                          className={`flex-1 py-2.5 rounded-full border-2 transition-all ${
                            selectedTaille === t 
                              ? 'border-[#C2185B] bg-pink-50 text-[#C2185B] font-semibold shadow-sm' 
                              : 'border-stone-200 hover:border-[#C2185B] hover:text-[#C2185B]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#C2185B]">grain</span>
                      Grosseur
                    </h3>
                    <div className="flex gap-3">
                      {grosseurs.map(g => (
                        <button
                          key={g}
                          onClick={() => setSelectedGrosseur(g)}
                          className={`flex-1 py-2.5 rounded-full border-2 transition-all ${
                            selectedGrosseur === g 
                              ? 'border-[#C2185B] bg-pink-50 text-[#C2185B] font-semibold shadow-sm' 
                              : 'border-stone-200 hover:border-[#C2185B] hover:text-[#C2185B]'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Récapitulatif prix */}
              <div className="bg-gradient-to-r from-[#C2185B]/5 to-pink-50 rounded-xl p-5 border border-pink-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-stone-500">Prix total</p>
                    <p className="text-3xl font-bold text-[#C2185B]">{prixFinal}€</p>
                    <p className="text-xs text-stone-400 mt-1">Acompte de 30% à la réservation</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">Durée estimée</p>
                    <p className="text-xl font-semibold text-[#1c1b1b]">
                      {Math.floor(service.dureeBase / 60)}h{service.dureeBase % 60 > 0 ? ` ${service.dureeBase % 60}min` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push(`/reservation/${serviceId}`)}
                  className="flex-1 py-4 bg-[#C2185B] text-white rounded-full font-bold text-lg hover:bg-[#9b0044] transition-all transform hover:-translate-y-0.5 shadow-md"
                >
                  Réserver cette coiffure
                </button>
                <button 
                  onClick={() => router.back()}
                  className="py-4 px-6 border border-stone-300 rounded-full hover:bg-stone-50 transition"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
              </div>

              <p className="text-xs text-stone-400 text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                Paiement sécurisé • Annulation gratuite jusqu'à 24h avant
              </p>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C2185B]">check_circle</span>
                </div>
                <h3 className="text-lg font-semibold">Inclus dans le pack</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-stone-600">
                  <span className="material-symbols-outlined text-sm text-green-500">check</span>
                  Consultation personnalisée
                </li>
                <li className="flex items-center gap-2 text-stone-600">
                  <span className="material-symbols-outlined text-sm text-green-500">check</span>
                  Lavage et soin hydratant
                </li>
                <li className="flex items-center gap-2 text-stone-600">
                  <span className="material-symbols-outlined text-sm text-green-500">check</span>
                  Mèches premium fournies
                </li>
                <li className="flex items-center gap-2 text-stone-600">
                  <span className="material-symbols-outlined text-sm text-green-500">check</span>
                  Finition à l'eau chaude
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C2185B]">tips_and_updates</span>
                </div>
                <h3 className="text-lg font-semibold">Conseils d'entretien</h3>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Portez un bonnet en satin la nuit. Hydratez vos tresses avec une huile légère 2 fois par semaine.
                Évitez les produits trop gras et utilisez un spray hydratant pour cheveux afro.
              </p>
            </div>
          </div>
        </div>
      </div>

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