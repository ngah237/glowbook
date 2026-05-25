import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// POST - Créer un intent de paiement Stripe pour l'acompte
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    // Récupérer les données de la requête
    const body = await request.json()
    const { 
      bookingId, 
      salonId, 
      montantTotal,
      clientNom,
      clientEmail,
      serviceNom,
      serviceId,
      clientTelephone,
      dateHeure,
      lieu,
      message
    } = body

    // Validation des champs requis
    if (!bookingId && !salonId) {
      return NextResponse.json({ 
        error: 'bookingId ou salonId requis' 
      }, { status: 400 })
    }

    let booking = null
    let salon = null
    let montantAcompte = 0
    let typeAcompte = 'percentage'
    let valeurAcompte = 30
    let montantTotalCalcul = montantTotal || 0

    // Si on a un bookingId, récupérer les infos depuis la réservation
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: true,
          service: true
        }
      })

      if (!booking) {
        return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 })
      }

      salon = booking.user
      montantTotalCalcul = Number(booking.prixTotal)
      typeAcompte = salon.acompteType || 'percentage'
      valeurAcompte = salon.acompteValeur || 30
      
      // Calculer l'acompte selon le type
      if (typeAcompte === 'percentage') {
        montantAcompte = (montantTotalCalcul * valeurAcompte) / 100
      } else {
        montantAcompte = valeurAcompte
      }
    } 
    // Sinon, récupérer les infos du salon
    else if (salonId) {
      salon = await prisma.user.findUnique({
        where: { id: salonId },
        select: {
          id: true,
          nomSalon: true,
          email: true,
          acompteType: true,
          acompteValeur: true,
          stripeAccountId: true
        }
      })

      if (!salon) {
        return NextResponse.json({ error: 'Salon non trouvé' }, { status: 404 })
      }

      typeAcompte = salon.acompteType || 'percentage'
      valeurAcompte = salon.acompteValeur || 30
      
      if (typeAcompte === 'percentage') {
        montantAcompte = (montantTotalCalcul * valeurAcompte) / 100
      } else {
        montantAcompte = valeurAcompte
      }
    }

    // Vérifier que Stripe est configuré
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY non configurée')
      return NextResponse.json({ 
        error: 'Configuration Stripe manquante' 
      }, { status: 500 })
    }

    // Arrondir à 2 décimales et convertir en centimes
    montantAcompte = Math.round(montantAcompte * 100) / 100
    const montantCentimes = Math.round(montantAcompte * 100)

    if (montantCentimes <= 0) {
      return NextResponse.json({ 
        error: 'Le montant de l\'acompte doit être supérieur à 0' 
      }, { status: 400 })
    }

    // Créer le PaymentIntent Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: montantCentimes,
      currency: 'eur',
      metadata: {
        bookingId: bookingId || 'pending',
        salonId: salon.id,
        salonNom: salon.nomSalon || 'Salon',
        typeAcompte: typeAcompte,
        valeurAcompte: valeurAcompte.toString(),
        montantTotal: montantTotalCalcul.toString()
      },
      description: `Acompte ${typeAcompte === 'percentage' ? `${valeurAcompte}%` : `${valeurAcompte}€`} - ${serviceNom || 'Réservation'}`,
    })

    // Ajouter le transfert si stripeAccountId existe
    if (salon.stripeAccountId) {
      await stripe.paymentIntents.update(paymentIntent.id, {
        transfer_data: {
          destination: salon.stripeAccountId,
          amount: montantCentimes
        }
      })
    }

    // Si c'est une nouvelle réservation, créer l'enregistrement en base
    let newBooking = booking
    if (!bookingId && salonId) {
      // Vérifier que serviceId est fourni
      if (!serviceId) {
        return NextResponse.json({ 
          error: 'serviceId requis pour une nouvelle réservation' 
        }, { status: 400 })
      }

      newBooking = await prisma.booking.create({
        data: {
          userId: salonId,
          serviceId: serviceId,
          clientNom: clientNom || 'Client',
          clientEmail: clientEmail || 'client@email.com',
          clientTelephone: clientTelephone || '',
          dateHeure: dateHeure ? new Date(dateHeure) : new Date(),
          lieu: lieu || 'salon',
          statut: 'en_attente_paiement',
          acompteMontant: montantAcompte,
          prixTotal: montantTotalCalcul,
          message: message || '',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    // Enregistrer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        bookingId: newBooking?.id || bookingId,
        montant: montantAcompte,
        type: 'acompte',
        stripeIntentId: paymentIntent.id,
        statut: 'en_attente',
        createdAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      montantAcompte: montantAcompte,
      typeAcompte: typeAcompte,
      valeurAcompte: valeurAcompte,
      bookingId: newBooking?.id || bookingId,
      transactionId: transaction.id
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erreur création payment intent:', error)
    
    // Gérer les erreurs Stripe spécifiques
    if (error.type === 'StripeError') {
      return NextResponse.json({ 
        error: error.message || 'Erreur Stripe lors du paiement' 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: error.message || 'Erreur lors de la création du paiement' 
    }, { status: 500 })
  }
}