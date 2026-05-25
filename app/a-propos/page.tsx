'use client'
import Link from 'next/link'
import { useEffect } from 'react'

// Équipe / valeurs
const values = [
  { 
    title: 'Excellence', 
    description: 'Une maîtrise technique irréprochable pour des résultats parfaits à chaque prestation.',
    icon: 'workspace_premium'
  },
  { 
    title: 'Bien-être', 
    description: 'Un moment de détente dans un cadre chaleureux et apaisant.',
    icon: 'spa'
  },
  { 
    title: 'Innovation', 
    description: 'Toujours à l\'affût des dernières tendances et techniques capillaires.',
    icon: 'lightbulb'
  },
  { 
    title: 'Respect', 
    description: 'Des produits naturels et des techniques douces qui préservent vos cheveux.',
    icon: 'eco'
  },
]

// Chiffres clés
const stats = [
  { value: '10+', label: 'Années d\'expérience', icon: 'stars' },
  { value: '500+', label: 'Clientes satisfaites', icon: 'favorite' },
  { value: '100%', label: 'Produits naturels', icon: 'eco' },
  { value: '4.9/5', label: 'Note moyenne', icon: 'star_rate' },
]

export default function AProposPage() {
  useEffect(() => {}, [])

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      {/* Header - identique aux autres pages */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FDFBF9] border-b border-stone-200 shadow-sm shadow-pink-900/5">
        <Link href="/" className="text-2xl font-serif italic tracking-tight text-[#C2185B]">GlowBook</Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="font-serif text-stone-600 hover:text-[#C2185B] transition-colors">Catalogue</Link>
          <Link href="/services" className="font-serif text-stone-600 hover:text-[#C2185B] transition-colors">Services</Link>
          <Link href="/tarifs" className="font-serif text-stone-600 hover:text-[#C2185B] transition-colors">Tarifs</Link>
          <Link href="/a-propos" className="font-serif text-[#C2185B] border-b-2 border-[#C2185B] font-semibold">À propos</Link>
        </nav>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full border border-stone-200 hover:bg-stone-50 text-sm transition">Connexion</Link>
          <Link href="/register" className="px-5 py-2 bg-[#C2185B] text-white rounded-full text-sm hover:bg-[#9b0044] transition">Réserver</Link>
        </div>
      </header>

      <div className="h-20"></div>

      <main>
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1600" 
              className="w-full h-full object-cover brightness-40" 
              alt="Coiffure afro élégante" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          <div className="relative text-center text-white px-4 z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full mb-1">
              <span className="material-symbols-outlined text-[9px]">favorite</span>
              <span className="text-[9px] font-medium">Notre passion</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-1">Notre Histoire</h1>
            <p className="text-xs md:text-sm max-w-2xl mx-auto opacity-90">Passionnée par l'art capillaire depuis plus de 10 ans</p>
          </div>
        </section>

        {/* Introduction avec photo de Sophie - femme noire africaine */}
        <div className="w-full bg-white py-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Photo de Sophie - femme noire africaine */}
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-xl border-4 border-[#C2185B]/20">
                    <img 
                      src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400" 
                      className="w-full h-full object-cover object-top" 
                      alt="Sophie - Fondatrice de GlowBook, coiffeuse professionnelle" 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#C2185B] rounded-full flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-sm">favorite</span>
                  </div>
                </div>
              </div>
              {/* Texte à droite */}
              <div className="md:w-2/3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C2185B]/10 flex items-center justify-center text-[#C2185B]">
                    <span className="material-symbols-outlined text-sm">stars</span>
                  </div>
                  <h2 className="text-lg md:text-xl font-serif font-bold text-[#C2185B]">✨ Bienvenue chez GlowBook</h2>
                </div>
                <p className="text-stone-600 leading-relaxed text-xs md:text-sm mb-2">
                  Je suis Sophie, coiffeuse spécialisée dans les coiffures afro et créatives. Après 10 ans d'expérience en salon, 
                  j'ai décidé de créer GlowBook pour offrir une expérience unique à mes clientes : un service personnalisé, 
                  des prestations de qualité dans un cadre chaleureux et professionnel.
                </p>
                <p className="text-stone-600 leading-relaxed text-xs md:text-sm mb-2">
                  Ma mission : sublimer votre beauté naturelle tout en préservant la santé de vos cheveux. Je vous accompagne 
                  dans tous vos projets capillaires, que ce soit pour un look du quotidien ou une occasion spéciale.
                </p>
                <div className="bg-pink-50 rounded-lg p-2 flex items-start gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#C2185B]/20 flex items-center justify-center text-[#C2185B] shrink-0">
                    <span className="material-symbols-outlined text-[10px]">calendar_month</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#C2185B] text-[10px] mb-0.5">📅 Prenez rendez-vous facilement</h3>
                    <p className="text-stone-600 text-[10px]">Choisissez votre coiffure, votre créneau et payez un acompte en toute sécurité.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section philosophie - agrandie pleine largeur */}
        <section className="w-full bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white py-10">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <span className="text-white/80 text-[10px] uppercase tracking-wider">Notre philosophie</span>
            <h2 className="text-xl md:text-3xl font-serif font-bold mt-2 mb-3">L'art de sublimer</h2>
            <p className="text-white/90 text-xs md:text-sm max-w-3xl mx-auto leading-relaxed">
              Chaque coiffure est une œuvre d'art unique, réalisée avec passion, précision et des produits de qualité. 
              Nous prenons le temps d'écouter vos envies pour vous offrir un résultat qui vous ressemble.
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-10 h-0.5 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="bg-white py-6 border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-4">
              <span className="text-[9px] text-[#C2185B] uppercase font-semibold tracking-wider bg-[#C2185B]/10 px-2 py-0.5 rounded-full">Pourquoi nous choisir</span>
              <h2 className="text-lg md:text-xl font-serif font-bold mt-1">Quelques chiffres</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-1.5 rounded-lg hover:shadow-lg transition">
                  <div className="w-8 h-8 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-1 group-hover:bg-[#C2185B] transition">
                    <span className="material-symbols-outlined text-sm text-[#C2185B]">{stat.icon}</span>
                  </div>
                  <p className="text-lg font-bold text-[#C2185B]">{stat.value}</p>
                  <p className="text-stone-500 text-[9px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-6">
              <span className="text-[9px] text-[#C2185B] uppercase font-semibold tracking-wider bg-[#C2185B]/10 px-2 py-0.5 rounded-full">Nos valeurs</span>
              <h2 className="text-lg md:text-xl font-serif font-bold mt-1">Ce qui nous guide</h2>
              <p className="text-stone-500 text-[10px] mt-1 max-w-2xl mx-auto">Des principes forts qui font notre différence au quotidien.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {values.map((value, idx) => (
                <div key={idx} className="group bg-white rounded-lg p-3 text-center shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-[#C2185B]/20 to-[#C2185B]/5 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                    <span className="material-symbols-outlined text-lg text-[#C2185B]">{value.icon}</span>
                  </div>
                  <h3 className="font-semibold text-xs text-[#1c1b1b] mb-0.5">{value.title}</h3>
                  <p className="text-stone-500 text-[9px] leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact & Infos pratiques - en blanc */}
        <section className="bg-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-5">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1c1b1b] mb-1">Nous contacter</h2>
              <p className="text-stone-500 text-xs max-w-2xl mx-auto">N'hésitez pas à nous joindre pour toute question ou prise de rendez-vous.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-[#FDFBF9] rounded-xl p-4 text-center hover:shadow-md transition border border-stone-100">
                <div className="w-10 h-10 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-[#C2185B] text-sm">location_on</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1c1b1b] mb-1">Notre salon</h3>
                <p className="text-stone-500 text-xs">Paris 9e - 12 rue de la Paix<br />75009 Paris</p>
              </div>
              <div className="bg-[#FDFBF9] rounded-xl p-4 text-center hover:shadow-md transition border border-stone-100">
                <div className="w-10 h-10 bg-[#C2185B]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-[#C2185B] text-sm">contact_mail</span>
                </div>
                <h3 className="font-semibold text-sm text-[#1c1b1b] mb-1">Contact</h3>
                <p className="text-stone-500 text-xs">contact@glowbook.fr<br />06 12 34 56 78</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/register" className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#C2185B] text-white rounded-full text-sm font-semibold hover:bg-[#9b0044] transition shadow-md">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - gardé en rose comme les autres pages */}
      <footer className="py-10 px-4 text-center bg-gradient-to-r from-[#C2185B] to-[#9b0044] text-white mt-0">
        <Link href="/" className="text-2xl font-serif italic text-white mb-4 inline-block">GlowBook</Link>
        <div className="flex flex-wrap justify-center gap-6 mb-4 mt-4">
          <Link href="/mentions-legales" className="text-white/80 text-xs hover:text-white transition">Mentions légales</Link>
          <Link href="/confidentialite" className="text-white/80 text-xs hover:text-white transition">Confidentialité</Link>
          <Link href="/contact" className="text-white/80 text-xs hover:text-white transition">Contact</Link>
        </div>
        <p className="text-white/70 text-sm">© 2026 GlowBook - Tous droits réservés</p>
      </footer>
    </div>
  )
}