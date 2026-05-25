import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer les variantes d'un service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const service = await prisma.service.findFirst({
      where: { id: params.id, userId: user.id }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    const variantes = await prisma.variante.findMany({
      where: { serviceId: params.id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(variantes)
  } catch (error) {
    console.error('Erreur GET variantes:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer une variante
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const service = await prisma.service.findFirst({
      where: { id: params.id, userId: user.id }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    const body = await request.json()
    const { taille, grosseur, prixSupplement, dureeSupplement } = body

    const variante = await prisma.variante.create({
      data: {
        serviceId: params.id,
        taille: taille || null,
        grosseur: grosseur || null,
        prixSupplement: prixSupplement || 0,
        dureeSupplement: dureeSupplement || 0,
        createdAt: new Date()
      }
    })

    return NextResponse.json(variante, { status: 201 })
  } catch (error) {
    console.error('Erreur POST variante:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une variante
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const varianteId = searchParams.get('varianteId')

    if (!varianteId) {
      return NextResponse.json({ error: 'varianteId requis' }, { status: 400 })
    }

    // Vérifier que la variante appartient au service de l'utilisateur
    const variante = await prisma.variante.findFirst({
      where: {
        id: varianteId,
        serviceId: params.id,
        service: { userId: user.id }
      }
    })

    if (!variante) {
      return NextResponse.json({ error: 'Variante non trouvée' }, { status: 404 })
    }

    await prisma.variante.delete({ where: { id: varianteId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE variante:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}