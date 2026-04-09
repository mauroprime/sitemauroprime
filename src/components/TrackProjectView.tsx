'use client'

import { useEffect } from 'react'
import { firePixelEvent } from './FBPixel'

type Props = {
  project: {
    id: string;
    title: string;
    category: string | null;
    price: number | null;
  }
}

export function TrackProjectView({ project }: Props) {
  useEffect(() => {
    firePixelEvent('ViewContent', {
      content_name: project.title,
      content_category: project.category || 'Geral',
      content_ids: [project.id],
      content_type: 'product',
      value: project.price || 0,
      currency: 'BRL'
    })
  }, [project.id, project.title, project.category, project.price])

  return null
}
