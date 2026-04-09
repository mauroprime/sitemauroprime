import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateProject } from '@/actions/projects'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  const project = data as any

  if (error || !project) {
    notFound()
  }

  // Bind the id to the server action
  const updateProjectWithId = updateProject.bind(null, id)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-y-2">
        <Link href="/admin/projetos" className="mr-4 inline-flex items-center justify-center p-2 rounded-md hover:bg-zinc-100 transition-colors">
           <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Editar Projeto</h2>
      </div>

      <div className="mx-auto max-w-4xl pt-4">
        <form action={updateProjectWithId}>
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Atualize os dados básicos do projeto {project.title}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Projeto</Label>
                  <Input id="title" name="title" required defaultValue={project.title} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo / Chamada</Label>
                  <Input id="subtitle" name="subtitle" defaultValue={project.subtitle || ''} placeholder="Ex: O novo ícone do Batel" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <select id="category" name="category" defaultValue={project.category || ''} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Selecione uma categoria</option>
                    <option value="Alto Padrão">Alto Padrão</option>
                    <option value="Médio Padrão">Médio Padrão</option>
                    <option value="Lançamento">Lançamento</option>
                    <option value="Investimento">Investimento</option>
                    <option value="Pronto para Morar">Pronto para Morar</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" name="status" defaultValue={project.status} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="type">Tipo de Projeto</Label>
                   <Input id="type" name="type" defaultValue={project.type || ''} placeholder="Ex: Casa Térrea, Sobrado, Triplex" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço de Venda (R$)</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={project.price || ''} placeholder="Ex: 349000.00" />
                  <p className="text-[10px] text-muted-foreground">Valor base para exibição no site.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotional_price">Preço Promocional (R$)</Label>
                  <Input id="promotional_price" name="promotional_price" type="number" step="0.01" defaultValue={project.promotional_price || ''} placeholder="Ex: 299000.00" />
                  <p className="text-[10px] text-muted-foreground">Se preenchido, o valor original aparecerá riscado.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20">
                <input 
                  type="checkbox" 
                  id="is_featured" 
                  name="is_featured" 
                  className="h-5 w-5 rounded border-brand-gold/30 text-brand-gold focus:ring-brand-gold accent-brand-gold" 
                  defaultChecked={project.is_featured} 
                />
                <Label htmlFor="is_featured" className="text-sm font-bold text-brand-gold flex items-center gap-2 cursor-pointer">
                  <Star className="w-4 h-4 fill-brand-gold" /> Exibir como Projeto em Destaque (Mural Animado)
                </Label>
              </div>

              <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <Label className="text-sm font-medium">Comportamento ao Clicar na Galeria</Label>
                <p className="text-xs text-muted-foreground mb-3">Escolha o que acontece quando o visitante clica neste projeto no mural/galeria animada.</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gallery_click_action" value="page" defaultChecked={project.gallery_click_action !== 'photo'} className="h-4 w-4 accent-zinc-900" />
                    <span className="text-sm">Abrir página do projeto</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gallery_click_action" value="photo" defaultChecked={project.gallery_click_action === 'photo'} className="h-4 w-4 accent-zinc-900" />
                    <span className="text-sm">Abrir somente a foto</span>
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="cover_image" className="block text-sm font-medium">Imagem de Capa (Opcional)</Label>
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {project.cover_image_url ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border shadow-sm">
                        <img src={project.cover_image_url} alt="Capa atual" className="h-full w-full object-cover" />
                      </div>
                      <label className="flex items-center gap-1 text-xs text-red-600 cursor-pointer hover:underline font-medium">
                        <input type="checkbox" name="delete_cover_image" value="true" className="accent-red-600 scale-110" />
                        Remover Capa
                      </label>
                    </div>
                  ) : (
                    <div className="h-24 w-32 shrink-0 rounded-md border border-dashed flex items-center justify-center bg-zinc-50 text-xs text-zinc-400">
                      Sem Capa
                    </div>
                  )}
                  <div className="flex flex-col gap-2 flex-1 w-full">
                    <Input 
                      id="cover_image" 
                      name="cover_image" 
                      type="file" 
                      accept="image/*"
                      className="cursor-pointer file:cursor-pointer file:font-semibold text-muted-foreground file:text-foreground hover:bg-zinc-50"
                    />
                    <p className="text-xs text-muted-foreground">Envie uma nova imagem para substituir a atual.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label htmlFor="gallery_images" className="block text-sm font-medium pr-2">Galeria Adicional</Label>
                {Array.isArray(project.gallery_images) && project.gallery_images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {project.gallery_images.map((url: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="relative h-20 w-20 overflow-hidden rounded border shadow-sm">
                          <img src={url} alt={`Galeria ${idx}`} className="h-full w-full object-cover" />
                        </div>
                        <label className="flex items-center gap-1 text-xs text-red-600 cursor-pointer hover:underline font-medium">
                          <input type="checkbox" name="delete_gallery_images" value={url} className="accent-red-600 scale-110" />
                          Excluir
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Input 
                    id="gallery_images" 
                    name="gallery_images" 
                    type="file"
                    multiple 
                    accept="image/*"
                    className="cursor-pointer file:cursor-pointer file:font-semibold text-muted-foreground file:text-foreground hover:bg-zinc-50"
                  />
                  <p className="text-xs text-muted-foreground">Novas imagens enviadas serão anexadas à sua galeria existente.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t bg-zinc-50/50 p-4 rounded-xl border-dashed border-2">
                <Label htmlFor="floor_plans" className="block text-sm font-bold text-zinc-900 pr-2">Plantas do Projeto (Blueprints)</Label>
                {Array.isArray(project.floor_plans) && project.floor_plans.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-4">
                    {project.floor_plans.map((url: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="relative h-20 w-20 overflow-hidden rounded border shadow-sm bg-white">
                          <img src={url} alt={`Planta ${idx}`} className="h-full w-full object-contain p-1" />
                        </div>
                        <label className="flex items-center gap-1 text-xs text-red-600 cursor-pointer hover:underline font-medium">
                          <input type="checkbox" name="delete_floor_plans" value={url} className="accent-red-600 scale-110" />
                          Excluir
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Input 
                    id="floor_plans" 
                    name="floor_plans" 
                    type="file"
                    multiple 
                    accept="image/*"
                    className="cursor-pointer file:cursor-pointer file:font-semibold text-muted-foreground file:text-foreground hover:bg-white"
                  />
                  <p className="text-xs text-muted-foreground">Arquivos de planta baixa ou esquemas técnicos aparecerão em uma seção separada da galeria.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Descrição Curta (Card)</Label>
                <Textarea id="short_description" name="short_description" defaultValue={project.short_description || ''} rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Descrição Completa (Página do Projeto)</Label>
                <Textarea id="full_description" name="full_description" defaultValue={project.full_description || ''} rows={8} />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Atributos do Imóvel</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={project.attributes_json?.bedrooms || 0} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={project.attributes_json?.bathrooms || 0} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suites">Suítes</Label>
                    <Input id="suites" name="suites" type="number" min="0" defaultValue={project.attributes_json?.suites || 0} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Metragem (m²)</Label>
                    <Input id="area" name="area" type="number" min="0" defaultValue={project.attributes_json?.area || 0} />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="has_living_room" name="has_living_room" className="h-4 w-4 rounded border-gray-300" defaultChecked={project.attributes_json?.has_living_room} />
                    <Label htmlFor="has_living_room">Possui Sala</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="has_kitchen" name="has_kitchen" className="h-4 w-4 rounded border-gray-300" defaultChecked={project.attributes_json?.has_kitchen} />
                    <Label htmlFor="has_kitchen">Possui Cozinha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="has_laundry" name="has_laundry" className="h-4 w-4 rounded border-gray-300" defaultChecked={project.attributes_json?.has_laundry} />
                    <Label htmlFor="has_laundry">Possui Lavanderia</Label>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="garage_info">Varanda e Garagem (Informação de Texto)</Label>
                  <Input id="garage_info" name="garage_info" defaultValue={project.attributes_json?.garage_info || ''} placeholder="Ex: Varanda e Garagem de 16,30m²" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-end gap-4">
             <Link href="/admin/projetos" className="inline-flex items-center justify-center rounded-md border px-8 py-2 text-sm font-medium hover:bg-zinc-50 transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-8 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900/90 transition-colors">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
