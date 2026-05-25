import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les disponibilités d'une coiffeuse
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

    const disponibilites = await prisma.disponibilite.findMany({
      where: { userId: user.id },
      orderBy: { jourSemaine: 'asc' }
    })

    // Ajouter les noms des jours pour le frontend
    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    
    const disponibilitesFormatees = disponibilites.map(disp => ({
      ...disp,
      jourNom: joursSemaine[disp.jourSemaine],
      actif: disp.actif ?? true
    }))

    return NextResponse.json(disponibilitesFormatees)
  } catch (error) {
    console.error('Erreur GET disponibilites:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une disponibilité
export async function POST(request: NextRequest) {
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
    let { jourSemaine, heureDebut, heureFin, actif } = body

    // Validation
    const errors: string[] = []
    
    if (jourSemaine === undefined || jourSemaine < 0 || jourSemaine > 6) {
      errors.push('Le jour de semaine doit être compris entre 0 (Dimanche) et 6 (Samedi)')
    }
    
    if (!heureDebut || !heureFin) {
      errors.push('Les heures de début et fin sont requises')
    } else {
      // Validation du format HH:MM
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(heureDebut) || !timeRegex.test(heureFin)) {
        errors.push('Format d\'heure invalide. Utilisez HH:MM')
      }
      
      // Vérifier que l'heure de début est avant l'heure de fin
      if (heureDebut >= heureFin) {
        errors.push('L\'heure de début doit être avant l\'heure de fin')
      }
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }
    
    // Vérifier si une disponibilité existe déjà pour ce jour
    const existingDispo = await prisma.disponibilite.findFirst({
      where: {
        userId: user.id,
        jourSemaine: jourSemaine
      }
    })
    
    if (existingDispo) {
      return NextResponse.json({ 
        error: `Une disponibilité existe déjà pour ce jour. Veuillez la modifier ou la supprimer.` 
      }, { status: 400 })
    }

    // Créer la disponibilité
    const disponibilite = await prisma.disponibilite.create({
      data: {
        userId: user.id,
        jourSemaine: parseInt(jourSemaine),
        heureDebut,
        heureFin,
        actif: actif !== undefined ? actif : true,
        createdAt: new Date()
      }
    })

    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    
    return NextResponse.json({ 
      success: true,
      message: `Disponibilité ajoutée pour le ${joursSemaine[jourSemaine]}`,
      disponibilite: {
        ...disponibilite,
        jourNom: joursSemaine[jourSemaine]
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur POST disponibilite:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier une disponibilité
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
    const { id, jourSemaine, heureDebut, heureFin, actif } = body

    if (!id) {
      return NextResponse.json({ error: 'ID de disponibilité requis' }, { status: 400 })
    }

    // Vérifier que la disponibilité appartient à l'utilisateur
    const existingDispo = await prisma.disponibilite.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingDispo) {
      return NextResponse.json({ error: 'Disponibilité non trouvée' }, { status: 404 })
    }

    // Validation des heures si fournies
    if (heureDebut && heureFin) {
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(heureDebut) || !timeRegex.test(heureFin)) {
        return NextResponse.json({ error: 'Format d\'heure invalide. Utilisez HH:MM' }, { status: 400 })
      }
      
      if (heureDebut >= heureFin) {
        return NextResponse.json({ error: 'L\'heure de début doit être avant l\'heure de fin' }, { status: 400 })
      }
    }

    // Mettre à jour
    const updatedDispo = await prisma.disponibilite.update({
      where: { id },
      data: {
        jourSemaine: jourSemaine !== undefined ? parseInt(jourSemaine) : undefined,
        heureDebut: heureDebut || undefined,
        heureFin: heureFin || undefined,
        actif: actif !== undefined ? actif : undefined
      }
    })

    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

    return NextResponse.json({ 
      success: true,
      message: `Disponibilité mise à jour`,
      disponibilite: {
        ...updatedDispo,
        jourNom: joursSemaine[updatedDispo.jourSemaine]
      }
    })
    
  } catch (error) {
    console.error('Erreur PUT disponibilite:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une disponibilité
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID de disponibilité requis' }, { status: 400 })
    }

    // Vérifier que la disponibilité appartient à l'utilisateur
    const existingDispo = await prisma.disponibilite.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingDispo) {
      return NextResponse.json({ error: 'Disponibilité non trouvée' }, { status: 404 })
    }

    await prisma.disponibilite.delete({ where: { id } })

    const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

    return NextResponse.json({ 
      success: true,
      message: `Disponibilité du ${joursSemaine[existingDispo.jourSemaine]} supprimée`
    })
    
  } catch (error) {
    console.error('Erreur DELETE disponibilite:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}