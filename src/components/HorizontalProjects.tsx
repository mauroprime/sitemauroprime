'use client'

import React, { useRef, useEffect, useState } from 'react'
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react"
import { ProjectCard } from './ProjectCard'

import { ProjectWithPromotions } from '@/services/public'

interface HorizontalProjectsProps {
  projects: ProjectWithPromotions[]
}

export function HorizontalProjects({ projects }: HorizontalProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isFullyVisible, setIsFullyVisible] = useState(false)
  const touchStartY = useRef(0)

  useEffect(() => {
    const parent = sectionRef.current
    const el = scrollContainerRef.current
    if (!parent || !el) return

    // Observer para detectar quando a seção está bem posicionada
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se a seção estiver ocupando a maior parte da tela, habilitamos a trava
        setIsFullyVisible(entry.intersectionRatio > 0.6)
      },
      { 
        threshold: [0, 0.4, 0.6, 0.8, 1.0],
        rootMargin: "-10% 0px" 
      }
    )
    observer.observe(parent)

    const handleScrollLogic = (deltaY: number, e: Event) => {
      // Se a seção não estiver visível o suficiente, ignoramos
      if (!isFullyVisible) return

      const canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 15)
      const canScrollLeft = el.scrollLeft > 15
      
      // Lógica de Trava: 
      // Se rolar para baixo e puder ir para a direita, OU rolar para cima e puder ir para a esquerda
      if ((deltaY > 0 && canScrollRight) || (deltaY < 0 && canScrollLeft)) {
        if (e.cancelable) e.preventDefault()
        
        // Aplica o movimento horizontal
        el.scrollLeft += deltaY * 1.5
      }
    }

    const onWheel = (e: WheelEvent) => {
      // Ignora scroll horizontal nativo (Trackpads)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      handleScrollLogic(e.deltaY, e)
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY.current - touchY
      
      // Só interceptamos se o movimento vertical for predominante
      handleScrollLogic(deltaY, e)
      
      // Atualizamos a base do toque apenas se não houver preventDefault (para permitir scroll fluido fora da trava)
      // Mas na verdade, para a trava ser contínua, atualizamos sempre se estivermos travados
      touchStartY.current = touchY
    }

    // passive: false é CRÍTICO para o preventDefault funcionar
    parent.addEventListener('wheel', onWheel, { passive: false })
    parent.addEventListener('touchstart', onTouchStart, { passive: true })
    parent.addEventListener('touchmove', onTouchMove, { passive: false })
    
    return () => {
      parent.removeEventListener('wheel', onWheel)
      parent.removeEventListener('touchstart', onTouchStart)
      parent.removeEventListener('touchmove', onTouchMove)
      observer.disconnect()
    }
  }, [isFullyVisible])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (!projects || projects.length === 0) return null

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen flex flex-col justify-center bg-brand-black w-full overflow-hidden py-12 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
              <div className="text-center md:text-left w-full md:w-auto">
                  <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[13px] mb-4 block">Portfólio de Consultoria</span>
                  <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight mb-4">Projetos em Destaque</h2>
                  <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto md:mx-0"></div>
              </div>
              
              <div className="flex items-center gap-4 self-end md:self-auto">
                  <button 
                    type="button"
                    onClick={() => scroll('left')}
                    className="p-4 rounded-full border border-white/10 text-white hover:bg-brand-gold hover:text-black transition-all group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => scroll('right')}
                    className="p-4 rounded-full border border-white/10 text-white hover:bg-brand-gold hover:text-black transition-all group"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
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
    </section>
  )
}
