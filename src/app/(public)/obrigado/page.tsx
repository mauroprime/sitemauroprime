import React, { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowLeft, Home, Building2, UserCheck } from 'lucide-react'
import { getProjectBySlug, getSiteSettings } from '@/services/public'
import { TrackLeadEffect } from '@/components/TrackLeadEffect'
import { TrackEventButton } from '@/components/TrackEventButton'

export const metadata = {
  title: 'Obrigado! | Construtora Prime',
  description: 'Recebemos seus dados. O Mauro Consultor entrará em contato em breve.',
}

function ObrigadoContent({ projetoSlug }: { projetoSlug?: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>}>
      <ObrigadoData projetoSlug={projetoSlug} />
    </Suspense>
  )
}

async function ObrigadoData({ projetoSlug }: { projetoSlug?: string }) {
  const project = projetoSlug ? await getProjectBySlug(projetoSlug) : null
  const settings = await getSiteSettings()

  const whatsappNumber = settings?.whatsapp_number?.replace(/\D/g, '') || '5541999999999'
  const message = project 
    ? `Olá Mauro! Acabei de preencher meus dados no site para o projeto *${project.title}* e gostaria de agilizar meu atendimento.`
    : 'Olá Mauro! Acabei de preencher meus dados no site e gostaria de saber mais sobre os projetos.'
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="min-h-screen bg-brand-dark relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Rastreamento de Lead no Cliente */}
      <TrackLeadEffect project={project ? {
        id: project.id,
        title: project.title,
        category: project.category,
        price: Number(project.promotional_price || project.price)
      } : null} />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-2xl relative z-10 text-center space-y-8">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-gold/10 rounded-full mb-4 border border-brand-gold/20">
          <CheckCircle2 className="w-12 h-12 text-brand-gold animate-in zoom-in duration-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight">
            Quase Tudo <span className="text-brand-gold">Pronto!</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Seus dados foram salvos com sucesso. O Mauro Consultor recebeu sua solicitação e já está analisando seu perfil.
          </p>
        </div>

        {/* Informação do Projeto se existir */}
        {project && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 text-left max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 relative rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img 
                src={project.cover_image_url || '/placeholder-project.jpg'} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Interesse Registrado</span>
              <h3 className="text-xl font-serif text-white">{project.title}</h3>
              <p className="text-sm text-zinc-500">{project.category}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 max-w-md mx-auto pt-8">
          <TrackEventButton 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            eventName="Contact"
            eventData={{
              content_name: project ? project.title : 'Sucesso Geral',
              method: 'WhatsApp'
            }}
            className="group flex items-center justify-center gap-3 bg-brand-gold hover:bg-brand-goldlight text-black py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_15px_30px_rgba(212,175,55,0.2)] hover:-translate-y-1"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Acelerar via WhatsApp
          </TrackEventButton>

          <Link 
            href="/"
            className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors py-2 text-sm uppercase tracking-widest font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </div>

        {/* Prova Social / Trust */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-16 border-t border-white/5 mt-16 max-w-xl mx-auto opacity-50">
          <div className="flex flex-col items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-gold" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Atendimento VIP</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-gold" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Projetos Exclusivos</span>
          </div>
          <div className="flex flex-col items-center gap-2 hidden md:flex">
            <Home className="w-5 h-5 text-brand-gold" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Realize seu Sonho</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function Page({ searchParams }: { searchParams: { projeto?: string } }) {
  const { projeto } = await searchParams
  return <ObrigadoContent projetoSlug={projeto} />
}
