import { getSiteSettings } from '@/services/public'
import { upsertSiteSettings } from '@/actions/settings'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Configurações do Site | Admin',
}

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  async function saveSettings(formData: FormData) {
    'use server'
    await upsertSiteSettings(formData)
    redirect('/admin/configuracoes?success=1')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações Gerais</h1>
        <p className="text-muted-foreground">Gerencie as informações de contato e cópia (textos) espalhados pelo seu site.</p>
      </div>

      <form action={saveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        
        {/* BLOCO: INFOS BÁSICAS */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Identificação Geral</CardTitle>
            <CardDescription>Nome da construtora e dados institucionais principais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name">Nome da Marca *</Label>
              <Input id="brand_name" name="brand_name" defaultValue={settings?.brand_name || 'Construtora Prime'} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço Físico Principal</Label>
              <Input id="address" name="address" defaultValue={settings?.address || ''} placeholder="Ex: Av. Faria Lima, 1000 - São Paulo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_hours">Horário de Atendimento</Label>
              <Input id="business_hours" name="business_hours" defaultValue={settings?.business_hours || ''} placeholder="Ex: Seg a Sex: 09h às 18h" />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO: CONTATOS & REDES */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Redes e Contatos</CardTitle>
            <CardDescription>Links ancorados no Header e Footer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp (Telefone Oficial)</Label>
              <Input id="whatsapp_number" name="whatsapp_number" defaultValue={settings?.whatsapp_number || ''} placeholder="Ex: 5511999999999" />
              <p className="text-xs text-muted-foreground">Somente números, com código do país (55).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">E-mail Profissional</Label>
              <Input id="contact_email" name="contact_email" type="email" defaultValue={settings?.contact_email || ''} placeholder="contato@construtoraprime.com.br" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Link do Instagram</Label>
              <Input id="instagram_url" name="instagram_url" type="url" defaultValue={settings?.instagram_url || ''} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Link do Facebook</Label>
              <Input id="facebook_url" name="facebook_url" type="url" defaultValue={settings?.facebook_url || ''} placeholder="https://facebook.com/..." />
            </div>
          </CardContent>
        </Card>

        {/* BLOCO: HOME HERO TEXTS */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Vitrine da Home (Capa)</CardTitle>
            <CardDescription>Textos exibidos no letreiro gigante da página inicial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Título Gigante (Hero Title)</Label>
              <Input id="hero_title" name="hero_title" defaultValue={settings?.hero_title || ''} placeholder="O Seu Próximo Lar Está Aqui" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Subtítulo Abaixo</Label>
              <Input id="hero_subtitle" name="hero_subtitle" defaultValue={settings?.hero_subtitle || ''} placeholder="Empreendimentos de alto padrão projetados..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_cta_text">Texto do Botão Principal *</Label>
              <Input id="hero_cta_text" name="hero_cta_text" defaultValue={settings?.hero_cta_text || 'Ver Lançamentos'} required />
            </div>
          </CardContent>
        </Card>

        {/* CONTROLES / SALVAR */}
        <div className="col-span-1 md:col-span-2 flex justify-end">
          <Button type="submit" size="lg" className="px-8 shadow-md hover:shadow-lg transition-all">
            Salvar Alterações Globais
          </Button>
        </div>

      </form>
    </div>
  )
}
