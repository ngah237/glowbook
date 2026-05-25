'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import toast from 'react-hot-toast'

interface Client {
  id: string
  nom: string
  email: string
  telephone: string
  rendezVous: number
  dernierRDV: string
  totalDepense: number
}

export default function ClientsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false) // Ajouté
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClient, setNewClient] = useState({ nom: '', email: '', telephone: '' })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    if (session) {
      fetchClients()
    }
  }, [session, status, router])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (!response.ok) throw new Error('Erreur chargement')
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement des clients')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClient = async () => {
    // Validation
    if (!newClient.nom.trim()) {
      toast.error('Veuillez saisir le nom du client')
      return
    }
    if (!newClient.email.trim()) {
      toast.error('Veuillez saisir l\'email du client')
      return
    }
    if (!newClient.email.includes('@')) {
      toast.error('Email invalide')
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading('Ajout en cours...')

    try {
      console.log('Envoi des données:', newClient) // Debug

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: newClient.nom.trim(),
          email: newClient.email.trim(),
          telephone: newClient.telephone.trim()
        })
      })

      console.log('Réponse status:', response.status) // Debug

      // Lire la réponse même en cas d'erreur
      const data = await response.json()
      console.log('Réponse data:', data) // Debug

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout')
      }

      // Succès
      toast.dismiss(loadingToast)
      toast.success(`Client ${newClient.nom} ajouté avec succès !`)
      setShowAddModal(false)
      setNewClient({ nom: '', email: '', telephone: '' })
      await fetchClients() // Recharger la liste
      
    } catch (error: any) {
      console.error('Erreur complète:', error)
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de l\'ajout du client')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowAddModal(false)
    setNewClient({ nom: '', email: '', telephone: '' })
  }

  const filteredClients = clients.filter(c =>
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <Sidebar />
        <HeaderMobile />
        <div className="lg:ml-72 min-h-screen bg-[#FDFBF9] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#C2185B] border-t-transparent"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-[#FDFBF9]">
        <div className="p-4 md:p-8">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1b1b]">Clients</h1>
              <p className="text-stone-500 text-sm mt-1">Gérez votre clientèle</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#C2185B] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-[#9b0044] transition shadow-md"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Ajouter un client
            </button>
          </div>

          {/* Recherche */}
          <div className="relative max-w-md mb-6">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
            />
          </div>

          {/* Tableau des clients */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-stone-50/50 border-b border-stone-100">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Client</th>
                    <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Contact</th>
                    <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">RDV</th>
                    <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Dépenses</th>
                    <th className="px-5 py-3 text-xs font-semibold text-stone-500 text-left">Dernier RDV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-stone-400">
                        Aucun client trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-pink-50/30 transition cursor-pointer">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-pink-100 text-[#C2185B] flex items-center justify-center text-xs font-bold">
                              {client.nom?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span className="font-medium">{client.nom}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-sm">{client.email}</p>
                          <p className="text-xs text-stone-400">{client.telephone || 'Non renseigné'}</p>
                        </td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-1 bg-pink-100 text-[#C2185B] rounded-full text-xs font-semibold">
                            {client.rendezVous || 0} rdv
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-semibold text-[#C2185B]">{client.totalDepense || 0}€</span>
                        </td>
                        <td className="px-5 py-3 text-sm text-stone-600">
                          {client.dernierRDV ? new Date(client.dernierRDV).toLocaleDateString('fr-FR') : 'Aucun'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODAL D'AJOUT DE CLIENT */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#1c1b1b]">Ajouter un client</h3>
                  <button
                    onClick={handleCancel}
                    className="p-1 hover:bg-stone-100 rounded-full transition"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nom complet *</label>
                    <input
                      type="text"
                      value={newClient.nom}
                      onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })}
                      placeholder="Sophie Martin"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="sophie@email.com"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={newClient.telephone}
                      onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })}
                      placeholder="06 12 34 56 78"
                      className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition font-medium disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddClient}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-[#C2185B] text-white rounded-xl font-semibold hover:bg-[#9b0044] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
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