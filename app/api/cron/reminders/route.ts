import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReminderEmail } from '@/lib/emails'

export async function GET(request: NextRequest) {
  try {
    // Vérifier la clé API pour sécuriser le cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const now = new Date()
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)

    // Récupérer les rendez-vous dans 48h qui n'ont pas encore reçu de rappel
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        dateHeure: {
          gte: new Date(in48Hours.setHours(0, 0, 0, 0)),
          lt: new Date(in48Hours.setHours(23, 59, 59, 999))
        },
        statut: { notIn: ['annule', 'paiement_echoue'] },
        reminderSent: false
      },
      include: { 
        service: true,
        user: {
          select: { notificationEmail: true }
        }
      }
    })

    let sent = 0
    let failed = 0

    for (const booking of upcomingBookings) {
      try {
        if (booking.user.notificationEmail) {
          await sendReminderEmail({
            to: booking.clientEmail,
            clientNom: booking.clientNom,
            serviceNom: booking.service.nom,
            dateHeure: booking.dateHeure,
            lieu: booking.lieu || 'salon',
            adresse: booking.adresse || undefined,
            subject: 'Rappel de rendez-vous',
            bookingId: booking.id
          })
        }

        // Marquer le rappel comme envoyé
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true }
        })
        sent++
      } catch (error) {
        console.error(`Erreur envoi rappel pour ${booking.id}:`, error)
        failed++
      }
    }

    // Également envoyer des rappels pour les rendez-vous dans 2h (SMS ou email)
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    const upcomingBookings2h = await prisma.booking.findMany({
      where: {
        dateHeure: {
          gte: new Date(in2Hours.setHours(in2Hours.getHours(), in2Hours.getMinutes() - 15, 0)),
          lt: new Date(in2Hours.setHours(in2Hours.getHours(), in2Hours.getMinutes() + 15, 0))
        },
        statut: 'confirme'
      },
      include: { service: true }
    })

    let sent2h = 0
    for (const booking of upcomingBookings2h) {
      // Envoi de rappel 2h avant (email ou SMS selon préférences)
      // À implémenter avec Twilio pour SMS
      sent2h++
    }

    return NextResponse.json({ 
      success: true, 
      reminder48h: { sent, failed },
      reminder2h: { sent: sent2h }
    })
  } catch (error) {
    console.error('Erreur cron reminders:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}