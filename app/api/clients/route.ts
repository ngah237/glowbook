import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les clients d'une coiffeuse
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

    // Récupérer les clients uniques depuis les réservations
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      select: {
        clientNom: true,
        clientEmail: true,
        clientTelephone: true,
        dateHeure: true,
        prixTotal: true,
        statut: true
      },
      orderBy: { dateHeure: 'desc' }
    })

    // Regrouper par email pour avoir une liste unique de clients
    const clientsMap = new Map()
    bookings.forEach(booking => {
      if (!booking.clientEmail) return
      
      if (!clientsMap.has(booking.clientEmail)) {
        clientsMap.set(booking.clientEmail, {
          id: booking.clientEmail,
          nom: booking.clientNom || 'Client',
          email: booking.clientEmail,
          telephone: booking.clientTelephone || '',
          rendezVous: 1,
          dernierRDV: booking.dateHeure,
          totalDepense: Number(booking.prixTotal) || 0,
          dernierStatut: booking.statut
        })
      } else {
        const existing = clientsMap.get(booking.clientEmail)
        existing.rendezVous += 1
        existing.totalDepense += Number(booking.prixTotal) || 0
        // Mettre à jour le dernier RDV si plus récent
        if (booking.dateHeure > existing.dernierRDV) {
          existing.dernierRDV = booking.dateHeure
          existing.dernierStatut = booking.statut
        }
      }
    })

    // Convertir la Map en tableau et trier par dernier RDV
    const clients = Array.from(clientsMap.values())
    clients.sort((a, b) => new Date(b.dernierRDV).getTime() - new Date(a.dernierRDV).getTime())

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Erreur GET clients:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter un client (créer une réservation par défaut)
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { nom, email, telephone } = body

    // Validation des champs requis
    if (!nom || !email) {
      return NextResponse.json({ error: 'Le nom et l\'email sont requis' }, { status: 400 })
    }

    // Validation du nom
    if (nom.trim().length < 2) {
      return NextResponse.json({ error: 'Le nom doit contenir au moins 2 caractères' }, { status: 400 })
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    // Vérifier si le client existe déjà via une réservation
    const existingClient = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        clientEmail: email
      }
    })

    if (existingClient) {
      return NextResponse.json({ 
        error: 'Ce client existe déjà' 
      }, { status: 400 })
    }

    // Récupérer un service par défaut (le premier service actif de la coiffeuse)
    const defaultService = await prisma.service.findFirst({
      where: { 
        userId: user.id,
        statut: 'active'
      }
    })

    if (!defaultService) {
      return NextResponse.json({ 
        error: 'Aucun service trouvé. Veuillez créer un service avant d\'ajouter un client.' 
      }, { status: 400 })
    }

    // Créer une réservation par défaut pour ce client
    const newBooking = await prisma.booking.create({
      data: {
        userId: user.id,
        serviceId: defaultService.id,
        clientNom: nom.trim(),
        clientEmail: email.toLowerCase().trim(),
        clientTelephone: telephone?.trim() || '',
        dateHeure: new Date(),
        lieu: 'salon',
        statut: 'en_attente',
        acompteMontant: 0,
        prixTotal: 0,
        message: 'Client ajouté manuellement depuis le dashboard',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        service: {
          select: {
            nom: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Client ${nom} ajouté avec succès`,
      client: {
        id: email.toLowerCase(),
        nom: nom.trim(),
        email: email.toLowerCase(),
        telephone: telephone?.trim() || '',
        rendezVous: 1,
        dernierRDV: newBooking.dateHeure.toISOString(),
        totalDepense: 0,
        service: defaultService.nom
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur POST client:', error)
    return NextResponse.json({ error: 'Erreur serveur lors de l\'ajout du client' }, { status: 500 })
  }
}

// PUT - Modifier un client
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { ancienEmail, nom, email, telephone } = body

    if (!ancienEmail || !email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    // Vérifier que le client existe
    const existingBookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        clientEmail: ancienEmail
      }
    })

    if (existingBookings.length === 0) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }

    // Mettre à jour toutes les réservations du client
    await prisma.booking.updateMany({
      where: {
        userId: user.id,
        clientEmail: ancienEmail
      },
      data: {
        clientNom: nom || existingBookings[0].clientNom,
        clientEmail: email,
        clientTelephone: telephone || existingBookings[0].clientTelephone
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Client mis à jour avec succès`
    })
    
  } catch (error) {
    console.error('Erreur PUT client:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un client (et ses réservations)
export async function DELETE(request: NextRequest) {
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
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email du client requis' }, { status: 400 })
    }

    // Supprimer toutes les réservations du client
    const deletedBookings = await prisma.booking.deleteMany({
      where: {
        userId: user.id,
        clientEmail: email
      }
    })

    if (deletedBookings.count === 0) {
      return NextResponse.json({ error: 'Client non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Client et ses ${deletedBookings.count} réservation(s) supprimés`
    })
    
  } catch (error) {
    console.error('Erreur DELETE client:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}