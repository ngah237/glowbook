'use client'

const testimonials = [
  { name: 'Sophie Martin', service: 'Knotless Braids', comment: 'Un travail magnifique ! Les tresses sont parfaites.', rating: 5, image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Camille Dubois', service: 'Butterfly Locs', comment: 'J\'adore mon nouveau look ! La coiffeuse est très professionnelle.', rating: 5, image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'Émilie Laurent', service: 'Box Braids', comment: 'Très bon accueil, prestation de qualité. Je recommande !', rating: 5, image: 'https://randomuser.me/api/portraits/women/3.jpg' },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-pink-50/30">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-sm text-[#c2185b] font-semibold uppercase tracking-wider">Avis clients</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1c1b1b] mt-2">Ce qu'elles disent</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <img src={t.image} className="w-12 h-12 rounded-full object-cover" alt={t.name} />
                <div className="text-left">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-stone-400">{t.service}</p>
                </div>
              </div>
              <div className="flex text-amber-400 mb-3">{'★'.repeat(t.rating)}</div>
              <p className="text-stone-600 italic">"{t.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}