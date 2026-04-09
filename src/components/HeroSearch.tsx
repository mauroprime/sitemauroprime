'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { MapPin, Home as HomeIcon, ChevronDown, Search, X, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '@/actions/leads'
import { useSearchParams, useRouter } from 'next/navigation'

interface HeroSearchProps {
  variant?: 'horizontal' | 'vertical'
  theme?: 'dark' | 'light'
}

function HeroSearchContent({ variant = 'horizontal', theme = 'dark' }: HeroSearchProps) {
  const isVertical = variant === 'vertical'
  const isLight = theme === 'light'
  const searchParams = useSearchParams()
  const router = useRouter()

  // Search State
  const [intent, setIntent] = useState<'Construir' | 'Investir'>('Construir')
  const [location, setLocation] = useState('')
  const [locationError, setLocationError] = useState(false)
  const [type, setType] = useState('')
  const [investment, setInvestment] = useState(500)
  
  // Modal State
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Lead Form State
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [hasLand, setHasLand] = useState(false)
  const [timeframe, setTimeframe] = useState('')

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

  const handleAnalyse = () => {
    if (!location.trim()) {
      setLocationError(true)
      return
    }
    setLocationError(false)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('phone', whatsapp)
    formData.append('has_land', hasLand ? 'true' : 'false')
    formData.append('intent', intent)
    formData.append('location', location)
    formData.append('project_type', type)
    formData.append('investment_range', `R$ ${investment}k`)
    formData.append('timeframe', timeframe)

    // Captura UTMs da URL
    formData.append('utm_source', searchParams.get('utm_source') || '')
    formData.append('utm_medium', searchParams.get('utm_medium') || '')
    formData.append('utm_campaign', searchParams.get('utm_campaign') || '')
    formData.append('utm_content', searchParams.get('utm_content') || '')
    formData.append('utm_term', searchParams.get('utm_term') || '')

    try {
      const result = await submitLead(formData)
      if (result.success) {
        setIsSuccess(true)
        // Redireciona para página de obrigado após um pequeno delay para mostrar o sucesso
        setTimeout(() => {
          setIsOpen(false)
          setIsSuccess(false)
          router.push('/obrigado')
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

  return (
    <>
      <div className={`w-full ${isVertical ? '' : 'max-w-7xl'} ${isLight ? 'bg-zinc-100 border-zinc-200 shadow-xl' : 'bg-brand-dark/60 backdrop-blur-3xl border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'} border rounded-2xl p-4 md:p-5 transition-colors duration-300`}>
        <div className={`flex flex-col ${isVertical ? '' : 'xl:flex-row'} items-center gap-8`}>
          
          {/* Type Toggle */}
          <div className={`relative flex items-center w-full ${isVertical ? '' : 'xl:w-auto'} ${isLight ? 'bg-zinc-200 border-zinc-300' : 'bg-black/40 border-white/5'} rounded-xl p-1.5 border shrink-0`}>
            <button 
              onClick={() => setIntent('Construir')}
              className={`flex-1 ${isVertical ? '' : 'xl:w-36'} py-3 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${intent === 'Construir' ? 'text-black bg-brand-gold shadow-lg' : isLight ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-500 hover:text-white'}`}
            >
              Construir
            </button>
            <button 
              onClick={() => setIntent('Investir')}
              className={`flex-1 ${isVertical ? '' : 'xl:w-36'} py-3 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${intent === 'Investir' ? 'text-black bg-brand-gold shadow-lg' : isLight ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-500 hover:text-white'}`}
            >
              Investir
            </button>
          </div>

          {!isVertical && <div className={`h-12 w-px ${isLight ? 'bg-zinc-300' : 'bg-white/10'} hidden xl:block shrink-0`}></div>}

          <div className={`flex-1 grid grid-cols-1 ${isVertical ? 'gap-6' : 'md:grid-cols-3 xl:grid-cols-10 gap-8'} w-full items-center`}>
            {/* Location */}
            <div className={`relative group ${isVertical ? '' : 'md:col-span-1 xl:col-span-3'}`}>
              <label className={`text-[9px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-500' : 'text-zinc-500'} block mb-2 ml-1`}>Localização Terreno</label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform group-hover:scale-110 ${locationError ? 'text-red-400' : 'text-brand-gold'}`} />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    if (locationError) setLocationError(false)
                  }}
                  placeholder="Seu Terreno ou Cidade" 
                  className={`w-full ${isLight ? 'bg-white border-zinc-300 text-zinc-900 focus:border-brand-gold placeholder-zinc-400' : 'bg-white/5 border-white/10 text-white focus:border-brand-gold placeholder-zinc-500'} border rounded-xl pl-10 pr-4 py-3.5 text-sm focus:outline-none transition-all hover:bg-white/10 ${locationError ? 'border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)] placeholder-red-400/50' : ''}`}
                />
              </div>
              {locationError && (
                <span className="absolute -bottom-5 left-2 text-[10px] text-red-400 font-medium whitespace-nowrap">
                  Este campo precisa ser preenchido
                </span>
              )}
            </div>
            
            {/* Property Type */}
            <div className={`relative group ${isVertical ? '' : 'md:col-span-1 xl:col-span-3'}`}>
              <label className={`text-[9px] uppercase tracking-[0.2em] font-bold ${isLight ? 'text-zinc-500' : 'text-zinc-500'} block mb-2 ml-1`}>Qual o projeto?</label>
              <div className="relative">
                <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold w-4 h-4 transition-transform group-hover:scale-110" />
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full ${isLight ? 'bg-white border-zinc-300 text-zinc-900 focus:border-brand-gold' : 'bg-white/5 border-white/10 text-zinc-300 focus:border-brand-gold'} border rounded-xl pl-10 pr-10 py-3.5 text-sm appearance-none focus:outline-none transition-all hover:bg-white/10 cursor-pointer`}
                >
                  <option value="" className={isLight ? 'bg-white text-zinc-900' : 'bg-brand-dark text-white'}>Selecione o estilo</option>
                  <option value="terrea" className={isLight ? 'bg-white text-zinc-900' : 'bg-brand-dark text-white'}>Casa Térrea</option>
                  <option value="sobrado" className={isLight ? 'bg-white text-zinc-900' : 'bg-brand-dark text-white'}>Sobrado Moderno</option>
                  <option value="geminada" className={isLight ? 'bg-white text-zinc-900' : 'bg-brand-dark text-white'}>Invest./Geminadas</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className={`relative ${isVertical ? '' : 'md:col-span-1 xl:col-span-4'} flex flex-col justify-center px-2`}>
              <div className={`flex justify-between text-[9px] ${isLight ? 'text-zinc-600' : 'text-zinc-500'} mb-2 uppercase font-black tracking-[0.15em]`}>
                <span>Investimento Estimado</span>
                <span className="text-brand-gold">R$ {investment}k - {investment > 1500 ? '2M+' : `R$ ${investment + 500}k`}</span>
              </div>
              <input 
                type="range" 
                min="200" 
                max="2000" 
                step="50"
                value={investment}
                onChange={(e) => setInvestment(parseInt(e.target.value))}
                className={`w-full h-1.5 ${isLight ? 'bg-zinc-300' : 'bg-white/10'} rounded-lg appearance-none cursor-pointer accent-brand-gold hover:bg-white/20 transition-all`}
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAnalyse}
            className="w-full xl:w-auto bg-brand-gold hover:bg-brand-goldlight text-black px-10 py-5 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shrink-0 group shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
          >
            <Search className="w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
            <span>Analisar Agora</span>
          </button>
        </div>
      </div>

      {/* Modal / Popup */}
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
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
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
                  <p className="text-zinc-400">Obrigado pelo interesse! Redirecionando para a página de obrigado...</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">Quase lá!</h3>
                    <p className="text-sm text-zinc-400">Complete seus dados para abrirmos sua análise consultiva personalizada.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg">
                        {error}
                      </div>
                    )}

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

                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors mb-4" onClick={() => setHasLand(!hasLand)}>
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${hasLand ? 'bg-brand-gold border-brand-gold text-black' : 'border-zinc-700'}`}>
                        {hasLand && <CheckCircle2 size={16} strokeWidth={3} />}
                      </div>
                      <span className="text-sm font-medium text-zinc-300">Já possuo terreno</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Quando você pretende iniciar?</label>
                      <select 
                        required
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white appearance-none focus:outline-none focus:border-brand-gold transition-all"
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

export function HeroSearch({ variant = 'horizontal', theme = 'dark' }: HeroSearchProps) {
  return (
    <Suspense fallback={<div className="w-full h-32 bg-white/5 animate-pulse rounded-2xl"></div>}>
      <HeroSearchContent variant={variant} theme={theme} />
    </Suspense>
  )
}
