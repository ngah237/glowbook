import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(data: any) {
  console.log('Email de confirmation à envoyer à:', data.to)
  return { success: true }
}

export async function sendReminderEmail(data: any) {
  console.log('Email de rappel à envoyer à:', data.to)
  return { success: true }
}