'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPromotion(formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string | null,
    badge_text: formData.get('badge_text') as string | null,
    related_project_id: formData.get('related_project_id') as string || null,
    start_date: formData.get('start_date') as string || null,
    end_date: formData.get('end_date') as string || null,
    active: formData.get('active') === 'on',
  }

  const { error } = await (supabase.from('promotions') as any).insert(data)

  if (error) {
    console.error('createPromotion error:', error)
    throw new Error('Falha ao criar a promoção.')
  }

  // Purga cash das promoções ativas na Home
  revalidatePath('/')
  redirect('/admin/promocoes')
}

export async function updatePromotion(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string | null,
    badge_text: formData.get('badge_text') as string | null,
    related_project_id: formData.get('related_project_id') as string || null,
    start_date: formData.get('start_date') as string || null,
    end_date: formData.get('end_date') as string || null,
    active: formData.get('active') === 'on',
  }

  const { error } = await (supabase.from('promotions') as any)
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('updatePromotion error:', error)
    throw new Error('Falha ao atualizar a promoção.')
  }

  revalidatePath('/')
  redirect('/admin/promocoes')
}

export async function deletePromotion(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deletePromotion error:', error)
    throw new Error('Falha ao excluir promoção.')
  }

  revalidatePath('/')
  redirect('/admin/promocoes')
}
