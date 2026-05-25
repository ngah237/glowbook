'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Types
interface Appointment {
  id: string
  client_nom: string
  service: string
  heure: string
  date: string
  lieu: string
  statut: string
  prix: number
  acompte: number
}

export default function PlanningPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'semaine' | 'mois'>('semaine')
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
  // Vue Mois
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      // Charger les rendez-vous (mockés pour l'exemple)
      setAppointments([
        { id: '1', client_nom: 'Sophie Martin', service: 'Knotless Braids', date: '2025-05-12', heure: '09:00', lieu: 'salon', statut: 'confirmé', prix: 120, acompte: 30 },
        { id: '2', client_nom: 'Camille Dubois', service: 'Butterfly Locs', date: '2025-05-13', heure: '14:00', lieu: 'salon', statut: 'confirmé', prix: 150, acompte: 30 },
        { id: '3', client_nom: 'Julie Durand', service: 'Box Braids', date: '2025-05-14', heure: '10:00', lieu: 'domicile', statut: 'confirmé', prix: 90, acompte: 20 },
        { id: '4', client_nom: 'Emma Martin', service: 'Balayage', date: '2025-05-15', heure: '11:00', lieu: 'salon', statut: 'confirmé', prix: 65, acompte: 15 },
      ])
      setLoading(false)
    }
  }, [status, router])

  // Obtenir les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const days = []
    // Ajuster pour que le mois commence le lundi (1 = lundi)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1
    
    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(a => a.date === dateStr)
  }

  const getAppointmentsForWeek = () => {
    // Logique pour la semaine
    return appointments.slice(0, 5)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  const daysInMonth = getDaysInMonth(currentDate)

  const modifyAppointment = (appointment: Appointment) => {
    toast.success(`Modification du rendez-vous de ${appointment.client_nom}`)
  }

  const cancelAppointment = (appointment: Appointment) => {
    if (confirm(`Annuler le rendez-vous de ${appointment.client_nom} ? L'acompte sera remboursé.`)) {
      setAppointments(appointments.filter(a => a.id !== appointment.id))
      toast.success(`Rendez-vous annulé`)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Sidebar />
        <HeaderMobile />
        <div className="lg:ml-72 min-h-screen bg-[#FDFBF9] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#C2185B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    )
  }

  if (!session) return null

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-[#FDFBF9]">
        <div className="p-4 md:p-8">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1b1b]">Planning</h1>
              <p className="text-stone-500 text-sm mt-1">Gérez votre agenda et vos rendez-vous</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('semaine')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'semaine' ? 'bg-[#C2185B] text-white shadow-md' : 'bg-white border border-stone-200 text-stone-600'}`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewMode('mois')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'mois' ? 'bg-[#C2185B] text-white shadow-md' : 'bg-white border border-stone-200 text-stone-600'}`}
              >
                Mois
              </button>
            </div>
          </div>

          {/* VUE SEMAINE */}
          {viewMode === 'semaine' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 border-b border-stone-100 bg-stone-50/50">
                  <div className="p-3 text-center text-xs font-semibold text-stone-500 border-r border-stone-100">Heure</div>
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                    <div key={day} className="p-3 text-center text-xs font-semibold text-stone-500 border-r border-stone-100">{day}</div>
                  ))}
                </div>
                {['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'].map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-stone-100 min-h-[80px]">
                    <div className="p-2 text-xs text-stone-400 text-center border-r border-stone-100 bg-stone-50/30">{hour}</div>
                    {[...Array(7)].map((_, idx) => {
                      const appointment = getAppointmentsForWeek().find(a => a.heure === hour && new Date(a.date).getDay() === idx + 1)
                      return (
                        <div key={idx} className="p-1 border-r border-stone-100 relative group">
                          {appointment && (
                            <div 
                              onClick={() => { setSelectedAppointment(appointment); setShowModal(true) }}
                              className="bg-pink-50 rounded-lg p-2 text-xs border-l-2 border-[#C2185B] cursor-pointer hover:shadow-md transition"
                            >
                              <p className="font-medium text-[#1c1b1b]">{appointment.client_nom}</p>
                              <p className="text-stone-500 text-[10px]">{appointment.service}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VUE MOIS - NOUVEAU */}
          {viewMode === 'mois' && (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              {/* En-tête du mois */}
              <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-stone-50/50">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-stone-100 rounded-full transition">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h2 className="text-xl font-semibold text-[#1c1b1b]">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-stone-100 rounded-full transition">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              
              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 border-b border-stone-100">
                {weekDays.map(day => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-stone-500">{day}</div>
                ))}
              </div>
              
              {/* Grille du mois */}
              <div className="grid grid-cols-7 auto-rows-fr">
                {daysInMonth.map((date, idx) => {
                  const appointmentsOfDay = date ? getAppointmentsForDate(date) : []
                  const isToday = date && date.toDateString() === new Date().toDateString()
                  const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString()
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => date && setSelectedDate(date)}
                      className={`min-h-[100px] p-2 border-b border-r border-stone-100 transition-all cursor-pointer hover:bg-pink-50/30 ${
                        isToday ? 'bg-pink-50/50' : ''
                      } ${isSelected ? 'ring-2 ring-[#C2185B] ring-inset' : ''}`}
                    >
                      {date && (
                        <>
                          <div className={`text-right text-sm font-medium mb-1 ${isToday ? 'text-[#C2185B]' : 'text-stone-600'}`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-1">
                            {appointmentsOfDay.slice(0, 2).map(apt => (
                              <div
                                key={apt.id}
                                onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); setShowModal(true) }}
                                className="bg-pink-100 rounded-md p-1 text-[10px] cursor-pointer hover:bg-pink-200 transition truncate"
                              >
                                {apt.heure} - {apt.client_nom}
                              </div>
                            ))}
                            {appointmentsOfDay.length > 2 && (
                              <div className="text-[10px] text-stone-400 text-center">+{appointmentsOfDay.length - 2} autres</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Modal détails rendez-vous */}
          {showModal && selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Détails du rendez-vous</h3>
                  <button onClick={() => setShowModal(false)} className="p-1 hover:bg-stone-100 rounded-full">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-stone-500">Client</span><span className="font-medium">{selectedAppointment.client_nom}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Service</span><span>{selectedAppointment.service}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Date</span><span>{selectedAppointment.date}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Heure</span><span>{selectedAppointment.heure}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Lieu</span><span>{selectedAppointment.lieu === 'salon' ? 'Au salon' : 'À domicile'}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Prix total</span><span className="font-bold text-[#C2185B]">{selectedAppointment.prix}€</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">Acompte versé</span><span>{selectedAppointment.acompte}€</span></div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => modifyAppointment(selectedAppointment)} className="flex-1 py-2 border border-[#C2185B] text-[#C2185B] rounded-lg hover:bg-pink-50 transition">Modifier</button>
                  <button onClick={() => cancelAppointment(selectedAppointment)} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Annuler</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}