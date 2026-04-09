import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type ProjectRow = Database['public']['Tables']['projects']['Row']
export type PromotionRow = Database['public']['Tables']['promotions']['Row']
export type TestimonialRow = Database['public']['Tables']['testimonials']['Row']
export type SiteSettingsRow = Database['public']['Tables']['site_settings']['Row']

export interface ProjectWithPromotions extends ProjectRow {
  promotions: PromotionRow[] | null;
}

export async function getPublishedProjects(): Promise<ProjectWithPromotions[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('getPublishedProjects: NEXT_PUBLIC_SUPABASE_URL is missing')
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*') // Removido promotions(*) para teste
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getPublishedProjects error details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    return []
  }
  return (data as unknown) as ProjectWithPromotions[]
}

export async function getTestimonials(): Promise<TestimonialRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('getTestimonials error:', error)
    return []
  }
  return data as TestimonialRow[]
}

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('getSiteSettings database error:', error.message || error, 'Code:', error.code)
  }
  return data as SiteSettingsRow | null
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    if (error.code !== 'PGRST116') console.error('getProjectBySlug error:', error)
    return null
  }
  return data as ProjectRow
}

export async function getRelatedProjects(category: string | null, ignoreId: string): Promise<ProjectRow[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .neq('id', ignoreId)
    .limit(3)
    
  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('getRelatedProjects error:', error)
    return []
  }
  return data as ProjectRow[]
}
