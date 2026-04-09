import { updateTestimonial } from '@/actions/testimonials'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { notFound } from 'next/navigation'

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await (supabase.from('testimonials') as any)
    .select('*')
    .eq('id', id)
    .single()

  const test = data as any

  if (!test) {
    notFound()
  }

  const handleUpdate = updateTestimonial.bind(null, id)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Depoimento</h1>
        <p className="text-muted-foreground">Atualizando informações da prova social.</p>
      </div>

      <form action={handleUpdate}>
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome do Cliente *</Label>
              <Input id="client_name" name="client_name" defaultValue={test.client_name} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_role">Cargo ou Relação (ex: Investidor, Morador)</Label>
              <Input id="client_role" name="client_role" defaultValue={test.client_role || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Texto do Depoimento *</Label>
              <Textarea id="content" name="content" defaultValue={test.content} className="h-32" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Estrelas (1 a 5)</Label>
                <Input id="rating" name="rating" type="number" min="1" max="5" defaultValue={test.rating} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input id="display_order" name="display_order" type="number" defaultValue={test.display_order} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="is_featured" name="is_featured" className="w-4 h-4" defaultChecked={test.is_featured} />
              <Label htmlFor="is_featured">Destacar (Exibir cor diferenciada ou na Home)</Label>
            </div>

            <div className="pt-6 flex gap-4 justify-end">
              <Link href="/admin/depoimentos">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
