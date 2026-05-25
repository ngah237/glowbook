'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ConfirmationPage() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9] px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
        </div>
        <h1 className="text-2xl font-serif font-bold mt-6 text-primary">Rendez-vous confirmé !</h1>
        <p className="text-stone-600 mt-3">Votre réservation a bien été enregistrée.</p>
        <p className="text-sm text-stone-400 mt-1">Un email de confirmation vous a été envoyé.</p>
        <Link href="/" className="block w-full bg-primary text-white px-6 py-3 rounded-full mt-8">Retour au catalogue</Link>
        <p className="text-xs text-stone-400 mt-4">Redirection dans {countdown} secondes...</p>
      </div>
    </div>
  )
}