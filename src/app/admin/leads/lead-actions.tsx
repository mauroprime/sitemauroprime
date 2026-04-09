'use client'

import { useTransition } from 'react'
import { updateLeadStatus, deleteLead } from '@/actions/leads'
import { Button } from '@/components/ui/button'

export function LeadStatusSelect({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      className="bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-md focus:ring-zinc-500 focus:border-zinc-500 block w-full p-2"
      value={currentStatus}
      onChange={(e) => {
        startTransition(() => {
          updateLeadStatus(id, e.target.value)
        })
      }}
      disabled={isPending}
    >
      <option value="new">Novo</option>
      <option value="contacted">Contatado</option>
      <option value="converted">Convertido</option>
      <option value="lost">Perdido</option>
    </select>
  )
}

export function DeleteLeadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      variant="destructive" 
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (confirm('Tem certeza que deseja excluir este lead?')) {
          startTransition(() => {
            deleteLead(id)
          })
        }
      }}
    >
      {isPending ? 'Excluindo...' : 'Excluir'}
    </Button>
  )
}
