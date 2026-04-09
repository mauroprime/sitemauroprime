import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SUPABASE_URL = "https://phfjkmhfjfzifwieznxr.supabase.co"
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmprbWhmamZ6aWZ3aWV6bnhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQwMzY3MCwiZXhwIjoyMDkwOTc5NjcwfQ.ahh5Fe8rfpogYQl_8EBra6RBFQ1BxlkOZ5BWsnoGR-c"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

const BASE_PROJETOS_DIR = "c:\\Users\\Henrique de Souza\\Desktop\\Apps\\Site Mauro - Construtora Prime\\assets\\projetos"
const BUCKET_NAME = 'project-images'

const projectsData = [
  {
    folder: 'projeto1',
    title: 'Residencial Classic 41',
    short_description: 'Casa de 2 quartos sala conjugada cozinha banheiro e lavanderia na parte de fora coberta com 41 m2.',
    price: 72000,
    promotional_price: 59900,
    category: 'Econômico',
    attributes_json: {
      bedrooms: 2,
      bathrooms: 1,
      area: 41,
      garage_info: "NÃO CONSTA",
      has_living_room: true,
      has_kitchen: true,
      has_laundry: true,
      extras: ["Lavanderia coberta", "Sem laje", "Forro PVC"]
    }
  },
  {
    folder: 'projeto2',
    title: 'Residencial Family 70',
    short_description: 'Casa de 4 quartos sala conjugada cozinha banheiro e lavanderia na parte de fora coberta com 70m2.',
    price: 122900,
    promotional_price: 99900,
    category: 'Econômico',
    attributes_json: {
      bedrooms: 4,
      bathrooms: 1,
      area: 70,
      garage_info: "NÃO CONSTA",
      has_living_room: true,
      has_kitchen: true,
      has_laundry: true,
      extras: ["Lavanderia coberta", "Sem laje", "Forro PVC"]
    }
  },
  {
    folder: 'projeto3',
    title: 'Sobrado Gourmet 100',
    short_description: 'Sobrado de 100m2 com área gourmet e churrasqueira. 3 quartos sala conjugada cozinha, 2 banheiros e lavanderia.',
    price: 240000,
    promotional_price: 184900,
    category: 'Médio Padrão',
    attributes_json: {
      bedrooms: 3,
      bathrooms: 2,
      area: 100,
      garage_info: "NÃO CONSTA",
      has_living_room: true,
      has_kitchen: true,
      has_laundry: true,
      extras: ["Área gourmet", "Churrasqueira", "Com laje nos 2 pisos"]
    }
  },
  {
    folder: 'projeto5',
    title: 'Triplex Premium 150',
    short_description: 'Triplex alto padrão 150m2 área total + área gourmet + churrasqueira. 4 quartos e sala conjugada cozinha 2 banheiros e lavanderia.',
    price: 349000,
    promotional_price: 299000,
    category: 'Alto Padrão',
    attributes_json: {
      bedrooms: 4,
      bathrooms: 2,
      area: 150,
      garage_info: "NÃO CONSTA",
      has_living_room: true,
      has_kitchen: true,
      has_laundry: true,
      extras: ["Alto padrão", "Área gourmet", "Churrasqueira", "Chave na mão", "Com laje nos 2 pisos"]
    }
  }
];

async function uploadFile(bucket, storagePath, filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return publicUrl;
}

async function run() {
  console.log("Iniciando upload dos projetos do usuário...");

  for (const proj of projectsData) {
    console.log(`\nProcessando: ${proj.title}`);
    const projectPath = path.join(BASE_PROJETOS_DIR, proj.folder);
    
    if (!fs.existsSync(projectPath)) {
      console.error(`Erro: Pasta ${projectPath} não encontrada.`);
      continue;
    }

    const files = fs.readdirSync(projectPath).filter(f => f.match(/\.(jpe?g|png|webp)$/i));
    
    if (files.length === 0) {
      console.error(`Aviso: Nenhuma imagem encontrada em ${proj.folder}`);
      continue;
    }

    const uploadedUrls = [];
    for (const file of files) {
      const storagePath = `gallery/${proj.folder}/${Date.now()}-${file}`;
      try {
        const url = await uploadFile(BUCKET_NAME, storagePath, path.join(projectPath, file));
        uploadedUrls.push(url);
        console.log(`  [Upload OK] ${file}`);
      } catch (err) {
        console.error(`  [Erro Upload] ${file}:`, err.message);
      }
    }

    if (uploadedUrls.length === 0) continue;

    const coverImageUrl = uploadedUrls[0];
    const galleryImages = uploadedUrls.slice(1);

    const slugBase = proj.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const slug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;

    const { error: dbError } = await supabase
      .from('projects')
      .insert({
        title: proj.title,
        slug: slug,
        short_description: proj.short_description,
        full_description: proj.short_description, // Usando a mesma para simplificar
        category: proj.category,
        status: 'published',
        is_featured: true, // Marcar como destaque para aparecer na galeria principal
        is_promotional: true,
        price: proj.price,
        promotional_price: proj.promotional_price,
        cover_image_url: coverImageUrl,
        gallery_images: galleryImages,
        attributes_json: proj.attributes_json,
        display_order: 100, // Ordem alta para aparecer no topo ou fim dependendo da ordenação
        gallery_click_action: 'photo' // Conforme solicitado em conversas anteriores (nas regras persistentes talvez)
      });

    if (dbError) {
      console.error(`  [Erro Banco] ${proj.title}:`, dbError.message);
    } else {
      console.log(`  [Sucesso] ${proj.title} cadastrado no banco.`);
    }
  }
}

run();
