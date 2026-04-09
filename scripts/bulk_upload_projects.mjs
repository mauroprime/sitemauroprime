import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = "https://phfjkmhfjfzifwieznxr.supabase.co"
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmprbWhmamZ6aWZ3aWV6bnhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQwMzY3MCwiZXhwIjoyMDkwOTc5NjcwfQ.ahh5Fe8rfpogYQl_8EBra6RBFQ1BxlkOZ5BWsnoGR-c"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

const ASSETS_DIR = "c:\\Users\\Henrique de Souza\\Desktop\\Apps\\Site Mauro - Construtora Prime\\assets"
const BUCKET_NAME = 'project-images'

const titles = [
  "Residencial Imperial", "Villa Aurora", "Piazza d'Oro", "Mansão das Acácias",
  "Palazzo Real", "Riviera di Capri", "Gran Vista Prime", "Diamond Residences",
  "Magnolia Estate", "Chateau Noble", "Mirante do Sol", "Belvedere High-End",
  "Platinum Tower", "Essence Living", "Sanctuary Park", "Heritage Mansion",
  "Solaris Prime", "Majestic Heights", "Opal Garden", "Cristal Palace",
  "Infinity View", "Royal Terrace"
]

async function run() {
  console.log("Iniciando upload em massa corrigido...")
  
  const files = fs.readdirSync(ASSETS_DIR).filter(f => f.match(/\.(jpe?g|png|webp)$/i))
  
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const title = titles[i] || `Projeto Alto Padrão ${i + 1}`
    const filePath = path.join(ASSETS_DIR, fileName)
    const fileBuffer = fs.readFileSync(filePath)
    
    // 1. Upload
    const storagePath = `covers/${Date.now()}-${fileName}`
    const { data: storageData, error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (storageError) {
      console.error(`Erro no storage (${fileName}):`, storageError.message)
      continue
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath)

    // 2. Inserção DB (respeitando attributes_json)
    const slugBase = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    
    const { error: dbError } = await supabase
      .from('projects')
      .insert({
        title,
        slug: `${slugBase}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'Alto Padrão',
        status: 'published',
        cover_image_url: publicUrl,
        short_description: `Um projeto exclusivo assinado por Mauro Consultor, focado em excelência técnica e design atemporal.`,
        is_featured: false,
        is_promotional: false,
        display_order: i + 10,
        gallery_images: [],
        attributes_json: {
          bedrooms: 3,
          bathrooms: 2,
          suites: 1,
          area: 250,
          garage_info: "2 Vagas"
        }
      })

    if (dbError) {
      console.error(`Erro no DB (${title}):`, dbError.message)
    } else {
      console.log(`[OK] ${title}`)
    }
  }
}

run()
