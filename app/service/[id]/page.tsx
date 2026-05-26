'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Service {
  id: string
  nom: string
  categorie: string
  prixBase: number
  dureeBase: number
  description: string
  inclus: string[]
  conseils: string
  photos?: { url: string }[]
}

export default function ServiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    heure: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${id}`)
      if (!response.ok) throw new Error('Service non trouvé')
      const data = await response.json()
      setService(data)
    } catch (error) {
      toast.error('Erreur chargement du service')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nom || !formData.email || !formData.date || !formData.heure) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    setSubmitting(true)
    
    try {
      const dateTime = new Date(`${formData.date}T${formData.heure}`)
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId: service?.id, // À adapter
          serviceId: id,
          clientNom: formData.nom,
          clientEmail: formData.email,
          clientTelephone: formData.telephone,
          dateHeure: dateTime.toISOString(),
          prixTotal: service?.prixBase
        })
      })
      
      if (response.ok) {
        toast.success('Réservation envoyée ! Vous recevrez une confirmation par email.')
        router.push('/reservation-confirmation')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la réservation')
      }
    } catch (error) {
      toast.error('Erreur de connexion')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C2185B] border-t-transparent"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500">Service non trouvé</p>
          <Link href="/" className="mt-4 text-[#C2185B] inline-block">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      {/* Header simplifié */}
      <header className="fixed top-0 w-full z-50 bg-[#FDFBF9] border-b border-stone-200 px-4 md:px-8 h-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
          <Link href="/" className="text-2xl font-serif italic text-[#C2185B]">GlowBook</Link>
          <Link href="/" className="text-stone-600 hover:text-[#C2185B] transition">← Retour</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="rounded-xl overflow-hidden sticky top-28">
            <img 
              src={service.photos?.[0]?.url || '/images/placeholder.jpg'} 
              alt={service.nom}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          {/* Infos et formulaire */}
          <div>
            <div className="mb-6">
              <span className="text-sm text-[#C2185B] uppercase font-semibold">{service.categorie}</span>
              <h1 className="text-3xl font-serif font-bold mt-1">{service.nom}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-2xl font-bold text-[#C2185B]">{Number(service.prixBase)}€</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500">{Math.floor(service.dureeBase / 60)}h{service.dureeBase % 60}min</span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-stone-600">{service.description}</p>
            </div>

            {service.inclus && service.inclus.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-2">✨ Ce qui est inclus</h3>
                <ul className="space-y-1">
                  {service.inclus.map((item, idx) => (
                    <li key={idx} className="text-stone-600 text-sm flex items-center gap-2">
                      <span className="text-[#C2185B]">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.conseils && (
              <div className="bg-pink-50 rounded-xl p-4 mb-8">
                <h3 className="font-semibold text-[#C2185B] mb-1">💡 Conseil de la coiffeuse</h3>
                <p className="text-stone-600 text-sm">{service.conseils}</p>
              </div>
            )}

            {/* Formulaire de réservation */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-4">Réserver ce service</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C2185B]/20 focus:border-[#C2185B]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C2185B]/20 focus:border-[#C2185B]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C2185B]/20 focus:border-[#C2185B]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C2185B]/20 focus:border-[#C2185B]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Heure *</label>
                  <input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-[#C2185B]/20 focus:border-[#C2185B]"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#C2185B] text-white rounded-full font-semibold hover:bg-[#9b0044] transition disabled:opacity-50"
                >
                  {submitting ? 'Réservation en cours...' : 'Réserver maintenant'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}