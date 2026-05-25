'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Données des services COMPLÈTES (9 services) - TU PEUX MODIFIER LES IMAGES ICI
const servicesData = [
  { 
    id: '1', nom: 'Knotless Braids', categorie: 'Tresses', prix: 120, duree: '4h 30m', dureeMinutes: 270,
    tailleMax: 'Long', 
    image: '/images/services/knotless-braids.jpg',  // ← REMPLACE PAR TON IMAGE
    badge: 'Populaire', 
    description: 'Tresses sans nœuds pour un fini naturel et une tension réduite sur le cuir chevelu.',
    conseils: 'Portez un bonnet en satin la nuit. Hydratez vos tresses avec une huile légère 2 fois par semaine.',
    inclus: ['Consultation personnalisée', 'Lavage et soin hydratant', 'Mèches premium fournies', 'Finition à l\'eau chaude']
  },
  { 
    id: '2', nom: 'Box Braids Classiques', categorie: 'Tresses', prix: 90, duree: '3h 00m', dureeMinutes: 180,
    tailleMax: 'Moyen', 
    image: '/images/services/box-braids.jpg',  // ← REMPLACE PAR TON IMAGE
    description: 'Le style iconique indémodable. Réalisé avec des sections précises pour une tenue longue durée.',
    conseils: 'Lavez vos tresses toutes les 2 semaines. Utilisez un shampoing doux et un spray hydratant.',
    inclus: ['Consultation', 'Shampoing hydratant', 'Séparation des mèches', 'Brushing de finition']
  },
  { 
    id: '3', nom: 'Butterfly Locs', categorie: 'Locks', prix: 150, duree: '5h 00m', dureeMinutes: 300,
    tailleMax: 'Long', 
    image: '/images/services/butterfly-locs.jpg',  // ← REMPLACE PAR TON IMAGE
    badge: 'Nouveau', 
    description: 'Look bohème et texturé avec des boucles douces. Parfait pour un style protecteur.',
    conseils: 'Évitez les produits trop gras. Utilisez une mousse légère pour redéfinir les boucles.',
    inclus: ['Installation des locs', 'Bain de vapeur', 'Finition bouclée', 'Conseils d\'entretien']
  },
  { 
    id: '4', nom: 'Cornrows Artistiques', categorie: 'Nattes', prix: 60, duree: '1h 30m', dureeMinutes: 90,
    tailleMax: 'Court', 
    image: '/images/services/cornrows.jpg',  // ← REMPLACE PAR TON IMAGE
    description: 'Nattes collées avec motifs géométriques personnalisés. Un travail de précision.',
    conseils: 'Démêlez délicatement avec un spray démêlant. Hydratez votre cuir chevelu régulièrement.',
    inclus: ['Design personnalisé', 'Mèches incluses', 'Finition gel', 'Soin hydratant']
  },
  { 
    id: '5', nom: 'Senegalese Twists', categorie: 'Torsades', prix: 110, duree: '4h 00m', dureeMinutes: 240,
    tailleMax: 'Long', 
    image: '/images/services/senegalese-twists.jpg',  // ← REMPLACE PAR TON IMAGE
    badge: 'Tendance',
    description: 'Torsades délicates et légères pour un look bohème chic et protecteur.',
    conseils: 'Démêlez doucement du bout vers la racine. Hydratez avec une huile légère une fois par semaine.',
    inclus: ['Torsades personnalisées', 'Soin hydratant', 'Finition boucles', 'Conseils d\'entretien']
  },
  { 
    id: '6', nom: 'Faux Locs', categorie: 'Locks', prix: 130, duree: '5h 30m', dureeMinutes: 330,
    tailleMax: 'Long', 
    image: '/images/services/faux-locs.jpg',  // ← REMPLACE PAR TON IMAGE
    description: 'Locks synthétiques légères, style protecteur sans engagement longue durée.',
    conseils: 'Évitez l\'excès d\'eau. Utilisez un spray sec pour rafraîchir vos racines.',
    inclus: ['Installation des locks', 'Mèches incluses', 'Finition naturelle', 'Soin hebdomadaire']
  },
  { 
    id: '7', nom: 'Silk Press Deluxe', categorie: 'Soins', prix: 65, duree: '2h 00m', dureeMinutes: 120,
    tailleMax: 'Moyen', 
    image: '/images/services/silk-press.jpg',  // ← REMPLACE PAR TON IMAGE
    badge: 'Best-seller',
    description: 'Lissage thermique sans produits chimiques avec soin vapeur inclus.',
    conseils: 'Utilisez un shampoing sans sulfates. Évitez les produits trop lourds.',
    inclus: ['Lavage profond', 'Soin vapeur', 'Lissage thermique', 'Brushing final']
  },
  { 
    id: '8', nom: 'Soin Kératine Bio', categorie: 'Soins', prix: 85, duree: '2h 30m', dureeMinutes: 150,
    tailleMax: 'Moyen', 
    image: '/images/services/soin-keratine.jpg',  // ← REMPLACE PAR TON IMAGE
    description: 'Lissage et nutrition à la kératine végétale pour cheveux brillants et forts.',
    conseils: 'Attendez 48h avant de mouiller vos cheveux. Utilisez des produits sans sel.',
    inclus: ['Diagnostic capillaire', 'Application kératine', 'Lissage progressif', 'Conseils personnalisés']
  },
  { 
    id: '9', nom: 'Coiffure Mariage', categorie: 'Événementiel', prix: 0, duree: '2h 00m', dureeMinutes: 120,
    tailleMax: 'Long', 
    image: '/images/services/coiffure-mariage.jpg',  // ← REMPLACE PAR TON IMAGE
    badge: 'Sur devis',
    description: 'Chignons, tresses intégrées, accessoires sur-mesure pour votre grand jour.',
    conseils: 'Prévoyez une séance dessai une semaine avant. Apportez vos accessoires si souhaité.',
    inclus: ['Consultation préalable', 'Séance dessai offerte', 'Installation jour J', 'Retouches incluses']
  },
]

export default function ServiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTaille, setSelectedTaille] = useState('Moyen')
  const [selectedGrosseur, setSelectedGrosseur] = useState('Moyenne')
  const [selectedImage, setSelectedImage] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const serviceId = Array.isArray(id) ? id[0] : id
    const found = servicesData.find(s => s.id === serviceId)
    setService(found || null)
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (service) {
      const validTailles = ['Court', 'Moyen', 'Long']
      if (!validTailles.includes(selectedTaille)) {
        setSelectedTaille('Moyen')
      }
      const validGrosseurs = ['Petite', 'Moyenne', 'Grosse']
      if (!validGrosseurs.includes(selectedGrosseur)) {
        setSelectedGrosseur('Moyenne')
      }
    }
  }, [service, selectedTaille, selectedGrosseur])

  const getPrixFinal = () => {
    if (service?.id === '9') return 'Sur devis'
    let prix = service?.prix || 0
    if (selectedTaille === 'Long') prix += 35
    if (selectedTaille === 'Court') prix -= 20
    if (selectedGrosseur === 'Grosse') prix += 25
    if (selectedGrosseur === 'Petite') prix -= 15
    return Math.max(prix, 35)
  }

  const getDureeFinale = () => {
    let duree = service?.dureeMinutes || 0
    if (selectedTaille === 'Long') duree += 60
    if (selectedTaille === 'Court') duree -= 30
    if (selectedGrosseur === 'Grosse') duree += 45
    if (selectedGrosseur === 'Petite') duree -= 30
    return Math.max(duree, 60)
  }

  const formatDuree = (minutes: number) => {
    if (service?.id === '9') return '2h - 3h'
    const heures = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${heures}h${mins > 0 ? ` ${mins}min` : ''}`
  }

  const handleReservation = () => {
    const serviceId = Array.isArray(id) ? id[0] : id
    if (!serviceId) {
      console.error('ID du service manquant')
      return
    }
    if (serviceId === '9') {
      router.push(`/devis/${serviceId}`)
    } else {
      router.push(`/reservation/${serviceId}?taille=${selectedTaille.toLowerCase()}&grosseur=${selectedGrosseur.toLowerCase()}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C2185B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500">Chargement des détails...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-stone-300">sentiment_dissatisfied</span>
          <h2 className="text-2xl font-serif mt-4">Service non trouvé</h2>
          <Link href="/" className="inline-block mt-6 px-6 py-2 bg-[#C2185B] text-white rounded-full hover:bg-[#9b0044] transition">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  const tailles = ['Court', 'Moyen', 'Long']
  const grosseurs = ['Petite', 'Moyenne', 'Grosse']
  const isPrixFixe = service.id === '9'

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link href="/" className="text-xl md:text-2xl font-serif italic text-[#C2185B]">GlowBook</Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/" className="text-stone-600 hover:text-[#C2185B] transition pb-2">Catalogue</Link>
              <Link href="/services" className="text-[#C2185B] border-b-2 border-[#C2185B] font-semibold pb-2">Services</Link>
              <Link href="/tarifs" className="text-stone-600 hover:text-[#C2185B] transition pb-2">Tarifs</Link>
              <Link href="/a-propos" className="text-stone-600 hover:text-[#C2185B] transition pb-2">À propos</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 transition text-sm">Connexion</Link>
              <Link href="/register" className="px-4 py-2 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition shadow-sm">Réserver</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-stone-500 hover:text-[#C2185B] transition">Accueil</Link>
            <span className="material-symbols-outlined text-sm text-stone-400">chevron_right</span>
            <Link href="/services" className="text-stone-500 hover:text-[#C2185B] transition">Services</Link>
            <span className="material-symbols-outlined text-sm text-stone-400">chevron_right</span>
            <span className="text-[#C2185B] font-medium">{service.nom}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-2xl overflow-hidden bg-stone-100 shadow-lg border border-stone-100 aspect-square"
              >
                <img 
                  src={service.image} 
                  alt={service.nom} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </motion.div>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[#C2185B] shadow-md' : 'border-stone-200'
                    }`}
                  >
                    <img src={service.image} alt={`Vue ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {service.badge && (
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    service.badge === 'Populaire' 
                      ? 'bg-amber-100 text-amber-700' 
                      : service.badge === 'Nouveau'
                      ? 'bg-green-100 text-green-700'
                      : service.badge === 'Best-seller'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-[#C2185B]/10 text-[#C2185B]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {service.badge === 'Populaire' ? 'stars' : service.badge === 'Nouveau' ? 'fiber_new' : 'sell'}
                  </span>
                  {service.badge}
                </motion.span>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#1c1b1b]">{service.nom}</h1>
              
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
                  <span className="text-sm">Durée: {service.duree}</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#C2185B]">
                  {typeof getPrixFinal() === 'string' ? getPrixFinal() : `${getPrixFinal()}€`}
                </span>
                {!isPrixFixe && service.prix > 0 && (
                  <>
                    <span className="text-stone-400 line-through text-lg">{service.prix}€</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">-20%</span>
                  </>
                )}
              </div>

              <p className="text-stone-600 leading-relaxed border-l-4 border-[#C2185B] pl-4 italic">{service.description}</p>

              {!isPrixFixe && (
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

              <motion.div 
                key={`${selectedTaille}-${selectedGrosseur}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-[#C2185B]/5 to-pink-50 rounded-xl p-5 border border-pink-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-stone-500">{isPrixFixe ? 'Tarif' : 'Prix total'}</p>
                    <p className="text-3xl font-bold text-[#C2185B]">
                      {typeof getPrixFinal() === 'string' ? getPrixFinal() : `${getPrixFinal()}€`}
                    </p>
                    {!isPrixFixe && <p className="text-xs text-stone-400 mt-1">Acompte de 30% à la réservation</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">Durée estimée</p>
                    <p className="text-xl font-semibold text-[#1c1b1b]">{formatDuree(getDureeFinale())}</p>
                  </div>
                </div>
              </motion.div>

              <button 
                onClick={handleReservation}
                className="w-full py-4 bg-[#C2185B] text-white rounded-full font-bold text-lg hover:bg-[#9b0044] transition-all transform hover:-translate-y-0.5 shadow-md"
              >
                {isPrixFixe ? 'Demander un devis' : 'Réserver cette coiffure'}
              </button>

              <p className="text-xs text-stone-400 text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                Paiement sécurisé • Annulation gratuite jusqu'à 24h avant
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C2185B]">check_circle</span>
                </div>
                <h3 className="text-lg font-semibold">Inclus dans le pack</h3>
              </div>
              <ul className="space-y-3">
                {service.inclus.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-stone-600">
                    <span className="material-symbols-outlined text-sm text-green-500">check</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C2185B]">tips_and_updates</span>
                </div>
                <h3 className="text-lg font-semibold">Conseils d'entretien</h3>
              </div>
              <p className="text-stone-600 leading-relaxed">{service.conseils}</p>
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="mt-3 text-[#C2185B] text-sm font-medium flex items-center gap-1 hover:underline"
              >
                {showDetails ? 'Voir moins' : 'En savoir plus'}
                <span className="material-symbols-outlined text-sm">{showDetails ? 'expand_less' : 'expand_more'}</span>
              </button>
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-stone-100"
                  >
                    <p className="text-stone-500 text-sm">✨ Astuce supplémentaire : Pour prolonger la tenue de votre coiffure, évitez l'humidité excessive et protégez vos cheveux la nuit avec un foulard en satin.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="text-2xl font-serif italic text-white hover:text-pink-100 transition">GlowBook</Link>
              <p className="text-white/70 text-sm mt-3">La beauté afro à portée de clic</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/" className="hover:text-white transition">Catalogue</Link></li>
                <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="/tarifs" className="hover:text-white transition">Tarifs</Link></li>
                <li><Link href="/a-propos" className="hover:text-white transition">À propos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Légal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link></li>
                <li><Link href="/confidentialite" className="hover:text-white transition">Confidentialité</Link></li>
                <li><Link href="/conditions" className="hover:text-white transition">Conditions de vente</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span> contact@glowbook.fr</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">phone</span> 06 12 34 56 78</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center text-white/60 text-sm">
            <p>© 2026 GlowBook - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  )
}