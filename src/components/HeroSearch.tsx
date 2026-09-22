'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { ChevronLeft, CheckCircle2, ArrowRight, X } from "lucide-react"
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
  let minVal = 0
  let maxVal = 2000
  let stepVal = 50
  let initialVal = 0
  const rangePlus = projectPrice ? (projectPrice < 200000 ? 50 : 100) : 500

  if (projectPrice) {
    const priceK = projectPrice / 1000
    minVal = 0
    maxVal = Math.max(100, Math.ceil((priceK * 1.5) / 5) * 5)
    stepVal = 5
    initialVal = 0
  }

  // Step state (main form: steps 1-6)
  const [currentStep, setCurrentStep] = useState(1)
  const totalMainSteps = 6

  // Form State - Main Steps (matching LumenCRM flow)
  const [terreno, setTerreno] = useState('')
  const [cidade, setCidade] = useState('')
  const [metragem, setMetragem] = useState('')
  const [projeto, setProjeto] = useState('')

  // Investment slider
  const [investment, setInvestment] = useState(initialVal)
  const [sliderMoved, setSliderMoved] = useState(false)

  // Form State - Modal
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [recurso, setRecurso] = useState('')
  const [prazo, setPrazo] = useState('')

  // Modal State
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(1)
  const [disqualified, setDisqualified] = useState(false)
  const [disqualifyMessage, setDisqualifyMessage] = useState('')

  // Ajusta o valor padrão do investimento se o preço do projeto carregar
  useEffect(() => {
    if (projectPrice) {
      const priceK = projectPrice / 1000
      setInvestment(0)
      setSliderMoved(false)
    }
  }, [projectPrice])

  // Bloqueia scroll do body quando o modal abre
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen])

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
      case 1: return terreno !== ''
      case 2: return cidade !== ''
      case 3: return metragem.trim().length > 0
      case 4: return projeto !== ''
      case 5: return recurso !== ''
      case 6: return prazo !== ''
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
    formData.append('has_land', terreno === 'sim' ? 'true' : 'false')
    formData.append('project_type', 'Personalizado')
    formData.append('investment_range', `R$ ${investment}k`)
    formData.append('timeframe', prazo)
    formData.append('city', cidade)
    formData.append('area', metragem)
    formData.append('has_project', projeto)
    formData.append('financing', recurso)
    formData.append('terreno', terreno)
    formData.append('bairro', '')
    formData.append('projeto', projeto)
    formData.append('recurso', recurso)
    formData.append('prazo', prazo)
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
          params.append('terreno', terreno)
          params.append('cidade', cidade)
          params.append('metragem', metragem)
          params.append('projeto_resp', projeto)
          params.append('recurso', recurso)
          params.append('prazo', prazo)
          
          const labelUpper = projectPrice ? `R$ ${investment + rangePlus}k` : (investment > 1500 ? '2M+' : `R$ ${investment + 500}k`)
          params.append('investment', `R$ ${investment}k a ${labelUpper}`)

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

  // Auto-advance for select buttons
  const handleTerrenoSelect = (value: string) => {
    setTerreno(value)
    if (value === 'nao') {
      setTimeout(() => {
        setDisqualified(true)
        setDisqualifyMessage('No momento, nosso atendimento é focado em quem já possui ou está em processo de aquisição de terreno. Quando tiver o terreno definido, volte e faremos uma análise personalizada para você!')
      }, 300)
      return
    }
    setTimeout(() => goNext(), 300)
  }

  const handleCidadeSelect = (value: string) => {
    setCidade(value)
    if (value === 'fora') {
      setTimeout(() => {
        setDisqualified(true)
        setDisqualifyMessage('Infelizmente nosso atendimento consultivo é focado na região de Curitiba e região metropolitana no momento. Para projetos em outras regiões, recomendamos buscar um consultor local especializado.')
      }, 300)
      return
    }
    setTimeout(() => goNext(), 300)
  }

  const handleProjetoSelect = (value: string) => {
    setProjeto(value)
    setTimeout(() => goNext(), 300)
  }

  const handleRecursoSelect = (value: string) => {
    setRecurso(value)
    setTimeout(() => goNext(), 300)
  }

  const handlePrazoSelect = (value: string) => {
    setPrazo(value)
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
                Você já possui o terreno para fazer a construção?
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Já tenho terreno!', value: 'sim' },
                { label: 'Processo de compra.', value: 'processo' },
                { label: 'Ainda não tenho.', value: 'nao' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTerrenoSelect(option.value)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    terreno === option.value
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option.label}</span>
                  {terreno === option.value && <CheckCircle2 size={18} />}
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
            <div className="space-y-2">
              {[
                { label: 'Curitiba - PR', value: 'curitiba' },
                { label: 'Região metropolitana', value: 'regiao' },
                { label: 'Fora de Curitiba', value: 'fora' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleCidadeSelect(option.value)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    cidade === option.value
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option.label}</span>
                  {cidade === option.value && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
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
                value={metragem}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, '')
                  setMetragem(onlyNums)
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
                Você já possui algum projeto ou croqui?
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Já tenho um projeto.', value: 'jatem' },
                { label: 'Finalizando projeto.', value: 'finalizando' },
                { label: 'Ainda não tenho.', value: 'naotem' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleProjetoSelect(option.value)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    projeto === option.value
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option.label}</span>
                  {projeto === option.value && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 5 de {totalMainSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Recursos próprios ou financiamento?
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Recursos próprios', value: 'recursoProprio' },
                { label: 'Financiamento', value: 'financiamento' },
                { label: 'Os dois', value: 'recursoeFinanciamento' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRecursoSelect(option.value)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    recurso === option.value
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option.label}</span>
                  {recurso === option.value && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-1`}>
                Passo 6 de {totalMainSteps}
              </p>
              <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Pretende iniciar essa obra em qual prazo?
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Imediatamente', value: 'imediatamente' },
                { label: '30 dias', value: '30dias' },
                { label: '90 dias', value: '90dias' },
                { label: '+ de 6 meses', value: '+6meses' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePrazoSelect(option.value)}
                  className={`w-full flex items-center justify-between py-5 px-5 rounded-xl text-sm font-bold transition-all border-2 ${
                    prazo === option.value
                      ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20'
                      : isLight
                      ? 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span>{option.label}</span>
                  {prazo === option.value && <CheckCircle2 size={18} />}
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
      {/* Tela de Desqualificação */}
      {disqualified ? (
        <div className={`w-full ${isVertical ? 'max-w-xl mx-auto' : 'max-w-[1360px]'} ${isLight ? 'bg-zinc-100 border-zinc-200 shadow-xl' : 'bg-brand-dark/85 backdrop-blur-3xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'} border rounded-3xl p-6 md:p-8 lg:p-9 transition-all duration-300`}>
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
              <X className="text-red-500" size={32} />
            </div>
            <h3 className={`text-xl md:text-2xl font-serif ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              Não foi possível continuar
            </h3>
            <p className={`text-sm max-w-md ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {disqualifyMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                setDisqualified(false)
                setDisqualifyMessage('')
                setTerreno('')
                setCidade('')
                setCurrentStep(1)
              }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all"
            >
              Recomeçar
            </button>
          </div>
        </div>
      ) : (
      /* Main Form Container - Step by Step (1-6) */
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
      )}

      {/* Modal / Popup - All fields at once */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden bg-brand-dark border border-white/10 rounded-3xl p-8 shadow-2xl"
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
                          {investment === 0 ? 'Mova para definir' : `R$ ${investment}k - ${projectPrice ? `R$ ${investment + rangePlus}k` : (investment > 1500 ? '2M+' : `R$ ${investment + 500}k`)}`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={minVal}
                        max={maxVal}
                        step={stepVal}
                        value={investment}
                        onChange={(e) => {
                          setInvestment(parseInt(e.target.value))
                          setSliderMoved(true)
                        }}
                        className="w-full cursor-pointer text-white/10"
                      />
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
                      disabled={isPending || !sliderMoved}
                      className={`w-full py-5 rounded-xl text-sm font-black uppercase tracking-[0.1em] transition-all relative overflow-hidden group shadow-xl ${
                        sliderMoved && !isPending
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
