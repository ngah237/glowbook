'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  icon: string
}

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Comment créer une réservation ?',
    content: 'Pour créer une réservation, rendez-vous dans l\'onglet "Nouvelle réservation". Sélectionnez une cliente existante ou créez-en une nouvelle, choisissez la coiffure souhaitée avec ses options (taille, grosseur), puis sélectionnez la date et l\'heure. Validez pour confirmer le rendez-vous.',
    category: 'Réservations',
    icon: 'event_available'
  },
  {
    id: '2',
    title: 'Gérer le catalogue de coiffures',
    content: 'Accédez à l\'onglet "Catalogue" pour ajouter, modifier ou supprimer vos coiffures. Pour chaque coiffure, vous pouvez définir un nom, une catégorie, un prix de base, une durée, ajouter des photos, et configurer des variantes de prix selon la taille et la grosseur.',
    category: 'Catalogue',
    icon: 'inventory_2'
  },
  {
    id: '3',
    title: 'Configurer mes disponibilités',
    content: 'Rendez-vous dans "Paramètres" > "Horaires d\'ouverture". Vous pouvez définir vos jours et horaires de travail, ajouter des pauses, et bloquer des dates exceptionnelles (congés, formation). Les clientes ne pourront réserver que sur ces créneaux.',
    category: 'Paramètres',
    icon: 'schedule'
  },
  {
    id: '4',
    title: 'Gérer les acomptes Stripe',
    content: 'Dans "Paramètres" > "Paiements", configurez le type d\'acompte (fixe ou pourcentage). Connectez votre compte Stripe pour recevoir les paiements directement. Les acomptes sont prélevés automatiquement lors de la réservation.',
    category: 'Paiements',
    icon: 'payments'
  },
  {
    id: '5',
    title: 'Personnaliser mon catalogue public',
    content: 'Allez dans "Paramètres" > "Personnalisation". Vous pouvez y ajouter votre logo, une bannière, choisir les couleurs du thème, et définir l\'URL personnalisée de votre catalogue visible par les clientes.',
    category: 'Catalogue',
    icon: 'palette'
  },
  {
    id: '6',
    title: 'Consulter le planning',
    content: 'L\'onglet "Planning" affiche tous vos rendez-vous. Vous pouvez basculer entre la vue jour, semaine ou mois. Cliquez sur un rendez-vous pour voir les détails, modifier le statut ou annuler la réservation.',
    category: 'Planning',
    icon: 'calendar_month'
  },
  {
    id: '7',
    title: 'Ajouter des photos de coiffures',
    content: 'Lors de la création ou modification d\'une coiffure, utilisez l\'outil d\'upload multiple. Vous pouvez glisser-déposer les images, les réorganiser, et définir une photo principale. Les formats acceptés sont JPG, PNG et WEBP (max 5MB).',
    category: 'Catalogue',
    icon: 'add_photo_alternate'
  },
  {
    id: '8',
    title: 'Comment fonctionnent les notifications ?',
    content: 'Les clientes reçoivent une confirmation par email après chaque réservation. Vous pouvez activer les rappels SMS dans les paramètres. Les nouvelles réservations déclenchent une alerte visuelle dans le tableau de bord.',
    category: 'Notifications',
    icon: 'notifications'
  }
]

const categories = [...new Set(helpArticles.map(a => a.category))]

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const router = useRouter()

  const filteredArticles = helpArticles.filter(article => {
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = !selectedCategory || article.category === selectedCategory
    return matchSearch && matchCategory
  })

  const handleSeeMore = () => {
    setIsOpen(false)
    router.push('/aide')
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#C2185B] text-white shadow-lg hover:bg-[#9b0044] transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Aide"
      >
        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">help</span>
      </button>

      {/* Popup d'aide */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">support_agent</span>
                  <h2 className="font-semibold">Centre d'aide</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <p className="text-xs text-pink-100 mt-1">Comment pouvons-nous vous aider ?</p>
            </div>

            {/* Recherche */}
            <div className="p-4 border-b border-stone-100">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
                <input
                  type="text"
                  placeholder="Rechercher une aide..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none text-sm"
                />
              </div>
            </div>

            {/* Catégories */}
            <div className="px-4 py-2 border-b border-stone-100 overflow-x-auto">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                    !selectedCategory ? 'bg-[#C2185B] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Toutes
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap ${
                      selectedCategory === cat ? 'bg-[#C2185B] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste des articles */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-stone-300 text-4xl">search_off</span>
                  <p className="text-stone-400 text-sm mt-2">Aucun résultat trouvé</p>
                </div>
              ) : (
                filteredArticles.map(article => (
                  <div key={article.id} className="group">
                    <button
                      onClick={() => router.push(`/aide/${article.id}`)}
                      className="w-full text-left p-3 rounded-xl hover:bg-pink-50 transition flex items-start gap-3"
                    >
                      <span className="material-symbols-outlined text-[#C2185B] text-xl">{article.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-[#1c1b1b] group-hover:text-[#C2185B] transition">{article.title}</p>
                        <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{article.content}</p>
                        <span className="text-xs text-[#C2185B] mt-1 inline-block opacity-0 group-hover:opacity-100 transition">Lire la suite →</span>
                      </div>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pied de page */}
            <div className="p-4 border-t border-stone-100 bg-stone-50">
              <button
                onClick={handleSeeMore}
                className="w-full text-center text-sm text-[#C2185B] font-medium hover:underline"
              >
                Voir toutes les aides →
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}