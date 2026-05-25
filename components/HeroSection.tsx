'use client'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1595475207225-428b62bda831?w=1600" className="w-full h-full object-cover" alt="Coiffure afro" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative text-center px-4 max-w-3xl z-10">
        <span className="inline-block px-4 py-1 bg-[#c2185b] text-white text-sm rounded-full mb-4">✨ Prenez rendez-vous en ligne</span>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-4">Élégance Afro</h1>
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">Spécialiste des tresses et coiffures afro. Sublimez votre beauté naturelle avec précision et soin.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button className="px-8 py-3 bg-[#c2185b] text-white rounded-full font-semibold hover:bg-[#9b0044] transition-all">Voir le catalogue</button>
          <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/20 transition-all">En savoir plus</button>
        </div>
      </motion.div>
    </section>
  )
}