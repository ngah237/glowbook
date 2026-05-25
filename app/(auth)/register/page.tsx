'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nomSalon, setNomSalon] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Vérifier que les champs sont remplis
    if (!email || !password || !nomSalon) {
      setError('Veuillez remplir tous les champs')
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom_salon: nomSalon })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        router.push('/login?registered=true')
      } else {
        setError(data.error || 'Une erreur est survenue')
        setLoading(false)
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-serif italic text-[#C2185B]">GlowBook</Link>
          <p className="text-stone-500 text-sm mt-2">Créez votre espace professionnel</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nom de votre salon</label>
            <input
              type="text"
              value={nomSalon}
              onChange={(e) => setNomSalon(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
              placeholder="Mon Salon"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
              placeholder="coiffeuse@glowbook.fr"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-stone-400 mt-1">Minimum 6 caractères</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C2185B] text-white py-3 rounded-full font-semibold hover:bg-[#9b0044] transition-all disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        
        <p className="text-center text-sm text-stone-500 mt-6">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-[#C2185B] font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}