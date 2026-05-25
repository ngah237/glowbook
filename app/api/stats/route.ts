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
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Date d'aujourd'hui
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Début de la semaine (lundi)
    const startOfWeek = new Date(today)
    const dayOfWeek = today.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startOfWeek.setDate(today.getDate() - daysToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    // Début du mois
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Rendez-vous aujourd'hui
    const rdvAujourdhui = await prisma.booking.count({
      where: {
        userId: user.id,
        dateHeure: {
          gte: today,
          lt: tomorrow
        },
        statut: { notIn: ['annule', 'absent'] }
      }
    })

    // Revenus de la semaine
    const weekBookings = await prisma.booking.aggregate({
      where: {
        userId: user.id,
        dateHeure: { gte: startOfWeek },
        statut: { notIn: ['annule', 'absent'] }
      },
      _sum: { prixTotal: true }
    })

    const revenusSemaine = weekBookings._sum.prixTotal || 0

    // Rendez-vous du mois
    const rdvMois = await prisma.booking.count({
      where: {
        userId: user.id,
        dateHeure: { gte: startOfMonth },
        statut: { notIn: ['annule', 'absent'] }
      }
    })

    // Taux de remplissage (exemple basé sur une capacité mensuelle de 30)
    const maxBookings = 30
    const tauxRemplissage = rdvMois ? Math.min(100, Math.round((rdvMois / maxBookings) * 100)) : 0

    return NextResponse.json({
      rendezVousAujourdhui: rdvAujourdhui,
      revenusSemaine,
      rendezVousMois: rdvMois,
      tauxRemplissage
    })
  } catch (error) {
    console.error('Erreur GET stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}