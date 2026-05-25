import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const salonId = searchParams.get('salonId')
    const serviceId = searchParams.get('serviceId')
    const date = searchParams.get('date')
    const varianteId = searchParams.get('varianteId')

    if (!salonId || !serviceId || !date) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    // Récupérer la durée du service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { variantes: true }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    let dureeMinutes = service.dureeBase

    // Ajuster la durée selon la variante
    if (varianteId) {
      const variante = service.variantes.find(v => v.id === varianteId)
      if (variante && variante.dureeSupplement) {
        dureeMinutes += variante.dureeSupplement
      }
    }

    // Récupérer les disponibilités pour ce jour
    const dateObj = new Date(date)
    const jourSemaine = dateObj.getDay() // 0 = Dimanche, 1 = Lundi, ...

    const disponibilites = await prisma.disponibilite.findMany({
      where: {
        userId: salonId,
        jourSemaine: jourSemaine,
        actif: true
      }
    })

    if (disponibilites.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    // Récupérer les réservations existantes pour ce jour
    const startOfDay = new Date(dateObj)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(dateObj)
    endOfDay.setHours(23, 59, 59, 999)

    const existingBookings = await prisma.booking.findMany({
      where: {
        userId: salonId,
        dateHeure: {
          gte: startOfDay,
          lte: endOfDay
        },
        statut: { notIn: ['annule', 'paiement_echoue'] }
      }
    })

    // Générer les créneaux disponibles
    const slots: string[] = []
    const stepMinutes = 15 // Créneaux de 15 minutes

    for (const dispo of disponibilites) {
      const [startHour, startMinute] = dispo.heureDebut.split(':').map(Number)
      const [endHour, endMinute] = dispo.heureFin.split(':').map(Number)

      let current = new Date(dateObj)
      current.setHours(startHour, startMinute, 0, 0)
      const end = new Date(dateObj)
      end.setHours(endHour, endMinute, 0, 0)

      while (current.getTime() + dureeMinutes * 60000 <= end.getTime()) {
        const slotTime = current.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        
        // Vérifier si le créneau est déjà réservé
        const slotEnd = new Date(current.getTime() + dureeMinutes * 60000)
        const isBooked = existingBookings.some(booking => {
          const bookingStart = new Date(booking.dateHeure)
          const bookingEnd = new Date(bookingStart.getTime() + (booking.service?.dureeBase || 60) * 60000)
          return (current < bookingEnd && slotEnd > bookingStart)
        })

        if (!isBooked) {
          slots.push(slotTime)
        }

        current.setMinutes(current.getMinutes() + stepMinutes)
      }
    }

    return NextResponse.json({ slots, dureeMinutes })
  } catch (error) {
    console.error('Erreur création créneaux:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}