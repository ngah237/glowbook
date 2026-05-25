'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import toast from 'react-hot-toast'

// Données mockées (à remplacer par API)
const clientsExistants = [
  { id: 1, nom: 'Sophie Martin', email: 'sophie@email.com', telephone: '06 12 34 56 78' },
  { id: 2, nom: 'Camille Dubois', email: 'camille@email.com', telephone: '06 23 45 67 89' },
  { id: 3, nom: 'Émilie Laurent', email: 'emilie@email.com', telephone: '06 34 56 78 90' },
  { id: 4, nom: 'Julie Durand', email: 'julie@email.com', telephone: '06 45 67 89 01' },
  { id: 5, nom: 'Clara Lefebvre', email: 'clara@email.com', telephone: '06 56 78 90 12' },
]

const servicesList = [
  { id: 1, nom: 'Knotless Braids', prix: 120, duree: '4h30', categorie: 'Tresses' },
  { id: 2, nom: 'Box Braids Classiques', prix: 90, duree: '3h00', categorie: 'Tresses' },
  { id: 3, nom: 'Butterfly Locs', prix: 150, duree: '5h00', categorie: 'Locks' },
  { id: 4, nom: 'Cornrows Artistiques', prix: 60, duree: '1h30', categorie: 'Nattes' },
  { id: 5, nom: 'Senegalese Twists', prix: 110, duree: '4h00', categorie: 'Twists' },
  { id: 6, nom: 'Faux Locs', prix: 130, duree: '6h00', categorie: 'Locks' },
  { id: 7, nom: 'Silk Press Deluxe', prix: 65, duree: '2h00', categorie: 'Soins' },
  { id: 8, nom: 'Soin Kératine Bio', prix: 85, duree: '2h00', categorie: 'Soins' },
  { id: 9, nom: 'Coiffure Mariage', prix: 150, duree: '3h00', categorie: 'Événementiel' },
]

export default function NouvelleReservationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // 🔔 État pour les alertes de nouvelles réservations
  const [newBookingsAlert, setNewBookingsAlert] = useState(false)
  const [lastCheckTime, setLastCheckTime] = useState(Date.now())

  // 🔔 Vérifier les nouvelles réservations toutes les 30 secondes
  useEffect(() => {
    const checkNewBookings = async () => {
      try {
        const response = await fetch('/api/bookings?since=' + lastCheckTime)
        const newBookings = await response.json()
        if (newBookings && newBookings.length > 0) {
          setNewBookingsAlert(true)
          toast.success(`${newBookings.length} nouvelle(s) réservation(s) !`, {
            duration: 5000,
            icon: '📅'
          })
          setLastCheckTime(Date.now())
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des réservations:', error)
      }
    }
    
    const interval = setInterval(checkNewBookings, 30000)
    return () => clearInterval(interval)
  }, [lastCheckTime])

  // Étape 1 - Client
  const [clientType, setClientType] = useState<'existant' | 'nouveau'>('existant')
  const [selectedClientId, setSelectedClientId] = useState<number>(clientsExistants[0].id)
  const [nouveauClient, setNouveauClient] = useState({ nom: '', email: '', telephone: '' })
  
  // Étape 2 - Service
  const [selectedServiceId, setSelectedServiceId] = useState<number>(servicesList[0].id)
  const [taille, setTaille] = useState('moyen')
  const [grosseur, setGrosseur] = useState('moyenne')
  
  // Étape 3 - Date et lieu
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedHeure, setSelectedHeure] = useState('')
  const [lieu, setLieu] = useState<'salon' | 'domicile'>('salon')
  const [adresse, setAdresse] = useState('')
  
  const selectedClient = clientsExistants.find(c => c.id === selectedClientId)
  const selectedService = servicesList.find(s => s.id === selectedServiceId)
  
  const getPrixFinal = () => {
    let prix = selectedService?.prix || 0
    if (taille === 'long') prix += 35
    if (taille === 'court') prix -= 20
    if (grosseur === 'grosse') prix += 25
    if (grosseur === 'petite') prix -= 15
    return Math.max(prix, 35)
  }
  
  const handleSubmit = async () => {
    if (!selectedDate || !selectedHeure) {
      toast.error('Veuillez sélectionner une date et une heure')
      return
    }
    
    setLoading(true)
    
    const clientData = clientType === 'existant' ? selectedClient : nouveauClient
    
    const reservationData = {
      client: clientData,
      service: selectedService,
      taille,
      grosseur,
      prix: getPrixFinal(),
      date: selectedDate,
      heure: selectedHeure,
      lieu,
      adresse: lieu === 'domicile' ? adresse : null,
      statut: 'confirme',
      createdBy: 'admin',
      createdAt: new Date().toISOString()
    }
    
    console.log('Réservation créée:', reservationData)
    
    setTimeout(() => {
      toast.success(`Rendez-vous créé avec succès pour ${clientData.nom}`)
      router.push('/dashboard/planning')
      setLoading(false)
    }, 1000)
  }
  
  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-pink-50/30 to-white">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {/* Header avec badge d'alerte */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl text-[#C2185B]">event_available</span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1b1b]">Nouvelle réservation</h1>
            </div>
            
            {/* 🔔 Bouton de notification avec badge d'alerte */}
            <div className="relative">
              <button 
                onClick={() => router.push('/dashboard/planning')}
                className="p-2 hover:bg-stone-100 rounded-full transition relative"
                title="Voir les réservations"
              >
                <span className="material-symbols-outlined text-stone-500">notifications</span>
                {newBookingsAlert && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </div>
          
          <p className="text-stone-500 text-sm -mt-6 mb-6 ml-9">Créer un rendez-vous pour une cliente existante ou nouvelle</p>
          
          {/* Stepper amélioré */}
          <div className="flex justify-between mb-10 max-w-2xl mx-auto">
            {[
              { step: 1, label: 'Client', icon: 'person', description: 'Choisir ou créer' },
              { step: 2, label: 'Coiffure', icon: 'content_cut', description: 'Sélectionner' },
              { step: 3, label: 'Date & heure', icon: 'calendar_month', description: 'Planifier' }
            ].map((s) => (
              <div key={s.step} className="flex-1 text-center relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-all z-10 relative ${
                  step >= s.step 
                    ? 'bg-[#C2185B] text-white shadow-lg shadow-pink-200' 
                    : 'bg-stone-100 text-stone-400'
                }`}>
                  <span className="material-symbols-outlined text-xl">{s.icon}</span>
                </div>
                <p className={`text-sm font-semibold ${step >= s.step ? 'text-[#C2185B]' : 'text-stone-400'}`}>{s.label}</p>
                <p className="text-xs text-stone-400 hidden md:block">{s.description}</p>
                {s.step < 3 && (
                  <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-0 ${
                    step > s.step ? 'bg-[#C2185B]' : 'bg-stone-200'
                  }`} style={{ width: 'calc(100% - 3rem)', left: 'calc(50% + 1.5rem)' }}></div>
                )}
              </div>
            ))}
          </div>
          
          {/* Étape 1 - Client */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-2">Informations client</h2>
              <p className="text-stone-500 text-sm mb-6">Sélectionnez une cliente existante ou créez-en une nouvelle</p>
              
              <div className="flex gap-4 mb-6 bg-stone-50 p-1 rounded-full w-fit">
                <button
                  onClick={() => setClientType('existant')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    clientType === 'existant' 
                      ? 'bg-[#C2185B] text-white shadow-sm' 
                      : 'text-stone-600 hover:text-[#C2185B]'
                  }`}
                >
                  Cliente existante
                </button>
                <button
                  onClick={() => setClientType('nouveau')}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    clientType === 'nouveau' 
                      ? 'bg-[#C2185B] text-white shadow-sm' 
                      : 'text-stone-600 hover:text-[#C2185B]'
                  }`}
                >
                  Nouvelle cliente
                </button>
              </div>
              
              {clientType === 'existant' ? (
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">Sélectionner une cliente</label>
                  <select 
                    value={selectedClientId} 
                    onChange={(e) => setSelectedClientId(Number(e.target.value))}
                    className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                  >
                    {clientsExistants.map(c => (
                      <option key={c.id} value={c.id}>{c.nom} - {c.email}</option>
                    ))}
                  </select>
                  {selectedClient && (
                    <div className="mt-4 p-4 bg-pink-50 rounded-xl">
                      <p className="text-sm font-medium text-[#C2185B] mb-2">Informations de la cliente</p>
                      <p className="text-sm"><span className="font-medium text-stone-600">Email:</span> {selectedClient.email}</p>
                      <p className="text-sm"><span className="font-medium text-stone-600">Téléphone:</span> {selectedClient.telephone}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Nom complet *</label>
                    <input 
                      type="text" 
                      value={nouveauClient.nom} 
                      onChange={(e) => setNouveauClient({...nouveauClient, nom: e.target.value})}
                      placeholder="Sophie Martin"
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Email *</label>
                    <input 
                      type="email" 
                      value={nouveauClient.email} 
                      onChange={(e) => setNouveauClient({...nouveauClient, email: e.target.value})}
                      placeholder="sophie@email.com"
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700">Téléphone</label>
                    <input 
                      type="tel" 
                      value={nouveauClient.telephone} 
                      onChange={(e) => setNouveauClient({...nouveauClient, telephone: e.target.value})}
                      placeholder="06 12 34 56 78"
                      className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                    />
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setStep(2)} 
                className="w-full mt-8 bg-[#C2185B] text-white py-3 rounded-full font-semibold hover:bg-[#9b0044] transition shadow-md"
              >
                Continuer →
              </button>
            </div>
          )}
          
          {/* Étape 2 - Service */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-2">Choix de la coiffure</h2>
              <p className="text-stone-500 text-sm mb-6">Sélectionnez le service et personnalisez les options</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-stone-700">Service</label>
                <select 
                  value={selectedServiceId} 
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                  className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                >
                  {servicesList.map(s => (
                    <option key={s.id} value={s.id}>{s.nom} - {s.prix}€ ({s.duree})</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">Taille</label>
                  <select 
                    value={taille} 
                    onChange={(e) => setTaille(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                  >
                    <option value="court">Court (-20€)</option>
                    <option value="moyen">Moyen (standard)</option>
                    <option value="long">Long (+35€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">Grosseur</label>
                  <select 
                    value={grosseur} 
                    onChange={(e) => setGrosseur(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                  >
                    <option value="petite">Petite (-15€)</option>
                    <option value="moyenne">Moyenne (standard)</option>
                    <option value="grosse">Grosse (+25€)</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#C2185B]/5 to-pink-50 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-stone-500">Prix estimé</p>
                    <p className="text-3xl font-bold text-[#C2185B]">{getPrixFinal()}€</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">Durée estimée</p>
                    <p className="font-semibold text-[#1c1b1b]">{selectedService?.duree}</p>
                  </div>
                </div>
                <p className="text-xs text-stone-400 mt-3 italic">Le prix est automatiquement ajusté selon la taille et la grosseur</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-3 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                  ← Retour
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  className="flex-1 bg-[#C2185B] text-white py-3 rounded-xl font-semibold hover:bg-[#9b0044] transition shadow-md"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}
          
          {/* Étape 3 - Date et lieu */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-2">Date et lieu du rendez-vous</h2>
              <p className="text-stone-500 text-sm mb-6">Choisissez le créneau et le lieu de la prestation</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-stone-700">Heure</label>
                  <select 
                    value={selectedHeure} 
                    onChange={(e) => setSelectedHeure(e.target.value)}
                    className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                  >
                    <option value="">Sélectionner une heure</option>
                    <option value="09:00">09:00</option>
                    <option value="10:30">10:30</option>
                    <option value="14:00">14:00</option>
                    <option value="15:30">15:30</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-stone-700">Lieu de la prestation</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={lieu === 'salon'} 
                      onChange={() => setLieu('salon')}
                      className="text-[#C2185B] focus:ring-[#C2185B]/20" 
                    />
                    <span>Au salon</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={lieu === 'domicile'} 
                      onChange={() => setLieu('domicile')}
                      className="text-[#C2185B] focus:ring-[#C2185B]/20" 
                    />
                    <span>À domicile (+15€)</span>
                  </label>
                </div>
              </div>
              
              {lieu === 'domicile' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-stone-700">Adresse complète</label>
                  <textarea 
                    rows={2} 
                    value={adresse} 
                    onChange={(e) => setAdresse(e.target.value)}
                    placeholder="12 rue de la Paix, 75002 Paris"
                    className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                  />
                </div>
              )}
              
              {/* Récapitulatif */}
              <div className="bg-stone-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-[#1c1b1b] mb-3">Récapitulatif de la réservation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-stone-500">Client</span><span className="font-medium">{clientType === 'existant' ? selectedClient?.nom : nouveauClient.nom}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Service</span><span>{selectedService?.nom}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Taille / Grosseur</span><span className="capitalize">{taille} / {grosseur}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Date / Heure</span><span>{selectedDate ? new Date(selectedDate).toLocaleDateString('fr-FR') : '—'} à {selectedHeure || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Lieu</span><span>{lieu === 'salon' ? 'Au salon' : 'À domicile'}</span></div>
                  <div className="flex justify-between pt-2 border-t border-stone-200"><span className="font-semibold">Prix total</span><span className="font-bold text-[#C2185B] text-lg">{getPrixFinal()}€</span></div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(2)} 
                  className="flex-1 py-3 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                  ← Retour
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading || !selectedDate || !selectedHeure}
                  className="flex-1 bg-[#C2185B] text-white py-3 rounded-xl font-semibold hover:bg-[#9b0044] transition disabled:opacity-50 shadow-md"
                >
                  {loading ? 'Création en cours...' : 'Créer le rendez-vous '}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}