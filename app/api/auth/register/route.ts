import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, nom_salon } = body

    // Validations
    const errors: string[] = []
    
    if (!email || typeof email !== 'string') {
      errors.push("Email requis")
    } else if (!email.includes('@')) {
      errors.push("Email invalide")
    }
    
    if (!password || typeof password !== 'string') {
      errors.push("Mot de passe requis")
    } else if (password.length < 6) {
      errors.push("Le mot de passe doit contenir au moins 6 caractères")
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }
    
    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10)
    const salonName = nom_salon?.trim() || "Mon Salon"
    
    const slug = salonName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-" + Date.now().toString().slice(-4)
    
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        nomSalon: salonName,
        slug: slug,
        themePrimary: "#C2185B",
        themeBackground: "#FDFBF9"
      },
      select: {
        id: true,
        email: true,
        nomSalon: true,
        slug: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({ 
      success: true,
      message: "Compte créé avec succès", 
      user: newUser
    })
    
  } catch (error) {
    console.error("Erreur inscription:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}