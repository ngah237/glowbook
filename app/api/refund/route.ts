import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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

    const { bookingId, reason, fullRefund } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'ID de réservation requis' }, { status: 400 })
    }

    // Vérifier que la réservation appartient à l'utilisateur
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: user.id
      },
      include: { transactions: true }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 })
    }

    // Trouver la transaction d'acompte
    const depositTransaction = booking.transactions.find(t => t.type === 'acompte' && t.statut === 'paye')

    if (!depositTransaction || !depositTransaction.stripeIntentId) {
      return NextResponse.json({ error: 'Aucun acompte à rembourser' }, { status: 400 })
    }

    // Remboursement Stripe
    const refund = await stripe.refunds.create({
      payment_intent: depositTransaction.stripeIntentId,
      amount: fullRefund ? undefined : Math.round(Number(booking.acompteMontant) * 100),
      reason: 'requested_by_customer',
      metadata: {
        bookingId: booking.id,
        reason: reason || 'Annulation par la coiffeuse'
      }
    })

    // Mettre à jour la transaction
    await prisma.transaction.update({
      where: { id: depositTransaction.id },
      data: { statut: 'rembourse' }
    })

    // Mettre à jour la réservation
    await prisma.booking.update({
      where: { id: booking.id },
      data: { 
        statut: 'annule',
        message: `Annulé - Remboursement effectué. Raison: ${reason || 'Non spécifiée'}`
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Remboursement effectué avec succès',
      refundId: refund.id,
      amount: refund.amount / 100
    })
  } catch (error: any) {
    console.error('Erreur remboursement:', error)
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 })
  }
}