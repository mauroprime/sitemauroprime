import { getPublishedProjects } from "@/services/public"
import { ProjectFilters } from "@/components/ProjectFilters"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projetos | Construtora Prime",
  description: "Explore nosso portfólio de projetos residenciais de alto padrão. Encontre a casa dos seus sonhos com filtragem avançada por preço, cômodos e estilo.",
}

export default async function ProjetosPage() {
  const projects = await getPublishedProjects()

  return (
    <main className="min-h-screen bg-black pt-28 md:pt-48 pb-16 md:pb-32">
      {/* Header da Página */}
      <section className="max-w-[80rem] mx-auto px-6 md:px-12 mb-16 md:mb-32 pt-safe">
        <div className="max-w-[54rem]">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <span className="w-8 md:w-12 h-[1px] bg-brand-gold"></span>
            <span className="text-brand-gold font-bold text-[10px] md:text-[13px] uppercase tracking-[0.2em] md:tracking-wider">Portfólio Completo</span>
          </div>
          <h1 className="text-[28px] md:text-6xl font-serif text-white mb-6 md:mb-8 leading-[1.1] md:leading-none tracking-tight">
            Nossos <span className="italic text-brand-gold">Projetos</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-snug md:leading-relaxed">
            Cada projeto da Construtora Prime é uma obra assinada, unindo estética atemporal, 
            funcionalidade absoluta e inteligência construtiva. Use os filtros para encontrar 
            a solução que melhor se adapta ao seu estilo de vida.
          </p>
        </div>
      </section>

      {/* Componente de Filtro e Grid (Client Side) */}
      <ProjectFilters initialProjects={projects || []} />
    </main>
  )
}
