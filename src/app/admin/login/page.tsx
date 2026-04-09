'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { signIn } from '@/actions/auth'

import { useState } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    try {
      await signIn(formData)
    } catch (e: any) {
      setError(e.message || 'Erro ao fazer login')
    }
  }

  return (
    <div className="w-full">
      {nextPath && (
        <div className="w-full mb-6 p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs text-center">
          Para acessar <b>{nextPath}</b> é necessário autenticação.
        </div>
      )}

      {error && (
        <div className="w-full mb-6 p-3 bg-red-50 text-red-900 border border-red-200 rounded text-xs text-center">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="w-full flex flex-col gap-4">
        <input type="hidden" name="next" value={nextPath || '/admin'} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
          <input 
            id="email"
            name="email"
            type="email" 
            placeholder="seu@email.com" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            required
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">Senha</label>
          <input 
            id="password"
            name="password"
            type="password" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            required
          />
        </div>

        <button 
          type="submit" 
          className="mt-4 bg-zinc-900 text-white rounded-md font-medium h-10 px-4 py-2 hover:bg-zinc-800 transition"
        >
          Entrar no Painel
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border rounded-xl shadow-sm p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold uppercase tracking-tight mb-2">Painel Mauro</h1>
        <p className="text-sm text-muted-foreground mb-8 text-center">
          Acesse para gerenciar projetos, depoimentos e visualizar leads.
        </p>

        <Suspense fallback={<div className="text-sm text-muted-foreground">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
