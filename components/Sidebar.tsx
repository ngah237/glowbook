'use client'

import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: 'dashboard' | 'planning' | 'catalogue' | 'clients' | 'parametres' | 'aide') => void;
}

interface UserData {
  nomSalon: string | null
  logoUrl: string | null
  email: string
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Charger les données utilisateur depuis l'API
  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/users/me')
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
          }
        } catch (error) {
          console.error('Erreur chargement profil:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [session])

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'dashboard', href: '/dashboard' },
    { id: 'planning', label: 'Planning', icon: 'calendar_month', href: '/dashboard/planning' },
    { id: 'catalogue', label: 'Catalogue', icon: 'content_cut', href: '/dashboard/catalogue' },
    { id: 'clients', label: 'Clients', icon: 'group', href: '/dashboard/clients' },
    { id: 'parametres', label: 'Paramètres', icon: 'settings', href: '/dashboard/parametres' },
    { id: 'aide', label: 'Aide', icon: 'help', href: '/aide' },
  ]

  const handleClick = (id: string, href: string) => {
    if (setActiveTab) {
      setActiveTab(id as any)
    }
    router.push(href)
  }

  const isActive = (itemId: string, href: string) => {
    if (setActiveTab) {
      return activeTab === itemId
    }
    return pathname === href || pathname?.startsWith(href + '/')
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      toast.success('Déconnexion réussie')
      router.push('/login')
    } catch (error) {
      toast.error('Erreur lors de la déconnexion')
    }
  }

  const handleNewReservation = () => {
    router.push('/dashboard/reservation/nouvelle')
  }

  // Évite l'erreur d'hydratation
  if (!mounted) {
    return null
  }

  // Données dynamiques
  const salonName = userData?.nomSalon || session?.user?.name || 'Mon Salon'
  const userEmail = session?.user?.email || 'coiffeuse@glowbook.fr'
  const userInitial = salonName.charAt(0).toUpperCase()
  const logoUrl = userData?.logoUrl

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-72 bg-white border-r border-stone-100 z-40">
      {/* En-tête */}
      <div className="p-6">
        <h1 className="text-2xl font-serif italic text-primary mb-8">GlowBook Pro</h1>
        
        {/* Profil utilisateur - DYNAMIQUE AVEC LOGO */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-stone-50 rounded-xl">
          {/* Avatar / Logo */}
          <div className="w-10 h-10 rounded-full bg-pink-100 text-primary flex items-center justify-center font-bold text-lg overflow-hidden">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={salonName} 
                className="w-full h-full object-cover"
              />
            ) : (
              userInitial
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#1c1b1b] truncate">{salonName}</p>
            <p className="text-xs text-stone-500 truncate">{userEmail}</p>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id, item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                isActive(item.id, item.href)
                  ? 'bg-pink-50 text-primary border-r-4 border-primary'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Pied de page */}
      <div className="mt-auto p-6 space-y-2 border-t border-stone-100">
        <button 
          onClick={handleNewReservation}
          className="w-full mb-2 bg-primary text-white py-3 rounded-full font-semibold shadow-md hover:bg-primary-dark active:scale-95 transition"
        >
          + Nouvelle Réservation
        </button>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 text-stone-400 text-sm hover:text-red-600 transition w-full"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}