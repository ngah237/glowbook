import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Gérer les événements Stripe
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      await handlePaymentSuccess(paymentIntent)
      break
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      await handlePaymentFailure(failedPayment)
      break
      
    default:
      console.log(`Événement non géré: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handlePaymentSuccess(paymentIntent: any) {
  const { bookingId, salonId, montantTotal } = paymentIntent.metadata
  const montantPaye = paymentIntent.amount / 100

  // Mettre à jour la transaction
  await prisma.transaction.updateMany({
    where: { stripeIntentId: paymentIntent.id },
    data: {
      statut: 'paye',
      montant: montantPaye
    }
  })

  // Mettre à jour la réservation
  if (bookingId && bookingId !== 'pending') {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        statut: 'confirme',
        acompteMontant: montantPaye,
        updatedAt: new Date()
      }
    })
  }

  // Envoyer email de confirmation (via Resend)
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, user: true }
  })

  if (booking && booking.user.notificationEmail) {
    const { sendConfirmationEmail } = await import('@/lib/emails')
    await sendConfirmationEmail({
      to: booking.clientEmail,
      clientNom: booking.clientNom,
      serviceNom: booking.service.nom,
      dateHeure: booking.dateHeure,
      lieu: booking.lieu || 'salon',
      adresse: booking.adresse || undefined,
      prixTotal: Number(booking.prixTotal),
      acompte: Number(booking.acompteMontant),
      bookingId: booking.id,
      subject: 'Confirmation de votre rendez-vous'
    })
  }

  console.log(`✅ Paiement réussi: ${montantPaye}€ pour la réservation ${bookingId}`)
}

async function handlePaymentFailure(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata

  // Mettre à jour la transaction
  await prisma.transaction.updateMany({
    where: { stripeIntentId: paymentIntent.id },
    data: { statut: 'echec' }
  })

  // Mettre à jour la réservation
  if (bookingId && bookingId !== 'pending') {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { statut: 'paiement_echoue' }
    })
  }

  console.log(`❌ Paiement échoué pour la réservation ${bookingId}`)
}