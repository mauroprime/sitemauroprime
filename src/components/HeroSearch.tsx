'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { MapPin, Home as HomeIcon, ChevronDown, ChevronLeft, CheckCircle2, ArrowRight } from "lucide-react"
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

  // Step state
  const [currentStep, setCurrentStep] = useState(1)
  const totalMainSteps = 4
  const totalModalSteps = 4
  const totalSteps = totalMainSteps + totalModalSteps

  // Form State
  const [intent, setIntent] = useState<'Construir' | 'Investir' | null>(null)
  const [hasLand, setHasLand] = useState<boolean | null>(null)
  const [type, setType] = useState('')
  const [investment, setInvestment] = useState(initialVal)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [timeframe, setTimeframe] = useState('')

  // Modal State
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

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
      setCurrentStep(totalMainSteps + 1)
      firePixelEvent('InitiateCheckout', {
        content_name: projectSlug ? `Análise: ${projectSlug}` : 'Procura Geral',
        content_category: type || 'Geral'
      })
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goBack = () => {
    setDirection(-1)
    if (currentStep === totalMainSteps + 1) {
      // Volta do modal para a tela principal
      setIsOpen(false)
      setCurrentStep(totalMainSteps)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return intent !== null
      case 2: return hasLand !== null
      case 3: return type !== ''
      case 4: return true // slider always valid
      case 5: return name.trim().length > 0
      case 6: return email.includes('@') && email.includes('.')
      case 7: return whatsapp.replace(/\D/g, '').length >= 10
      case 8: return timeframe !== ''
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
    formData.append('intent', intent || '')
    formData.append('has_land', hasLand ? 'true' : 'false')
    formData.append('project_type', type)
    formData.append('investment_range', `R$ ${investment}k`)
    formData.append('timeframe', timeframe)
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
          params.append('intent', intent || '')
          params.append('has_land', hasLand ? 'true' : 'false')
          params.append('project_type', type)
          
          const labelUpper = projectPrice ? `R$ ${investment + rangePlus}k` : (investment > 1500 ? '2M+' : `R$ ${investment + 500}k`)
          params.append('investment', `R$ ${investment}k a ${labelUpper}`)
          params.append('timeframe', timeframe)

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

  // Auto-advance for toggle buttons (steps 1 and 2)
  const handleIntentSelect = (value: 'Construir' | 'Investir') => {
    setIntent(value)
    setTimeout(() => goNext(), 300)
  }

  const handleHasLandSelect = (value: boolean) => {
    setHasLand(value)
    setTimeout(() => goNext(), 300)
  }

  const handleTypeSelect = (value: string) => {
    setType(value)
    if (value) {
      setTimeout(() => goNext(), 300)
    }
  }

  // Progress dots
  const renderProgress = (stepInTotal: number, total: number) => (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i + 1 === stepInTotal
              ? 'w-8 bg-brand-gold'
              : i + 1 < stepInTotal
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

  // Step content for main page
  const renderMainStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 1 de {totalSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                O que você busca?
              </h3>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleIntentSelect('Construir')}
                className={`flex-1 py-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                  intent === 'Construir'
                    ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                    : isLight
                    ? 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                }`}
              >
                <HomeIcon className="w-6 h-6 mx-auto mb-2" />
                Construir
              </button>
              <button
                type="button"
                onClick={() => handleIntentSelect('Investir')}
                className={`flex-1 py-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                  intent === 'Investir'
                    ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                    : isLight
                    ? 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Investir
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 2 de {totalSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Possui terreno?
              </h3>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleHasLandSelect(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-6 rounded-xl text-xs font-black transition-all border-2 ${
                  hasLand === true
                    ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                    : isLight
                    ? 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                }`}
              >
                <CheckCircle2 size={18} className={hasLand === true ? 'opacity-100' : 'opacity-0'} />
                SIM
              </button>
              <button
                type="button"
                onClick={() => handleHasLandSelect(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-6 rounded-xl text-xs font-black transition-all border-2 ${
                  hasLand === false
                    ? 'bg-zinc-800 border-zinc-800 text-white shadow-lg shadow-black/20'
                    : isLight
                    ? 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                    : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                }`}
              >
                <CheckCircle2 size={18} className={hasLand === false ? 'opacity-100' : 'opacity-0'} />
                NÃO
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 3 de {totalSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Estilo do projeto
              </h3>
            </div>
            <div className="space-y-2">
              {['Padrão', 'Médio Padrão', 'Alto Padrão'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleTypeSelect(option)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    type === option
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option}</span>
                  {type === option && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 4 de {totalSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Investimento estimado
              </h3>
            </div>
            <div className="space-y-3 px-1">
              <div className={`flex justify-between text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-500'} uppercase font-black tracking-widest`}>
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
                className={`w-full cursor-pointer transition-all ${isLight ? 'text-zinc-300' : 'text-white/10'}`}
              />
            </div>
            <button
              type="button"
              onClick={goNext}
              className="w-full bg-brand-gold hover:bg-brand-goldlight text-black py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )

      default:
        return null
    }
  }

  // Step content for modal
  const renderModalStep = () => {
    switch (currentStep) {
      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1">
                Passo 5 de {totalSteps}
              </p>
              <h3 className="text-xl md:text-2xl font-serif text-white">
                Seu nome
              </h3>
              <p className="text-sm text-zinc-400 mt-1">Para personalizar seu atendimento</p>
            </div>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              autoFocus
              className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition-all text-center text-lg"
              disabled={isPending}
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

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1">
                Passo 6 de {totalSteps}
              </p>
              <h3 className="text-xl md:text-2xl font-serif text-white">
                Seu email
              </h3>
              <p className="text-sm text-zinc-400 mt-1">Para enviarmos sua análise</p>
            </div>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: joao@email.com"
              autoFocus
              className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition-all text-center text-lg"
              disabled={isPending}
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

      case 7:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1">
                Passo 7 de {totalSteps}
              </p>
              <h3 className="text-xl md:text-2xl font-serif text-white">
                WhatsApp
              </h3>
              <p className="text-sm text-zinc-400 mt-1">Para contato rápido</p>
            </div>
            <input
              required
              type="tel"
              value={whatsapp}
              onChange={handlePhoneChange}
              placeholder="(00) 00000-0000"
              autoFocus
              className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold transition-all text-center text-lg tracking-wider"
              disabled={isPending}
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

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1">
                Passo 8 de {totalSteps} — Último!
              </p>
              <h3 className="text-xl md:text-2xl font-serif text-white">
                Prazo para iniciar
              </h3>
              <p className="text-sm text-zinc-400 mt-1">Quando você pretende começar?</p>
            </div>
            <select
              required
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-brand-gold transition-all text-center text-lg cursor-pointer"
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
            <button
              type="submit"
              disabled={isPending || !canProceed()}
              className={`w-full py-5 rounded-xl text-sm font-black uppercase tracking-[0.1em] transition-all duration-300 relative overflow-hidden group shadow-xl ${
                canProceed() && !isPending
                  ? 'bg-brand-gold hover:bg-brand-goldlight text-black'
                  : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10'
              }`}
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
          </div>
        )

      default:
        return null
    }
  }

  // Determine if we're in modal steps
  const isInModal = currentStep > totalMainSteps

  return (
    <>
      {/* Main Form Container */}
      <div className={`w-full ${isVertical ? 'max-w-xl mx-auto' : 'max-w-[1360px]'} ${isLight ? 'bg-zinc-100 border-zinc-200 shadow-xl' : 'bg-brand-dark/85 backdrop-blur-3xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'} border rounded-3xl p-6 md:p-8 lg:p-9 transition-all duration-300`}>
        <div className="flex flex-col w-full gap-4">
          {/* Progress Bar */}
          {renderProgress(currentStep, totalMainSteps)}

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

      {/* Modal / Popup - Steps 5-8 */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-brand-dark border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Box Background Decor */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl"></div>

              <button
                onClick={() => {
                  setIsOpen(false)
                  setCurrentStep(totalMainSteps)
                }}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
                disabled={isPending}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                <form onSubmit={handleSubmit}>
                  {/* Modal Progress */}
                  {renderProgress(currentStep - totalMainSteps, totalModalSteps)}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  <div className="relative min-h-[240px] flex items-center">
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
                        {renderModalStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Back Button in Modal */}
                  {currentStep > totalMainSteps + 1 && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mt-2 w-full"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Voltar
                    </button>
                  )}
                </form>
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
