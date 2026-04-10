'use client'

import React, { useState, Suspense } from 'react'
import { submitLead } from '@/actions/leads'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSearchParams, useRouter } from 'next/navigation'
import { firePixelEvent } from './FBPixel'

interface ContactFormProps {
  projectSlug?: string
  projectId?: string
}

function ContactFormContent({ projectSlug, projectId }: ContactFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasStartedFilling, setHasStartedFilling] = useState(false)

  const handleFocus = () => {
    if (!hasStartedFilling) {
      setHasStartedFilling(true)
      firePixelEvent('InitiateCheckout', {
        content_name: projectSlug ? `Form: ${projectSlug}` : 'Contato Geral',
        content_category: 'Lead'
      })
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    if (projectId) {
      formData.append('related_project_id', projectId)
    }
    
    // Captura UTMs da URL
    formData.append('utm_source', searchParams.get('utm_source') || '')
    formData.append('utm_medium', searchParams.get('utm_medium') || '')
    formData.append('utm_campaign', searchParams.get('utm_campaign') || '')
    formData.append('utm_content', searchParams.get('utm_content') || '')
    formData.append('utm_term', searchParams.get('utm_term') || '')

    try {
      const result = await submitLead(formData)
      if (result.success) {
        // Redireciona para página de obrigado
        const redirectUrl = projectSlug ? `/obrigado?projeto=${projectSlug}` : '/obrigado'
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
      
      <div className="space-y-2 text-left">
        <Label htmlFor="name" className="text-zinc-400 font-normal">Nome Completo</Label>
        <Input id="name" name="name" required disabled={isPending} className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-400 font-normal">E-mail</Label>
          <Input id="email" name="email" type="email" required disabled={isPending} className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-zinc-400 font-normal">Telefone / WhatsApp</Label>
          <Input id="phone" name="phone" type="tel" disabled={isPending} className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl" />
        </div>
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="message" className="text-zinc-400 font-normal">Sua mensagem ou dúvida</Label>
        <Textarea 
          id="message" 
          name="message" 
          rows={4} 
          disabled={isPending}
          className="bg-brand-black border-white/10 text-white focus-visible:ring-brand-gold/50 rounded-xl resize-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-black rounded-xl font-bold h-14 hover:opacity-90 transition-all duration-300 disabled:opacity-70 shadow-[0_10px_30px_rgba(212,175,55,0.2)] uppercase tracking-widest text-sm"
      >
        {isPending ? 'Enviando...' : 'Solicitar Análise de Projeto'}
      </button>
    </form>
  )
}

export function ContactForm({ projectSlug, projectId }: ContactFormProps) {
  return (
    <Suspense fallback={<div className="h-64 bg-white/5 animate-pulse rounded-2xl"></div>}>
      <ContactFormContent projectSlug={projectSlug} projectId={projectId} />
    </Suspense>
  )
}
