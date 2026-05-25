import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  subject: string
  clientNom: string
  serviceNom: string
  dateHeure: Date
  lieu: string
  adresse?: string
  prixTotal?: number
  acompte?: number
  bookingId: string
}

export async function sendConfirmationEmail(data: EmailData) {
  const { to, clientNom, serviceNom, dateHeure, lieu, adresse, prixTotal, acompte, bookingId } = data

  const dateFormatted = new Date(dateHeure).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const timeFormatted = new Date(dateHeure).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@glowbook.fr',
      to: [to],
      subject: `Confirmation de rendez-vous - ${serviceNom}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmation GlowBook</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #C2185B; padding: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #C2185B;">✨ GlowBook</span>
            </div>
            <div style="padding: 30px 0;">
              <h2>Bonjour ${clientNom},</h2>
              <p>Votre rendez-vous est confirmé !</p>
              <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 Date :</strong> ${dateFormatted} à ${timeFormatted}</p>
                <p><strong>💇 Prestation :</strong> ${serviceNom}</p>
                <p><strong>📍 Lieu :</strong> ${lieu === 'salon' ? 'Au salon' : 'À domicile'}${adresse ? `<br/>📌 Adresse : ${adresse}` : ''}</p>
                ${acompte ? `<p><strong>💰 Acompte versé :</strong> ${acompte}€</p>` : ''}
                ${prixTotal ? `<p><strong>💰 Prix total :</strong> ${prixTotal}€</p>` : ''}
              </div>
              <p>Un rappel vous sera envoyé 48h avant votre rendez-vous.</p>
            </div>
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p>© 2025 GlowBook - Solution de gestion pour coiffeuses</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
    console.log(`Email de confirmation envoyé à ${to}`)
  } catch (error) {
    console.error(`Erreur envoi email à ${to}:`, error)
  }
}

export async function sendReminderEmail(data: EmailData) {
  const { to, clientNom, serviceNom, dateHeure, lieu, adresse } = data

  const dateFormatted = new Date(dateHeure).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'rappel@glowbook.fr',
      to: [to],
      subject: 'Rappel : Votre rendez-vous approche !',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Rappel GlowBook</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #C2185B; padding: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #C2185B;">✨ GlowBook</span>
            </div>
            <div style="padding: 30px 0;">
              <h2>Bonjour ${clientNom},</h2>
              <p>Nous vous rappelons que vous avez rendez-vous :</p>
              <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>📅 ${dateFormatted}</strong></p>
                <p><strong>💇 ${serviceNom}</strong></p>
                <p><strong>📍 ${lieu === 'salon' ? 'Au salon' : 'À domicile'}</strong></p>
              </div>
              <p>Nous vous attendons ! À très bientôt ✨</p>
            </div>
          </div>
        </body>
        </html>
      `
    })
    console.log(`Email de rappel envoyé à ${to}`)
  } catch (error) {
    console.error(`Erreur envoi rappel à ${to}:`, error)
  }
}