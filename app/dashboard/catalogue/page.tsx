'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import toast from 'react-hot-toast'
import { ServicePhoto } from '@/components/ServicePhoto' // Ajout du composant Cloudinary

interface Service {
  id: string
  nom: string
  categorie: string
  prixBase: number
  dureeBase: number
  statut: string
  description: string
  inclus: string[]
  conseils: string
  populaire: boolean
  createdAt: string
  photos?: { id: string; url: string; publicId: string; ordre: number }[]
}

export default function CatalogueManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategorie, setFilterCategorie] = useState('tous')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  // Récupérer les services depuis la base de données
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (!response.ok) throw new Error('Erreur chargement')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement des services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session) {
      fetchServices()
    }
  }, [session, status, router])

  const categories = ['tous', 'Tresses', 'Locks', 'Nattes', 'Twists', 'Soins', 'Coupe', 'Couleur', 'Coiffage', 'Lissage']

  // Formater la durée en heures/minutes
  const formatDuree = (minutes: number) => {
    const heures = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (heures === 0) return `${mins}min`
    if (mins === 0) return `${heures}h`
    return `${heures}h${mins}`
  }

  const filteredServices = services.filter(s => {
    if (searchTerm && !s.nom.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !s.description?.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (filterCategorie !== 'tous' && s.categorie !== filterCategorie) return false
    if (filterStatut === 'actif' && s.statut !== 'active') return false
    if (filterStatut === 'inactif' && s.statut === 'active') return false
    return true
  })

  // Activer/Désactiver un service
  const toggleStatut = async (id: string, currentStatut: string) => {
    try {
      const newStatut = currentStatut === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatut })
      })
      
      if (response.ok) {
        setServices(services.map(s => s.id === id ? { ...s, statut: newStatut } : s))
        toast.success(`Service ${newStatut === 'active' ? 'activé' : 'désactivé'}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors du changement de statut')
      }
    } catch (error) {
      toast.error('Erreur lors du changement de statut')
    }
  }

  // Supprimer un service
  const deleteService = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setServices(services.filter(s => s.id !== id))
        setShowDeleteModal(null)
        toast.success('Service supprimé définitivement')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  // Dupliquer un service
  const duplicateService = async (service: Service) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: `${service.nom} (copie)`,
          categorie: service.categorie,
          dureeBase: service.dureeBase,
          prixBase: service.prixBase,
          description: service.description,
          inclus: service.inclus,
          conseils: service.conseils,
          populaire: service.populaire
        })
      })
      
      if (response.ok) {
        toast.success('Service dupliqué avec succès')
        fetchServices() // Recharger la liste
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erreur lors de la duplication')
      }
    } catch (error) {
      toast.error('Erreur lors de la duplication')
    }
  }

  const getStatistiques = () => {
    const totalServices = services.length
    const actifs = services.filter(s => s.statut === 'active').length
    const inactifs = totalServices - actifs
    const revenusPotentiels = services.reduce((sum, s) => sum + (s.prixBase || 0), 0)
    return { totalServices, actifs, inactifs, revenusPotentiels }
  }

  const stats = getStatistiques()

  // Récupérer l'image principale d'un service (première photo ou fallback)
  const getServiceImage = (service: Service) => {
    if (service.photos && service.photos.length > 0) {
      return service.photos[0].url
    }
    // Fallback basé sur la catégorie
    const fallbackImages: Record<string, string> = {
      'Tresses': 'https://images.pexels.com/photos/3998420/pexels-photo-3998420.jpeg?w=400',
      'Locks': 'https://images.pexels.com/photos/3998389/pexels-photo-3998389.jpeg?w=400',
      'Nattes': 'https://images.pexels.com/photos/3998421/pexels-photo-3998421.jpeg?w=400',
      'Twists': 'https://images.pexels.com/photos/3997353/pexels-photo-3997353.jpeg?w=400',
      'Soins': 'https://images.pexels.com/photos/3998422/pexels-photo-3998422.jpeg?w=400'
    }
    return fallbackImages[service.categorie] || 'https://images.pexels.com/photos/3997369/pexels-photo-3997369.jpeg?w=400'
  }

  // Récupérer le publicId pour le composant Cloudinary
  const getServicePublicId = (service: Service) => {
    if (service.photos && service.photos.length > 0) {
      return service.photos[0].publicId
    }
    return null
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Sidebar />
        <HeaderMobile />
        <div className="lg:ml-72 min-h-screen bg-[#FDFBF9] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#C2185B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    )
  }

  if (!session) return null

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-[#FDFBF9]">
        <div className="p-4 md:p-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1b1b]">Catalogue des services</h1>
              <p className="text-stone-500 text-sm mt-1">Gérez vos coiffures et services</p>
            </div>
            <Link href="/dashboard/catalogue/edition/nouveau" className="bg-[#C2185B] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#9b0044] transition shadow-sm">
              <span className="material-symbols-outlined text-sm">add</span>
              Ajouter un service
            </Link>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-stone-100">
              <p className="text-2xl font-bold text-[#C2185B]">{stats.totalServices}</p>
              <p className="text-xs text-stone-500">Total services</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-stone-100">
              <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
              <p className="text-xs text-stone-500">Services actifs</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-stone-100">
              <p className="text-2xl font-bold text-red-500">{stats.inactifs}</p>
              <p className="text-xs text-stone-500">Services inactifs</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-stone-100">
              <p className="text-2xl font-bold text-[#C2185B]">{stats.revenusPotentiels}€</p>
              <p className="text-xs text-stone-500">Revenus potentiels</p>
            </div>
          </div>

          {/* Barre d'outils */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Rechercher par nom ou description..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none" 
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select 
                value={filterCategorie} 
                onChange={(e) => setFilterCategorie(e.target.value)} 
                className="px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:ring-[#C2185B]/20"
              >
                <option value="tous">Toutes catégories</option>
                {categories.slice(1).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              <select 
                value={filterStatut} 
                onChange={(e) => setFilterStatut(e.target.value)} 
                className="px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white"
              >
                <option value="tous">Tous statuts</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactifs</option>
              </select>
              <div className="flex gap-1 border border-stone-200 rounded-xl p-1 bg-white">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#C2185B] text-white' : 'text-stone-400'}`}
                >
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[#C2185B] text-white' : 'text-stone-400'}`}
                >
                  <span className="material-symbols-outlined text-sm">list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Liste des services - VUE GRILLE */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <span className="material-symbols-outlined text-5xl text-stone-300">inventory</span>
              <p className="text-stone-500 mt-3">Aucun service trouvé</p>
              <button 
                onClick={() => { 
                  setSearchTerm('')
                  setFilterCategorie('tous')
                  setFilterStatut('tous')
                }} 
                className="mt-4 text-[#C2185B] font-semibold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const publicId = getServicePublicId(service)
                return (
                  <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition group">
                    <div className="relative h-52 overflow-hidden">
                      {publicId ? (
                        <ServicePhoto
                          publicId={publicId}
                          nom={service.nom}
                          width={400}
                          height={300}
                        />
                      ) : (
                        <img 
                          src={getServiceImage(service)} 
                          alt={service.nom} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${service.statut === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {service.statut === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-[#1c1b1b]">{service.nom}</h3>
                          <p className="text-xs text-stone-400">{service.categorie}</p>
                        </div>
                        <span className="text-[#C2185B] font-bold text-xl">{service.prixBase}€</span>
                      </div>
                      <p className="text-stone-500 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-3 text-stone-400 text-xs mb-4">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">schedule</span>
                          {formatDuree(service.dureeBase)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">event</span>
                          Créé le {new Date(service.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Link href={`/dashboard/catalogue/edition/${service.id}`} className="flex-1 text-center text-[#C2185B] text-sm border border-[#C2185B]/30 rounded-xl py-2 hover:bg-pink-50 transition">
                          Modifier
                        </Link>
                        <button 
                          onClick={() => toggleStatut(service.id, service.statut)} 
                          className={`flex-1 text-center text-sm border rounded-xl py-2 transition ${service.statut === 'active' ? 'text-red-500 border-red-200 hover:bg-red-50' : 'text-green-500 border-green-200 hover:bg-green-50'}`}
                        >
                          {service.statut === 'active' ? 'Désactiver' : 'Activer'}
                        </button>
                        <button 
                          onClick={() => duplicateService(service)} 
                          className="px-3 border border-stone-200 rounded-xl text-stone-500 hover:bg-stone-50 transition"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                        <button 
                          onClick={() => setShowDeleteModal(service.id)} 
                          className="px-3 border border-stone-200 rounded-xl text-stone-500 hover:bg-red-50 hover:text-red-500 transition"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* VUE LISTE */
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-stone-50/50 border-b border-stone-100">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Service</th>
                      <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Catégorie</th>
                      <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Prix</th>
                      <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Durée</th>
                      <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Statut</th>
                      <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredServices.map((service) => {
                      const publicId = getServicePublicId(service)
                      return (
                        <tr key={service.id} className="hover:bg-pink-50/30 transition">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {publicId ? (
                                <ServicePhoto
                                  publicId={publicId}
                                  nom={service.nom}
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <img src={getServiceImage(service)} className="w-10 h-10 rounded-lg object-cover" />
                              )}
                              <span className="font-medium">{service.nom}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm">{service.categorie}</td>
                          <td className="px-5 py-3 text-sm font-semibold text-[#C2185B]">{service.prixBase}€</td>
                          <td className="px-5 py-3 text-sm">{formatDuree(service.dureeBase)}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${service.statut === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {service.statut === 'active' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <Link href={`/dashboard/catalogue/edition/${service.id}`} className="p-1 text-stone-400 hover:text-[#C2185B] transition">
                                <span className="material-symbols-outlined text-sm">edit</span>
                              </Link>
                              <button onClick={() => duplicateService(service)} className="p-1 text-stone-400 hover:text-[#C2185B] transition">
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                              </button>
                              <button onClick={() => setShowDeleteModal(service.id)} className="p-1 text-stone-400 hover:text-red-500 transition">
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal confirmation suppression */}
          {showDeleteModal !== null && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <h3 className="text-xl font-semibold mb-2">Confirmer la suppression</h3>
                <p className="text-stone-500 mb-6">Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-2 border border-stone-300 rounded-lg hover:bg-stone-50">
                    Annuler
                  </button>
                  <button onClick={() => deleteService(showDeleteModal)} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}