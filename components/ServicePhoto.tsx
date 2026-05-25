'use client';

import { CldImage } from 'next-cloudinary'

interface ServicePhotoProps {
  publicId: string;
  nom: string;
  width?: number;
  height?: number;
}

export function ServicePhoto({ publicId, nom, width = 400, height = 300 }: ServicePhotoProps) {
  return (
    <CldImage
      src={publicId}
      width={width}
      height={height}
      alt={nom}
      crop="fill"
      className="rounded-lg object-cover"
    />
  )
}