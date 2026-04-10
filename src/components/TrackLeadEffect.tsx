'use client'

import { useEffect } from 'react'
import { firePixelEvent } from './FBPixel'

type Props = {
  project?: {
    id: string;
    title: string;
    category: string | null;
    price: number | null;
  } | null
}

/**
 * Componente que dispara o evento de 'Lead' quando montado.
 * Ideal para ser colocado na página de 'Obrigado'.
 */
export function TrackLeadEffect({ project }: Props) {
  useEffect(() => {
    // Dispara o evento de Lead padrão
    const leadData = project ? {
      content_name: project.title,
      content_category: project.category || 'Geral',
      content_ids: [project.id],
      value: project.price || 0,
      currency: 'BRL'
    } : undefined

    firePixelEvent('Lead', leadData)
    
    // Log para depuração em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('FBPixel: Evento [Lead] disparado', leadData)
    }
  }, [project])

  return null
}
