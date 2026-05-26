const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Services à créer dans la base de données
const services = [
  {
    nom: 'Knotless Braids',
    categorie: 'Tresses',
    dureeBase: 270,
    prixBase: 120,
    description: 'Tresses sans nœuds pour un fini naturel et une tension réduite sur le cuir chevelu.',
    inclus: ['Tresses sans nœuds', 'Finition naturelle', 'Protection optimale'],
    conseils: 'Idéal pour protéger vos cheveux naturels. À espacer de 4 à 6 semaines.',
    statut: 'active',
    populaire: true,
    nouveaute: false,
    ordre: 1
  },
  {
    nom: 'Box Braids Classiques',
    categorie: 'Tresses',
    dureeBase: 180,
    prixBase: 90,
    description: 'Le style iconique indémodable. Réalisé avec des sections précises.',
    inclus: ['Box braids classiques', 'Finitions soignées', 'Tête légère'],
    conseils: 'Parfait pour un look protecteur durable. Entretien facile.',
    statut: 'active',
    populaire: true,
    nouveaute: false,
    ordre: 2
  },
  {
    nom: 'Butterfly Locs',
    categorie: 'Locks',
    dureeBase: 300,
    prixBase: 150,
    description: 'Look bohème et texturé avec des boucles douces.',
    inclus: ['Locks papillons', 'Style bohème', 'Boucles naturelles'],
    conseils: 'Tendance et léger sur la tête. Parfait pour l\'été.',
    statut: 'active',
    populaire: true,
    nouveaute: true,
    ordre: 3
  },
  {
    nom: 'Cornrows Artistiques',
    categorie: 'Nattes',
    dureeBase: 90,
    prixBase: 60,
    description: 'Nattes collées avec motifs géométriques personnalisés.',
    inclus: ['Nattes au sol', 'Motifs personnalisés', 'Finition gel'],
    conseils: 'Parfait pour un look sportif ou élégant. Tenue 2 à 3 semaines.',
    statut: 'active',
    populaire: false,
    nouveaute: false,
    ordre: 4
  },
  {
    nom: 'Senegalese Twists',
    categorie: 'Twists',
    dureeBase: 240,
    prixBase: 110,
    description: 'Torsades délicates et légères, idéales pour un look bohème chic.',
    inclus: ['Torsades sénégalaises', 'Finition légère', 'Style protecteur'],
    conseils: 'Style protecteur très prisé. Léger et confortable.',
    statut: 'active',
    populaire: true,
    nouveaute: false,
    ordre: 5
  },
  {
    nom: 'Faux Locs',
    categorie: 'Locks',
    dureeBase: 360,
    prixBase: 130,
    description: 'Locks synthétiques légères, parfaites pour un style protecteur.',
    inclus: ['Faux locks', 'Style naturel', 'Légères'],
    conseils: 'Look rasta sans engagement. Dure 4 à 6 semaines.',
    statut: 'active',
    populaire: true,
    nouveaute: false,
    ordre: 6
  },
  {
    nom: 'Silk Press Deluxe',
    categorie: 'Soins',
    dureeBase: 120,
    prixBase: 65,
    description: 'Lissage thermique professionnel sans produits chimiques.',
    inclus: ['Shampoing', 'Soin réparateur', 'Lissage thermique', 'Brushing'],
    conseils: 'Cheveux lisses et brillants sans produits chimiques. Résultat 2 semaines.',
    statut: 'active',
    populaire: true,
    nouveaute: false,
    ordre: 7
  }
]

async function createServices() {
  console.log('=== CRÉATION DES SERVICES EN BASE DE DONNÉES ===\n')
  
  try {
    // Récupérer le premier utilisateur (coiffeuse)
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé.')
      console.log('💡 Créez d\'abord un compte coiffeuse :')
      console.log('   - Allez sur http://localhost:3000/register')
      console.log('   - Ou exécutez : node scripts/create-user.js')
      return
    }
    
    console.log(`✅ Utilisateur trouvé : ${user.email} (ID: ${user.id})\n`)
    
    let created = 0
    let skipped = 0
    
    for (const service of services) {
      // Vérifier si le service existe déjà pour cet utilisateur
      const existing = await prisma.service.findFirst({
        where: {
          userId: user.id,
          nom: service.nom
        }
      })
      
      if (existing) {
        console.log(`⚠️  Service "${service.nom}" existe déjà - ignoré`)
        skipped++
        continue
      }
      
      // CRÉER le service dans la base de données
      const newService = await prisma.service.create({
        data: {
          userId: user.id,
          nom: service.nom,
          categorie: service.categorie,
          dureeBase: service.dureeBase,
          prixBase: service.prixBase,
          description: service.description,
          inclus: service.inclus,
          conseils: service.conseils,
          statut: service.statut,
          populaire: service.populaire,
          nouveaute: service.nouveaute,
          ordre: service.ordre,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      console.log(`✅ SERVICE CRÉÉ : "${service.nom}" - ${service.prixBase}€ (${service.dureeBase}min)`)
      created++
    }
    
    console.log(`\n📊 RÉSUMÉ :`)
    console.log(`   ✅ ${created} services créés dans la base`)
    console.log(`   ⚠️  ${skipped} services déjà existants`)
    
    // Afficher tous les services maintenant en base
    const allServices = await prisma.service.findMany({
      where: { userId: user.id },
      orderBy: { ordre: 'asc' }
    })
    
    console.log(`\n📋 SERVICES PRÉSENTS DANS VOTRE BASE (${allServices.length}) :`)
    allServices.forEach(s => {
      console.log(`   ${s.ordre}. ${s.nom} - ${s.prixBase}€ (${s.dureeBase}min) - ${s.categorie}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la création :', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createServices()