'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Service {
  id: string
  nom: string
  prixBase: number
  dureeBase: number
  description: string
  photos: { url: string; ordre: number }[]
  variantes: { taille: string; grosseur: string; prixSupplement: number; dureeSupplement: number }[]
}

interface User {
  id: string
  nomSalon: string
  telephone: string | null
}

export default function ReservationPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id as string

  // États
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([])
  const [selectedTaille, setSelectedTaille] = useState('')
  const [selectedGrosseur, setSelectedGrosseur] = useState('')
  const [prixFinal, setPrixFinal] = useState(0)
  const [dureeFinale, setDureeFinale] = useState(0)

  // Formulaire client
  const [formData, setFormData] = useState({
    clientNom: '',
    clientEmail: '',
    clientTelephone: '',
    lieu: 'salon',
    adresse: '',
    date: '',
    heure: ''
  })

  // Charger les données du service et du salon
  useEffect(() => {
    async function fetchData() {
      try {
        const [serviceRes, userRes] = await Promise.all([
          fetch(`/api/services/${serviceId}`),
          fetch(`/api/users/salon?serviceId=${serviceId}`)
        ])
        if (serviceRes.ok) {
          const serviceData = await serviceRes.json()
          setService(serviceData)
          setPrixFinal(serviceData.prixBase)
          setDureeFinale(serviceData.dureeBase)
        }
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData)
        }
      } catch (error) {
        toast.error('Erreur chargement')
      }
    }
    if (serviceId) fetchData()
  }, [serviceId])

  // Mettre à jour prix selon variantes
  useEffect(() => {
    if (!service) return
    let prix = service.prixBase
    let duree = service.dureeBase
    const variante = service.variantes?.find(v => v.taille === selectedTaille && v.grosseur === selectedGrosseur)
    if (variante) {
      prix += variante.prixSupplement
      duree += variante.dureeSupplement
    }
    setPrixFinal(prix)
    setDureeFinale(duree)
  }, [selectedTaille, selectedGrosseur, service])

  // Charger créneaux disponibles
  useEffect(() => {
    async function fetchSlots() {
      if (!formData.date || !serviceId || !user) return
      try {
        const res = await fetch(`/api/slots?serviceId=${serviceId}&date=${formData.date}&userId=${user.id}`)
        const data = await res.json()
        setSlots(data.slots || [])
      } catch (error) {
        console.error('Erreur chargement créneaux:', error)
      }
    }
    fetchSlots()
  }, [formData.date, serviceId, user])

  const acompteMontant = Math.max(Math.round(prixFinal * 0.3), 20)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }
    if (!formData.date || !formData.heure) {
      toast.error('Veuillez sélectionner un créneau')
      return
    }

    setLoading(true)
    const dateHeure = new Date(`${formData.date}T${formData.heure}:00`)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          serviceId,
          clientNom: formData.clientNom,
          clientEmail: formData.clientEmail,
          clientTelephone: formData.clientTelephone,
          dateHeure: dateHeure.toISOString(),
          lieu: formData.lieu,
          adresse: formData.lieu === 'domicile' ? formData.adresse : null,
          taille: selectedTaille || null,
          grosseur: selectedGrosseur || null,
          prixTotal: prixFinal,
          acompteMontant: acompteMontant
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur création')
      }

      toast.success(`Rendez-vous confirmé ! Acompte de ${acompteMontant}€ à payer sur place`)
      router.push('/')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!service || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C2185B]"></div>
      </div>
    )
  }

  const photoPrincipale = service.photos?.[0]?.url

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
        <div className="max-w-4xl mx-auto">
          {/* Nom du salon */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-[#C2185B]">{user.nomSalon}</h1>
            {user.telephone && <p className="text-sm text-stone-500 mt-1">📞 {user.telephone}</p>}
          </div>

          {/* Stepper 3 étapes */}
          <div className="flex justify-between mb-8 max-w-md mx-auto">
            {[
              { step: 1, label: 'Coiffure', icon: 'content_cut' },
              { step: 2, label: 'Coordonnées', icon: 'person' },
              { step: 3, label: 'Créneau', icon: 'calendar_month' }
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                  step >= s.step ? 'bg-[#C2185B] text-white shadow-md' : 'bg-stone-100 text-stone-400'
                }`}>
                  <span className="material-symbols-outlined text-xl">{s.icon}</span>
                </div>
                <p className={`text-xs font-medium ${step >= s.step ? 'text-[#C2185B]' : 'text-stone-400'}`}>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* ÉTAPE 1 - Choix coiffure + variantes */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choisissez votre coiffure</h2>
                  <div className="flex gap-4 mb-6">
                    {photoPrincipale && (
                      <img src={photoPrincipale} alt={service.nom} className="w-24 h-24 rounded-lg object-cover" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{service.nom}</h3>
                      <p className="text-sm text-stone-500">{service.description}</p>
                    </div>
                  </div>

                  {service.variantes && service.variantes.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-stone-700">Taille / Longueur</label>
                        <div className="flex gap-2">
                          {['Court', 'Moyen', 'Long'].map(t => (
                            <button key={t} type="button" onClick={() => setSelectedTaille(t)} className={`px-4 py-2 rounded-lg border transition ${
                              selectedTaille === t ? 'border-[#C2185B] bg-pink-50 text-[#C2185B] font-semibold' : 'border-stone-200 hover:border-[#C2185B]'
                            }`}>{t}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-stone-700">Grosseur</label>
                        <div className="flex gap-2">
                          {['Petite', 'Moyenne', 'Grosse'].map(g => (
                            <button key={g} type="button" onClick={() => setSelectedGrosseur(g)} className={`px-4 py-2 rounded-lg border transition ${
                              selectedGrosseur === g ? 'border-[#C2185B] bg-pink-50 text-[#C2185B] font-semibold' : 'border-stone-200 hover:border-[#C2185B]'
                            }`}>{g}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-stone-50 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-stone-600">Prix total</span>
                      <span className="text-2xl font-bold text-[#C2185B]">{prixFinal}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Durée estimée</span>
                      <span className="font-semibold">{dureeFinale} min</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-200">
                      <span className="text-stone-600">Acompte (30%)</span>
                      <span className="font-semibold text-[#C2185B]">{acompteMontant}€</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-3">Solde à régler le jour du rendez-vous</p>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 - Coordonnées client */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Vos informations</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-stone-700">Nom complet *</label>
                      <input type="text" required value={formData.clientNom} onChange={e => setFormData({...formData, clientNom: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 outline-none" placeholder="Sophie Martin" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-stone-700">Email *</label>
                      <input type="email" required value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 outline-none" placeholder="sophie@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-stone-700">Téléphone</label>
                      <input type="tel" value={formData.clientTelephone} onChange={e => setFormData({...formData, clientTelephone: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 outline-none" placeholder="06 12 34 56 78" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-stone-700">Lieu de la prestation</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2"><input type="radio" name="lieu" checked={formData.lieu === 'salon'} onChange={() => setFormData({...formData, lieu: 'salon'})} className="text-[#C2185B]" /> Au salon</label>
                        <label className="flex items-center gap-2"><input type="radio" name="lieu" checked={formData.lieu === 'domicile'} onChange={() => setFormData({...formData, lieu: 'domicile'})} className="text-[#C2185B]" /> À domicile (+15€)</label>
                      </div>
                    </div>
                    {formData.lieu === 'domicile' && (
                      <div>
                        <label className="block text-sm font-medium mb-1 text-stone-700">Adresse complète</label>
                        <textarea rows={2} value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 outline-none" placeholder="12 rue de la Paix, 75002 Paris" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 - Choix du créneau */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choisissez votre créneau</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-stone-700">Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value, heure: ''})} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 outline-none" />
                  </div>

                  {formData.date && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2 text-stone-700">Horaire</label>
                      {slots.length === 0 ? (
                        <p className="text-stone-400 text-center py-8 bg-stone-50 rounded-xl">Aucun créneau disponible ce jour</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {slots.map((slot) => (
                            <button key={slot.time} type="button" disabled={!slot.available} onClick={() => setFormData({...formData, heure: slot.time})} className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                              formData.heure === slot.time ? 'bg-[#C2185B] text-white border-[#C2185B] shadow-sm' : slot.available ? 'border-stone-200 hover:border-[#C2185B] hover:bg-pink-50' : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
                            }`}>{slot.time}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-amber-600">info</span>
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Confirmation immédiate</p>
                        <p className="text-xs text-amber-700 mt-1">Un email récapitulatif vous sera envoyé. Acompte de {acompteMontant}€ à payer sur place.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons navigation */}
              <div className="flex gap-3 mt-8 pt-4 border-t border-stone-100">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="flex-1 py-3 border border-stone-300 rounded-xl hover:bg-stone-50 transition font-medium">← Retour</button>
                )}
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#C2185B] text-white rounded-xl font-semibold hover:bg-[#9b0044] transition shadow-md disabled:opacity-50">
                  {step === 3 ? (loading ? 'Confirmation...' : 'Confirmer ma réservation') : 'Continuer →'}
                </button>
              </div>
            </form>
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