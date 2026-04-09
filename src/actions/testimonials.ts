'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient()

  const data = {
    client_name: formData.get('client_name') as string,
    client_role: formData.get('client_role') as string | null,
    content: formData.get('content') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    is_featured: formData.get('is_featured') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }

  const { error } = await (supabase.from('testimonials') as any).insert(data)

  if (error) {
    console.error('createTestimonial error:', error)
    throw new Error('Falha ao criar o depoimento.')
  }

  revalidatePath('/')
  redirect('/admin/depoimentos')
}

export async function updateTestimonial(id: string, formData: FormData) {
  const supabase = await createClient()

  const data = {
    client_name: formData.get('client_name') as string,
    client_role: formData.get('client_role') as string | null,
    content: formData.get('content') as string,
    rating: parseInt(formData.get('rating') as string) || 5,
    is_featured: formData.get('is_featured') === 'on',
    display_order: parseInt(formData.get('display_order') as string) || 0,
  }

  const { error } = await (supabase.from('testimonials') as any)
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('updateTestimonial error:', error)
    throw new Error('Falha ao atualizar o depoimento.')
  }

  revalidatePath('/')
  redirect('/admin/depoimentos')
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('deleteTestimonial error:', error)
    throw new Error('Falha ao excluir depoimento.')
  }

  revalidatePath('/')
  redirect('/admin/depoimentos')
}
