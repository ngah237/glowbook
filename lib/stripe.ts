import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  appInfo: { name: 'GlowBook', version: '1.0.0' }
})

export const createPaymentIntent = async (amount: number, metadata: any) => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'eur',
    metadata,
    automatic_payment_methods: { enabled: true }
  })
}