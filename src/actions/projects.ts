'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

/**
 * Utilitário interno para subir o File do Next nativo para o Supabase Storage.
 * Retorna a URL pública gerada.
 */
async function uploadToStorage(supabase: any, file: File, bucket: string = 'project-images') {
  const fileName = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, '_')}`
  
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  })
  
  if (error) {
    throw error
  }
  
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return publicData.publicUrl
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title')?.toString() || 'Novo Projeto'
  const subtitle = formData.get('subtitle')?.toString() || null
  const slug = formData.get('slug')?.toString() || crypto.randomUUID()
  const status = formData.get('status')?.toString() || 'draft'
  const short_description = formData.get('short_description')?.toString() || ''
  const full_description = formData.get('full_description')?.toString() || null
  const category = formData.get('category')?.toString() || ''
  const type = formData.get('type')?.toString() || null
  const price = formData.get('price') ? Number(formData.get('price')) : null
  const promotional_price = formData.get('promotional_price') ? Number(formData.get('promotional_price')) : null
  const is_featured = formData.get('is_featured') === 'on'
  const gallery_click_action = formData.get('gallery_click_action')?.toString() || 'page'

  // Lógica de plantas (floor_plans)
  const floorPlansFiles = formData.getAll('floor_plans') as File[]
  const validFloorPlansFiles = floorPlansFiles.filter(f => f.size > 0)
  let floor_plans: string[] = []

  // Faz a checagem e upload da capa se houver
  const coverImageFile = formData.get('cover_image') as File | null
  let cover_image_url = null

  // Lógica de upload em batch (Galeria)
  const galleryFiles = formData.getAll('gallery_images') as File[]
  const validGalleryFiles = galleryFiles.filter(f => f.size > 0)
  let gallery_images: string[] = []

  try {
    if (coverImageFile && coverImageFile.size > 0) {
      cover_image_url = await uploadToStorage(supabase, coverImageFile)
    }
    
    if (validGalleryFiles.length > 0) {
      gallery_images = await Promise.all(validGalleryFiles.map(f => uploadToStorage(supabase, f)))
    }

    if (validFloorPlansFiles.length > 0) {
      floor_plans = await Promise.all(validFloorPlansFiles.map(f => uploadToStorage(supabase, f)))
    }
  } catch (uploadError) {
    console.error('Erro de upload na criação:', uploadError)
    throw new Error('Falha ao processar arquivos de imagem ou plantas.')
  }

  const attributes_json = {
    bedrooms: Number(formData.get('bedrooms')) || 0,
    bathrooms: Number(formData.get('bathrooms')) || 0,
    suites: Number(formData.get('suites')) || 0,
    area: Number(formData.get('area')) || 0,
    has_living_room: formData.get('has_living_room') === 'on',
    has_kitchen: formData.get('has_kitchen') === 'on',
    has_laundry: formData.get('has_laundry') === 'on',
    garage_info: formData.get('garage_info')?.toString() || '',
  }

  const payload: ProjectInsert = {
      title,
      slug,
      subtitle,
      status: status as "published" | "draft" | "archived",
      short_description,
      full_description,
      category,
      cover_image_url,
      gallery_images,
      floor_plans,
      is_featured,
      is_promotional: !!promotional_price,
      display_order: 0,
      gallery_click_action: gallery_click_action as 'page' | 'photo',
      attributes_json,
      price,
      promotional_price,
      type,
  }

  const { error } = await (supabase.from('projects') as any).insert(payload)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/projetos')
  revalidatePath('/')
  redirect('/admin/projetos')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title')?.toString()
  const subtitle = formData.get('subtitle')?.toString()
  const status = formData.get('status')?.toString() 
  const short_description = formData.get('short_description')?.toString()
  const full_description = formData.get('full_description')?.toString()
  const category = formData.get('category')?.toString() 
  const type = formData.get('type')?.toString()
  const price = formData.get('price') ? Number(formData.get('price')) : (formData.has('price') ? null : undefined)
  const promotional_price = formData.get('promotional_price') ? Number(formData.get('promotional_price')) : (formData.has('promotional_price') ? null : undefined)

  const updates: any = {}
  if (title !== undefined) updates.title = title
  if (subtitle !== undefined) updates.subtitle = subtitle
  if (status !== undefined) updates.status = status as "published" | "draft" | "archived"
  if (short_description !== undefined) updates.short_description = short_description
  if (full_description !== undefined) updates.full_description = full_description
  if (category !== undefined) updates.category = category
  if (type !== undefined) updates.type = type
  if (price !== undefined) updates.price = price
  if (promotional_price !== undefined) updates.promotional_price = promotional_price
  
  updates.is_featured = formData.get('is_featured') === 'on'
  if (promotional_price !== undefined) {
    updates.is_promotional = !!promotional_price
  }


  const gallery_click_action = formData.get('gallery_click_action')?.toString()
  if (gallery_click_action) {
    updates.gallery_click_action = gallery_click_action
  }

  // Atributos via JSON
  const attributes_json = {
    bedrooms: Number(formData.get('bedrooms')) || 0,
    bathrooms: Number(formData.get('bathrooms')) || 0,
    suites: Number(formData.get('suites')) || 0,
    area: Number(formData.get('area')) || 0,
    has_living_room: formData.get('has_living_room') === 'on',
    has_kitchen: formData.get('has_kitchen') === 'on',
    has_laundry: formData.get('has_laundry') === 'on',
    garage_info: formData.get('garage_info')?.toString() || '',
  }
  updates.attributes_json = attributes_json

  // Lógica de upload em Update
  const coverImageFile = formData.get('cover_image') as File | null
  const galleryFiles = formData.getAll('gallery_images') as File[]
  const validGalleryFiles = galleryFiles.filter(f => f.size > 0)

  // Plantas
  const floorPlansFiles = formData.getAll('floor_plans') as File[]
  const validFloorPlansFiles = floorPlansFiles.filter(f => f.size > 0)

  // Deletions
  const deleteCoverImage = formData.get('delete_cover_image') === 'true'
  const deleteGalleryImagesURL = formData.getAll('delete_gallery_images').map(String)
  const deleteFloorPlansURL = formData.getAll('delete_floor_plans').map(String)

  // Fetch das imagens atuais para poder remover ou adicionar
  const { data: proj } = await supabase.from('projects').select('gallery_images, floor_plans').eq('id', id).single()
  let currentGallery = Array.isArray((proj as any)?.gallery_images) ? (proj as any).gallery_images : []
  let currentPlans = Array.isArray((proj as any)?.floor_plans) ? (proj as any).floor_plans : []

  // Aplica remoções
  if (deleteGalleryImagesURL.length > 0) {
    currentGallery = currentGallery.filter((url: string) => !deleteGalleryImagesURL.includes(url))
  }
  if (deleteFloorPlansURL.length > 0) {
    currentPlans = currentPlans.filter((url: string) => !deleteFloorPlansURL.includes(url))
  }


  try {
    if (coverImageFile && coverImageFile.size > 0) {
      const cover_image_url = await uploadToStorage(supabase, coverImageFile)
      updates.cover_image_url = cover_image_url
    } else if (deleteCoverImage) {
      updates.cover_image_url = null
    }
    
    if (validGalleryFiles.length > 0) {
      const newUploadedUrls = await Promise.all(validGalleryFiles.map(f => uploadToStorage(supabase, f)))
      currentGallery = [...currentGallery, ...newUploadedUrls]
    }

    if (validFloorPlansFiles.length > 0) {
      const newPlansUrls = await Promise.all(validFloorPlansFiles.map(f => uploadToStorage(supabase, f)))
      currentPlans = [...currentPlans, ...newPlansUrls]
    }
  } catch (uploadError) {
    console.error('Erro de upload na atualização:', uploadError)
    throw new Error('Falha ao fazer upload ou remover imagens e plantas.')
  }

  // Atualiza as arrays se houver mudança
  if (validGalleryFiles.length > 0 || deleteGalleryImagesURL.length > 0) {
    updates.gallery_images = currentGallery
  }
  if (validFloorPlansFiles.length > 0 || deleteFloorPlansURL.length > 0) {
    updates.floor_plans = currentPlans
  }

  const { error } = await (supabase.from('projects') as any).update(updates)
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/projetos')
  revalidatePath('/')
  redirect('/admin/projetos')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/projetos')
  revalidatePath('/')
}

export async function toggleProjectPublish(id: string, currentStatus: string) {
  const supabase = await createClient()
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'

  const { error } = await (supabase.from('projects') as any).update({ status: newStatus })
    .eq('id', id)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/projetos')
  revalidatePath('/')
}
