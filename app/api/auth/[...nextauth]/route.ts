import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        nom_salon: { label: "Nom du salon", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        // Connexion - Vérifier dans PostgreSQL
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // Connexion - utilisateur existant
        if (user) {
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (isValid) {
            return { 
              id: user.id, 
              email: user.email, 
              name: user.nomSalon,
              nom_salon: user.nomSalon
            }
          }
          throw new Error("Mot de passe incorrect")
        }
        
        // Inscription - nouveau compte
        if (!credentials.nom_salon) {
          throw new Error("Nom du salon requis pour l'inscription")
        }
        
        // Créer un nouvel utilisateur dans PostgreSQL
        const hashedPassword = await bcrypt.hash(credentials.password, 10)
        
        // Générer un slug à partir du nom du salon
        const slug = credentials.nom_salon
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
        
        const newUser = await prisma.user.create({
          data: {
            email: credentials.email,
            password: hashedPassword,
            nomSalon: credentials.nom_salon,
            slug: slug,
            themePrimary: "#C2185B",
            themeBackground: "#FDFBF9",
            notificationEmail: true,
            notificationSms: false,
            acompteType: "percentage",
            acompteValeur: 30,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        return { 
          id: newUser.id, 
          email: newUser.email, 
          name: newUser.nomSalon,
          nom_salon: newUser.nomSalon
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.nom_salon = user.nom_salon
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.nom_salon = token.nom_salon as string
        session.user.email = token.email as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "glowbook-secret-key-2025",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }