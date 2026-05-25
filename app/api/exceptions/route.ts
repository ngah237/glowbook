import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les exceptions
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

    const exceptions = await prisma.exception.findMany({
      where: { userId: user.id },
      orderBy: { dateException: 'asc' }
    })

    return NextResponse.json(exceptions)
  } catch (error) {
    console.error('Erreur GET exceptions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une exception
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
    const { dateException, heureDebut, heureFin, raison, actif } = body

    if (!dateException) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 })
    }

    // Vérifier si une exception existe déjà pour cette date
    const existing = await prisma.exception.findFirst({
      where: {
        userId: user.id,
        dateException: new Date(dateException)
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Une exception existe déjà pour cette date' }, { status: 400 })
    }

    const exception = await prisma.exception.create({
      data: {
        userId: user.id,
        dateException: new Date(dateException),
        heureDebut: heureDebut || null,
        heureFin: heureFin || null,
        raison: raison || '',
        actif: actif !== undefined ? actif : true,
        createdAt: new Date()
      }
    })

    return NextResponse.json(exception, { status: 201 })
  } catch (error) {
    console.error('Erreur POST exception:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Modifier une exception
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
    const { id, heureDebut, heureFin, raison, actif } = body

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    // Vérifier que l'exception appartient à l'utilisateur
    const existing = await prisma.exception.findFirst({
      where: { id, userId: user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Exception non trouvée' }, { status: 404 })
    }

    const updated = await prisma.exception.update({
      where: { id },
      data: {
        heureDebut: heureDebut !== undefined ? heureDebut : existing.heureDebut,
        heureFin: heureFin !== undefined ? heureFin : existing.heureFin,
        raison: raison !== undefined ? raison : existing.raison,
        actif: actif !== undefined ? actif : existing.actif
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Erreur PUT exception:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une exception
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
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    // Vérifier que l'exception appartient à l'utilisateur
    const existing = await prisma.exception.findFirst({
      where: { id, userId: user.id }
    })

    if (!existing) {
      return NextResponse.json({ error: 'Exception non trouvée' }, { status: 404 })
    }

    await prisma.exception.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE exception:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}