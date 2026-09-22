'use client'

import React, { useRef, useEffect } from 'react'
import { ArrowRight, ChevronRight } from "lucide-react"
import { ProjectCard } from './ProjectCard'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ProjectWithPromotions } from '@/services/public'

gsap.registerPlugin(ScrollTrigger)

interface HorizontalProjectsProps {
  projects: ProjectWithPromotions[]
}

export function HorizontalProjects({ projects }: HorizontalProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scrollContainer = scrollContainerRef.current
    const wrapper = wrapperRef.current
    if (!section || !scrollContainer || !wrapper) return

    const ctx = gsap.context(() => {
      // Calcula a distância total de scroll horizontal
      const getScrollDistance = () => {
        return scrollContainer.scrollWidth - scrollContainer.clientWidth
      }

      // Cria a animação de scroll horizontal
      const tween = gsap.to(scrollContainer, {
        scrollLeft: () => getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: wrapper,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      })

      // Refresh no resize
      const handleResize = () => {
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, section)

    return () => ctx.revert()
  }, [projects])

  if (!projects || projects.length === 0) return null

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-brand-black w-full overflow-hidden"
    >
      <div 
        ref={wrapperRef}
        className="relative min-h-screen flex flex-col justify-center py-12 md:py-24"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div className="text-center md:text-left w-full md:w-auto">
                    <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[13px] mb-4 block">Portfólio de Consultoria</span>
                    <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight mb-4">Projetos em Destaque</h2>
                    <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto md:mx-0"></div>
                </div>
                
                <div className="flex items-center gap-4 self-end md:self-auto">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Role para ver mais</span>
                    <ArrowRight className="w-5 h-5 text-brand-gold animate-pulse" />
                </div>
            </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar pb-12 w-full"
          style={{ 
            paddingLeft: 'max(1.5rem, calc((100% - 1280px) / 2 + 2rem))',
            paddingRight: 'max(1.5rem, calc((100% - 1280px) / 2 + 2rem))'
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              className="w-[280px] md:w-[450px] shrink-0"
            />
          ))}
          
          <div className="w-[300px] md:w-[350px] flex flex-col items-center justify-center text-center p-12 shrink-0 bg-white/5 rounded-[40px] border border-dashed border-white/10 group hover:border-brand-gold/40 transition-all duration-700">
            <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all">
              <ArrowRight size={40} />
            </div>
            <h4 className="text-white font-serif text-[26px] mb-6 leading-tight">Sua casa pode estar aqui.</h4>
            <p className="text-base text-zinc-500 mb-10 leading-relaxed font-light">Vamos analisar qual planta se encaixa no seu orçamento e terreno.</p>
            <a href="#contato" className="inline-flex items-center gap-3 text-brand-gold hover:text-white font-black text-[11px] uppercase tracking-[0.2em] transition-colors">
              Solicitar Consultoria <ChevronRight size={16} />
            </a>
          </div>
        </div>

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  )
}
