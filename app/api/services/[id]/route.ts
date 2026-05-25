import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        photos: { orderBy: { ordre: 'asc' } },
        variantes: true
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Erreur GET service:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const service = await prisma.service.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Erreur PUT service:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    await prisma.service.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE service:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}