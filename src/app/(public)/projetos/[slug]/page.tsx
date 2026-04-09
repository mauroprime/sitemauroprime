import { getProjectBySlug, getRelatedProjects, getSiteSettings } from '@/services/public'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { Bed, Bath, Sofa, Utensils, Waves, Car, ShieldCheck } from 'lucide-react'
import { ImageCarousel } from '@/components/ImageCarousel'
import { HeroSearch } from '@/components/HeroSearch'
import { TrackProjectView } from '@/components/TrackProjectView'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Projeto não encontrado',
    }
  }

  return {
    title: `${project.title} | Construtora Prime`,
    description: project.short_description || `Conheça o ${project.title}, um incrível empreendimento da Construtora Prime.`,
    openGraph: {
      images: project.cover_image_url ? [project.cover_image_url] : [],
    },
  }
}

export default async function ProjectDetailsPage({ params }: Props) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(project.category, project.id)
  const settings = await getSiteSettings()
  
  const attr = (project.attributes_json as any) || {}
  const projectImages = ([project.cover_image_url, ...(project.gallery_images as string[] || [])].filter((img): img is string => !!img))

  const attributeList = [
    { key: 'bedrooms', icon: <Bed className="w-5 h-5" />, label: 'Quartos', value: attr.bedrooms ? `${attr.bedrooms} Quartos` : null },
    { key: 'bathrooms', icon: <Bath className="w-5 h-5" />, label: 'Banheiros', value: attr.bathrooms ? `${attr.bathrooms} Banheiros` : null },
    { key: 'suites', icon: <ShieldCheck className="w-5 h-5" />, label: 'Suítes', value: attr.suites ? `${attr.suites} Suíte${attr.suites > 1 ? 's' : ''}` : null },
    { key: 'living', icon: <Sofa className="w-5 h-5" />, label: 'Sala', value: attr.has_living_room ? 'Sala' : null },
    { key: 'kitchen', icon: <Utensils className="w-5 h-5" />, label: 'Cozinha', value: attr.has_kitchen ? 'Cozinha' : null },
    { key: 'laundry', icon: <Waves className="w-5 h-5" />, label: 'Lavanderia', value: attr.has_laundry ? 'Lavanderia' : null },
    { key: 'garage', icon: <Car className="w-5 h-5" />, label: 'Garagem', value: attr.garage_info || null },
  ].filter(a => a.value !== null)

  const isPromotional = project.promotional_price && Number(project.promotional_price) < Number(project.price)
  const whatsappUrl = `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || '5541999999999'}?text=Olá, tenho interesse no projeto *${project.title}*${isPromotional ? ' que está em oferta!' : ''}`

  return (
    <div className="w-full flex flex-col bg-background text-foreground pb-24 lg:pb-0 relative">
      
      {/* HERO / CARROSSEL PRINCIPAL */}
      <section className="relative w-full h-[60vh] md:h-[75vh] bg-zinc-950 overflow-hidden">
        <ImageCarousel 
          images={projectImages} 
          aspectRatio="h-full w-full"
          className="h-full w-full"
          objectFit="contain"
        />
        {/* Overlay para o título */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pt-32 pb-12 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pointer-events-auto">
            {project.category && (
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full mb-4">
                {project.category}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="text-xl md:text-2xl text-zinc-200 max-w-2xl font-light">
                {project.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-10 gap-12">
          
          {/* LADO ESQUERDO: Descrições (60%) */}
          <div className="lg:col-span-6 space-y-12">
            
            {/* Descrição Curta (Destaque) */}
            {project.short_description && (
              <p className="text-xl md:text-2xl font-medium text-zinc-800 leading-relaxed border-l-4 border-primary pl-6">
                {project.short_description}
              </p>
            )}

            {/* Descrição Completa */}
            {project.full_description && (
              <div className="prose prose-zinc max-w-none text-zinc-600">
                <p className="whitespace-pre-line">{project.full_description}</p>
              </div>
            )}
            
          </div>

          {/* LADO DIREITO: Informações de Venda (Sidebar - 40%) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-card border rounded-2xl p-8 shadow-sm space-y-8">
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Investimento</p>
                {project.price ? (
                  <div className="flex flex-col">
                     {project.promotional_price && Number(project.promotional_price) < Number(project.price) ? (
                       <div className="space-y-1">
                         <div className="flex items-center gap-3">
                           <span className="text-zinc-500 line-through text-lg font-light">R$ {Number(project.price).toLocaleString('pt-BR')}</span>
                           <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                             {Math.round((1 - Number(project.promotional_price) / Number(project.price)) * 100)}% OFF
                           </span>
                         </div>
                         <p className="text-5xl font-extrabold text-brand-gold font-serif">
                           R$ {Number(project.promotional_price).toLocaleString('pt-BR')}
                         </p>
                       </div>
                    ) : (
                      <p className="text-4xl font-extrabold text-white font-serif">
                        R$ {Number(project.price).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-3xl font-extrabold text-white font-serif">Sob Consulta</p>
                )}
              </div>

              {attributeList.length > 0 ? (
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h4 className="font-semibold text-zinc-900 mb-4">Diferenciais do Imóvel</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {attributeList.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                        <span className="text-primary">{item.icon}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-zinc-100 flex items-center justify-center min-h-[80px]">
                   <span className="text-sm border border-dashed px-4 py-2 rounded-lg text-zinc-400">Características sob consulta</span>
                </div>
              )}

              {/* Seção de Plantas do Projeto */}
              {Array.isArray(project.floor_plans) && project.floor_plans.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h4 className="font-semibold text-zinc-900 mb-4">Plantas do Projeto</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(project.floor_plans as string[] || []).map((url: string, i: number) => (
                      <div key={i} className="group relative aspect-square bg-white border rounded-xl overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all">
                        <img 
                          src={url} 
                          alt={`Planta ${i + 1}`} 
                          className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] font-bold bg-white/90 px-2 py-1 rounded-full shadow-sm">Ver Planta</span>
                        </div>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nova seção de Análise Consultiva com HeroSearch Vertical */}
              <div className="pt-8 border-t border-zinc-100 flex flex-col items-center">
                <div className="text-center mb-6">
                  <h4 className="font-serif text-xl text-zinc-900 mb-2">Análise Consultiva</h4>
                  <p className="text-xs text-zinc-500">Inicie sua orientação técnica personalizada para este projeto.</p>
                </div>
                
                <HeroSearch variant="vertical" theme="light" />
                
                <p className="text-[10px] text-center text-zinc-400 mt-6 uppercase tracking-widest leading-relaxed">
                  Atendimento focado em clareza técnica e segurança financeira.
                </p>
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* PROJETOS RELACIONADOS */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="py-24 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Você também pode se interessar</h2>
            
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-6 pb-6 lg:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
              {relatedProjects.map((relProject) => (
                <div key={relProject.id} className="min-w-[85vw] sm:min-w-[40vw] lg:min-w-0 snap-center group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md relative">
                  <div className="aspect-[4/3] bg-muted w-full relative overflow-hidden">
                    <ImageCarousel 
                      images={[relProject.cover_image_url, ...(relProject.gallery_images as string[] || [])].filter((img): img is string => !!img)} 
                      aspectRatio="aspect-[4/3]"
                    />
                  </div>
                  <a href={`/projetos/${relProject.slug}`} className="p-6 flex-1 flex flex-col">
                    <div className="text-sm font-semibold text-primary mb-2">{relProject.category || 'Destaque'}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{relProject.title}</h3>
                    <div className="mt-auto pt-4 border-t w-full">
                      <span className="font-semibold text-sm">
                        {relProject.price ? `R$ ${Number(relProject.price).toLocaleString('pt-BR')}` : 'Consulte valores'}
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA MOBILE FIXO NO RODAPÉ */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 lg:hidden flex gap-4 items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Investimento</p>
          <p className="font-bold text-lg leading-tight text-zinc-900 border-l-[3px] border-primary pl-2 mt-1">
            {project.price ? `R$ ${Number(project.promotional_price || project.price).toLocaleString('pt-BR')}` : 'Sob Consulta'}
          </p>
        </div>
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors shadow-md whitespace-nowrap"
        >
          Falar Agora
        </a>
      </div>

      <TrackProjectView project={project} />
    </div>
  )
}
