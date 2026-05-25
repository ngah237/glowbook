'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import Link from 'next/link'

interface HelpArticle {
  id: string
  title: string
  content: string
  category: string
  icon: string
  steps?: string[]
  tips?: string[]
}

const helpArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Comment créer une réservation ?',
    content: 'La création de réservation se fait en 3 étapes simples. Vous pouvez choisir une cliente existante ou en créer une nouvelle, sélectionner la coiffure avec ses options de personnalisation, puis définir la date et l\'heure du rendez-vous.',
    category: 'Réservations',
    icon: 'event_available',
    steps: [
      'Cliquez sur "Nouvelle réservation" dans le menu latéral',
      'Étape 1 : Sélectionnez ou créez une cliente',
      'Étape 2 : Choisissez la coiffure, la taille et la grosseur',
      'Étape 3 : Définissez la date, l\'heure et le lieu',
      'Validez pour confirmer la réservation'
    ],
    tips: [
      'Les prix s\'ajustent automatiquement selon les options choisies',
      'Un acompte de 30% est demandé à la réservation',
      'Les clientes reçoivent une confirmation par email'
    ]
  },
  {
    id: '2',
    title: 'Gérer le catalogue de coiffures',
    content: 'Le catalogue est votre vitrine. Vous pouvez y ajouter toutes vos prestations avec photos, descriptions, et prix personnalisés selon les variantes de taille et grosseur.',
    category: 'Catalogue',
    icon: 'inventory_2',
    steps: [
      'Allez dans "Catalogue" dans le menu latéral',
      'Cliquez sur "Nouvelle coiffure"',
      'Remplissez les informations : nom, catégorie, prix, durée',
      'Ajoutez des photos (glisser-déposer)',
      'Configurez les variantes de prix selon taille/grosseur'
    ],
    tips: [
      'Les photos peuvent être réorganisées par glisser-déposer',
      'La première photo sera celle affichée en miniature',
      'Les coiffures peuvent être masquées temporairement'
    ]
  },
  {
    id: '3',
    title: 'Configurer mes disponibilités',
    content: 'Définissez vos horaires de travail pour que les clientes ne puissent réserver que sur vos créneaux disponibles. Vous pouvez aussi bloquer des dates exceptionnelles.',
    category: 'Paramètres',
    icon: 'schedule',
    steps: [
      'Allez dans "Paramètres" > "Horaires d\'ouverture"',
      'Pour chaque jour, activez/désactivez et définissez les plages',
      'Ajoutez des exceptions pour les jours fermés (congés)',
      'Sauvegardez vos modifications'
    ],
    tips: [
      'Vous pouvez avoir plusieurs plages horaires par jour (ex: 9h-12h et 14h-18h)',
      'Les pauses déjeuner sont configurables',
      'Les clientes ne voient que les créneaux disponibles'
    ]
  },
  {
    id: '4',
    title: 'Gérer les acomptes Stripe',
    content: 'Configurez le système d\'acompte pour sécuriser vos rendez-vous et réduire les no-shows. Les acomptes sont collectés automatiquement lors de la réservation en ligne.',
    category: 'Paiements',
    icon: 'payments',
    steps: [
      'Allez dans "Paramètres" > "Paiements"',
      'Choisissez le type d\'acompte : fixe (ex: 20€) ou pourcentage (ex: 30%)',
      'Connectez votre compte Stripe pour recevoir les paiements',
      'Les fonds sont automatiquement transférés'
    ],
    tips: [
      'Le montant minimum d\'acompte est de 20€',
      'Vous pouvez rembourser un acompte depuis le planning',
      'Stripe prélève une commission de 1,4% + 0,25€'
    ]
  },
  {
    id: '5',
    title: 'Personnaliser mon catalogue public',
    content: 'Donnez une identité unique à votre catalogue visible par les clientes. Personnalisez les couleurs, le logo, la bannière et l\'URL.',
    category: 'Catalogue',
    icon: 'palette',
    steps: [
      'Allez dans "Paramètres" > "Personnalisation"',
      'Ajoutez votre logo (format carré)',
      'Ajoutez une bannière de couverture',
      'Choisissez les couleurs du thème',
      'Définissez votre URL personnalisée'
    ],
    tips: [
      'Le logo doit être transparent pour un meilleur rendu',
      'La bannière idéale fait 1200x400px',
      'L\'URL sera : glowbook.fr/votre-nom-salon'
    ]
  },
  {
    id: '6',
    title: 'Consulter le planning',
    content: 'Visualisez tous vos rendez-vous et gérez-les facilement. Le planning offre plusieurs vues et permet de modifier le statut des réservations.',
    category: 'Planning',
    icon: 'calendar_month',
    steps: [
      'Allez dans "Planning" dans le menu latéral',
      'Changez de vue : Jour, Semaine ou Mois',
      'Cliquez sur un rendez-vous pour voir les détails',
      'Modifiez le statut (confirmé, terminé, annulé)'
    ],
    tips: [
      'Les rendez-vous du jour sont surlignés en rose',
      'Les nouveaux rendez-vous sont indiqués par un badge',
      'Vous pouvez exporter le planning en CSV'
    ]
  },
  {
    id: '7',
    title: 'Ajouter des photos de coiffures',
    content: 'L\'outil d\'upload multiple vous permet d\'ajouter jusqu\'à 10 photos par coiffure avec réorganisation et sélection de la photo principale.',
    category: 'Catalogue',
    icon: 'add_photo_alternate',
    steps: [
      'Dans l\'édition d\'une coiffure, allez dans "Photos"',
      'Cliquez pour sélectionner les fichiers (ou glisser-déposer)',
      'Les photos s\'affichent en grille',
      'Glissez pour réorganiser',
      'Cliquez sur l\'étoile pour définir la photo principale'
    ],
    tips: [
      'Formats acceptés : JPG, PNG, WEBP',
      'Taille maximale : 5MB par photo',
      'Les photos sont optimisées automatiquement'
    ]
  },
  {
    id: '8',
    title: 'Comment fonctionnent les notifications ?',
    content: 'Restez informé des nouvelles réservations et tenez vos clientes informées automatiquement par email et SMS.',
    category: 'Notifications',
    icon: 'notifications',
    steps: [
      'Configurez vos préférences dans "Paramètres" > "Notifications"',
      'Activez les rappels SMS (option payante)',
      'Les emails sont inclus dans tous les forfaits'
    ],
    tips: [
      'Les clientes reçoivent une confirmation immédiate',
      'Un rappel est envoyé 48h avant le rendez-vous',
      'Les nouvelles réservations déclenchent une alerte visuelle'
    ]
  }
]

const categories = ['Toutes', ...new Set(helpArticles.map(a => a.category))]

export default function AidePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)

  const filteredArticles = helpArticles.filter(article => {
    const matchSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === 'Toutes' || article.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-pink-50/30 to-white">
        <div className="p-4 md:p-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C2185B]/10 rounded-2xl mb-4">
              <span className="material-symbols-outlined text-3xl text-[#C2185B]">support_agent</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#1c1b1b]">Centre d'aide</h1>
            <p className="text-stone-500 mt-2">Tout ce que vous devez savoir pour utiliser GlowBook</p>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">search</span>
              <input
                type="text"
                placeholder="Rechercher une aide..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#C2185B] text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grille d'articles */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-stone-300 text-5xl">search_off</span>
              <p className="text-stone-400 mt-3">Aucun résultat trouvé pour "{searchTerm}"</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('Toutes')
                }}
                className="mt-4 text-[#C2185B] text-sm hover:underline"
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-xl shadow-sm border border-stone-100 p-5 cursor-pointer hover:shadow-md hover:border-[#C2185B]/20 transition group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center group-hover:bg-[#C2185B]/10 transition">
                      <span className="material-symbols-outlined text-[#C2185B]">{article.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1c1b1b] group-hover:text-[#C2185B] transition">{article.title}</h3>
                      <p className="text-sm text-stone-500 mt-1 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-[#C2185B] font-medium">Lire l'article</span>
                        <span className="material-symbols-outlined text-sm text-[#C2185B] group-hover:translate-x-1 transition">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal article détaillé */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-100 p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#C2185B]">{selectedArticle.icon}</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1c1b1b]">{selectedArticle.title}</h2>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="p-2 hover:bg-stone-100 rounded-full transition">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-stone-600 leading-relaxed">{selectedArticle.content}</p>

              {selectedArticle.steps && selectedArticle.steps.length > 0 && (
                <div className="bg-pink-50 rounded-xl p-5">
                  <h3 className="font-semibold text-[#1c1b1b] mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C2185B] text-sm">format_list_numbered</span>
                    Étapes à suivre
                  </h3>
                  <ol className="space-y-2">
                    {selectedArticle.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                        <span className="w-5 h-5 bg-[#C2185B]/10 text-[#C2185B] rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">{idx + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedArticle.tips && selectedArticle.tips.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-5">
                  <h3 className="font-semibold text-[#1c1b1b] mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-sm">lightbulb</span>
                    Conseils pratiques
                  </h3>
                  <ul className="space-y-2">
                    {selectedArticle.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                        <span className="text-amber-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full py-2.5 bg-[#C2185B] text-white rounded-xl font-medium hover:bg-[#9b0044] transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}