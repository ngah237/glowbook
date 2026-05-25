'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import { api } from '@/lib/apiClient'
import toast from 'react-hot-toast'

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export default function DisponibilitesPage() {
  const [disponibilites, setDisponibilites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDisponibilites().then(setDisponibilites).finally(() => setLoading(false))
  }, [])

  const updateDispo = async (jour: number, field: string, value: any) => {
    const existante = disponibilites.find(d => d.jour_semaine === jour)
    const data = { jour_semaine: jour, heure_debut: existante?.heure_debut || '09:00', heure_fin: existante?.heure_fin || '18:00', actif: existante?.actif ?? true, [field]: value }
    const updated = await api.updateDisponibilite(data)
    setDisponibilites(prev => [...prev.filter(d => d.jour_semaine !== jour), updated])
    toast.success('Mis à jour')
  }

  if (loading) return <div className="lg:ml-72 p-8 text-center">Chargement...</div>

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-[#FDFBF9] p-8">
        <h1 className="text-2xl font-serif font-bold mb-6">Mes disponibilités</h1>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-stone-50 border-b"><tr><th className="px-4 py-3">Jour</th><th className="px-4 py-3">Actif</th><th className="px-4 py-3">Début</th><th className="px-4 py-3">Fin</th></tr></thead>
            <tbody>
              {jours.map((jour, idx) => {
                const dispo = disponibilites.find(d => d.jour_semaine === idx)
                return (
                  <tr key={idx} className="border-b"><td className="px-4 py-3">{jour}</td>
                    <td className="px-4 py-3"><button onClick={() => updateDispo(idx, 'actif', !dispo?.actif)} className={`px-3 py-1 rounded-full text-xs ${dispo?.actif !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{dispo?.actif !== false ? 'Actif' : 'Inactif'}</button></td>
                    <td className="px-4 py-3"><input type="time" value={dispo?.heure_debut || '09:00'} onChange={(e) => updateDispo(idx, 'heure_debut', e.target.value)} disabled={dispo?.actif === false} className="border rounded px-2 py-1 disabled:opacity-50" /></td>
                    <td className="px-4 py-3"><input type="time" value={dispo?.heure_fin || '18:00'} onChange={(e) => updateDispo(idx, 'heure_fin', e.target.value)} disabled={dispo?.actif === false} className="border rounded px-2 py-1 disabled:opacity-50" /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}