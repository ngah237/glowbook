'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import toast from 'react-hot-toast'

interface DashboardStats {
  rendezVousJour: {
    id: string
    heure: string
    cliente: string
    service: string
    lieu: string
    statut: string
    acompte: number
  }[]
  acomptesMois: number
  tauxRemplissage: number
  prochaineDisponibilite: string
  nouvellesReservations: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session) {
      fetchStats()
    }
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) throw new Error('Erreur chargement')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement du tableau de bord')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Sidebar />
        <HeaderMobile />
        <div className="lg:ml-72 min-h-screen bg-[#FDFBF9] flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-12 h-12 border-4 border-[#C2185B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-500">Chargement du tableau de bord...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-rose-50/20 to-white">
        <div className="p-4 md:p-8">
          {/* En-tête avec bienvenue */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#C2185B] to-[#9b0044] rounded-xl flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-white text-xl">dashboard</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1b1b]">Tableau de bord</h1>
            </div>
            <p className="text-stone-500 text-sm ml-14">
              Bonjour {session?.user?.name || 'Coiffeuse'} 👋
            </p>
          </div>

          {/* Alertes nouvelles réservations */}
          {stats && stats.nouvellesReservations > 0 && (
            <div className="mb-6 bg-gradient-to-r from-rose-50 to-pink-50 border-l-4 border-[#C2185B] rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C2185B]/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C2185B]">notifications_active</span>
                </div>
                <div>
                  <p className="font-semibold text-[#1c1b1b]">Nouvelles réservations</p>
                  <p className="text-sm text-stone-600">
                    {stats.nouvellesReservations} nouvelle(s) réservation(s) reçue(s)
                  </p>
                </div>
              </div>
              <Link href="/dashboard/planning" className="text-sm text-[#C2185B] font-medium hover:underline">
                Voir
              </Link>
            </div>
          )}

          {/* 4 Cartes KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition">
                  <span className="material-symbols-outlined text-emerald-600">payments</span>
                </div>
                <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-full">Ce mois</span>
              </div>
              <p className="text-2xl font-bold text-[#C2185B]">{stats?.acomptesMois || 0}€</p>
              <p className="text-sm text-stone-500 mt-1">Acomptes encaissés</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition">
                  <span className="material-symbols-outlined text-blue-600">calendar_month</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1c1b1b]">{stats?.tauxRemplissage || 0}%</p>
              <p className="text-sm text-stone-500 mt-1">Taux de remplissage</p>
              <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C2185B] to-[#9b0044] rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.tauxRemplissage || 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition">
                  <span className="material-symbols-outlined text-amber-600">schedule</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-[#1c1b1b] truncate">{stats?.prochaineDisponibilite || 'Non configuré'}</p>
              <p className="text-sm text-stone-500 mt-1">Prochaine disponibilité</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-5 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition">
                  <span className="material-symbols-outlined text-[#C2185B]">event_available</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1c1b1b]">{stats?.rendezVousJour?.length || 0}</p>
              <p className="text-sm text-stone-500 mt-1">Rendez-vous aujourd'hui</p>
            </div>
          </div>

          {/* Rendez-vous du jour */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-gradient-to-r from-stone-50 to-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C2185B]">today</span>
                <h2 className="font-semibold text-[#1c1b1b]">Rendez-vous aujourd'hui</h2>
              </div>
              <Link href="/dashboard/planning" className="text-sm text-[#C2185B] font-medium hover:underline">
                Voir tout
              </Link>
            </div>
            <div className="p-6">
              {stats && stats.rendezVousJour?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl text-[#C2185B]">event_busy</span>
                  </div>
                  <p className="text-stone-400">✨ Aucun rendez-vous aujourd'hui</p>
                  <p className="text-xs text-stone-300 mt-1">Profitez de votre journée !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.rendezVousJour?.map((rdv) => (
                    <div key={rdv.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-rose-50 transition group">
                      <div className="flex items-center gap-5 flex-wrap">
                        <div className="min-w-[80px]">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <span className="font-bold text-[#C2185B]">{rdv.heure}</span>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-[#1c1b1b]">{rdv.cliente}</p>
                          <p className="text-xs text-stone-500 flex items-center gap-2">
                            <span className="material-symbols-outlined text-xs">content_cut</span>
                            {rdv.service}
                            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                            <span className="material-symbols-outlined text-xs">location_on</span>
                            {rdv.lieu === 'salon' ? 'Au salon' : 'À domicile'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rdv.statut === 'confirme' ? 'bg-green-100 text-green-700' :
                          rdv.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {rdv.statut === 'confirme' ? 'Confirmé' : rdv.statut === 'en_attente' ? 'En attente' : rdv.statut}
                        </span>
                        <span className="text-base font-bold text-[#C2185B]">{rdv.acompte}€</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides - BOUTONS ROSE SANS FLÈCHES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/dashboard/reservation/nouvelle" 
              className="group relative overflow-hidden bg-gradient-to-r from-[#C2185B] to-[#9b0044] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <span className="material-symbols-outlined text-white text-2xl">add_circle</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Nouvelle réservation</h3>
                  <p className="text-rose-100 text-sm">Créer un rendez-vous rapidement</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/dashboard/catalogue" 
              className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <span className="material-symbols-outlined text-white text-2xl">inventory_2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Gérer le catalogue</h3>
                  <p className="text-rose-100 text-sm">Ajouter ou modifier des coiffures</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}