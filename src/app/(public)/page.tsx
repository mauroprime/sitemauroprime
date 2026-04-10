import { getPublishedProjects, getSiteSettings, getTestimonials } from "@/services/public";
import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";
import { Bed, BedDouble, CheckCircle2, HelpCircle, Shield, User, ChevronRight, Hammer, Star } from "lucide-react";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { ProjectMovingWall } from "@/components/ProjectMovingWall";
import { HeroSearch } from "@/components/HeroSearch";
import { FAQ } from "@/components/FAQ";

export default async function Home() {
  const allProjects = await getPublishedProjects()
  const settings = await getSiteSettings()
  const testimonials = await getTestimonials()

  const featuredProjects = allProjects?.filter(p => p.is_featured) || []
  const generalProjects = allProjects?.filter(p => !p.is_featured) || []

  return (
    <div className="w-full flex-col flex items-center justify-center">
      {/* HERO SECTION PREMIUM */}
      <section className="w-full relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
            alt="Interior de luxo" 
            fill
            className="object-cover object-center brightness-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/70 to-brand-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col items-center text-center mt-12">
          <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-xs mb-6 bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20 backdrop-blur-sm">
            Orientação e Clareza Técnica
          </span>
          <h1 className="text-4xl md:text-7xl font-serif text-white font-medium tracking-tight mb-8 leading-[1.1]">
            O projeto certo para o seu momento, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-goldlight">
              com clareza e segurança absoluta.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 font-light max-w-3xl mb-14 leading-relaxed">
            Seja para a primeira casa, um upgrade de padrão ou investimento, eu ajudo você a entender o que faz sentido para o seu terreno, seu bolso e sua família.
          </p>

          {/* Advanced Search Bar / Selector */}
          <HeroSearch />
        </div>
      </section>

      <HorizontalProjects projects={generalProjects} />

      {/* SEÇÃO: PROJETOS ASSINADOS - MURAL ANIMADO (3ª SESSÃO) */}
      <ProjectMovingWall projects={featuredProjects} />

      {/* SEÇÃO: SERVIÇOS DE CONSULTORIA ELITE (4ª SESSÃO) */}
      <section id="services" className="py-24 bg-brand-black w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
                <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[13px] mb-4 block">Segurança em cada etapa</span>
                <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight mb-4">Serviços de Consultoria Elite</h2>
                <p className="text-base text-gray-400 font-light max-w-2xl mx-auto mb-6">Mais do que um projeto, entregamos a direção técnica que sua família precisa para construir sem surpresas.</p>
                <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Service 1 */}
                <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-gold/50 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:bg-brand-gold/10 transition-colors">
                        <Shield className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h3 className="text-[18px] text-white font-medium mb-3">Análise de Viabilidade</h3>
                    <p className="text-base text-gray-400 leading-relaxed">Avaliação técnica profunda do seu terreno e orçamento antes de colocar a primeira pedra.</p>
                </div>

                {/* Service 2 */}
                <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-gold/50 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:bg-brand-gold/10 transition-colors">
                        <Hammer className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h3 className="text-[18px] text-white font-medium mb-3">Planejamento de Obra</h3>
                    <p className="text-base text-gray-400 leading-relaxed">Cronogramas realistas e gestão de expectativas para eliminar o medo de custos inesperados.</p>
                </div>

                {/* Service 3 */}
                <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-gold/50 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:bg-brand-gold/10 transition-colors">
                        <User className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h3 className="text-[18px] text-white font-medium mb-3">Rede de Parceiros Elite</h3>
                    <p className="text-base text-gray-400 leading-relaxed">Conexão direta com os melhores arquitetos e construtores do país, selecionados por mim.</p>
                </div>

                {/* Service 4 */}
                <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-gold/50 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-brand-black rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:bg-brand-gold/10 transition-colors">
                        <ChevronRight className="w-8 h-8 text-brand-gold" />
                    </div>
                    <h3 className="text-[18px] text-white font-medium mb-3">Gestão de Padrão</h3>
                    <p className="text-base text-gray-400 leading-relaxed">Curadoria técnica de acabamentos que garantem a valorização do seu patrimônio final.</p>
                </div>
            </div>
        </div>
      </section>

      {/* SEÇÃO: DEPOIMENTOS - INFINITE SCROLL SLOW (5ª SESSÃO) */}
      <section className="py-24 bg-[#080808] border-y border-white/5 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
            <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight mb-4">Experiências que Inspiram Confiança</h2>
            <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto"></div>
        </div>

        {/* Linha 1: Esquerda */}
        <div className="relative w-full flex overflow-hidden group mb-6">
            <div className="relative flex w-[200%] animate-infinite-scroll-slow hover:[animation-play-state:paused]">
                {/* Conjunto de Depoimentos duplicado para loop infinito */}
                {[1, 2].map((set) => (
                  <div key={set} className="flex w-1/2 justify-around items-center px-4 gap-6">
                      {(testimonials && testimonials.length >= 2 ? testimonials.slice(0, Math.ceil(testimonials.length / 2)) : [
                        { client_name: 'Ricardo Almeida', client_role: 'Empresário', content: 'A consultoria do Mauro foi o divisor de águas para nossa obra. Ele trouxe a clareza técnica e a segurança financeira que nenhuma construtora havia nos dado.', rating: 5 },
                        { client_name: 'Dra. Helena Souza', client_role: 'Cirurgiã', content: 'Pela rede de parceiros do Mauro, conseguimos os melhores arquitetos e fornecedores. O nível de curadoria e profissionalismo é de outro patamar técnico.', rating: 5 },
                        { client_name: 'Marcus Vinícius', client_role: 'Investidor', content: 'Para quem busca investir em imóveis de alto padrão, a análise de viabilidade do Mauro é indispensável. Decidimos com a razão e temos o lucro garantido.', rating: 5 },
                      ]).map((test, index) => (
                        <div key={index} className="bg-brand-dark p-8 rounded-3xl border border-white/5 w-[450px] flex-shrink-0 shadow-2xl relative">
                            <div className="flex text-brand-gold mb-6 gap-1">
                                {Array.from({ length: test.rating || 5 }).map((_, i) => (
                                  <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-base text-gray-300 font-light italic mb-8 leading-relaxed">
                              "{test.content}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-14 h-14 bg-brand-black flex items-center justify-center text-brand-gold text-xl font-serif rounded-full overflow-hidden border border-brand-gold/20">
                                    {test.client_name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-base">{test.client_name}</h4>
                                    {test.client_role && <span className="text-[13px] text-brand-gold font-bold uppercase tracking-widest">{test.client_role}</span>}
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
        </div>

        {/* Linha 2: Direita */}
        <div className="relative w-full flex overflow-hidden group">
            <div className="relative flex w-[200%] animate-infinite-scroll-slow [animation-direction:reverse] hover:[animation-play-state:paused]">
                {[1, 2].map((set) => (
                  <div key={set} className="flex w-1/2 justify-around items-center px-4 gap-6">
                      {(testimonials && testimonials.length >= 2 ? testimonials.slice(Math.ceil(testimonials.length / 2)) : [
                        { client_name: 'Marcus Vinícius', client_role: 'Investidor', content: 'Para quem busca investir em imóveis de alto padrão, a análise de viabilidade do Mauro é indispensável. Decidimos com a razão e temos o lucro garantido.', rating: 5 },
                        { client_name: 'Dra. Helena Souza', client_role: 'Cirurgiã', content: 'Pela rede de parceiros do Mauro, conseguimos os melhores arquitetos e fornecedores. O nível de curadoria e profissionalismo é de outro patamar técnico.', rating: 5 },
                        { client_name: 'Ricardo Almeida', client_role: 'Empresário', content: 'A consultoria do Mauro foi o divisor de águas para nossa obra. Ele trouxe a clareza técnica e a segurança financeira que nenhuma construtora havia nos dado.', rating: 5 },
                      ]).map((test, index) => (
                        <div key={index} className="bg-brand-dark p-8 rounded-3xl border border-white/5 w-[450px] flex-shrink-0 shadow-2xl relative">
                            <div className="flex text-brand-gold mb-6 gap-1">
                                {Array.from({ length: test.rating || 5 }).map((_, i) => (
                                  <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-base text-gray-300 font-light italic mb-8 leading-relaxed">
                              "{test.content}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-14 h-14 bg-brand-black flex items-center justify-center text-brand-gold text-xl font-serif rounded-full overflow-hidden border border-brand-gold/20">
                                    {test.client_name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-base">{test.client_name}</h4>
                                    {test.client_role && <span className="text-[13px] text-brand-gold font-bold uppercase tracking-widest">{test.client_role}</span>}
                                </div>
                            </div>
                        </div>
                      ))}
                  </div>
                ))}
            </div>
        </div>
      </section>

      {/* SEÇÃO: SOBRE O MAURO (CONSULTORIA) */}
      <section id="sobre" className="w-full py-24 bg-brand-black border-y border-white/5">
        <div className="max-w-7xl px-6 lg:px-8 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-xs font-bold uppercase tracking-widest">
              <User size={16} /> Consultoria Especializada
            </div>
            <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight leading-tight">
              Direção prática para quem não quer errar na escolha.
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed font-light">
              Diferente de uma empresa padrão, meu papel é ser seu braço direito na decisão. Eu ajudo famílias a entenderem o que é viável antes mesmo de colocar a primeira pedra no terreno.
            </p>
            <div className="space-y-4 pt-4">
              {[
                "Orientação sobre financiamento e entrada.",
                "Análise técnica do que cabe no seu terreno.",
                "Seleção de projetos conforme sua necessidade real.",
                "Clareza total sobre medidas, custos e prazos."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-brand-gold mt-1 shrink-0" size={20} />
                  <span className="text-base text-zinc-300 font-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-square md:aspect-auto md:h-[600px] bg-brand-dark rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex items-end">
             <Image 
               src="/mauro-bio.webp" 
               alt="Mauro Consultor" 
               fill
               className="object-cover object-top"
               quality={100}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-brand-black/40 to-transparent"></div>
             <div className="relative z-10 p-8 md:p-12 text-center text-white space-y-4 w-full">
                <p className="text-[22px] font-serif font-medium text-brand-gold">Mauro Consultor</p>
                <p className="text-base text-zinc-300 font-light">Transformando dúvidas em direção segura para famílias em todo o Brasil.</p>
             </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: DORES E DÚVIDAS (IDENTIFICAÇÃO) */}
      <section className="w-full py-24 bg-[#080808] border-b border-white/5">
        <div className="max-w-7xl px-6 lg:px-8 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-[22px] md:text-[30px] font-serif font-medium tracking-tight text-white leading-tight">
              Ainda está travado entre a vontade e a decisão?
            </h2>
            <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto my-4"></div>
            <p className="text-base text-zinc-400 font-light">
              Eu sei que construir envolve inseguranças que podem paralisar seus planos. Meu trabalho é simplificar esses pontos:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            {[
              { 
                tile: "Insegurança Financeira", 
                desc: "Não sei se meu financiamento aprova ou quanto preciso de entrada.", 
                icon: <Shield className="text-brand-gold" size={32} /> 
              },
              { 
                tile: "Dúvida no Terreno", 
                desc: "Tenho o terreno (ou pretendo comprar), mas não sei o que cabe nele.", 
                icon: <HelpCircle className="text-brand-gold" size={32} /> 
              },
              { 
                tile: "Medo das Medidas", 
                desc: "Dificuldade de entender o tamanho real dos quartos e vãos no papel.", 
                icon: <Bed className="text-brand-gold" size={32} /> 
              },
              { 
                tile: "Surpresas na Obra", 
                desc: "Medo de custos inesperados ou prazos que nunca terminam.", 
                icon: <HelpCircle className="text-brand-gold" size={32} /> 
              }
            ].map((item, i) => (
              <div key={i} className="bg-brand-dark p-8 rounded-2xl border border-white/5 shadow-none hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-300 text-left space-y-4 group">
                 <div className="bg-brand-black w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/5 group-hover:bg-brand-gold/5 transition-colors">
                    {item.icon}
                 </div>
                 <h3 className="text-[18px] font-medium text-white">{item.tile}</h3>
                 <p className="text-base text-zinc-400 font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      {/* FORMULÁRIO DE CONTATO (CTA FINAL) */}
      <section id="contato" className="w-full py-24 bg-[#080808]">
        <div className="max-w-7xl px-4 mx-auto md:px-8 mt-4 flex flex-col items-center">
          <div className="flex flex-col items-center text-center mb-12 space-y-4">
            <h2 className="text-[22px] md:text-[30px] font-serif font-medium tracking-tight text-white mb-2">Vamos analisar seu cenário?</h2>
            <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto mb-4"></div>
            <p className="text-zinc-400 text-base font-light mt-4 max-w-2xl text-center">Mande seus dados para uma conversa inicial de orientação técnica sobre seu terreno, financiamento e projeto.</p>
          </div>
          
          <div className="w-full flex justify-center mt-8">
            <HeroSearch />
          </div>

          <p className="text-center text-[13px] text-zinc-600 mt-12 font-light tracking-widest uppercase">Atenção: Atendimento consultivo focado em quem busca construir com segurança e planejamento real.</p>
        </div>
      </section>

    </div>
  );
}
