import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les réservations d'une coiffeuse
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const statut = searchParams.get('statut')

    let whereClause: any = { userId: user.id }
    
    if (startDate && endDate) {
      whereClause.dateHeure = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    if (statut && statut !== 'tous') {
      whereClause.statut = statut
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        service: {
          select: {
            id: true,
            nom: true,
            prixBase: true,
            dureeBase: true
          }
        },
        variante: true
      },
      orderBy: { dateHeure: 'desc' }
    })

    // Formater les données pour le frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      clientNom: booking.clientNom,
      clientEmail: booking.clientEmail,
      clientTelephone: booking.clientTelephone,
      dateHeure: booking.dateHeure,
      lieu: booking.lieu,
      statut: booking.statut,
      prixTotal: Number(booking.prixTotal),
      acompteMontant: Number(booking.acompteMontant),
      service: booking.service,
      variante: booking.variante,
      message: booking.message,
      createdAt: booking.createdAt
    }))

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error('Erreur GET bookings:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une réservation (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      salonId,  // userId
      serviceId,
      varianteId,
      clientNom,
      clientEmail,
      clientTelephone,
      dateHeure,
      lieu,
      adresse,
      taille,
      grosseur,
      prixTotal,
      acompteMontant,
      message
    } = body

    // Validation
    if (!salonId || !serviceId || !clientNom || !clientEmail || !dateHeure) {
      return NextResponse.json({ 
        error: 'Champs requis: salonId, serviceId, clientNom, clientEmail, dateHeure' 
      }, { status: 400 })
    }

    // Vérifier que le service existe
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId: salonId,
        statut: 'active'
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé ou indisponible' }, { status: 404 })
    }

    // Vérifier que la date n'est pas dans le passé
    const bookingDate = new Date(dateHeure)
    if (bookingDate < new Date()) {
      return NextResponse.json({ error: 'La date de réservation ne peut pas être dans le passé' }, { status: 400 })
    }

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        userId: salonId,
        serviceId: serviceId,
        varianteId: varianteId || null,
        clientNom: clientNom,
        clientEmail: clientEmail,
        clientTelephone: clientTelephone || '',
        dateHeure: bookingDate,
        lieu: lieu || 'salon',
        adresse: adresse || '',
        taille: taille || '',
        grosseur: grosseur || '',
        prixTotal: prixTotal || 0,
        acompteMontant: acompteMontant || 0,
        statut: 'en_attente',  // Statut initial
        message: message || '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: { 
        service: {
          select: {
            nom: true,
            prixBase: true,
            dureeBase: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Réservation créée avec succès',
      booking: {
        id: booking.id,
        clientNom: booking.clientNom,
        clientEmail: booking.clientEmail,
        dateHeure: booking.dateHeure,
        statut: booking.statut,
        service: booking.service,
        prixTotal: Number(booking.prixTotal)
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur POST booking:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour une réservation
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, statut, dateHeure, lieu } = body

    if (!bookingId) {
      return NextResponse.json({ error: 'ID de réservation requis' }, { status: 400 })
    }

    // Vérifier que la réservation appartient à l'utilisateur
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingBooking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 })
    }

    // Mettre à jour
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        statut: statut || existingBooking.statut,
        dateHeure: dateHeure ? new Date(dateHeure) : existingBooking.dateHeure,
        lieu: lieu || existingBooking.lieu,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Réservation mise à jour',
      booking: updatedBooking
    })
    
  } catch (error) {
    console.error('Erreur PUT booking:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Annuler une réservation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json({ error: 'ID de réservation requis' }, { status: 400 })
    }

    // Vérifier que la réservation appartient à l'utilisateur
    const existingBooking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        user: {
          email: session.user.email
        }
      }
    })

    if (!existingBooking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 })
    }

    // Annuler (changer statut plutôt que supprimer)
    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        statut: 'annule',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Réservation annulée',
      booking: cancelledBooking
    })
    
  } catch (error) {
    console.error('Erreur DELETE booking:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}