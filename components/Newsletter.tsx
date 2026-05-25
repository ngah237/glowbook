'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      toast.success('Merci pour votre inscription !')
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-[#c2185b] to-[#9b0044]">
      <div className="max-w-3xl mx-auto px-4 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-serif font-bold">Restez informée</h2>
        <p className="mt-2 opacity-90">Recevez nos offres spéciales et les nouveautés</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-6">
          <input type="email" placeholder="Votre adresse email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-5 py-3 rounded-full text-black outline-none" required />
          <button type="submit" disabled={loading} className="px-8 py-3 bg-white text-[#c2185b] rounded-full font-semibold hover:bg-pink-50 transition disabled:opacity-50">{loading ? 'Inscription...' : "S'inscrire"}</button>
        </form>
        <p className="text-white/70 text-xs mt-4">Pas de spam. Désabonnez-vous à tout moment.</p>
      </div>
    </section>
  )
}