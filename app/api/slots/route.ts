import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const date = searchParams.get('date')
    const userId = searchParams.get('userId')

    if (!serviceId || !date || !userId) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { dureeBase: true, nom: true }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    const dateObj = new Date(date)
    const jourSemaine = dateObj.getDay()
    const jourSemaineIndex = jourSemaine === 0 ? 6 : jourSemaine - 1

    const disponibilites = await prisma.disponibilite.findMany({
      where: {
        userId,
        jourSemaine: jourSemaineIndex,
        actif: true
      }
    })

    if (disponibilites.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    const exception = await prisma.exception.findFirst({
      where: {
        userId,
        dateException: {
          gte: new Date(`${date}T00:00:00`),
          lt: new Date(`${date}T23:59:59`)
        },
        actif: false
      }
    })

    if (exception) {
      return NextResponse.json({ slots: [] })
    }

    const existingBookings = await prisma.booking.findMany({
      where: {
        userId,
        dateHeure: {
          gte: new Date(`${date}T00:00:00`),
          lt: new Date(`${date}T23:59:59`)
        },
        statut: { notIn: ['annule', 'absent'] }
      },
      select: { dateHeure: true }
    })

    const bookedTimes = new Set(
      existingBookings.map(b => 
        b.dateHeure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      )
    )

    const slots: { time: string; available: boolean }[] = []
    const dureeMinutes = service.dureeBase

    for (const dispo of disponibilites) {
      let [startHour, startMin] = dispo.heureDebut.split(':').map(Number)
      const [endHour, endMin] = dispo.heureFin.split(':').map(Number)
      
      let currentMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin

      while (currentMinutes + dureeMinutes <= endMinutes) {
        const hour = Math.floor(currentMinutes / 60)
        const minute = currentMinutes % 60
        const timeSlot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
        
        slots.push({
          time: timeSlot,
          available: !bookedTimes.has(timeSlot)
        })
        currentMinutes += dureeMinutes
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    console.error('Erreur GET slots:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}