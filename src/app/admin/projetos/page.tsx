import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toggleProjectPublish, deleteProject } from '@/actions/projects'

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  const projects = (data || []) as any[]

  if (error) {
    return <div className="p-8 text-red-500">Erro ao carregar projetos: {error.message}</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Projetos</h2>
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/projetos/new"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Projetos</CardTitle>
          <CardDescription>
            Gerencie seu portfólio. Projetos em rascunho não aparecem no site público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        project.status === 'published' ? 'bg-green-100 text-green-800' : 
                        project.status === 'archived' ? 'bg-zinc-100 text-zinc-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'published' ? 'Publicado' : project.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                      </span>
                    </TableCell>
                    <TableCell>{project.category || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <form action={async () => {
                           'use server';
                           await toggleProjectPublish(project.id, project.status);
                        }}>
                           <button className="text-xs border px-2 py-1 rounded hover:bg-zinc-50 transition-colors">
                             {project.status === 'published' ? 'Ocultar' : 'Publicar'}
                           </button>
                        </form>
                        <Link href={`/admin/projetos/${project.id}/edit`} className="text-xs border px-2 py-1 rounded hover:bg-zinc-50 transition-colors">
                          Editar
                        </Link>
                        <form action={async () => {
                           'use server';
                           await deleteProject(project.id);
                        }}>
                           <button className="text-xs border px-2 py-1 rounded text-red-600 hover:bg-red-50 transition-colors">
                             Excluir
                           </button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum projeto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
