import { createClient } from '@/lib/supabase/server'
import { LeadStatusSelect, DeleteLeadButton } from './lead-actions'
import { MapPin, Wallet, Home, Info, Clock, Download } from 'lucide-react'
import { ExportLeadsButton } from './export-button'

export const metadata = {
  title: 'Leads | Admin',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function LeadsAdminPage(props: PageProps) {
  const searchParams = await props.searchParams

  const status = searchParams.status || 'all'
  const from = searchParams.from || ''
  const to = searchParams.to || ''
  const intent = searchParams.intent || ''
  const project_type = searchParams.project_type || ''
  const utm_source = searchParams.utm_source || ''

  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select(`
      *,
      projects (
        title
      )
    `)
    .order('created_at', { ascending: false })

  if (status !== 'all') {
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
  const leads = data as any[]

  const csvParams = new URLSearchParams()
  if (status !== 'all') csvParams.set('status', status)
  if (from) csvParams.set('from', from)
  if (to) csvParams.set('to', to)
  if (intent) csvParams.set('intent', intent)
  if (project_type) csvParams.set('project_type', project_type)
  if (utm_source) csvParams.set('utm_source', utm_source)
  const csvHref = `/admin/leads/export?${csvParams.toString()}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Gerencie os contatos recebidos através do site.</p>
        </div>
      </div>

      <form
        method="GET"
        className="border rounded-lg shadow-sm bg-white p-4 flex flex-wrap items-end gap-3"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</label>
          <select
            name="status"
            defaultValue={status}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-36 p-2"
          >
            <option value="all">Todos</option>
            <option value="new">Novo</option>
            <option value="contacted">Contatado</option>
            <option value="converted">Convertido</option>
            <option value="lost">Perdido</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">De</label>
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-40 p-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Até</label>
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-40 p-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Intenção</label>
          <select
            name="intent"
            defaultValue={intent}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-32 p-2"
          >
            <option value="">Todas</option>
            <option value="Construir">Construir</option>
            <option value="Comprar">Comprar</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Tipo do Projeto</label>
          <select
            name="project_type"
            defaultValue={project_type}
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-32 p-2"
          >
            <option value="">Todos</option>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">UTM Source</label>
          <input
            type="text"
            name="utm_source"
            defaultValue={utm_source}
            placeholder="Qualquer..."
            className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-32 p-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Filtrar
          </button>

          {(status !== 'all' || from || to || intent || project_type || utm_source) && (
            <a
              href="/admin/leads"
              className="text-xs text-zinc-500 hover:text-zinc-900 underline transition-colors"
            >
              Limpar
            </a>
          )}
        </div>

        <div className="ml-auto">
          <ExportLeadsButton href={csvHref} />
        </div>
      </form>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-600">Contato / Lead</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Detalhes da Busca (Hero)</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Marketing (UTM)</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Mensagem / Obs</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Data</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y relative">
            {leads && leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <div className="font-bold text-zinc-900">{lead.name}</div>
                    <div className="text-zinc-500 text-xs">{lead.email}</div>
                    <div className="text-brand-gold font-bold text-xs mt-1">{lead.phone || 'Sem telefone'}</div>
                    <div className="mt-2">
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${lead.has_land ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>
                         {lead.has_land ? 'Possui Terreno' : 'Não possui terreno'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-2">
                      {lead.intent && (
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${lead.intent === 'Construir' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                             {lead.intent}
                           </span>
                        </div>
                      )}
                      {lead.location && (
                        <div className="flex items-center gap-2 text-zinc-700">
                           <MapPin size={14} className="text-brand-gold" />
                           <span className="text-xs font-medium">{lead.location}</span>
                        </div>
                      )}
                      {lead.project_type && (
                        <div className="flex items-center gap-2 text-zinc-700">
                           <Home size={14} className="text-zinc-400" />
                           <span className="text-xs capitalize">{lead.project_type}</span>
                        </div>
                      )}
                      {lead.investment_range && (
                        <div className="flex items-center gap-2 text-zinc-700">
                           <Wallet size={14} className="text-green-600" />
                           <span className="text-xs font-bold text-green-700">{lead.investment_range}</span>
                        </div>
                      )}
                      {lead.timeframe && (
                        <div className="flex items-center gap-2 text-zinc-700">
                           <Clock size={14} className="text-blue-500" />
                           <span className="text-xs font-medium text-blue-700">{lead.timeframe}</span>
                        </div>
                      )}
                      {lead.projects && (
                        <div className="flex items-center gap-2 text-zinc-500 bg-zinc-50 p-2 rounded border border-zinc-100 mt-2">
                          <Info size={14} />
                          <span className="text-[10px] font-bold">Projeto de Interesse: {lead.projects.title}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="space-y-1">
                      {lead.utm_source ? (
                        <>
                          <div className="text-xs"><span className="font-bold text-zinc-400">Src:</span> {lead.utm_source}</div>
                          {lead.utm_medium && <div className="text-[10px]"><span className="font-bold text-zinc-400">Med:</span> {lead.utm_medium}</div>}
                          {lead.utm_campaign && <div className="text-[10px]"><span className="font-bold text-zinc-400">Cam:</span> {lead.utm_campaign}</div>}
                        </>
                      ) : (
                        <span className="text-zinc-300 text-xs italic">Orgânico / Direto</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <p className="text-zinc-600 line-clamp-4 overflow-hidden text-ellipsis max-w-xs text-xs italic" title={lead.message || ''}>
                      {lead.message || 'Sem mensagem adicional'}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-top w-40">
                    <LeadStatusSelect id={lead.id} currentStatus={lead.status || 'new'} />
                  </td>
                  <td className="px-6 py-4 align-top whitespace-nowrap">
                    <div className="text-zinc-900 font-medium">
                      {new Date(lead.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </div>
                    <div className="text-zinc-400 text-[10px]">
                      {new Date(lead.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right align-top">
                     <DeleteLeadButton id={lead.id} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum lead encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
