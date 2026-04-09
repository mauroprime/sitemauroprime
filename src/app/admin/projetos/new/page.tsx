import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createProject } from '@/actions/projects'

export default function NewProjectPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-y-2">
        <Link href="/admin/projetos" className="mr-4 inline-flex items-center justify-center p-2 rounded-md hover:bg-zinc-100 transition-colors">
           <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Criar Projeto</h2>
      </div>

      <div className="mx-auto max-w-4xl pt-4">
        <form action={createProject}>
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Defina os dados básicos do novo empreendimento ou consultoria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Projeto</Label>
                  <Input id="title" name="title" required placeholder="Ex: Residencial Prime" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtítulo / Chamada</Label>
                  <Input id="subtitle" name="subtitle" placeholder="Ex: O novo ícone do Batel" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" name="slug" required placeholder="ex: residencial-prime" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                  <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
                <div className="space-y-2">
                   <Label htmlFor="type">Tipo de Projeto</Label>
                   <Input id="type" name="type" placeholder="Ex: Casa Térrea, Sobrado, Triplex" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço de Venda (R$)</Label>
                  <Input id="price" name="price" type="number" step="0.01" placeholder="Ex: 349000.00" />
                  <p className="text-[10px] text-muted-foreground">Valor base para exibição no site.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotional_price">Preço Promocional (R$)</Label>
                  <Input id="promotional_price" name="promotional_price" type="number" step="0.01" placeholder="Ex: 299000.00" />
                  <p className="text-[10px] text-muted-foreground">Se preenchido, o valor original aparecerá riscado.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20">
                <input type="checkbox" id="is_featured" name="is_featured" className="h-5 w-5 rounded border-brand-gold/30 text-brand-gold focus:ring-brand-gold accent-brand-gold" />
                <Label htmlFor="is_featured" className="text-sm font-bold text-brand-gold flex items-center gap-2 cursor-pointer">
                  <Star className="w-4 h-4 fill-brand-gold" /> Exibir como Projeto em Destaque (Mural Animado)
                </Label>
              </div>

              <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <Label className="text-sm font-medium">Comportamento ao Clicar na Galeria</Label>
                <p className="text-xs text-muted-foreground mb-3">Escolha o que acontece quando o visitante clica neste projeto no mural/galeria animada.</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gallery_click_action" value="page" defaultChecked className="h-4 w-4 accent-zinc-900" />
                    <span className="text-sm">Abrir página do projeto</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="gallery_click_action" value="photo" className="h-4 w-4 accent-zinc-900" />
                    <span className="text-sm">Abrir somente a foto</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_image" className="block text-sm font-medium">Imagem de Capa (Principal)</Label>
                <Input 
                  id="cover_image" 
                  name="cover_image" 
                  type="file" 
                  accept="image/*"
                  className="cursor-pointer file:cursor-pointer file:font-semibold text-muted-foreground file:text-foreground hover:bg-zinc-50"
                />
                <p className="text-xs text-muted-foreground">Recomendado: 1200x800px (.jpg, .png ou .webp)</p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label htmlFor="gallery_images" className="block text-sm font-medium pr-2">Galeria de Imagens (Opcional)</Label>
                <div className="flex flex-col gap-2">
                  <Input 
                    id="gallery_images" 
                    name="gallery_images" 
                    type="file"
                    multiple 
                    accept="image/*"
                    className="cursor-pointer file:cursor-pointer file:font-semibold text-muted-foreground file:text-foreground hover:bg-zinc-50"
                  />
                  <p className="text-xs text-muted-foreground">Você pode selecionar várias imagens de uma vez para a galeria.</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t bg-zinc-50/50 p-4 rounded-xl border-dashed border-2">
                <Label htmlFor="floor_plans" className="block text-sm font-bold text-zinc-900 pr-2">Plantas do Projeto (Opcional)</Label>
                <div className="flex flex-col gap-2">
                  <Input 
                    id="floor_plans" 
                    name="floor_plans" 
                    type="file"
                    multiple 
                    accept="image/*"
                    className="cursor-pointer file:cursor-pointer file:font-semibold text-muted-foreground file:text-foreground hover:bg-white"
                  />
                  <p className="text-xs text-muted-foreground">Envie os esquemas técnicos ou plantas baixas aqui.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Descrição Curta (Card)</Label>
                <Textarea id="short_description" name="short_description" placeholder="Resumo do projeto que aparecerá nos cards e buscas" rows={2} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Descrição Completa (Página do Projeto)</Label>
                <Textarea id="full_description" name="full_description" placeholder="Descreva todos os detalhes, diferenciais e informações técnicas do projeto..." rows={8} />
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Atributos do Imóvel</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input id="bedrooms" name="bedrooms" type="number" min="0" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input id="bathrooms" name="bathrooms" type="number" min="0" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="suites">Suítes</Label>
                    <Input id="suites" name="suites" type="number" min="0" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Metragem (m²)</Label>
                    <Input id="area" name="area" type="number" min="0" placeholder="Ex: 150" />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="has_living_room" name="has_living_room" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="has_living_room">Possui Sala</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="has_kitchen" name="has_kitchen" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="has_kitchen">Possui Cozinha</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="has_laundry" name="has_laundry" className="h-4 w-4 rounded border-gray-300" />
                    <Label htmlFor="has_laundry">Possui Lavanderia</Label>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="garage_info">Varanda e Garagem (Informação de Texto)</Label>
                  <Input id="garage_info" name="garage_info" placeholder="Ex: Varanda e Garagem de 16,30m²" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-end">
            <button type="submit" className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-8 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900/90 transition-colors">
              Salvar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
