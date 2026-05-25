'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', icon: 'dashboard', label: 'Tableau de bord' },
  { href: '/dashboard/planning', icon: 'calendar_month', label: 'Planning' },
  { href: '/dashboard/catalogue', icon: 'content_cut', label: 'Catalogue' },
  { href: '/dashboard/disponibilites', icon: 'schedule', label: 'Disponibilités' },
]

export default function HeaderMobile() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 px-4 py-3 flex justify-between items-center border-b border-stone-100">
        <h1 className="text-xl font-serif italic text-primary">GlowBook</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-stone-50">
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </header>
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-white z-40 p-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${pathname === item.href ? 'bg-pink-50 text-primary' : 'hover:bg-stone-50'}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 text-left mt-4">
              <span className="material-symbols-outlined">logout</span>
              <span>Déconnexion</span>
            </button>
          </nav>
        </div>
      )}
      <div className="lg:hidden h-14"></div>
    </>
  )
}