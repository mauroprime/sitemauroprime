'use client'

import { useEffect } from 'react'
import { firePixelEvent } from './FBPixel'

type Props = {
  project?: {
    id: string;
    title: string;
    category: string | null;
    price: number | null;
  } | null;
  eventId?: string;
  email?: string;
  name?: string;
  phone?: string;
  intent?: string;
  project_type?: string;
  investment?: string;
  timeframe?: string;
}

/**
 * Componente que dispara o evento de 'Lead' quando montado.
 * Ideal para ser colocado na página de 'Obrigado'.
 */
export function TrackLeadEffect({ project, eventId, email, name, phone, intent, project_type, investment, timeframe }: Props) {
  useEffect(() => {
    // Dispara o evento de Lead com todos os dados do lead
    const leadData: Record<string, any> = {}

    if (project) {
      leadData.content_name = project.title
      leadData.content_category = project.category || 'Geral'
      leadData.content_ids = [project.id]
      leadData.value = project.price || 0
      leadData.currency = 'BRL'
    }

    if (email) leadData.email = email
    if (name) leadData.name = name
    if (phone) leadData.phone = phone
    if (intent) leadData.intent = intent
    if (project_type) leadData.project_type = project_type
    if (investment) leadData.investment = investment
    if (timeframe) leadData.timeframe = timeframe

    firePixelEvent('Lead', leadData, eventId)

    if (process.env.NODE_ENV === 'development') {
      console.log('FBPixel: Evento [Lead] disparado', leadData)
    }
  }, [project, email, name, phone, intent, project_type, investment, timeframe])

  return null
}
