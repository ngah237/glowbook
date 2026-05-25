'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import toast from 'react-hot-toast'

const tailles = ['Court', 'Moyen', 'Long']
const grosseurs = ['Petite', 'Moyenne', 'Grosse']

// Matrice des prix et durées par défaut
const defaultMatrix = {
  'Court': { 'Petite': { prix: 60, duree: 120 }, 'Moyenne': { prix: 70, duree: 150 }, 'Grosse': { prix: 80, duree: 180 } },
  'Moyen': { 'Petite': { prix: 80, duree: 180 }, 'Moyenne': { prix: 90, duree: 210 }, 'Grosse': { prix: 100, duree: 240 } },
  'Long': { 'Petite': { prix: 120, duree: 300 }, 'Moyenne': { prix: 140, duree: 360 }, 'Grosse': { prix: 160, duree: 420 } }
}

export default function EditionCoiffurePage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [service, setService] = useState({
    nom: 'Knotless Braids',
    categorie: 'Tresses & Braids',
    prix_base: 80,
    duree_base: 180,
    description: 'Technique de tressage sans nœud pour un aspect naturel et moins de tension sur le cuir chevelu.',
    statut: true
  })
  const [photos, setPhotos] = useState<string[]>([])
  const [matrix, setMatrix] = useState(defaultMatrix)

  useEffect(() => { setLoading(false) }, [])

  const handleMatrixChange = (taille: string, grosseur: string, field: 'prix' | 'duree', value: number) => {
    setMatrix(prev => ({ ...prev, [taille]: { ...prev[taille as keyof typeof prev], [grosseur]: { ...prev[taille as keyof typeof prev][grosseur as keyof typeof prev[keyof typeof prev]], [field]: value } } }))
  }

  const sauvegarder = async () => { setSaving(true); setTimeout(() => { toast.success('Modifications enregistrées'); setSaving(false) }, 1000) }

  if (loading) return (<><Sidebar /><HeaderMobile /><div className="lg:ml-72 p-8 text-center">Chargement...</div></>)

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-[#FDFBF9]">
        <div className="p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-stone-100 bg-[#f6f3f2] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1c1b1b]">Édition : {service.nom}</h2>
                <p className="text-stone-500 text-sm mt-1">Configurez les détails et les variantes de ce service</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => router.back()} className="px-6 py-2.5 border border-stone-200 rounded-full font-medium text-stone-600 hover:bg-stone-50 transition">Annuler</button>
                <button onClick={sauvegarder} disabled={saving} className="px-8 py-2.5 bg-[#c2185b] text-white rounded-full font-semibold shadow-md hover:bg-[#9b0044] transition disabled:opacity-50">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
              {/* Colonne gauche */}
              <div className="lg:col-span-5 p-6 md:p-8 space-y-6">
                <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Nom de la prestation</label><input type="text" value={service.nom} onChange={(e) => setService({...service, nom: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#c2185b]/20 focus:border-[#c2185b] outline-none" /></div>
                <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Catégorie</label><select value={service.categorie} onChange={(e) => setService({...service, categorie: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#c2185b]/20 focus:border-[#c2185b] outline-none"><option>Tresses & Braids</option><option>Extensions</option><option>Soins</option><option>Coloration</option><option>Locks & Faux-locs</option></select></div>
                <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-stone-700 mb-1.5">Prix de base (€)</label><input type="number" value={service.prix_base} onChange={(e) => setService({...service, prix_base: parseFloat(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-stone-200" /></div><div><label className="block text-sm font-medium text-stone-700 mb-1.5">Durée (min)</label><input type="number" value={service.duree_base} onChange={(e) => setService({...service, duree_base: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-stone-200" /></div></div>
                <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label><textarea rows={4} value={service.description} onChange={(e) => setService({...service, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#c2185b]/20 focus:border-[#c2185b] outline-none" /></div>
                <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Photos du service</label><div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:border-[#c2185b]/40 hover:bg-pink-50/30 transition cursor-pointer"><span className="material-symbols-outlined text-3xl text-stone-400">cloud_upload</span><p className="text-sm text-stone-500 mt-1">Glissez-déposez vos photos ou <span className="text-[#c2185b] font-semibold">parcourez</span></p><p className="text-xs text-stone-400 mt-1">PNG, JPG jusqu'à 10MB</p></div><div className="grid grid-cols-4 gap-2 mt-4">{photos.map((photo, idx) => (<div key={idx} className="aspect-square rounded-lg bg-stone-100 overflow-hidden relative group"><img src={photo} className="w-full h-full object-cover" /><button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">close</span></button></div>))}<div className="aspect-square rounded-lg bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-stone-400">add</span></div></div></div>
              </div>

              {/* Colonne droite - Matrice */}
              <div className="lg:col-span-7 p-6 md:p-8 bg-stone-50/30">
                <div className="mb-6"><h3 className="text-xl font-semibold text-[#1c1b1b]">Matrice des Variantes</h3><p className="text-stone-500 text-sm mt-1">Ajustez le prix et la durée selon la taille et la grosseur</p></div>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid grid-cols-4 gap-3 mb-4 px-2"><div></div>{grosseurs.map(g => (<div key={g} className="text-center font-semibold text-sm text-stone-600 uppercase tracking-wider">{g}</div>))}</div>
                    {tailles.map(taille => (
                      <div key={taille} className="grid grid-cols-4 gap-3 mb-5">
                        <div className="font-semibold text-stone-700 flex items-center justify-center bg-white rounded-xl p-3 border border-stone-100">{taille}</div>
                        {grosseurs.map(grosseur => {
                          const variant = matrix[taille as keyof typeof matrix]?.[grosseur as keyof typeof matrix[keyof typeof matrix]] || { prix: '', duree: '' }
                          const isCustom = variant.prix !== defaultMatrix[taille as keyof typeof defaultMatrix]?.[grosseur as keyof typeof defaultMatrix[keyof typeof defaultMatrix]]?.prix
                          return (
                            <div key={grosseur} className="bg-white rounded-xl border border-stone-100 p-3 shadow-sm space-y-2">
                              <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">€</span><input type="number" value={variant.prix || ''} onChange={(e) => handleMatrixChange(taille, grosseur, 'prix', parseInt(e.target.value) || 0)} placeholder="Prix" className={`w-full pl-6 pr-2 py-2 text-sm rounded-lg border ${isCustom ? 'border-[#c2185b] bg-pink-50 text-[#c2185b] font-bold' : 'border-stone-100 bg-stone-50'}`} /></div>
                              <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">min</span><input type="number" value={variant.duree || ''} onChange={(e) => handleMatrixChange(taille, grosseur, 'duree', parseInt(e.target.value) || 0)} placeholder="Durée" className={`w-full pl-8 pr-2 py-2 text-sm rounded-lg border ${isCustom ? 'border-[#c2185b] bg-pink-50 text-[#c2185b] font-bold' : 'border-stone-100 bg-stone-50'}`} /></div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                    <div className="mt-6 p-4 bg-pink-50 rounded-xl flex items-start gap-3"><span className="material-symbols-outlined text-[#c2185b]">info</span><p className="text-xs text-[#c2185b]/90 leading-relaxed"><strong>Note :</strong> Les champs vides utiliseront automatiquement les valeurs de prix et durée par défaut. Les valeurs en <span className="font-bold text-[#c2185b]">rose</span> sont des prix personnalisés qui surchargent le prix de base.</p></div>
                    <div className="mt-6 pt-4 border-t border-stone-100"><div className="flex flex-wrap justify-between items-center gap-4"><div className="flex items-center gap-6"><div><span className="text-sm font-medium text-stone-700">Couleurs disponibles</span><div className="flex gap-2 mt-2"><div className="w-7 h-7 rounded-full bg-black ring-1 ring-stone-200"></div><div className="w-7 h-7 rounded-full bg-amber-800"></div><div className="w-7 h-7 rounded-full bg-amber-300"></div><div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div><button className="text-[#c2185b] text-xs font-medium ml-2">+ Ajouter</button></div></div><div><span className="text-sm font-medium text-stone-700">Statut</span><div className="mt-2"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold"><span className="material-symbols-outlined text-sm">check_circle</span> Active (visible dans le catalogue)</span></div></div></div><button className="px-5 py-2 border border-red-200 text-red-600 rounded-full text-sm hover:bg-red-50 transition">Désactiver</button></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}