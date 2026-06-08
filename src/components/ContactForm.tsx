'use client'

import React, { useState, Suspense } from 'react'
import { submitLead } from '@/actions/leads'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Home as HomeIcon, ChevronDown } from "lucide-react"
import { useSearchParams, useRouter } from 'next/navigation'
import { firePixelEvent } from './FBPixel'

interface ContactFormProps {
  projectSlug?: string
  projectId?: string
  projectPrice?: number
}

function ContactFormContent({ projectSlug, projectId, projectPrice }: ContactFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasStartedFilling, setHasStartedFilling] = useState(false)

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

  // Lead Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [intent, setIntent] = useState<'Construir' | 'Investir' | null>(null)
  const [hasLand, setHasLand] = useState<boolean | null>(null)
  const [type, setType] = useState('')
  const [investment, setInvestment] = useState(initialVal)
  const [timeframe, setTimeframe] = useState('')

  // Ajusta o valor padrão do investimento se o preço do projeto carregar
  React.useEffect(() => {
    if (projectPrice) {
      const priceK = projectPrice / 1000
      setInvestment(Math.floor(priceK / 5) * 5)
    }
  }, [projectPrice])

  const handleFocus = () => {
    if (!hasStartedFilling) {
      setHasStartedFilling(true)
      firePixelEvent('InitiateCheckout', {
        content_name: projectSlug ? `Form: ${projectSlug}` : 'Contato Geral',
        content_category: 'Lead'
      })
    }
  }

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        // Redireciona para página de obrigado
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
    <form onSubmit={handleSubmit} onFocus={handleFocus} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm">
          {error}
        </div>
      )}
      
      {/* Intent Toggle */}
      <div className="space-y-2">
        <Label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">O que você busca?</Label>
        <div className="flex gap-2 p-1.5 bg-brand-black border border-white/5 rounded-xl">
          <button 
            type="button"
            onClick={() => setIntent('Construir')}
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${intent === 'Construir' ? 'text-black bg-brand-gold shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Construir
          </button>
          <button 
            type="button"
            onClick={() => setIntent('Investir')}
            className={`flex-1 py-3 text-xs font-black rounded-lg transition-all uppercase tracking-widest ${intent === 'Investir' ? 'text-black bg-brand-gold shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Investir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Has Land */}
        <div className="space-y-2">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">Possuí terreno?</Label>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setHasLand(true)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all border ${hasLand === true ? 'bg-brand-gold border-brand-gold text-black shadow-lg shadow-brand-gold/20' : 'bg-brand-black border-white/10 text-zinc-500 hover:bg-white/5'}`}
            >
              <CheckCircle2 size={14} className={hasLand === true ? 'opacity-100' : 'opacity-0'} />
              SIM
            </button>
            <button 
              type="button"
              onClick={() => setHasLand(false)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all border ${hasLand === false ? 'bg-zinc-800 border-zinc-800 text-white shadow-lg shadow-black/20' : 'bg-brand-black border-white/10 text-zinc-500 hover:bg-white/5'}`}
            >
              <CheckCircle2 size={14} className={hasLand === false ? 'opacity-100' : 'opacity-0'} />
              NÃO
            </button>
          </div>
        </div>

        {/* Project Style */}
        <div className="space-y-2 relative">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">Estilo do projeto</Label>
          <div className="relative">
            <select 
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-brand-black border border-white/10 rounded-xl px-4 py-3.5 text-sm text-zinc-300 focus:outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-dark">Selecione o padrão</option>
              <option value="Padrão" className="bg-brand-dark">Padrão</option>
              <option value="Médio Padrão" className="bg-brand-dark">Médio Padrão</option>
              <option value="Alto Padrão" className="bg-brand-dark">Alto Padrão</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">
          <span>Investimento Estimado</span>
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
          className="w-full cursor-pointer transition-all text-white/10"
        />
      </div>

      <div className="h-px bg-white/5 my-4"></div>

      {/* Personal Info */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">Nome Completo</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
          disabled={isPending} 
          placeholder="Ex: João Silva"
          className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl h-14" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
          disabled={isPending} 
          placeholder="Ex: joao@email.com"
          className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl h-14" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">Telefone / WhatsApp</Label>
          <Input 
            id="phone" 
            value={whatsapp}
            onChange={handlePhoneChange}
            type="tel" 
            required
            disabled={isPending} 
            placeholder="(00) 00000-0000"
            className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl h-14" 
          />
        </div>

        <div className="space-y-2 relative">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold ml-1">Prazo para começar</Label>
          <div className="relative">
            <select 
              required
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-brand-black border border-white/10 rounded-xl px-4 h-14 text-sm text-zinc-300 focus:outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer"
              disabled={isPending}
            >
              <option value="" className="bg-brand-dark">Selecione o prazo</option>
              <option value="Preciso com urgência" className="bg-brand-dark">Preciso com urgência</option>
              <option value="Pretendo iniciar em 30 dias" className="bg-brand-dark">Pretendo iniciar em 30 dias</option>
              <option value="Pretendo iniciar em 90 dias" className="bg-brand-dark">Pretendo iniciar em 90 dias</option>
              <option value="Pretendo iniciar daqui 6 meses" className="bg-brand-dark">Pretendo iniciar daqui 6 meses</option>
              <option value="Pretendo iniciar daqui 1 ano" className="bg-brand-dark">Pretendo iniciar daqui 1 ano</option>
              <option value="Pretendo iniciar daqui 2 anos" className="bg-brand-dark">Pretendo iniciar daqui 2 anos</option>
              <option value="Somente 2 anos +" className="bg-brand-dark">Somente 2 anos +</option>
              <option value="Estou só avaliando as possibilidades" className="bg-brand-dark">Estou só avaliando as possibilidades</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending || intent === null || hasLand === null || type === ''}
        className={`w-full rounded-xl font-bold h-16 transition-all duration-300 uppercase tracking-widest text-sm mt-4 ${
          intent !== null && hasLand !== null && type !== ''
            ? 'bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-black hover:opacity-90 shadow-[0_10px_30px_rgba(212,175,55,0.2)]'
            : 'bg-white/5 text-zinc-500 cursor-not-allowed border border-white/10'
        }`}
      >
        {isPending ? 'Enviando...' : 'Solicitar Análise de Projeto'}
      </button>
    </form>
  )
}

export function ContactForm({ projectSlug, projectId, projectPrice }: ContactFormProps) {
  return (
    <Suspense fallback={<div className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>}>
      <ContactFormContent projectSlug={projectSlug} projectId={projectId} projectPrice={projectPrice} />
    </Suspense>
  )
}
