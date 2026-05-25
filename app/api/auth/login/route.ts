import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validation des champs
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe dans PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        password: true,
        nomSalon: true,
        slug: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    // Connexion réussie
    return NextResponse.json({ 
      message: "Connexion réussie", 
      user: { 
        id: user.id, 
        email: user.email, 
        nom_salon: user.nomSalon,
        slug: user.slug
      } 
    })
    
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}