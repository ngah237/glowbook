'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    content: 'La création de réservation se fait en 3 étapes simples...',
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
      'Les prix s\'ajustent automatiquement selon les options',
      'Un acompte de 30% est demandé à la réservation',
      'Les clientes reçoivent une confirmation par email'
    ]
  },
  {
    id: '2',
    title: 'Gérer le catalogue de coiffures',
    content: 'Le catalogue est votre vitrine...',
    category: 'Catalogue',
    icon: 'inventory_2',
    steps: [
      'Allez dans "Catalogue" dans le menu latéral',
      'Cliquez sur "Nouvelle coiffure"',
      'Remplissez les informations',
      'Ajoutez des photos',
      'Configurez les variantes'
    ],
    tips: [
      'Les photos peuvent être réorganisées',
      'La première photo sera la miniature',
      'Les coiffures peuvent être masquées'
    ]
  },
  {
    id: '3',
    title: 'Configurer mes disponibilités',
    content: 'Définissez vos horaires de travail...',
    category: 'Paramètres',
    icon: 'schedule',
    steps: [
      'Allez dans "Paramètres" > "Horaires"',
      'Activez les jours et définissez les plages',
      'Ajoutez des exceptions (congés)',
      'Sauvegardez'
    ],
    tips: [
      'Plusieurs plages par jour possibles',
      'Les pauses déjeuner sont configurables',
      'Les clientes ne voient que les créneaux libres'
    ]
  },
  {
    id: '4',
    title: 'Gérer les acomptes Stripe',
    content: 'Configurez le système d\'acompte...',
    category: 'Paiements',
    icon: 'payments',
    steps: [
      'Allez dans "Paramètres" > "Paiements"',
      'Choisissez fixe ou pourcentage',
      'Connectez Stripe',
      'Les fonds sont transférés automatiquement'
    ],
    tips: [
      'Minimum 20€ d\'acompte',
      'Remboursement possible depuis le planning',
      'Commission Stripe : 1,4% + 0,25€'
    ]
  },
  {
    id: '5',
    title: 'Personnaliser mon catalogue public',
    content: 'Donnez une identité unique à votre catalogue...',
    category: 'Catalogue',
    icon: 'palette',
    steps: [
      'Allez dans "Paramètres" > "Personnalisation"',
      'Ajoutez logo et bannière',
      'Choisissez les couleurs',
      'Définissez l\'URL'
    ],
    tips: [
      'Logo transparent recommandé',
      'Bannière idéale : 1200x400px',
      'URL : glowbook.fr/votre-nom'
    ]
  },
  {
    id: '6',
    title: 'Consulter le planning',
    content: 'Visualisez tous vos rendez-vous...',
    category: 'Planning',
    icon: 'calendar_month',
    steps: [
      'Allez dans "Planning"',
      'Changez de vue (Jour/Semaine/Mois)',
      'Cliquez sur un rendez-vous',
      'Modifiez le statut'
    ],
    tips: [
      'RDV du jour surlignés en rose',
      'Nouveaux RDV avec badge',
      'Export CSV disponible'
    ]
  },
  {
    id: '7',
    title: 'Ajouter des photos de coiffures',
    content: 'Upload multiple jusqu\'à 10 photos...',
    category: 'Catalogue',
    icon: 'add_photo_alternate',
    steps: [
      'Dans l\'édition coiffure, allez dans "Photos"',
      'Glissez-déposez les fichiers',
      'Réorganisez par glisser',
      'Définissez la photo principale'
    ],
    tips: [
      'Formats : JPG, PNG, WEBP',
      'Taille max : 5MB',
      'Optimisation automatique'
    ]
  },
  {
    id: '8',
    title: 'Comment fonctionnent les notifications ?',
    content: 'Restez informé des nouvelles réservations...',
    category: 'Notifications',
    icon: 'notifications',
    steps: [
      'Configurez dans "Paramètres" > "Notifications"',
      'Activez les rappels SMS (optionnel)',
      'Les emails sont inclus'
    ],
    tips: [
      'Confirmation immédiate pour les clientes',
      'Rappel 48h avant',
      'Alerte visuelle pour nouvelles réservations'
    ]
  }
]

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<HelpArticle | null>(null)

  useEffect(() => {
    const found = helpArticles.find(a => a.id === params.id)
    if (found) {
      setArticle(found)
    } else {
      router.push('/aide')
    }
  }, [params.id, router])

  if (!article) {
    return (
      <>
        <Sidebar />
        <HeaderMobile />
        <div className="lg:ml-72 min-h-screen bg-[#FDFBF9] flex items-center justify-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-gradient-to-br from-pink-50/30 to-white">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Fil d'Ariane */}
          <div className="flex items-center gap-2 text-sm text-stone-400 mb-6">
            <Link href="/dashboard" className="hover:text-[#C2185B] transition">Dashboard</Link>
            <span>/</span>
            <Link href="/aide" className="hover:text-[#C2185B] transition">Aide</Link>
            <span>/</span>
            <span className="text-stone-600">{article.title}</span>
          </div>

          {/* Article */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#C2185B] to-[#9b0044] p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-2xl">{article.icon}</span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{article.category}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">{article.title}</h1>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <p className="text-stone-600 leading-relaxed text-lg">{article.content}</p>

              {article.steps && article.steps.length > 0 && (
                <div className="bg-pink-50 rounded-xl p-6">
                  <h2 className="font-semibold text-[#1c1b1b] text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#C2185B]">format_list_numbered</span>
                    Étapes à suivre
                  </h2>
                  <ol className="space-y-3">
                    {article.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#C2185B] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                                   {idx + 1}
                        </div>
                        <span className="text-stone-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {article.tips && article.tips.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-6">
                  <h2 className="font-semibold text-[#1c1b1b] text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600">lightbulb</span>
                    Conseils pratiques
                  </h2>
                  <ul className="space-y-2">
                    {article.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-700">
                        <span className="text-amber-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Articles connexes */}
              <div className="border-t border-stone-100 pt-6 mt-6">
                <h3 className="font-semibold text-[#1c1b1b] mb-4">Articles connexes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {helpArticles
                    .filter(a => a.id !== article.id && a.category === article.category)
                    .slice(0, 2)
                    .map(related => (
                      <Link
                        key={related.id}
                        href={`/aide/${related.id}`}
                        className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-pink-50 transition group"
                      >
                        <span className="material-symbols-outlined text-stone-400 group-hover:text-[#C2185B]">{related.icon}</span>
                        <span className="text-sm text-stone-600 group-hover:text-[#C2185B]">{related.title}</span>
                        <span className="material-symbols-outlined text-sm text-stone-400 ml-auto">arrow_forward</span>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Link
                  href="/aide"
                  className="flex-1 text-center py-3 border border-stone-300 rounded-xl hover:bg-stone-50 transition font-medium"
                >
                  ← Retour à l'aide
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 text-center bg-[#C2185B] text-white py-3 rounded-xl font-medium hover:bg-[#9b0044] transition shadow-md"
                >
                  Aller au tableau de bord
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}