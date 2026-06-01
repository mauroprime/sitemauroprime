import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const intent = searchParams.get('intent')
  const project_type = searchParams.get('project_type')
  const utm_source = searchParams.get('utm_source')

  const supabase = await getAdminClient()

  let query = supabase
    .from('leads')
    .select(`
      *,
      projects (
        title
      )
    `)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (from) {
    query = query.gte('created_at', from)
  }

  if (to) {
    query = query.lte('created_at', to)
  }

  if (intent) {
    query = query.eq('intent', intent)
  }

  if (project_type) {
    query = query.eq('project_type', project_type)
  }

  if (utm_source) {
    query = query.ilike('utm_source', `%${utm_source}%`)
  }

  const { data } = await query
  const leads = (data || []) as any[]

  const headers = [
    'Nome',
    'Email',
    'Telefone',
    'Status',
    'Intenção',
    'Localização',
    'Tipo de Projeto',
    'Faixa de Investimento',
    'Prazo',
    'Possui Terreno',
    'Mensagem',
    'Projeto de Interesse',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'UTM Content',
    'UTM Term',
    'Fonte',
    'Data de Criação',
  ]

  const rows = leads.map((lead: any) => [
    escapeCSV(lead.name || ''),
    escapeCSV(lead.email || ''),
    escapeCSV(lead.phone || ''),
    escapeCSV(lead.status || ''),
    escapeCSV(lead.intent || ''),
    escapeCSV(lead.location || ''),
    escapeCSV(lead.project_type || ''),
    escapeCSV(lead.investment_range || ''),
    escapeCSV(lead.timeframe || ''),
    lead.has_land ? 'Sim' : 'Não',
    escapeCSV(lead.message || ''),
    escapeCSV(lead.projects?.title || ''),
    escapeCSV(lead.utm_source || ''),
    escapeCSV(lead.utm_medium || ''),
    escapeCSV(lead.utm_campaign || ''),
    escapeCSV(lead.utm_content || ''),
    escapeCSV(lead.utm_term || ''),
    escapeCSV(lead.source || ''),
    lead.created_at ? new Date(lead.created_at).toLocaleString('pt-BR') : '',
  ])

  let csv = '\uFEFF' // BOM for Excel compatibility with Portuguese accents
  csv += headers.join(';') + '\r\n'
  csv += rows.map((row: string[]) => row.join(';')).join('\r\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}

function escapeCSV(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
