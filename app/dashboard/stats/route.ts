import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, nomSalon: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // Rendez-vous du jour
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(now)
    todayEnd.setHours(23, 59, 59, 999)

    const todayBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        dateHeure: { gte: todayStart, lte: todayEnd },
        statut: { notIn: ['annule', 'paiement_echoue'] }
      },
      include: { service: true },
      orderBy: { dateHeure: 'asc' }
    })

    // Statistiques globales
    const totalBookings = await prisma.booking.count({
      where: { userId: user.id, statut: { notIn: ['annule', 'paiement_echoue'] } }
    })

    const completedBookings = await prisma.booking.count({
      where: { userId: user.id, statut: 'termine' }
    })

    const cancelledBookings = await prisma.booking.count({
      where: { userId: user.id, statut: 'annule' }
    })

    const pendingBookings = await prisma.booking.count({
      where: { userId: user.id, statut: 'en_attente' }
    })

    // Chiffre d'affaires (acomptes encaissés)
    const totalDeposits = await prisma.transaction.aggregate({
      where: {
        booking: { userId: user.id },
        statut: 'paye',
        type: 'acompte'
      },
      _sum: { montant: true }
    })

    // Rendez-vous du mois
    const monthBookings = await prisma.booking.count({
      where: {
        userId: user.id,
        dateHeure: { gte: startOfMonth },
        statut: { notIn: ['annule', 'paiement_echoue'] }
      }
    })

    // Taux de remplissage
    const disponibilites = await prisma.disponibilite.findMany({
      where: { userId: user.id, actif: true }
    })

    let totalDispoMinutes = 0
    for (const dispo of disponibilites) {
      const [startHour, startMin] = dispo.heureDebut.split(':').map(Number)
      const [endHour, endMin] = dispo.heureFin.split(':').map(Number)
      totalDispoMinutes += (endHour * 60 + endMin) - (startHour * 60 + startMin)
    }

    const totalBookedMinutes = await prisma.booking.aggregate({
      where: {
        userId: user.id,
        statut: { notIn: ['annule', 'paiement_echoue'] }
      },
      _sum: { dureeBase: true }
    })

    const tauxRemplissage = totalDispoMinutes > 0 
      ? Math.round(((totalBookedMinutes._sum?.dureeBase || 0) / totalDispoMinutes) * 100) 
      : 0

    // Top 5 services
    const topServices = await prisma.$queryRaw`
      SELECT s.nom, COUNT(b.id) as total
      FROM "Service" s
      JOIN "Booking" b ON b.service_id = s.id
      WHERE b.user_id = ${user.id} AND b.statut NOT IN ('annule', 'paiement_echoue')
      GROUP BY s.id, s.nom
      ORDER BY total DESC
      LIMIT 5
    `

    // Évolution mensuelle des réservations (6 derniers mois)
    const monthlyEvolution = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const count = await prisma.booking.count({
        where: {
          userId: user.id,
          dateHeure: { gte: month, lt: nextMonth },
          statut: { notIn: ['annule', 'paiement_echoue'] }
        }
      })
      
      monthlyEvolution.push({
        mois: month.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        total: count
      })
    }

    return NextResponse.json({
      today: {
        count: todayBookings.length,
        bookings: todayBookings.map(b => ({
          id: b.id,
          time: new Date(b.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          clientNom: b.clientNom,
          serviceNom: b.service?.nom,
          lieu: b.lieu,
          statut: b.statut
        }))
      },
      global: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        conversionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0
      },
      revenue: {
        totalDeposits: Number(totalDeposits._sum?.montant || 0),
        monthBookings,
        averageTicket: monthBookings > 0 ? Math.round(Number(totalDeposits._sum?.montant || 0) / monthBookings) : 0
      },
      occupancy: {
        rate: tauxRemplissage,
        totalDispoHours: Math.round(totalDispoMinutes / 60),
        totalBookedHours: Math.round((totalBookedMinutes._sum?.dureeBase || 0) / 60)
      },
      topServices: topServices as { nom: string; total: number }[],
      monthlyEvolution
    })
  } catch (error) {
    console.error('Erreur GET stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}