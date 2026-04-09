import { createClient } from '@/lib/supabase/server'
import { LeadRow } from '@/types/database.types'

export default async function AdminPage() {
  const supabase = await createClient()

  // Projetos ativos
  const { count: activeProjectsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Leads recentes (7 dias)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { count: recentLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString())

  // Depoimentos
  const { count: testimonialsCount } = await supabase
    .from('testimonials')
    .select('*', { count: 'exact', head: true })

  // 5 Leads mais recentes
  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5) as { data: LeadRow[] | null }

  return (
    <div className="max-w-5xl">
      <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-2">Projetos Ativos</span>
          <span className="text-3xl font-bold">{activeProjectsCount ?? 0}</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-2">Novos Leads (7 dias)</span>
          <span className="text-3xl font-bold text-primary">{recentLeadsCount ?? 0}</span>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-2">Depoimentos</span>
          <span className="text-3xl font-bold">{testimonialsCount ?? 0}</span>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">Leads Recentes</h3>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase rounded-md">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Contato</th>
                <th className="px-4 py-3 font-medium">Interesse/Origem</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentLeads?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Nenhum lead recebido ainda.</td>
                </tr>
              ) : recentLeads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="block truncate max-w-[200px]">{lead.email}</span>
                    {lead.phone && <span className="block whitespace-nowrap">{lead.phone}</span>}
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="block truncate">{lead.source || 'Formulário do Site'}</span>
                    {/* Aqui como não temos o title do related_project com Join dinâmico, exibimos a origem */}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(lead.created_at))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      lead.status === 'new' ? 'bg-amber-100 text-amber-800' :
                      lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-zinc-100 text-zinc-800'
                    }`}>
                      {lead.status === 'new' ? 'Novo' : 
                       lead.status === 'contacted' ? 'Em Contato' : 
                       lead.status === 'converted' ? 'Convertido' : 'Perdido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
