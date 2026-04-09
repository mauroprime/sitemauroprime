import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Site Mauro',
  description: 'Painel administrativo',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar do Admin */}
      <aside className="w-64 bg-zinc-950 text-white flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="font-bold text-lg tracking-wider uppercase">Painel Mauro</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-medium">
          <a href="/admin" className="flex items-center px-4 py-2 bg-white/10 rounded-md text-white">
            Dashboard
          </a>
          <a href="/admin/projetos" className="flex items-center px-4 py-2 hover:bg-white/5 rounded-md text-zinc-300 hover:text-white transition-colors">
            Projetos
          </a>
          <a href="/admin/leads" className="flex items-center px-4 py-2 hover:bg-white/5 rounded-md text-zinc-300 hover:text-white transition-colors">
            Leads
          </a>
          <a href="/admin/depoimentos" className="flex items-center px-4 py-2 hover:bg-white/5 rounded-md text-zinc-300 hover:text-white transition-colors">
            Depoimentos
          </a>
          <a href="/admin/promocoes" className="flex items-center px-4 py-2 hover:bg-white/5 rounded-md text-zinc-300 hover:text-white transition-colors">
            Promoções
          </a>
          <a href="/admin/configuracoes" className="flex items-center px-4 py-2 hover:bg-white/5 rounded-md text-zinc-300 hover:text-white transition-colors">
            Configurações
          </a>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm z-10 justify-between">
          <h1 className="text-xl font-semibold text-zinc-800">Administração</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
