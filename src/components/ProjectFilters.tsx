'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProjectWithPromotions } from '@/services/public'
import { Search, Sofa, Utensils, Waves } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProjectFiltersProps {
  initialProjects: ProjectWithPromotions[]
}

export function ProjectFilters({ initialProjects }: ProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [projectType, setProjectType] = useState<string>('all')
  const [bedrooms, setBedrooms] = useState<string>('all')
  const [bathrooms, setBathrooms] = useState<string>('all')
  const [suites, setSuites] = useState<string>('all')
  const [investment, setInvestment] = useState(4000)

  // Filtros Booleanos
  const [hasLiving, setHasLiving] = useState<boolean | null>(null)
  const [hasKitchen, setHasKitchen] = useState<boolean | null>(null)
  const [hasLaundry, setHasLaundry] = useState<boolean | null>(null)

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = initialProjects.map(p => p.category).filter(Boolean) as string[]
    return ['all', ...Array.from(new Set(cats))]
  }, [initialProjects])

  const projectTypes = useMemo(() => {
    const types = initialProjects.map(p => p.type).filter(Boolean) as string[]
    return ['all', ...Array.from(new Set(types))]
  }, [initialProjects])

  const filteredProjects = useMemo(() => {
    return initialProjects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.category?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = category === 'all' || project.category === category
      const matchesType = projectType === 'all' || project.type === projectType
      
      const attributes = (project.attributes_json as any) || {}
      
      const matchesBedrooms = bedrooms === 'all' || 
                              (bedrooms === '4+' ? parseInt(attributes.bedrooms || 0) >= 4 : attributes.bedrooms?.toString() === bedrooms)
      
      const matchesBathrooms = bathrooms === 'all' || 
                               (bathrooms === '3+' ? parseInt(attributes.bathrooms || 0) >= 3 : attributes.bathrooms?.toString() === bathrooms)

      const matchesSuites = suites === 'all' || 
                            (suites === '3+' ? parseInt(attributes.suites || 0) >= 3 : attributes.suites?.toString() === suites)

      const matchesLiving = hasLiving === null || !!attributes.has_living_room === hasLiving
      const matchesKitchen = hasKitchen === null || !!attributes.has_kitchen === hasKitchen
      const matchesLaundry = hasLaundry === null || !!attributes.has_laundry === hasLaundry
      
      const matchesPrice = project.price ? project.price <= (investment * 1000) : true

      const isNotOnlyGallery = project.gallery_click_action !== 'photo'

      return matchesSearch && matchesCategory && matchesType && matchesBedrooms && matchesBathrooms && 
             matchesSuites && matchesLiving && matchesKitchen && matchesLaundry && 
             matchesPrice && isNotOnlyGallery
    })
  }, [initialProjects, searchTerm, category, projectType, bedrooms, bathrooms, suites, hasLiving, hasKitchen, hasLaundry, investment])

  const clearFilters = () => {
    setSearchTerm('')
    setCategory('all')
    setProjectType('all')
    setBedrooms('all')
    setBathrooms('all')
    setSuites('all')
    setHasLiving(null)
    setHasKitchen(null)
    setHasLaundry(null)
    setInvestment(4000)
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Sob Consulta'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="max-w-[80rem] mx-auto px-6 md:px-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Barra Lateral de Filtros */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-32 space-y-8 lg:space-y-10 pb-12 lg:pb-20">
            {/* Busca Principal */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-brand-gold font-black ml-1">Pesquisar</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 group-focus-within:text-brand-gold transition-colors" />
                <Input 
                  placeholder="Nome ou estilo..." 
                  className="pl-11 bg-zinc-900/50 border-white/10 text-white focus:border-brand-gold/50 h-14 rounded-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Divisor */}
            <div className="h-px bg-white/5 mx-2"></div>

            {/* Seção: Tipo de Projeto (Novo) */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Tipo de Projeto</label>
              <Select value={projectType} onValueChange={(val) => setProjectType(val || 'all')}>
                <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white h-12 rounded-xl focus:ring-brand-gold/20">
                  <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">Ver Todos</SelectItem>
                  {projectTypes.filter(c => c !== 'all').map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Divisor */}
            <div className="h-px bg-white/5 mx-2"></div>

            {/* Seção: Padrão */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Padrão de Acabamento</label>
              <Select value={category} onValueChange={(val) => setCategory(val || 'all')}>
                <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white h-12 rounded-xl focus:ring-brand-gold/20">
                  <SelectValue placeholder="Todos os padrões" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectItem value="all">Todos os padrões</SelectItem>
                  {categories.filter(c => c !== 'all').map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seção: Dormitórios */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Dormitórios</label>
              <div className="flex flex-wrap gap-2">
                {['all', '1', '2', '3', '4+'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBedrooms(val)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      bedrooms === val 
                      ? 'bg-brand-gold border-brand-gold text-black' 
                      : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {val === 'all' ? 'Ver Todos' : val}
                  </button>
                ))}
              </div>
            </div>

             {/* Seção: Banheiros */}
             <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Banheiros</label>
              <div className="flex flex-wrap gap-2">
                {['all', '1', '2', '3+'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBathrooms(val)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      bathrooms === val 
                      ? 'bg-brand-gold border-brand-gold text-black' 
                      : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {val === 'all' ? 'Ver Todos' : val}
                  </button>
                ))}
              </div>
            </div>

             {/* Seção: Suítes */}
             <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Suítes</label>
              <div className="flex flex-wrap gap-2">
                {['all', '1', '2', '3+'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSuites(val)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                      suites === val 
                      ? 'bg-brand-gold border-brand-gold text-black' 
                      : 'bg-zinc-900/50 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    {val === 'all' ? 'Ver Todas' : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Seção: Comodidades */}
            <div className="space-y-4">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Comodidades</label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setHasLiving(hasLiving === true ? null : true)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                    hasLiving === true ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <Sofa className="w-4 h-4" /> Sala de Estar
                </button>
                <button
                  type="button"
                  onClick={() => setHasKitchen(hasKitchen === true ? null : true)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                    hasKitchen === true ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <Utensils className="w-4 h-4" /> Cozinha
                </button>
                <button
                  type="button"
                  onClick={() => setHasLaundry(hasLaundry === true ? null : true)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                    hasLaundry === true ? 'bg-brand-gold/10 border-brand-gold text-brand-gold' : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <Waves className="w-4 h-4" /> Lavanderia
                </button>
              </div>
            </div>

            {/* Seção: Faixa de Preço */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-bold ml-1">Investimento Máx.</label>
                <span className="text-brand-gold font-serif italic text-lg">{formatPrice(investment * 1000)}</span>
              </div>
              <div className="px-2">
                <input 
                  type="range" 
                  min="200" 
                  max="4000" 
                  step="50"
                  value={investment}
                  onChange={(e) => setInvestment(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-gold hover:bg-white/20 transition-all"
                />
                <div className="flex justify-between mt-3 text-[10px] text-zinc-600 uppercase font-black tracking-widest">
                  <span>R$ 200k</span>
                  <span>R$ 4M+</span>
                </div>
              </div>
            </div>

            {/* Botão Limpar */}
            {(searchTerm || category !== 'all' || projectType !== 'all' || bedrooms !== 'all' || bathrooms !== 'all' || suites !== 'all' || hasLiving !== null || hasKitchen !== null || hasLaundry !== null || investment < 4000) && (
              <Button 
                variant="ghost" 
                className="w-full text-zinc-500 hover:text-white hover:bg-white/5 h-12 rounded-xl"
                onClick={clearFilters}
              >
                Limpar Todos os Filtros
              </Button>
            )}
          </div>
        </aside>

        {/* Listagem de Projetos */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <p className="text-zinc-500 text-sm font-light">
              Exibindo <span className="text-white font-medium">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'projeto de excelência' : 'projetos de excelência'}
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredProjects.map((project) => {
                const attrs = (project.attributes_json as any) || {}
                return (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                  />
                )
              })}
            </div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center max-w-sm mx-auto">
              <div className="w-24 h-24 rounded-full bg-zinc-900/50 flex items-center justify-center mb-8 border border-white/5">
                <Search className="w-8 h-8 text-zinc-800" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">Nenhum resultado</h3>
              <p className="text-zinc-500 text-sm font-light mb-10 leading-relaxed">
                Ajuste os critérios da barra lateral para encontrar o projeto ideal para o seu terreno.
              </p>
              <Button 
                onClick={clearFilters}
                variant="outline"
                className="rounded-xl border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 px-8 h-12 w-full md:w-auto"
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
