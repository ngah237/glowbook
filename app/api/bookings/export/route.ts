import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let whereClause: any = { userId: user.id }
    
    if (startDate && endDate) {
      whereClause.dateHeure = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: { service: true },
      orderBy: { dateHeure: 'desc' }
    })

    // Créer le contenu CSV
    const headers = [
      'ID',
      'Client',
      'Email',
      'Téléphone',
      'Service',
      'Date',
      'Heure',
      'Lieu',
      'Adresse',
      'Prix total',
      'Acompte',
      'Statut',
      'Message',
      'Créé le'
    ]

    const rows = bookings.map(booking => [
      booking.id,
      booking.clientNom,
      booking.clientEmail,
      booking.clientTelephone || '',
      booking.service.nom,
      new Date(booking.dateHeure).toLocaleDateString('fr-FR'),
      new Date(booking.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      booking.lieu === 'salon' ? 'Au salon' : 'À domicile',
      booking.adresse || '',
      Number(booking.prixTotal).toString(),
      Number(booking.acompteMontant).toString(),
      booking.statut === 'confirme' ? 'Confirmé' : booking.statut === 'en_attente' ? 'En attente' : booking.statut === 'annule' ? 'Annulé' : booking.statut,
      booking.message || '',
      new Date(booking.createdAt!).toLocaleDateString('fr-FR')
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n')

    // Ajouter BOM pour UTF-8 (compatibilité Excel)
    const bom = '\uFEFF'
    const csvWithBom = bom + csvContent

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reservations_${user.nomSalon}_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error('Erreur export CSV:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}