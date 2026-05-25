import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { uploadImage } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const serviceId = formData.get('serviceId') as string

    if (!serviceId) {
      return NextResponse.json({ error: 'serviceId requis' }, { status: 400 })
    }

    // Vérifier que le service appartient à l'utilisateur
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId: user.id
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    // Limiter à 10 photos maximum
    if (files.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 photos par service' }, { status: 400 })
    }

    // Récupérer l'ordre actuel des photos
    const existingPhotos = await prisma.photoService.findMany({
      where: { serviceId },
      orderBy: { ordre: 'asc' }
    })

    let currentOrder = existingPhotos.length

    const uploadedPhotos = []

    for (const file of files) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Le fichier doit être une image' }, { status: 400 })
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'L\'image ne doit pas dépasser 5MB' }, { status: 400 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const result: any = await uploadImage(buffer, `glowbook/services/${serviceId}`)

      const photo = await prisma.photoService.create({
        data: {
          serviceId: serviceId,
          url: result.secure_url,
          publicId: result.public_id,
          ordre: currentOrder++,
          createdAt: new Date()
        }
      })

      uploadedPhotos.push(photo)
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedPhotos.length} photo(s) uploadée(s) avec succès`,
      photos: uploadedPhotos
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur upload photos:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer une photo
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const photoId = searchParams.get('id')

    if (!photoId) {
      return NextResponse.json({ error: 'ID de photo requis' }, { status: 400 })
    }

    // Récupérer la photo avec le service associé
    const photo = await prisma.photoService.findFirst({
      where: {
        id: photoId,
        service: {
          userId: user.id
        }
      }
    })

    if (!photo) {
      return NextResponse.json({ error: 'Photo non trouvée' }, { status: 404 })
    }

    // Supprimer de Cloudinary
    const { deleteImage } = await import('@/lib/cloudinary')
    if (photo.publicId) {
      await deleteImage(photo.publicId)
    }

    // Supprimer de la base de données
    await prisma.photoService.delete({
      where: { id: photoId }
    })

    // Réordonner les photos restantes
    const remainingPhotos = await prisma.photoService.findMany({
      where: { serviceId: photo.serviceId },
      orderBy: { ordre: 'asc' }
    })

    for (let i = 0; i < remainingPhotos.length; i++) {
      await prisma.photoService.update({
        where: { id: remainingPhotos[i].id },
        data: { ordre: i }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Photo supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression photo:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET - Récupérer les photos d'un service
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')

    if (!serviceId) {
      return NextResponse.json({ error: 'serviceId requis' }, { status: 400 })
    }

    // Vérifier que le service appartient à l'utilisateur
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        userId: user.id
      }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service non trouvé' }, { status: 404 })
    }

    const photos = await prisma.photoService.findMany({
      where: { serviceId },
      orderBy: { ordre: 'asc' }
    })

    return NextResponse.json(photos)

  } catch (error) {
    console.error('Erreur récupération photos:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}