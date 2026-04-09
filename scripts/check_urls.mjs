import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://phfjkmhfjfzifwieznxr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmprbWhmamZ6aWZ3aWV6bnhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQwMzY3MCwiZXhwIjoyMDkwOTc5NjcwfQ.ahh5Fe8rfpogYQl_8EBra6RBFQ1BxlkOZ5BWsnoGR-c"
)

async function check() {
  // 1. Verificar URLs no banco
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, cover_image_url')
    .limit(3)

  console.log("=== URLs no banco ===")
  for (const p of projects) {
    console.log(`${p.title}: ${p.cover_image_url}`)
  }

  // 2. Testar acesso HTTP à primeira URL
  if (projects[0]?.cover_image_url) {
    console.log("\n=== Testando acesso HTTP ===")
    try {
      const res = await fetch(projects[0].cover_image_url, { method: 'HEAD' })
      console.log(`Status: ${res.status} ${res.statusText}`)
      console.log(`Content-Type: ${res.headers.get('content-type')}`)
    } catch (e) {
      console.log(`Erro de fetch: ${e.message}`)
    }
  }

  // 3. Listar arquivos no bucket
  console.log("\n=== Arquivos no bucket (covers/) ===")
  const { data: files, error } = await supabase.storage.from('project-images').list('covers', { limit: 5 })
  if (error) {
    console.log(`Erro ao listar bucket: ${error.message}`)
  } else {
    for (const f of files) {
      console.log(`  ${f.name} (${f.metadata?.mimetype || 'unknown'})`)
    }
  }
}

check()
