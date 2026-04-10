'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react"
import { ProjectCard } from './ProjectCard'

import { ProjectWithPromotions } from '@/services/public'

interface HorizontalProjectsProps {
  projects: ProjectWithPromotions[]
}

export function HorizontalProjects({ projects }: HorizontalProjectsProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  
  // useScroll captura o progresso do scroll do contêiner pai
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  // Transformamos o progresso (0 a 1) em translação horizontal (0% a -[algum valor]%)
  // Como temos os cards + o card final de "sua casa", calculamos um valor que mostre tudo.
  // Ajustado para -75% para acomodar a largura extra dos cards e o card final.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"])

  if (!projects || projects.length === 0) return null

  return (
    <section ref={targetRef} className="relative h-[350vh] bg-brand-black">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 w-full pt-12 md:pt-0">
            {/* Header com Navegação */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div className="text-center md:text-left w-full md:w-auto">
                    <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[13px] mb-4 block">Portfólio de Consultoria</span>
                    <h2 className="text-[22px] md:text-[30px] font-serif text-white font-medium tracking-tight mb-4">Projetos em Destaque</h2>
                    <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto md:mx-0"></div>
                </div>
                
                {/* Indicador Visual de Scroll */}
                <div className="hidden md:flex items-center gap-4 text-zinc-500 uppercase text-[10px] tracking-[0.3em] font-bold">
                    <span>Role para Explorar</span>
                    <div className="w-12 h-[1px] bg-white/10"></div>
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                </div>
            </div>
        </div>

        {/* Trilha Horizontal Animada */}
        <div className="flex items-center">
            <motion.div 
              style={{ x }} 
              className="flex gap-8 px-[max(1.5rem,calc((100%-1280px)/2+2rem))]"
            >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    className="w-[280px] md:w-[450px] shrink-0"
                  />
                ))}
                
                {/* Card de CTA Final */}
                <div className="w-[300px] md:w-[350px] flex flex-col items-center justify-center text-center p-8 md:p-12 shrink-0 bg-white/5 rounded-[40px] border border-dashed border-white/10 group hover:border-brand-gold/40 transition-all duration-700">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-brand-gold/20 transition-all">
                    <ArrowRight size={32} />
                  </div>
                  <h4 className="text-white font-serif text-[20px] md:text-[26px] mb-4 md:mb-6 leading-tight">Sua casa pode estar aqui.</h4>
                  <p className="text-sm md:text-base text-zinc-500 mb-6 md:mb-10 leading-relaxed font-light">Vamos analisar qual planta se encaixa no seu orçamento e terreno.</p>
                  <a href="#contato" className="inline-flex items-center gap-3 text-brand-gold hover:text-white font-black text-[11px] uppercase tracking-[0.2em] transition-colors">
                    Solicitar Consultoria <ChevronRight size={16} />
                  </a>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
