'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ServiceCard({ service }: { service: any }) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="relative h-64 overflow-hidden">
        <img src={service.photos?.[0]?.url || '/images/placeholder.jpg'} alt={service.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-3 left-3"><span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#c2185b]">{service.categorie}</span></div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-[#1c1b1b]">{service.nom}</h3>
          <span className="text-[#c2185b] font-bold text-lg">{service.prix_base}€</span>
        </div>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2">{service.description}</p>
        <Link href={`/service/${service.id}`} className="w-full block text-center py-3 rounded-full bg-[#c2185b] text-white font-semibold hover:bg-[#9b0044] transition-all">Réserver</Link>
      </div>
    </motion.div>
  )
}