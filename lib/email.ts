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

  await resend.emails.send({
    from: 'GlowBook <noreply@glowbook.fr>',
    to: [to],
    subject: `Confirmation de rendez-vous - ${serviceNom}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation GlowBook</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #C2185B; }
          .logo { font-size: 24px; font-weight: bold; color: #C2185B; }
          .content { padding: 30px 0; }
          .info { background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .info-item { margin: 10px 0; }
          .label { font-weight: bold; width: 120px; display: inline-block; }
          .price { font-size: 24px; color: #C2185B; font-weight: bold; }
          .button { 
            display: inline-block; 
            background: #C2185B; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✨ GlowBook</div>
          </div>
          <div class="content">
            <h2>Bonjour ${clientNom},</h2>
            <p>Votre rendez-vous est confirmé ! Voici les détails :</p>
            
            <div class="info">
              <div class="info-item"><span class="label">📅 Date :</span> ${dateFormatted}</div>
              <div class="info-item"><span class="label">⏰ Heure :</span> ${timeFormatted}</div>
              <div class="info-item"><span class="label">💇 Prestation :</span> ${serviceNom}</div>
              <div class="info-item"><span class="label">📍 Lieu :</span> ${lieu === 'salon' ? 'Au salon' : 'À domicile'}${adresse ? `<br/><span style="margin-left: 120px;">${adresse}</span>` : ''}</div>
            </div>

            ${acompte ? `
              <div class="info">
                <div class="info-item"><span class="label">💰 Acompte versé :</span> <span class="price">${acompte}€</span></div>
                ${prixTotal ? `<div class="info-item"><span class="label">💰 Prix total :</span> ${prixTotal}€</div>` : ''}
                <div class="info-item"><span class="label">💳 Reste à payer :</span> ${(prixTotal || 0) - (acompte || 0)}€</div>
              </div>
            ` : ''}

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/booking/${bookingId}" class="button">
                Voir mon rendez-vous
              </a>
            </div>

            <p style="margin-top: 30px;">
              Pour modifier ou annuler votre rendez-vous, merci de contacter directement le salon.<br/>
              Un rappel vous sera envoyé 48h avant votre rendez-vous.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 GlowBook - Solution de gestion pour coiffeuses</p>
            <p>Cet email vous a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
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

  await resend.emails.send({
    from: 'GlowBook <rappel@glowbook.fr>',
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
}