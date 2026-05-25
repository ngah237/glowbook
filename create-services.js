const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Vos services EXACTS du catalogue - format CORRECT pour votre schéma
const services = [
  {
    nom: "Knotless Braids",
    categorie: "Tresses",
    dureeBase: 270,
    prixBase: 120,  // Sera converti en Decimal
    description: "Tresses sans nœuds pour un fini naturel et une tension réduite sur le cuir chevelu.",
    inclus: ["Tresses sans nœuds", "Finition naturelle", "Protection optimale"],
    conseils: "Idéal pour protéger vos cheveux naturels. À espacer de 4 à 6 semaines.",
    populaire: true,
    ordre: 1
  },
  {
    nom: "Box Braids Classiques",
    categorie: "Tresses",
    dureeBase: 180,
    prixBase: 90,
    description: "Le style iconique indémodable. Réalisé avec des sections précises.",
    inclus: ["Box braids classiques", "Finitions soignées", "Tête légère"],
    conseils: "Parfait pour un look protecteur durable. Entretien facile.",
    populaire: true,
    ordre: 2
  },
  {
    nom: "Butterfly Locs",
    categorie: "Locks",
    dureeBase: 300,
    prixBase: 150,
    description: "Look bohème et texturé avec des boucles douces.",
    inclus: ["Locks papillons", "Style bohème", "Boucles naturelles"],
    conseils: "Tendance et léger sur la tête. Parfait pour l'été.",
    populaire: true,
    ordre: 3
  },
  {
    nom: "Cornrows Artistiques",
    categorie: "Nattes",
    dureeBase: 90,
    prixBase: 60,
    description: "Nattes collées avec motifs géométriques personnalisés.",
    inclus: ["Nattes au sol", "Motifs personnalisés", "Finition gel"],
    conseils: "Parfait pour un look sportif ou élégant. Tenue 2 à 3 semaines.",
    populaire: false,
    ordre: 4
  },
  {
    nom: "Senegalese Twists",
    categorie: "Twists",
    dureeBase: 240,
    prixBase: 110,
    description: "Torsades délicates et légères, idéales pour un look bohème chic.",
    inclus: ["Torsades sénégalaises", "Finition légère", "Style protecteur"],
    conseils: "Style protecteur très prisé. Léger et confortable.",
    populaire: true,
    ordre: 5
  },
  {
    nom: "Faux Locs",
    categorie: "Locks",
    dureeBase: 360,
    prixBase: 130,
    description: "Locks synthétiques légères, parfaites pour un style protecteur.",
    inclus: ["Faux locks", "Style naturel", "Légères"],
    conseils: "Look rasta sans engagement. Dure 4 à 6 semaines.",
    populaire: true,
    ordre: 6
  },
  {
    nom: "Silk Press Deluxe",
    categorie: "Soins",
    dureeBase: 120,
    prixBase: 65,
    description: "Lissage thermique professionnel sans produits chimiques.",
    inclus: ["Shampoing", "Soin réparateur", "Lissage thermique", "Brushing"],
    conseils: "Cheveux lisses et brillants sans produits chimiques. Résultat 2 semaines.",
    populaire: true,
    ordre: 7
  }
]

async function addServices() {
  console.log("=== AJOUT DES SERVICES DU CATALOGUE ===\n")
  
  try {
    // Récupérer l'utilisateur
    const user = await prisma.user.findFirst()
    
    if (!user) {
      console.log("❌ Aucun utilisateur trouvé.")
      console.log("💡 Assurez-vous d'avoir un compte utilisateur dans la base")
      return
    }
    
    console.log(`✅ Utilisateur: ${user.email} (ID: ${user.id})\n`)
    
    let added = 0
    let skipped = 0
    
    for (const service of services) {
      // Vérifier si le service existe déjà
      const existing = await prisma.service.findFirst({
        where: {
          userId: user.id,
          nom: service.nom
        }
      })
      
      if (existing) {
        console.log(`⚠️  "${service.nom}" existe déjà - ignoré`)
        skipped++
        continue
      }
      
      // Créer le service avec le format correct
      await prisma.service.create({
        data: {
          userId: user.id,
          nom: service.nom,
          categorie: service.categorie,
          dureeBase: service.dureeBase,
          prixBase: service.prixBase,  // Prisma convertit automatiquement en Decimal
          description: service.description,
          inclus: service.inclus,      // Tableau de strings
          conseils: service.conseils,   // String simple
          statut: "active",            // "active" correspond à votre enum
          populaire: service.populaire,
          nouveaute: false,
          ordre: service.ordre,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      
      console.log(`✅ "${service.nom}" ajouté (${service.prixBase}€ - ${service.dureeBase}min)`)
      added++
    }
    
    console.log(`\n📊 RÉSUMÉ:`)
    console.log(`   ✅ ${added} services ajoutés`)
    console.log(`   ⚠️  ${skipped} services existants ignorés`)
    
    // Afficher tous les services
    const allServices = await prisma.service.findMany({
      where: { userId: user.id },
      orderBy: { ordre: 'asc' },
      select: {
        nom: true,
        prixBase: true,
        dureeBase: true,
        categorie: true,
        inclus: true,
        statut: true
      }
    })
    
    console.log(`\n📋 SERVICES DANS LA BASE (${allServices.length}):`)
    allServices.forEach(s => {
      console.log(`   • ${s.nom} - ${s.prixBase}€ (${s.dureeBase}min) - ${s.categorie}`)
      if (s.inclus && s.inclus.length > 0) {
        console.log(`     Inclus: ${s.inclus.join(', ')}`)
      }
    })
    
  } catch (error) {
    console.error("❌ Erreur:", error.message)
    console.error("📝 Détail:", error)
  } finally {
    await prisma.$disconnect()
  }
}

addServices()