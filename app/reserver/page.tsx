'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const services = [
  { id: '1', nom: 'Knotless Braids', prix: 120, duree: '4h30', image: '/images/knotless.jpg' },
  { id: '2', nom: 'Box Braids Classiques', prix: 90, duree: '3h', image: '/images/boxbraids.jpg' },
  { id: '3', nom: 'Butterfly Locs', prix: 150, duree: '5h', image: '/images/butterfly.jpg' },
  { id: '4', nom: 'Silk Press', prix: 65, duree: '1h30', image: '/images/silkpress.jpg' },
]

export default function ReserverPage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleReserver = () => {
    if (selectedService) router.push(`/reservation/${selectedService}`)
  }

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FDFBF9] border-b border-stone-200 shadow-sm">
        <Link href="/" className="text-2xl font-serif italic text-[#C2185B]">GlowBook</Link>
        <div className="flex gap-3"><Link href="/login" className="px-5 py-2 rounded-full border border-stone-200">Connexion</Link><Link href="/register" className="px-5 py-2 bg-[#C2185B] text-white rounded-full">Réserver</Link></div>
      </header>

      <main className="pt-20 max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold text-center mb-4">Réserver une coiffure</h1>
        <p className="text-center text-stone-500 mb-12">Choisissez votre coiffure parmi notre sélection</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} onClick={() => setSelectedService(service.id)} className={`cursor-pointer rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${selectedService === service.id ? 'ring-2 ring-primary shadow-lg transform scale-[1.02]' : 'hover:shadow-md'}`}>
              <div className="bg-white"><div className="h-48 overflow-hidden"><img src={`https://images.unsplash.com/photo-${service.id === '1' ? '1611166119753-2f0e9f2c8e5a' : service.id === '2' ? '1585079545273-5d3b5d9c7e2a' : service.id === '3' ? '1607522370275-f1425360f7d2' : '1595475207225-428b62bda831'}?w=400`} alt={service.nom} className="w-full h-full object-cover" /></div>
                <div className="p-4"><h3 className="font-semibold text-lg">{service.nom}</h3><p className="text-primary font-bold mt-1">{service.prix}€</p><p className="text-stone-400 text-sm">⏱️ {service.duree}</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12"><button onClick={handleReserver} disabled={!selectedService} className={`px-8 py-3 rounded-full font-semibold transition-all ${selectedService ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>Continuer la réservation</button></div>
      </main>

      <footer className="py-8 text-center border-t border-stone-200"><p className="text-stone-400 text-sm">© 2025 GlowBook - Tous droits réservés</p></footer>
    </div>
  )
}