import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deletePromotion } from '@/actions/promotions'

export const metadata = {
  title: 'Promoções | Admin',
}

export default async function PromotionsAdminPage() {
  const supabase = await createClient()
  
  // Pegamos a promoção e seu respectivo projeto (FK related_project_id)
  const { data } = await supabase
    .from('promotions')
    .select('*, projects(title)')
    .order('created_at', { ascending: false })
  const promotions = (data || []) as any[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promoções Especiais</h1>
          <p className="text-muted-foreground">Gerencie campanhas de escassez e ribbons para os seus projetos.</p>
        </div>
        <Link href="/admin/promocoes/new">
          <Button>Adicionar Promoção</Button>
        </Link>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-600">Promoção</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Vinculado a</th>
              <th className="px-6 py-4 font-semibold text-zinc-600">Status</th>
              <th className="px-6 py-4 font-semibold text-zinc-600 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {promotions && promotions.length > 0 ? (
              promotions.map((promo: any) => (
                <tr key={promo.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{promo.title}</div>
                    <div className="text-zinc-500 text-xs">{promo.badge_text || 'Sem Tag'}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-700">
                    {promo.projects?.title || 'Global (Todos)'}
                  </td>
                  <td className="px-6 py-4">
                    {promo.active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Ativa</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Pausada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link href={`/admin/promocoes/${promo.id}/edit`}>
                         <Button variant="outline" size="sm">Editar</Button>
                       </Link>
                       <form action={async () => {
                         'use server'
                         await deletePromotion(promo.id)
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
                  Nenhuma promoção cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
