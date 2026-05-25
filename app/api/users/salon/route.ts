import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (!serviceId) {
      return NextResponse.json({ error: 'serviceId requis' }, { status: 400 })
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        user: {
          select: {
            id: true,
            nomSalon: true,
            telephone: true,
            themePrimary: true
          }
        }
      }
    })

    if (!service || !service.user) {
      return NextResponse.json({ error: 'Salon non trouvé' }, { status: 404 })
    }

    return NextResponse.json(service.user)
  } catch (error) {
    console.error('Erreur GET salon:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}