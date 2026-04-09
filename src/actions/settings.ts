'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertSiteSettings(formData: FormData) {
  const supabase = await createClient()

  const data = {
    id: '1', // Hardcoded singleton ID
    brand_name: formData.get('brand_name') as string,
    whatsapp_number: formData.get('whatsapp_number') as string | null,
    contact_email: formData.get('contact_email') as string | null,
    address: formData.get('address') as string | null,
    business_hours: formData.get('business_hours') as string | null,
    instagram_url: formData.get('instagram_url') as string | null,
    facebook_url: formData.get('facebook_url') as string | null,
    hero_title: formData.get('hero_title') as string | null,
    hero_subtitle: formData.get('hero_subtitle') as string | null,
    hero_cta_text: formData.get('hero_cta_text') as string,
    
    // Default values if not provided (per the schema requirements, though colors are hidden)
    primary_color: '#000000',
    secondary_color: '#ffffff',
  }

  // Tratamentos para null caso os inputs venham vazios do frontend
  Object.keys(data).forEach(key => {
    if (data[key as keyof typeof data] === '') {
      (data as any)[key] = null
    }
  })

  // Validação mínima
  if (!data.brand_name || !data.hero_cta_text) {
    throw new Error('O Nome da Marca e o Texto do Botão (CTA) são obrigatórios.')
  }

  const { error } = await (supabase.from('site_settings') as any).upsert(data)

  if (error) {
    console.error('upsertSiteSettings error:', error)
    throw new Error('Falha ao salvar as configurações. Verifique os logs e se o limite da tabela permite a gravação.')
  }

  // Purga o cache pesado de todo o site, limpando o Header/Footer de todas as páginas
  revalidatePath('/', 'layout')
}
