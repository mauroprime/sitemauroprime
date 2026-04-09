'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectWithPromotions } from '@/services/public'
import { X } from 'lucide-react'

interface ProjectMovingWallProps {
  projects: ProjectWithPromotions[]
}

export function ProjectMovingWall({ projects }: ProjectMovingWallProps) {
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null)
  // ...
  const openLightbox = useCallback((url: string, title: string) => {
    setLightbox({ url, title })
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    document.body.style.overflow = ''
  }, [])

  // Garantir que temos projetos suficientes para o loop duplicando-os se necessário
  const displayProjects = projects && projects.length > 0 ? [...projects, ...projects, ...projects, ...projects] : []

  // Sempre manter 4 colunas para preservar o "estilo galeria" (mural denso)
  // Independente da quantidade de projetos, preenchemos as 4 colunas usando repetição
  const columns = [
    displayProjects.filter((_, i) => i % 4 === 0),
    displayProjects.filter((_, i) => i % 4 === 1),
    displayProjects.filter((_, i) => i % 4 === 2),
    displayProjects.filter((_, i) => i % 4 === 3),
  ]

  if (!projects || projects.length === 0) return null

  const renderCard = (project: ProjectWithPromotions, key: string, showFooter: boolean = true) => {
    const imageUrl = project.cover_image_url || '/placeholder-project.jpg'
    const isPhotoMode = project.gallery_click_action === 'photo'

    const content = (
      <>
        <Image 
          src={imageUrl}
          alt={project.title}
          fill
          className="project-wall-image"
          sizes="(max-w-7xl) 25vw, 50vw"
        />
        <div className="project-wall-content">
          <span className="text-brand-gold font-bold text-[9px] tracking-[0.25em] uppercase mb-2 block opacity-80">
            {project.type || project.category || 'Residencial High-End'}
          </span>
          <h4 className="text-white text-[18px] font-serif italic mb-1">
            {project.title}
          </h4>
          {showFooter && (
            <div className="flex items-center justify-between mt-4">
               <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                 {isPhotoMode ? 'Ver Foto' : 'Ver Detalhes'}
               </span>
               <div className="w-8 h-[1px] bg-brand-gold/30"></div>
            </div>
          )}
        </div>
      </>
    )

    if (isPhotoMode) {
      return (
        <button
          type="button"
          key={key}
          className="project-wall-card h-[380px] group block w-full text-left"
          onClick={() => openLightbox(imageUrl, project.title)}
        >
          {content}
        </button>
      )
    }

    return (
      <Link 
        href={`/projetos/${project.slug}`} 
        key={key}
        className="project-wall-card h-[380px] group block"
      >
        {content}
      </Link>
    )
  }

  const renderMobileCard = (project: ProjectWithPromotions) => {
    const imageUrl = project.cover_image_url || '/placeholder-project.jpg'
    const isPhotoMode = project.gallery_click_action === 'photo'

    const inner = (
      <>
        <Image 
          src={imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h4 className="text-white text-[18px] font-serif italic mb-1">{project.title}</h4>
          <span className="text-brand-gold font-bold text-[9px] tracking-[0.2em] uppercase">{project.type || project.category}</span>
        </div>
      </>
    )

    if (isPhotoMode) {
      return (
        <button
          type="button"
          key={project.id}
          className="min-w-[280px] h-[400px] relative rounded-3xl overflow-hidden border border-white/10 shrink-0 text-left"
          onClick={() => openLightbox(imageUrl, project.title)}
        >
          {inner}
        </button>
      )
    }

    return (
      <Link 
        href={`/projetos/${project.slug}`}
        key={project.id}
        className="min-w-[280px] h-[400px] relative rounded-3xl overflow-hidden border border-white/10 shrink-0"
      >
        {inner}
      </Link>
    )
  }

  return (
    <section className="overflow-hidden bg-[#050505] border-white/5 border-t pt-28 pb-28 relative w-full" id="project-wall">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wallScrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes wallScrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .project-wall-track {
          display: flex;
          flex-direction: column;
          gap: 20px;
          will-change: transform;
        }
        .wall-up {
          animation: wallScrollUp 250s linear infinite;
        }
        .wall-down {
          animation: wallScrollDown 250s linear infinite;
        }
        .project-wall-column:hover .project-wall-track {
          animation-play-state: paused;
        }
        .project-wall-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04);
          isolation: isolate;
        }
        .project-wall-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(5, 5, 5, 0.95) 0%, rgba(5, 5, 5, 0.7) 30%, rgba(5, 5, 5, 0.1) 60%, transparent 100%);
          opacity: 0.6;
          transition: opacity 0.45s ease;
          z-index: 1;
        }
        .project-wall-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(197, 160, 89, 0.15), transparent 50%);
          opacity: 0;
          transition: opacity 0.45s ease;
          z-index: 1;
          pointer-events: none;
        }
        .project-wall-card:hover::before { opacity: 0.9; }
        .project-wall-card:hover::after { opacity: 1; }
        
        .project-wall-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.01);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s ease;
        }
        .project-wall-card:hover .project-wall-image {
          transform: scale(1.1);
          filter: brightness(0.8) saturate(1.1);
        }
        .project-wall-content {
          position: absolute;
          inset-inline: 0;
          bottom: 0;
          z-index: 2;
          padding: 24px;
          transform: translateY(10px);
          opacity: 0.8;
          transition: transform 0.45s ease, opacity 0.45s ease;
        }
        .project-wall-card:hover .project-wall-content {
          transform: translateY(0);
          opacity: 1;
        }
        
        @media (max-width: 1023px) {
          .wall-up, .wall-down { animation-duration: 320s; }
        }

        /* Lightbox animations */
        @keyframes lightboxFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lightboxScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .lightbox-overlay {
          animation: lightboxFadeIn 0.3s ease forwards;
        }
        .lightbox-content {
          animation: lightboxScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(197,160,89,0.05),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(197,160,89,0.03),transparent_30%)]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize: '60px 60px'}}></div>
      </div>

      <div className="z-10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold/20 bg-brand-gold/5 text-[10px] uppercase tracking-[0.3em] text-brand-gold mb-6 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_10px_#C5A059]"></span>
              Portfólio de Excelência
            </div>
            <h2 className="text-[22px] md:text-[30px] font-serif font-medium tracking-tight text-white mb-6">
              Projetos que definem o <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-goldlight to-brand-gold">novo padrão</span>
            </h2>
            <p className="text-gray-400 text-base font-light leading-relaxed max-w-2xl mx-auto">
              Uma imersão técnica e visual em obras assinadas, onde cada detalhe é planejado para segurança, valorização e funcionalidade absoluta.
            </p>
          </div>
        </div>

        <div className="hidden md:block project-wall-stage max-w-7xl mx-auto overflow-hidden px-6 lg:px-8" 
             style={{maskImage: 'linear-gradient(180deg,transparent,black 15%,black 85%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,transparent,black 15%,black 85%,transparent)'}}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 overflow-hidden h-[900px] items-start">
            {columns.map((columnProjects, colIdx) => (
              <div key={colIdx} className="project-wall-column relative h-full overflow-hidden">
                <div className={`project-wall-track ${colIdx % 2 === 0 ? 'wall-up' : 'wall-down'}`}>
                  {columnProjects.map((project, projIdx) => 
                    renderCard(project, `${colIdx}-${projIdx}`, true)
                  )}
                  {/* Duplicação para loop contínuo */}
                  {columnProjects.map((project, projIdx) => 
                    renderCard(project, `dup-${colIdx}-${projIdx}`, false)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="md:hidden flex overflow-x-auto gap-4 pb-8 no-scrollbar scroll-smooth">
              {projects.map((project) => renderMobileCard(project))}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal de Foto */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center lightbox-overlay"
          onClick={closeLightbox}
        >
          {/* Backdrop escuro com blur */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>
          
          {/* Conteúdo */}
          <div 
            className="relative z-10 w-[90vw] h-[85vh] max-w-6xl lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute -top-12 right-0 md:top-4 md:right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagem */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={lightbox.url}
                alt={lightbox.title}
                fill
                className="object-contain bg-black/50"
                sizes="90vw"
                priority
              />
            </div>

            {/* Título */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
              <h3 className="text-white text-xl font-serif italic">{lightbox.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
