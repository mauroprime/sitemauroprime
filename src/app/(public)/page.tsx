import { getPublishedProjects, getSiteSettings, getTestimonials } from "@/services/public";
import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";
import { Bed, BedDouble, CheckCircle2, HelpCircle, Shield, User, ChevronRight, Hammer, Star } from "lucide-react";
import { HorizontalProjects } from "@/components/HorizontalProjects";
import { ProjectMovingWall } from "@/components/ProjectMovingWall";
import { HeroSearch } from "@/components/HeroSearch";
import { FAQ } from "@/components/FAQ";
import { TestimonialSlidingWall } from "@/components/TestimonialSlidingWall";


const googleReviews = [
  { client_name: 'Janaine Sheron', link: 'https://share.google/Z8ZjZcjXKTdrqq2Dy', date: 'um mês atrás', content: 'Empresa séria e comprometida com o cliente. Sempre disponíveis para esclarecer dúvidas e muito organizados durante todo o processo. Fiquei muito satisfeita!', rating: 5 },
  { client_name: 'Samara Andressa', link: 'https://share.google/67WWCFfzXEg5uapGZ', date: 'um mês atrás', content: 'Excelente experiência! Desde o primeiro contato fui muito bem atendida, sempre prestativos e transparentes. O serviço foi entregue dentro do prazo e com uma qualidade impecável. É uma empresa que realmente se preocupa com o cliente e faz tudo com muito profissionalismo. Super indico!', rating: 5 },
  { client_name: 'Adriano De Oliveira Pinto', link: 'https://share.google/eILKPsFgLK4kx3pFP', date: 'um mês atrás', content: 'A prime me surpreendeu , Empresa correta em meio a tantas empresas que nos decepcionam, Construí minha casa e é só alegria 😀😀', rating: 5 },
  { client_name: 'Tiago Henrique', link: 'https://share.google/zv3BwyF6zfNTDUBaw', date: 'um mês atrás', content: 'Excelente suporte e agilidade nas entregas de cada prazo da obra. O proprietário possui uma equipe, mas sempre se coloca à disposição para dúvidas. Até o momento, estou super satisfeito e indico a construtora!!!', rating: 5 },
  { client_name: 'Gilmar Kahell', link: 'https://share.google/G3W0QF2JUEXyTPMEa', date: 'um mês atrás', content: 'Fizeram um serviço de primeira, com especialista na área! Parabéns ao Diego e equipe!', rating: 5 },
  { client_name: 'Maiko Charles Rodrigues', link: 'https://share.google/dTcwZ33rRa0OIAnxY', date: 'um mês atrás', content: 'Empresa séria e comprometida com o cliente. Top.', rating: 5 },
  { client_name: 'marcos Silva', link: 'https://share.google/ABJMMij9XujjeI0EO', date: 'um mês atrás', content: 'Minha obra foi realizada no cronograma em dia, empresa organizada e equipe de profissionais atenciosos', rating: 5 },
  { client_name: 'Cristian George', link: 'https://share.google/E6Stjyf4RtkbOXfFl', date: 'um mês atrás', content: 'Excelentes profissionais! Recomendo', rating: 5 },
  { client_name: 'Marcia Regina', link: 'https://share.google/CA2xyfBxZRfYLOngu', date: 'um mês atrás', content: 'Trabalho de alta qualidade, com profissionalismo e transparência do início ao fim!!', rating: 5 }
];

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
      <section className="relative py-24 bg-[#080808] border-y border-white/5 overflow-hidden w-full">
        {/* Efeito de Fade Premium nas Laterais */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-64 bg-gradient-to-r from-[#080808] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 md:w-64 bg-gradient-to-l from-[#080808] to-transparent z-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center relative z-10">
            <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight mb-4">Experiências que Inspiram Confiança</h2>
            <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto"></div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <TestimonialSlidingWall 
            reviews={googleReviews.slice(0, 5)} 
            duration={60}
          />
          <TestimonialSlidingWall 
            reviews={googleReviews.slice(5)} 
            reverse={true}
            duration={60}
          />
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
