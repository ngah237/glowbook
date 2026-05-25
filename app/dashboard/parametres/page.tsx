'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import HeaderMobile from '@/components/HeaderMobile'
import toast from 'react-hot-toast'

export default function ParametresPage() {
  const [formData, setFormData] = useState({
    salonName: 'Salon Élégance',
    email: 'contact@glowbook.fr',
    phone: '06 12 34 56 78',
    address: '12 rue de la Paix, 75009 Paris',
    description: 'Salon de coiffure spécialisé dans les coiffures afro',
    logo: null as string | null,
    banner: null as string | null,
    themeColor: '#c2185b',
    acompteType: 'pourcentage' as 'fixe' | 'pourcentage',
    acompteValeur: 30,
    requireAcompte: true,
    cancelDelay: true,
    emailNotifications: true,
    smsNotifications: false
  })

  const [horaires, setHoraires] = useState([
    { jour: 'Lundi', debut: '09:00', fin: '18:00', actif: true },
    { jour: 'Mardi', debut: '09:00', fin: '18:00', actif: true },
    { jour: 'Mercredi', debut: '09:00', fin: '18:00', actif: true },
    { jour: 'Jeudi', debut: '09:00', fin: '18:00', actif: true },
    { jour: 'Vendredi', debut: '09:00', fin: '18:00', actif: true },
    { jour: 'Samedi', debut: '10:00', fin: '16:00', actif: true },
    { jour: 'Dimanche', debut: '00:00', fin: '00:00', actif: false },
  ])

  const handleSave = () => { toast.success('Paramètres enregistrés') }

  const toggleHoraire = (index: number) => { setHoraires(horaires.map((h, i) => i === index ? { ...h, actif: !h.actif } : h)) }
  const updateHoraire = (index: number, field: string, value: string) => { setHoraires(horaires.map((h, i) => i === index ? { ...h, [field]: value } : h)) }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { const url = URL.createObjectURL(file); setFormData({...formData, logo: url}); toast.success('Logo uploadé') }
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { const url = URL.createObjectURL(file); setFormData({...formData, banner: url}); toast.success('Bannière uploadée') }
  }

  return (
    <>
      <Sidebar />
      <HeaderMobile />
      <div className="lg:ml-72 min-h-screen bg-[#FDFBF9]">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1c1b1b]">Paramètres</h1>
            <p className="text-stone-500 text-sm mt-1">Personnalisez votre espace professionnel</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-8">
            
            {/* 1. Personnalisation du catalogue */}
            <div>
              <h2 className="text-lg font-semibold text-[#1c1b1b] border-b border-stone-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">palette</span>
                Personnalisation du catalogue
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Logo upload */}
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Logo du salon</label>
                  <div className="mt-1 flex items-center gap-4">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border rounded-lg p-1" />
                    ) : (
                      <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                    <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg text-sm transition">
                      Changer le logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                {/* Bannière upload */}
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Bannière de couverture</label>
                  <div className="mt-1">
                    {formData.banner ? (
                      <img src={formData.banner} alt="Bannière" className="w-full h-32 object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-32 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                        <span className="material-symbols-outlined">landscape</span>
                      </div>
                    )}
                    <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg text-sm transition inline-block mt-2">
                      Changer la bannière
                      <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                {/* Thème de couleur */}
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Thème de couleur</label>
                  <div className="flex gap-3 mt-1">
                    {['#c2185b', '#9b0044', '#e91e63', '#7b1fa2', '#00695c'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({...formData, themeColor: color})}
                        className={`w-8 h-8 rounded-full transition-all ${formData.themeColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                {/* Description du salon */}
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Description du salon</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Présentez votre salon..."
                  />
                </div>
              </div>
            </div>

            {/* 2. Informations du salon */}
            <div>
              <h2 className="text-lg font-semibold text-[#1c1b1b] border-b border-stone-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">business</span>
                Informations du salon
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><label className="block text-xs text-stone-500 mb-1">Nom du salon</label><input type="text" value={formData.salonName} onChange={(e) => setFormData({...formData, salonName: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
                <div><label className="block text-xs text-stone-500 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
                <div><label className="block text-xs text-stone-500 mb-1">Téléphone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
                <div><label className="block text-xs text-stone-500 mb-1">Adresse</label><input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" /></div>
              </div>
            </div>

            {/* 3. Horaires d'ouverture */}
            <div>
              <h2 className="text-lg font-semibold text-[#1c1b1b] border-b border-stone-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">schedule</span>
                Horaires d'ouverture
              </h2>
              <div className="space-y-3 mt-4">
                {horaires.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-3 flex-wrap">
                    <span className="w-24 text-sm text-stone-600 font-medium">{h.jour}</span>
                    <input type="time" value={h.debut} onChange={(e) => updateHoraire(idx, 'debut', e.target.value)} disabled={!h.actif} className="px-3 py-1.5 border border-stone-200 rounded-lg w-28 disabled:opacity-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <span className="text-stone-400">-</span>
                    <input type="time" value={h.fin} onChange={(e) => updateHoraire(idx, 'fin', e.target.value)} disabled={!h.actif} className="px-3 py-1.5 border border-stone-200 rounded-lg w-28 disabled:opacity-50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    <label className="flex items-center gap-2 ml-2 cursor-pointer">
                      <input type="checkbox" checked={h.actif} onChange={() => toggleHoraire(idx)} className="rounded text-primary focus:ring-primary/20" />
                      <span className="text-sm text-stone-600">Ouvert</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Paramètres de paiement */}
            <div>
              <h2 className="text-lg font-semibold text-[#1c1b1b] border-b border-stone-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Paramètres de paiement
              </h2>
              <div className="space-y-4 mt-4">
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="acompteType" checked={formData.acompteType === 'fixe'} onChange={() => setFormData({...formData, acompteType: 'fixe'})} className="text-primary" />
                    <span className="text-sm">Montant fixe</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="acompteType" checked={formData.acompteType === 'pourcentage'} onChange={() => setFormData({...formData, acompteType: 'pourcentage'})} className="text-primary" />
                    <span className="text-sm">Pourcentage du prix</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">
                    {formData.acompteType === 'fixe' ? 'Acompte (€)' : 'Acompte (%)'}
                  </label>
                  <input type="number" value={formData.acompteValeur} onChange={(e) => setFormData({...formData, acompteValeur: parseInt(e.target.value) || 0})} className="w-32 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.requireAcompte} onChange={(e) => setFormData({...formData, requireAcompte: e.target.checked})} className="rounded text-primary focus:ring-primary/20" />
                  <span className="text-sm text-stone-600">Exiger un acompte à la réservation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.cancelDelay} onChange={(e) => setFormData({...formData, cancelDelay: e.target.checked})} className="rounded text-primary focus:ring-primary/20" />
                  <span className="text-sm text-stone-600">Autoriser les annulations jusqu'à 24h avant</span>
                </label>
              </div>
            </div>

            {/* 5. Notifications */}
            <div>
              <h2 className="text-lg font-semibold text-[#1c1b1b] border-b border-stone-100 pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">notifications</span>
                Notifications
              </h2>
              <div className="space-y-3 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.emailNotifications} onChange={(e) => setFormData({...formData, emailNotifications: e.target.checked})} className="rounded text-primary focus:ring-primary/20" />
                  <span className="text-sm text-stone-600">Recevoir les notifications par email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.smsNotifications} onChange={(e) => setFormData({...formData, smsNotifications: e.target.checked})} className="rounded text-primary focus:ring-primary/20" />
                  <span className="text-sm text-stone-600">Recevoir les notifications par SMS</span>
                </label>
                <p className="text-xs text-stone-400 italic">Les clientes recevront automatiquement une confirmation de rendez-vous par email.</p>
              </div>
            </div>

            {/* Bouton d'enregistrement */}
            <div className="pt-4 border-t border-stone-100">
              <button onClick={handleSave} className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary-dark transition shadow-md flex items-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-sm">save</span>
                Enregistrer toutes les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}