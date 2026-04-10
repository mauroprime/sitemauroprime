'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bed, ShieldCheck, Crop, ChevronRight } from 'lucide-react'
import { ImageCarousel } from './ImageCarousel'


interface ProjectCardProps {
  project: {
    id: string
    slug: string
    title: string
    cover_image_url?: string | null
    short_description?: string | null
    subtitle?: string | null
    type?: string | null
    category?: string | null
    price?: number | string | null | undefined
    promotional_price?: number | string | null | undefined
    attributes_json?: any
    gallery_images?: any // Adicionado para evitar erro de spread
  }
  customImage?: React.ReactNode // Permite passar o ImageCarousel se necessário
  className?: string
}

export function ProjectCard({ project, customImage, className = '' }: ProjectCardProps) {
  const attrs = (project.attributes_json as any) || {}
  
  const formatPrice = (price: number | string | null | undefined) => {
    if (!price) return 'Sob Consulta'
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL', 
      maximumFractionDigits: 0 
    }).format(numPrice as number)
  }

  return (
    <Link 
      href={`/projetos/${project.slug}`} 
      key={project.id}
      className={`group block bg-zinc-900/30 rounded-[32px] overflow-hidden border border-white/5 hover:border-brand-gold/30 transition-all duration-700 hover:-translate-y-2 ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {customImage ? (
          customImage
        ) : project.gallery_images && (project.gallery_images as any[]).length > 0 ? (
          <ImageCarousel 
            images={[project.cover_image_url, ...(project.gallery_images as string[])].filter((img): img is string => !!img)} 
            aspectRatio="h-full w-full"
            className="h-full w-full"
          />
        ) : (
          <Image 
            src={project.cover_image_url || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
        
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] rounded-full w-fit">
            {project.type || project.category || 'Residencial'}
          </span>
          {project.promotional_price && Number(project.promotional_price) < Number(project.price) && (
            <span className="px-4 py-1.5 bg-brand-gold backdrop-blur-xl text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full w-fit shadow-lg shadow-brand-gold/20">
              {Math.round((1 - Number(project.promotional_price) / Number(project.price)) * 100)}% OFF
            </span>
          )}
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-6 md:space-y-8">
        <div>
          <h3 className="text-[20px] md:text-2xl font-serif text-white group-hover:text-brand-gold transition-colors duration-500 mb-2 md:mb-3 leading-tight tracking-tight truncate">
            {project.title}
          </h3>
          <p className="text-zinc-500 text-sm font-light line-clamp-2 leading-relaxed h-10">
            {project.short_description || project.subtitle || 'Descrição breve do projeto de alto padrão executado pela Construtora Prime.'}
          </p>
        </div>

        <div className="flex items-center justify-between py-5 border-y border-white/5">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Dorms</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Bed className="w-3.5 h-3.5 text-brand-gold" /> {attrs.bedrooms || 0}
            </span>
          </div>
          <div className="w-px h-8 bg-white/5"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Suítes</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> {attrs.suites || 0}
            </span>
          </div>
          <div className="w-px h-8 bg-white/5"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Área</span>
            <span className="text-white font-medium text-sm flex items-center gap-2">
              <Crop className="w-3.5 h-3.5 text-brand-gold" /> {attrs.area || 0}m²
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">
              {project.promotional_price ? 'Oportunidade Única' : 'Valor Estimado'}
            </span>
            <div className="flex flex-col">
              {project.promotional_price && Number(project.promotional_price) < Number(project.price) && (
                <span className="text-xs text-zinc-500 line-through mb-0.5">
                  {formatPrice(project.price)}
                </span>
              )}
              <span className={`text-xl font-medium font-serif ${project.promotional_price ? 'text-brand-gold' : 'text-white'}`}>
                {formatPrice(project.promotional_price || project.price)}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-gold transition-all duration-500 group-hover:rotate-45">
            <ChevronRight className="w-5 h-5 text-white group-hover:text-black group-hover:-rotate-45 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
