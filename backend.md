# Backend Specification

## Objetivo
Criar um backend moderno com Supabase para substituir a experiência de gerenciamento que hoje seria feita com WordPress + JetEngine, permitindo cadastrar, editar, publicar e remover projetos e demais conteúdos por meio de um painel administrativo web.

## Stack sugerido
- Supabase
  - PostgreSQL
  - Auth
  - Storage
  - Row Level Security
- Next.js App Router
- Server Actions ou Route Handlers para operações seguras
- Vercel para deploy
- Painel administrativo dentro do mesmo projeto

## Conceito
O sistema deve funcionar como um mini CMS customizado.
Não replicar WordPress internamente; replicar apenas as capacidades operacionais:
- CRUD de projetos
- CRUD de depoimentos
- CRUD de configurações do site
- gerenciamento de leads
- upload de imagens
- controle de destaques e promoções
- publicação/despublicação

## Perfis de acesso
### Admin
- acesso total
- gerencia projetos, depoimentos, leads, branding básico e configurações

### Editor
- cria e edita conteúdo
- não altera configurações sensíveis
- não gerencia usuários

## Entidades principais

### 1. projects
Campos sugeridos:
- id
- slug
- title
- subtitle
- short_description
- full_description
- category
- type
- status (draft, published, archived)
- is_featured
- is_promotional
- price
- promotional_price
- cover_image_url
- gallery_images
- attributes_json
- display_order
- created_at
- updated_at

### 2. testimonials
Campos:
- id
- client_name
- client_role
- content
- rating
- avatar_url
- is_featured
- display_order
- created_at
- updated_at

### 3. leads
Campos:
- id
- name
- email
- phone
- source
- message
- related_project_id
- created_at
- status

### 4. site_settings
Campos:
- id
- brand_name
- logo_url
- primary_color
- secondary_color
- whatsapp_number
- contact_email
- address
- business_hours
- instagram_url
- facebook_url
- hero_title
- hero_subtitle
- hero_cta_text
- updated_at

### 5. promotions
Campos:
- id
- title
- subtitle
- related_project_id
- badge_text
- active
- start_date
- end_date
- created_at
- updated_at

## Storage
Buckets sugeridos:
- brand-assets
- project-images
- testimonial-assets

## Funcionalidades do painel administrativo
- Login com Supabase Auth
- Dashboard inicial com métricas simples
- Tela de listagem de projetos
- Tela de criação e edição de projeto
- Upload de capa e galeria
- Marcação de destaque e promoção
- Ordenação manual dos cards
- Gestão de depoimentos
- Gestão de leads
- Gestão de configurações globais do site
- Ações rápidas de publicar e despublicar

## Experiência estilo WordPress/JetEngine
O painel deve lembrar o fluxo de uso de CMS:
- menu lateral
- tabela com itens cadastrados
- filtros
- busca
- formulário de edição em seções
- campos customizados
- upload de mídia
- preview do conteúdo
- status de publicação

## Segurança
- RLS habilitado em todas as tabelas
- leitura pública apenas para conteúdos publicados
- escrita apenas para usuários autenticados autorizados
- policies separadas por role
- validação server-side nas mutations

## API / acesso aos dados
Estratégia sugerida:
- leitura pública no frontend via server components ou rotas seguras
- escrita via server actions ou route handlers
- evitar expor operações administrativas diretamente no client

## Publicação
Regras:
- somente projetos com status published aparecem no site público
- draft aparece apenas no admin
- archived fica oculto do site
- promoções só aparecem se active = true e dentro da data válida

## Leads
Fluxo inicial:
- usuário envia formulário
- lead é salvo no Supabase
- admin visualiza no painel
- campo de status para acompanhamento (novo, contatado, convertido, perdido)

## AI Development / Supabase MCP
O projeto poderá utilizar o Supabase MCP como ferramenta de apoio ao desenvolvimento com IA.

Objetivos de uso:
- inspecionar schema e tabelas
- auxiliar na criação e revisão de migrations
- executar consultas controladas em ambiente de desenvolvimento
- gerar tipos TypeScript a partir do schema
- consultar logs e diagnósticos do projeto

Diretrizes:
- usar MCP apenas em ambiente de desenvolvimento e homologação
- não depender de MCP para funcionalidades de produção
- preferir project scoping
- usar read-only quando aplicável
- restringir features habilitadas ao mínimo necessário
- manter revisão humana em queries, migrations e ações destrutivas

## Variáveis de ambiente
O projeto deve utilizar variáveis de ambiente locais e na Vercel para todas as credenciais sensíveis. Nunca armazenar service role key, senha do banco ou tokens privados em arquivos markdown versionados.

## Escalabilidade
O sistema deve permitir expansão futura para:
- múltiplos consultores
- múltiplas landing pages
- blog
- integração com CRM
- automações por webhook
- multitenancy simples

## Requisitos técnicos
- modelagem limpa
- tipagem TypeScript
- componentes administrativos reutilizáveis
- separação clara entre camada pública e admin
- preparado para deploy na Vercel
- fácil manutenção por um desenvolvedor full stack

## Fora do escopo inicial
- construtor visual estilo Elementor
- workflow editorial complexo
- versionamento de conteúdo
- permissões empresariais avançadas
