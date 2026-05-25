'use client'

import { useState, useEffect } from 'react'

interface StatsData {
  today: { count: number; bookings: any[] }
  global: { totalBookings: number; completedBookings: number; cancelledBookings: number; pendingBookings: number; conversionRate: number }
  revenue: { totalDeposits: number; monthBookings: number; averageTicket: number }
  occupancy: { rate: number; totalDispoSlots: number; totalBookedHours: number }
  topServices: { nom: string; total: number }[]
}

export default function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-stone-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-stone-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Chiffre d'affaires</p>
          <p className="text-2xl font-bold text-[#C2185B]">{stats.revenue.totalDeposits}€</p>
          <p className="text-xs text-stone-400 mt-1">{stats.revenue.monthBookings} réservations ce mois</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Taux de remplissage</p>
          <p className="text-2xl font-bold text-[#C2185B]">{stats.occupancy.rate}%</p>
          <p className="text-xs text-stone-400 mt-1">{stats.occupancy.totalBookedHours}h / {stats.occupancy.totalDispoSlots}h</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Taux de conversion</p>
          <p className="text-2xl font-bold text-[#C2185B]">{stats.global.conversionRate}%</p>
          <p className="text-xs text-stone-400 mt-1">{stats.global.completedBookings} RDV terminés</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <p className="text-xs text-stone-500 uppercase tracking-wide">Ticket moyen</p>
          <p className="text-2xl font-bold text-[#C2185B]">{stats.revenue.averageTicket}€</p>
          <p className="text-xs text-stone-400 mt-1">acompte moyen</p>
        </div>
      </div>

      {/* Top coiffures */}
      {stats.topServices.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
          <h3 className="font-semibold mb-3">Top 5 des coiffures</h3>
          <div className="space-y-2">
            {stats.topServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{service.nom}</span>
                <span className="text-sm font-semibold text-[#C2185B]">{service.total} réservations</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rendez-vous du jour */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
        <h3 className="font-semibold mb-3">Rendez-vous du jour ({stats.today.count})</h3>
        {stats.today.bookings.length === 0 ? (
          <p className="text-stone-400 text-sm">Aucun rendez-vous aujourd'hui</p>
        ) : (
          <div className="space-y-2">
            {stats.today.bookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-2 bg-stone-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{booking.clientNom}</p>
                  <p className="text-xs text-stone-500">{booking.serviceNom}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{booking.time}</p>
                  <p className="text-xs text-stone-500">{booking.lieu === 'salon' ? 'Au salon' : 'À domicile'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}