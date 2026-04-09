import type { Metadata } from 'next'
import { getSiteSettings } from '@/services/public'

export const metadata: Metadata = {
  title: 'Site Mauro - Construtora Prime',
  description: 'Projetos e oportunidades exclusivas',
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  const brandName = settings?.brand_name || 'Construtora Prime'
  const whatsapp = settings?.whatsapp_number || '(11) 99999-9999'
  const email = settings?.contact_email || 'contato@construtoraprime.com.br'

  return (
    <div className="bg-[#000] min-h-screen">
      <div className="max-w-[1920px] mx-auto w-full relative bg-brand-black min-h-screen shadow-2xl overflow-hidden">
        <header className="fixed top-0 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[1920px] backdrop-blur-md border-b border-white/5 bg-brand-black/95 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo Area */}
            <a href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center w-12 h-12 border border-brand-gold rounded-sm transition-transform group-hover:scale-105">
                <span className="font-serif text-2xl text-brand-gold font-medium tracking-tight">MC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-white tracking-tight leading-none">MAURO CONSULTOR</span>
                <span className="text-[10px] text-brand-gold tracking-[0.2em] mt-1 font-bold uppercase transition-opacity group-hover:opacity-80">Estratégia e Projetos</span>
              </div>
            </a>
            
            {/* Nav Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/" className="text-white hover:text-brand-gold px-3 py-2 text-sm font-semibold tracking-wide transition-colors uppercase">Início</a>
                <a href="/projetos" className="text-zinc-400 hover:text-brand-gold px-3 py-2 text-sm font-semibold tracking-wide transition-colors uppercase">Projetos</a>
                <a href="/#depoimentos" className="text-zinc-400 hover:text-brand-gold px-3 py-2 text-sm font-semibold tracking-wide transition-colors uppercase">Depoimentos</a>
                <a href="/#sobre" className="text-zinc-400 hover:text-brand-gold px-3 py-2 text-sm font-semibold tracking-wide transition-colors uppercase">Sobre</a>
                <a href="/#contato" className="text-zinc-400 hover:text-brand-gold px-3 py-2 text-sm font-semibold tracking-wide transition-colors uppercase">Contato</a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a 
                href="/#contato"
                className="border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black px-6 py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest transition-all duration-300 ease-in-out"
              >
                Análise de Projeto
              </a>
            </div>

            {/* Mobile Menu Icon (Placeholder for functionality) */}
            <div className="md:hidden">
              <button className="text-brand-gold">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <footer className="w-full bg-zinc-950 text-zinc-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="font-bold text-2xl text-white mb-4 uppercase tracking-tighter">{brandName}</div>
            <p className="text-base leading-relaxed max-w-sm">Apresentamos os melhores projetos e oportunidades exclusivas. Consultoria focada em maximizar seu investimento conosco.</p>
            {settings?.address && (
              <p className="mt-4 text-sm text-zinc-500">{settings.address}</p>
            )}
            {settings?.business_hours && (
              <p className="text-sm text-zinc-500">{settings.business_hours}</p>
            )}
            <div className="flex gap-4 mt-6">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition">Instagram</a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition">Facebook</a>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Acesso Rápido</h4>
            <ul className="text-sm space-y-3">
              <li><a href="#projetos" className="hover:text-white transition-colors">Ver Projetos</a></li>
              <li><a href="#sobre" className="hover:text-white transition-colors">Sobre o Consultor</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contato Direto</h4>
            <ul className="text-sm space-y-3">
              <li className="flex items-center gap-2">WhatsApp: {whatsapp}</li>
              <li className="flex items-center gap-2">Email: {email}</li>
            </ul>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
