'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { Database } from '../types/database.types'
import { revalidatePath } from 'next/cache'
import { sendFBCapiEvent, prepareUserData } from '../lib/facebook-capi'

/**
 * Função auxiliar para criar um cliente Supabase com a chave de serviço (Service Role),
 * contornando o RLS para operações administrativas.
 */
async function getAdminClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

export async function submitLead(formData: FormData) {
  const name = formData.get('name')?.toString()
  const email = formData.get('email')?.toString() || 'não-informado@mauro.com'
  const phone = formData.get('phone')?.toString() || null
  const message = formData.get('message')?.toString() || null
  const related_project_id = formData.get('related_project_id')?.toString() || null

  // Novos campos da busca do Hero
  const intent = formData.get('intent')?.toString() || null
  const location = formData.get('location')?.toString() || null
  const project_type = formData.get('project_type')?.toString() || null
  const investment_range = formData.get('investment_range')?.toString() || null
  const timeframe = formData.get('timeframe')?.toString() || null
  const has_land = formData.get('has_land') === 'on' || formData.get('has_land') === 'true' || formData.get('has_land') === '1'

  // Parâmetros UTM para rastreamento de marketing
  const utm_source = formData.get('utm_source')?.toString() || null
  const utm_medium = formData.get('utm_medium')?.toString() || null
  const utm_campaign = formData.get('utm_campaign')?.toString() || null
  const utm_content = formData.get('utm_content')?.toString() || null
  const utm_term = formData.get('utm_term')?.toString() || null

  if (!name) {
    return { success: false, error: 'O nome é obrigatório.' }
  }

  const supabase = await getAdminClient()

  const payload: Database['public']['Tables']['leads']['Insert'] = {
    name,
    email,
    phone,
    message,
    related_project_id,
    intent,
    location,
    project_type,
    investment_range,
    timeframe,
    has_land,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    source: intent ? `Busca Hero (${intent})` : 'Formulário do Site',
    status: 'new'
  }

  const { data, error } = await (supabase.from('leads') as any).insert(payload).select().single()

  if (error) {
    console.error('Lead submit error:', error)
    return { success: false, error: 'Erro ao enviar contato. Tente novamente.' }
  }

  // DISPARO DA API DE CONVERSÕES (CAPI)
  try {
    const head = await headers()
    const userAgent = head.get('user-agent') || ''
    const clientIp = head.get('x-forwarded-for')?.split(',')[0] || ''
    const userData = await prepareUserData(email, phone || '')

    await sendFBCapiEvent({
      event_name: 'Lead',
      event_source_url: head.get('referer') || '',
      user_data: {
        ...userData,
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      },
      custom_data: {
        content_name: intent ? `Busca: ${intent}` : 'Lead de Contato',
        content_category: project_type || 'Imóveis',
        timeframe: timeframe || 'não informado'
      }
    })
  } catch (capiError) {
    console.error('Falha ao disparar CAPI no servidor:', capiError)
    // Não paramos o fluxo caso o rastreio falhe, pois o lead já foi salvo.
  }

  return { success: true, leadId: data?.id }
}

export async function deleteLead(id: string) {
  const supabase = await getAdminClient()

  const { error } = await (supabase.from('leads') as any).delete().eq('id', id)

  if (error) {
    console.error('Error deleting lead:', error)
    throw new Error('Erro ao excluir lead')
  }

  revalidatePath('/admin/leads')
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await getAdminClient()

  const { error } = await (supabase.from('leads') as any)
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating lead status:', error)
    throw new Error('Erro ao atualizar status do lead')
  }

  revalidatePath('/admin/leads')
}
