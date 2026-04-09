import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteTestimonial } from '@/actions/testimonials'

export const metadata = {
  title: 'Depoimentos | Admin',
}

export default async function TestimonialsAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  const testimonials = data as any[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Depoimentos</h1>
          <p className="text-muted-foreground">Gerencie a prova social exibida no site.</p>
        </div>
        <Link href="/admin/depoimentos/new">
          <Button>Adicionar Depoimento</Button>
        </Link>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-600">Cliente</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Avaliação</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Destaque</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {testimonials && testimonials.length > 0 ? (
              testimonials.map((test) => (
                <tr key={test.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{test.client_name}</div>
                    <div className="text-zinc-500 text-xs">{test.client_role || 'Sem cargo'}</div>
                  </td>
                  <td className="px-6 py-4">{'⭐'.repeat(test.rating)}</td>
                  <td className="px-6 py-4">
                    {test.is_featured ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Sim</span>
                    ) : (
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs">Não</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link href={`/admin/depoimentos/${test.id}/edit`}>
                         <Button variant="outline" size="sm">Editar</Button>
                       </Link>
                       <form action={async () => {
                         'use server'
                         await deleteTestimonial(test.id)
                       }}>
                         <Button variant="destructive" size="sm">Excluir</Button>
                       </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum depoimento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
