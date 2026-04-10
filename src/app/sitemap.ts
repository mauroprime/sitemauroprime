import { MetadataRoute } from 'next'
import { getPublishedProjects } from '@/services/public'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sitemauro.vercel.app'

  // Rotas estáticas
  const routes = [
    '',
    '/admin/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.5,
  }))

  // Projetos Dinâmicos - aguardamos o banco com tipagem forte e lidamos de forma segura c/ errors
  try {
    const projects = await getPublishedProjects()
    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projetos/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    return [...routes, ...projectRoutes]
  } catch (err) {
    console.error('Falha ao gerar o sitemap dos projetos:', err)
    return routes
  }
}
