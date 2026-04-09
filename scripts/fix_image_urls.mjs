import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://phfjkmhfjfzifwieznxr.supabase.co"
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmprbWhmamZ6aWZ3aWV6bnhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQwMzY3MCwiZXhwIjoyMDkwOTc5NjcwfQ.ahh5Fe8rfpogYQl_8EBra6RBFQ1BxlkOZ5BWsnoGR-c"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

async function fixUrls() {
  console.log("Iniciando correção de URLs das capas...")
  
  const { data: projects, error: fetchError } = await supabase
    .from('projects')
    .select('id, cover_image_url')
    .not('cover_image_url', 'is', null)

  if (fetchError) {
    console.error("Erro ao buscar projetos:", fetchError.message)
    return
  }

  for (const project of projects) {
    // Garantir que a URL aponte para o endpoint publico
    if (project.cover_image_url.includes('/storage/v1/object/public/')) {
       console.log(`[PULANDO] ${project.id} já parece pública.`)
       continue
    }

    const publicUrl = project.cover_image_url.replace('/storage/v1/object/', '/storage/v1/object/public/')
    
    const { error: updateError } = await supabase
      .from('projects')
      .update({ cover_image_url: publicUrl })
      .eq('id', project.id)

    if (updateError) {
      console.error(`Erro ao atualizar ${project.id}:`, updateError.message)
    } else {
      console.log(`[CORRIGIDO] ${project.id} -> URL Pública ativada.`)
    }
  }

  console.log("Correção concluída.")
}

fixUrls()
