'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Home as HomeIcon, ChevronLeft, CheckCircle2, ArrowRight, Search, X } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '@/actions/leads'
import { useSearchParams, useRouter } from 'next/navigation'
import { firePixelEvent } from './FBPixel'

interface HeroSearchProps {
  variant?: 'horizontal' | 'vertical'
  theme?: 'dark' | 'light'
  projectSlug?: string
  projectId?: string
  projectName?: string
  projectPrice?: number
}

function HeroSearchContent({ variant = 'horizontal', theme = 'dark', projectSlug, projectId, projectName, projectPrice }: HeroSearchProps) {
  const isVertical = variant === 'vertical'
  const isLight = theme === 'light'
  const searchParams = useSearchParams()
  const router = useRouter()

  // Orçamento dinâmico baseado no preço do projeto
  let minVal = 200
  let maxVal = 2000
  let stepVal = 50
  let initialVal = 500
  const rangePlus = projectPrice ? (projectPrice < 200000 ? 50 : 100) : 500

  if (projectPrice) {
    const priceK = projectPrice / 1000
    minVal = Math.max(30, Math.floor((priceK * 0.7) / 5) * 5)
    maxVal = Math.max(100, Math.ceil((priceK * 1.5) / 5) * 5)
    stepVal = 5
    initialVal = Math.floor(priceK / 5) * 5
  }

  // Step state (main form only: steps 1-4)
  const [currentStep, setCurrentStep] = useState(1)
  const totalMainSteps = 4

  // Form State - Main Steps
  const [landStatus, setLandStatus] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [hasProject, setHasProject] = useState('')

  // Investment slider
  const [investment, setInvestment] = useState(initialVal)

  // Form State - Modal
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [financing, setFinancing] = useState('')
  const [timeframe, setTimeframe] = useState('')

  // Modal State
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(1)

  // Ajusta o valor padrão do investimento se o preço do projeto carregar
  useEffect(() => {
    if (projectPrice) {
      const priceK = projectPrice / 1000
      setInvestment(Math.floor(priceK / 5) * 5)
    }
  }, [projectPrice])

  // WhatsApp Mask: (00) 00000-0000
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3')
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2')
    } else {
      value = value.replace(/^(\d*)/, '($1')
    }
    setWhatsapp(value)
  }

  const goNext = () => {
    setDirection(1)
    if (currentStep < totalMainSteps) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === totalMainSteps) {
      // Abre o modal
      setIsOpen(true)
      firePixelEvent('InitiateCheckout', {
        content_name: projectSlug ? `Análise: ${projectSlug}` : 'Procura Geral',
        content_category: 'Lead'
      })
    }
  }

  const goBack = () => {
    setDirection(-1)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return landStatus !== ''
      case 2: return city.trim().length > 0
      case 3: return area.trim().length > 0
      case 4: return hasProject !== ''
      default: return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone', whatsapp)
    formData.append('intent', 'Construir')
    formData.append('has_land', landStatus === 'Já possuo o terreno' ? 'true' : 'false')
    formData.append('project_type', 'Personalizado')
    formData.append('investment_range', `R$ ${investment}k`)
    formData.append('timeframe', timeframe)
    formData.append('city', city)
    formData.append('area', area)
    formData.append('has_project', hasProject)
    formData.append('financing', financing)
    if (projectId) {
      formData.append('related_project_id', projectId)
    }

    // Captura UTMs da URL
    formData.append('utm_source', searchParams.get('utm_source') || '')
    formData.append('utm_medium', searchParams.get('utm_medium') || '')
    formData.append('utm_campaign', searchParams.get('utm_campaign') || '')
    formData.append('utm_content', searchParams.get('utm_content') || '')
    formData.append('utm_term', searchParams.get('utm_term') || '')

    const eventId = crypto.randomUUID()
    formData.append('event_id', eventId)

    try {
      const result = await submitLead(formData)
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          
          const params = new URLSearchParams()
          if (projectSlug) params.append('projeto', projectSlug)
          if (eventId) params.append('event_id', eventId)
          params.append('name', name)
          params.append('email', email)
          params.append('phone', whatsapp)
          params.append('intent', 'Construir')
          params.append('has_land', landStatus === 'Já possuo o terreno' ? 'true' : 'false')
          params.append('project_type', 'Personalizado')
          
          const labelUpper = projectPrice ? `R$ ${investment + rangePlus}k` : (investment > 1500 ? '2M+' : `R$ ${investment + 500}k`)
          params.append('investment', `R$ ${investment}k a ${labelUpper}`)
          params.append('timeframe', timeframe)
          params.append('city', city)
          params.append('area', area)

          const redirectUrl = `/obrigado?${params.toString()}`
          router.push(redirectUrl)
        }, 1500)
      } else {
        setError(result.error || 'Erro inesperado')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.')
    } finally {
      setIsPending(false)
    }
  }

  // Auto-advance for select/toggle buttons
  const handleLandSelect = (value: string) => {
    setLandStatus(value)
    setTimeout(() => goNext(), 300)
  }

  const handleProjectSelect = (value: string) => {
    setHasProject(value)
    setTimeout(() => goNext(), 300)
  }

  // Progress dots
  const renderProgress = () => (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalMainSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i + 1 === currentStep
              ? 'w-8 bg-brand-gold'
              : i + 1 < currentStep
              ? 'w-3 bg-brand-gold/40'
              : 'w-3 bg-white/10'
          }`}
        />
      ))}
    </div>
  )

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  }

  // Step content for main page (steps 1-4)
  const renderMainStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 1 de {totalMainSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Você já possui o terreno ou está em processo de compra?
              </h3>
            </div>
            <div className="space-y-2">
              {['Já possuo o terreno', 'Estou em processo de compra', 'Ainda não tenho terreno'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLandSelect(option)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    landStatus === option
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option}</span>
                  {landStatus === option && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 2 de {totalMainSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Em qual cidade será a construção?
              </h3>
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Curitiba, São Paulo..."
              autoFocus
              className={`w-full border-2 rounded-xl px-4 py-4 text-lg focus:outline-none transition-all ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-brand-gold'
                  : 'bg-white/5 border-white/10 text-white placeholder-zinc-600 focus:border-brand-gold'
              }`}
            />
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${
                canProceed()
                  ? 'bg-brand-gold hover:bg-brand-goldlight text-black shadow-[0_10px_20px_rgba(212,175,55,0.2)]'
                  : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10'
              }`}
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 3 de {totalMainSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Qual a metragem aproximada da construção?
              </h3>
            </div>
            <div className="relative">
              <input
                type="text"
                value={area}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, '')
                  setArea(onlyNums)
                }}
                placeholder="Ex: 150"
                autoFocus
                className={`w-full border-2 rounded-xl px-4 py-4 text-lg focus:outline-none transition-all ${
                  isLight
                    ? 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-brand-gold'
                    : 'bg-white/5 border-white/10 text-white placeholder-zinc-600 focus:border-brand-gold'
                }`}
              />
              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                m²
              </span>
            </div>
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${
                canProceed()
                  ? 'bg-brand-gold hover:bg-brand-goldlight text-black shadow-[0_10px_20px_rgba(212,175,55,0.2)]'
                  : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10'
              }`}
            >
              <span>Próximo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 4 de {totalMainSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Já possui algum projeto ou croqui?
              </h3>
            </div>
            <div className="space-y-2">
              {['Já tenho projeto aprovado', 'Tenho um croqui/rascunho', 'Ainda estou em fase de ideias'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleProjectSelect(option)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    hasProject === option
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option}</span>
                  {hasProject === option && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Main Form Container - Step by Step (1-4) */}
      <div className={`w-full ${isVertical ? 'max-w-xl mx-auto' : 'max-w-[1360px]'} ${isLight ? 'bg-zinc-100 border-zinc-200 shadow-xl' : 'bg-brand-dark/85 backdrop-blur-3xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'} border rounded-3xl p-6 md:p-8 lg:p-9 transition-all duration-300`}>
        <div className="flex flex-col w-full gap-4">
          {/* Progress Bar */}
          {renderProgress()}

          {/* Step Content with Animation */}
          <div className="relative min-h-[220px] flex items-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full"
              >
                {renderMainStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Back Button */}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goBack}
              className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                isLight ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>
      </div>

      {/* Modal / Popup - All fields at once */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-brand-dark border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              {/* Box Background Decor */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl"></div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
                disabled={isPending}
              >
                <X size={24} />
              </button>

              {isSuccess ? (
                <div className="py-12 flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center text-brand-gold">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-3xl font-serif text-white">Análise Solicitada!</h3>
                  <p className="text-zinc-400">Obrigado pelo interesse! Redirecionando...</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">Quase lá!</h3>
                    <p className="text-sm text-zinc-400">Complete seus dados para abrirmos sua análise consultiva personalizada.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    {/* Faixa de Investimento */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Faixa de Investimento</label>
                      <div className="flex justify-between text-xs text-zinc-500 uppercase font-black tracking-widest px-1">
                        <span>Seu orçamento</span>
                        <span className="text-brand-gold">
                          R$ {investment}k - {projectPrice ? `R$ ${investment + rangePlus}k` : (investment > 1500 ? '2M+' : `R$ ${investment + 500}k`)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={minVal}
                        max={maxVal}
                        step={stepVal}
                        value={investment}
                        onChange={(e) => setInvestment(parseInt(e.target.value))}
                        className="w-full cursor-pointer text-white/10"
                      />
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Financiamento */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Recursos próprios ou financiamento?</label>
                      <select
                        required
                        value={financing}
                        onChange={(e) => setFinancing(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-brand-gold transition-all cursor-pointer"
                        disabled={isPending}
                      >
                        <option value="" className="bg-brand-dark text-white">Selecione</option>
                        <option value="Recursos próprios" className="bg-brand-dark text-white">Recursos próprios</option>
                        <option value="Financiamento bancário" className="bg-brand-dark text-white">Financiamento bancário</option>
                        <option value="Misto (entrada + financiamento)" className="bg-brand-dark text-white">Misto (entrada + financiamento)</option>
                        <option value="Ainda não defini" className="bg-brand-dark text-white">Ainda não defini</option>
                      </select>
                    </div>

                    {/* Prazo */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Pretende iniciar a obra em qual prazo?</label>
                      <select
                        required
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-brand-gold transition-all cursor-pointer"
                        disabled={isPending}
                      >
                        <option value="" className="bg-brand-dark text-white">Selecione o prazo</option>
                        <option value="Preciso com urgência" className="bg-brand-dark text-white">Preciso com urgência</option>
                        <option value="Pretendo iniciar em 30 dias" className="bg-brand-dark text-white">Pretendo iniciar em 30 dias</option>
                        <option value="Pretendo iniciar em 90 dias" className="bg-brand-dark text-white">Pretendo iniciar em 90 dias</option>
                        <option value="Pretendo iniciar daqui 6 meses" className="bg-brand-dark text-white">Pretendo iniciar daqui 6 meses</option>
                        <option value="Pretendo iniciar daqui 1 ano" className="bg-brand-dark text-white">Pretendo iniciar daqui 1 ano</option>
                        <option value="Pretendo iniciar daqui 2 anos" className="bg-brand-dark text-white">Pretendo iniciar daqui 2 anos</option>
                        <option value="Somente 2 anos +" className="bg-brand-dark text-white">Somente 2 anos +</option>
                        <option value="Estou só avaliando as possibilidades" className="bg-brand-dark text-white">Estou só avaliando as possibilidades</option>
                      </select>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    {/* Dados pessoais */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Nome e Sobrenome</label>
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João Silva"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Email</label>
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: joao@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Telefone / WhatsApp</label>
                      <input 
                        required
                        type="tel" 
                        value={whatsapp}
                        onChange={handlePhoneChange}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition-all"
                        disabled={isPending}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-brand-gold hover:bg-brand-goldlight text-black py-5 rounded-xl text-sm font-black uppercase tracking-[0.1em] transition-all relative overflow-hidden group shadow-xl"
                    >
                      {isPending ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <span>Enviar Solicitação de Análise</span>
                      )}
                    </button>
                    
                    <p className="text-[10px] text-center text-zinc-500">
                      Ao enviar, você concorda em ser contatado pelo Mauro Consultor para fins de orientação técnica.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export function HeroSearch({ variant = 'horizontal', theme = 'dark', projectSlug, projectId, projectName, projectPrice }: HeroSearchProps) {
  return (
    <Suspense fallback={<div className="w-full h-32 bg-white/5 animate-pulse rounded-2xl"></div>}>
      <HeroSearchContent variant={variant} theme={theme} projectSlug={projectSlug} projectId={projectId} projectName={projectName} projectPrice={projectPrice} />
    </Suspense>
  )
}
