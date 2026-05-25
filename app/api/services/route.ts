import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les services (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 })
    }

    const services = await prisma.service.findMany({
      where: { userId, statut: 'active' },
      include: {
        photos: { orderBy: { ordre: 'asc' } },
        variantes: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Erreur GET services:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un service (admin)
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
    const { nom, categorie, dureeBase, prixBase, description } = body

    const service = await prisma.service.create({
      data: {
        userId: user.id,
        nom,
        categorie,
        dureeBase,
        prixBase,
        description
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Erreur POST service:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}