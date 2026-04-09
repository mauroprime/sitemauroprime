import { createPromotion } from '@/actions/promotions'
import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NewPromotionPage() {
  const supabase = await createClient()
  const { data: projectsData } = await supabase.from('projects').select('id, title').eq('status', 'published')
  const projects = (projectsData || []) as any[]

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nova Promoção</h1>
        <p className="text-muted-foreground">Cadastre uma nova campanha atrelada a um imóvel.</p>
      </div>

      <form action={createPromotion}>
        <Card>
          <CardHeader>
            <CardTitle>Configuração da Etiqueta / Banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="related_project_id">Projeto Vinculado</Label>
              <select id="related_project_id" name="related_project_id" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                 <option value="">Nenhum (Campanha Global)</option>
                 {projects && projects.map(proj => (
                   <option key={proj.id} value={proj.id}>{proj.title}</option>
                 ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Nome da Campanha Interna *</Label>
              <Input id="title" name="title" placeholder="Ex: Black Friday" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge_text">Texto da Ribbon (Etiqueta Flutuante) *</Label>
              <Input id="badge_text" name="badge_text" placeholder="Ex: Últimas Unidades" required />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Data de Início</Label>
                <Input id="start_date" name="start_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">Data de Encerramento</Label>
                <Input id="end_date" name="end_date" type="date" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input type="checkbox" id="active" name="active" className="w-4 h-4" defaultChecked />
              <Label htmlFor="active">Ativar Promoção Imediatamente</Label>
            </div>

            <div className="pt-6 flex gap-4 justify-end">
              <Link href="/admin/promocoes">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit">Salvar Campanha</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
