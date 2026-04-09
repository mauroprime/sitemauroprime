export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ProjectRow {
  id: string
  slug: string
  title: string
  subtitle: string | null
  short_description: string | null
  full_description: string | null
  category: string | null
  type: string | null
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  is_promotional: boolean
  price: number | null
  promotional_price: number | null
  cover_image_url: string | null
  gallery_images: Json
  attributes_json: Json
  display_order: number
  gallery_click_action: 'page' | 'photo'
  created_at: string
  updated_at: string
  floor_plans: Json
}

export interface TestimonialRow {
  id: string
  client_name: string
  client_role: string | null
  content: string
  rating: number
  avatar_url: string | null
  is_featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface LeadRow {
  id: string
  name: string
  email: string
  phone: string | null
  source: string | null
  message: string | null
  related_project_id: string | null
  status: 'new' | 'contacted' | 'converted' | 'lost'
  intent: string | null
  location: string | null
  project_type: string | null
  investment_range: string | null
  timeframe: string | null
  has_land: boolean
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  created_at: string
  updated_at: string
}

export interface SiteSettingsRow {
  id: string
  brand_name: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  whatsapp_number: string | null
  contact_email: string | null
  address: string | null
  business_hours: string | null
  instagram_url: string | null
  facebook_url: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_cta_text: string
  gallery_animation_speed: number
  updated_at: string
}

export interface PromotionRow {
  id: string
  title: string
  subtitle: string | null
  related_project_id: string | null
  badge_text: string | null
  active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow
        Insert: Partial<ProjectRow>
        Update: Partial<ProjectRow>
        Relationships: []
      }
      testimonials: {
        Row: TestimonialRow
        Insert: Partial<TestimonialRow>
        Update: Partial<TestimonialRow>
        Relationships: []
      }
      leads: {
        Row: LeadRow
        Insert: Partial<LeadRow>
        Update: Partial<LeadRow>
        Relationships: [
          {
            foreignKeyName: "leads_related_project_id_fkey"
            columns: ["related_project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: SiteSettingsRow
        Insert: Partial<SiteSettingsRow>
        Update: Partial<SiteSettingsRow>
        Relationships: []
      }
      promotions: {
        Row: PromotionRow
        Insert: Partial<PromotionRow>
        Update: Partial<PromotionRow>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
