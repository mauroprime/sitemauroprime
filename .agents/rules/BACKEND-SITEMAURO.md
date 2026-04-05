# BACKEND — Sistema de Projetos para Consultor Imobiliário

## Visão Geral

Sistema full-stack com **Next.js (App Router)** como framework principal, **Supabase** como banco de dados, autenticação e storage, e um **painel administrativo** com rotas protegidas para gerenciar projetos e visualizar leads.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Banco de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (email/senha) |
| Storage (imagens) | Supabase Storage |
| **Gerenciamento do BD** | **Supabase MCP (via IDE — Cursor / Claude Code)** |
| ORM/Query (runtime) | Supabase JS Client v2 |
| Validação | Zod |
| UI do Admin | shadcn/ui + Tailwind CSS |
| Deploy | Vercel (recomendado) |

> **Importante — dois modos de interação com o Supabase:**
> - **MCP (desenvolvimento):** usado na IDE para criar tabelas, rodar migrations, aplicar RLS, criar buckets e inspecionar dados — tudo via linguagem natural com o assistente AI.
> - **JS Client (runtime):** usado no código da aplicação (API Routes, Server Components) para queries, inserts, auth e storage em produção.

---

## Estrutura de Pastas

```
/
├── app/
│   ├── (site)/                   # Grupo de rotas públicas (frontend)
│   │   ├── page.tsx              # Home
│   │   ├── projetos/
│   │   │   ├── page.tsx          # Listagem de projetos
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Página individual do projeto
│   │   └── layout.tsx
│   │
│   ├── (admin)/                  # Grupo de rotas protegidas
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx      # Login do admin
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Dashboard com métricas
│   │   │   ├── projetos/
│   │   │   │   ├── page.tsx      # Listagem de projetos (admin)
│   │   │   │   ├── novo/
│   │   │   │   │   └── page.tsx  # Criar novo projeto
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Editar projeto
│   │   │   └── leads/
│   │   │       └── page.tsx      # Visualizar leads
│   │   └── layout.tsx            # Layout com verificação de auth
│   │
│   └── api/
│       ├── projetos/
│       │   ├── route.ts          # GET (listagem) | POST (criar)
│       │   └── [id]/
│       │       └── route.ts      # GET | PUT | DELETE
│       ├── leads/
│       │   └── route.ts          # POST (receber lead do formulário)
│       └── upload/
│           └── route.ts          # POST (upload de imagens)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase client
│   │   ├── server.ts             # Server-side Supabase client
│   │   └── middleware.ts         # Auth middleware helper
│   ├── validations/
│   │   ├── projeto.ts            # Schema Zod para projetos
│   │   └── lead.ts               # Schema Zod para leads
│   └── utils.ts                  # Funções utilitárias (slugify, formatPrice, etc.)
│
├── middleware.ts                  # Proteção de rotas /admin/*
├── components/
│   └── admin/                    # Componentes exclusivos do painel
└── types/
    └── index.ts                  # Tipos TypeScript globais
```

---

## Supabase via MCP — Configuração e Workflow

### O que é o Supabase MCP

O **Supabase MCP Server** expõe as APIs do Supabase como ferramentas que o assistente AI da sua IDE (Cursor, Claude Code, Windsurf) pode chamar diretamente. Isso significa que você descreve o que quer em linguagem natural e o assistente executa as operações no banco — sem precisar abrir o dashboard do Supabase ou escrever SQL manualmente.

**O que o MCP permite fazer diretamente pela IDE:**
- Criar e alterar tabelas (`CREATE TABLE`, `ALTER TABLE`)
- Rodar migrations e aplicar patches de schema
- Criar e aplicar políticas de RLS
- Criar buckets de Storage e definir permissões
- Executar queries SQL arbitrárias para inspecionar dados
- Listar tabelas, colunas, funções e triggers existentes
- Criar usuários de autenticação (para o admin inicial)

---

### Instalação do Supabase MCP

#### 1. Pré-requisito: Personal Access Token do Supabase

Acesse [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) e gere um **Personal Access Token** com permissão total. Guarde em local seguro — ele não aparece novamente.

#### 2. Configuração no Cursor

Crie ou edite o arquivo `.cursor/mcp.json` na raiz do projeto (ou globalmente em `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "SEU_PERSONAL_ACCESS_TOKEN_AQUI"
      ]
    }
  }
}
```

> Reinicie o Cursor após salvar. O MCP aparecerá como ferramenta disponível no chat do Agente (modo Agent/Composer).

#### 3. Configuração no Claude Code

```bash
claude mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest \
  --access-token SEU_PERSONAL_ACCESS_TOKEN_AQUI
```

#### 4. Configuração no Windsurf / outros

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--access-token", "TOKEN"]
    }
  }
}
```

---

### Workflow de Desenvolvimento com MCP

Em vez de abrir o SQL Editor do Supabase no navegador, você instrui o assistente diretamente na IDE. Exemplos de prompts para cada etapa do projeto:

#### Criação do schema

```
"Crie as tabelas projetos e leads no meu projeto Supabase com o schema
especificado neste arquivo BACKEND.md, incluindo os triggers de updated_at
e todos os índices."
```

```
"Aplique as políticas de RLS nas tabelas projetos e leads conforme descrito
na seção de Row Level Security deste documento."
```

```
"Crie o bucket 'projetos-imagens' como público e aplique as políticas de
storage: leitura pública para todos, escrita somente para autenticados."
```

```
"Crie um usuário admin no Supabase Auth com email admin@dominio.com e
senha temporária Temp@1234 para o painel administrativo."
```

#### Inspeção e debug durante o desenvolvimento

```
"Liste todas as tabelas do meu projeto Supabase e mostre as colunas de cada uma."
"Mostre os últimos 10 leads inseridos na tabela leads."
"Verifique se as políticas de RLS estão ativas na tabela projetos."
"Execute: SELECT id, titulo, status FROM projetos ORDER BY created_at DESC LIMIT 10."
```

#### Migrations futuras (após o deploy)

```
"Adicione a coluna video_url TEXT (nullable) na tabela projetos."
"Crie um índice na coluna email da tabela leads para acelerar buscas."
"Renomeie a coluna vagas_garagem para garagem na tabela projetos e
atualize todos os índices relacionados."
```

---

### Separação clara: MCP vs. JS Client no código

| Tarefa | Onde executar |
|---|---|
| Criar tabelas, colunas, triggers | **MCP na IDE** |
| Aplicar políticas de RLS | **MCP na IDE** |
| Criar e configurar buckets de Storage | **MCP na IDE** |
| Criar usuário admin | **MCP na IDE** |
| Rodar migrations de schema | **MCP na IDE** |
| Inspecionar e debugar dados em dev | **MCP na IDE** |
| Query de dados no runtime da app | **JS Client no código** |
| Auth de usuário no runtime | **JS Client no código** |
| Upload de imagens no runtime | **JS Client no código** |
| Leitura de dados em Server Components | **JS Client no código** |

> O MCP é uma ferramenta de **desenvolvimento e operação**. O JS Client é o que roda em **produção** dentro da aplicação Next.js.

---

## Banco de Dados — Supabase (PostgreSQL)

> Os SQLs abaixo são a referência de schema. Na prática, você os aplicará via MCP na IDE (instruindo o assistente em linguagem natural) em vez de rodá-los manualmente.

### Tabela: `projetos`

```sql
CREATE TABLE projetos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Identificação
  titulo      TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'rascunho'
              CHECK (status IN ('rascunho', 'publicado', 'arquivado')),

  -- Conteúdo
  descricao_curta   TEXT,                    -- Aparece no card da listagem
  descricao_longa   TEXT,                    -- Aparece na página do projeto (suporta markdown)
  
  -- Financeiro
  preco             NUMERIC(12, 2),           -- Ex: 850000.00
  preco_visivel     BOOLEAN DEFAULT TRUE,     -- Se false, mostra "Consulte"
  
  -- Características do imóvel
  area_total        NUMERIC(8, 2),            -- m²
  area_construida   NUMERIC(8, 2),            -- m²
  quartos           INTEGER,
  banheiros         INTEGER,
  vagas_garagem     INTEGER,
  tipo_projeto      TEXT,                     -- Ex: "Casa Térrea", "Sobrado", "Duplex"
  estilo            TEXT,                     -- Ex: "Moderno", "Clássico", "Minimalista"
  
  -- Localização
  cidade            TEXT,
  estado            TEXT,
  
  -- Mídia
  imagem_capa       TEXT,                     -- URL da imagem principal (Supabase Storage)
  galeria           TEXT[] DEFAULT '{}',      -- Array de URLs das imagens
  
  -- SEO
  meta_titulo       TEXT,
  meta_descricao    TEXT,
  
  -- Ordenação
  ordem             INTEGER DEFAULT 0,
  destaque          BOOLEAN DEFAULT FALSE     -- Aparece em seção especial na home
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_projetos
  BEFORE UPDATE ON projetos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Índices para performance
CREATE INDEX idx_projetos_status ON projetos(status);
CREATE INDEX idx_projetos_slug ON projetos(slug);
CREATE INDEX idx_projetos_destaque ON projetos(destaque);
CREATE INDEX idx_projetos_ordem ON projetos(ordem);
```

### Tabela: `leads`

```sql
CREATE TABLE leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados pessoais
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefone    TEXT,
  
  -- Origem
  projeto_id  UUID REFERENCES projetos(id) ON DELETE SET NULL,
  projeto_titulo TEXT,                      -- Desnormalizado para caso o projeto seja deletado
  origem      TEXT DEFAULT 'site',          -- 'site', 'whatsapp', 'instagram', etc.
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  
  -- Mensagem
  mensagem    TEXT,
  
  -- Controle
  status      TEXT DEFAULT 'novo'
              CHECK (status IN ('novo', 'em_contato', 'qualificado', 'convertido', 'descartado')),
  anotacoes   TEXT                          -- Campo livre para o consultor anotar
);

-- Índices
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_projeto ON leads(projeto_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
```

---

## Row Level Security (RLS) — Supabase

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- PROJETOS: Qualquer um pode LER projetos publicados
CREATE POLICY "Leitura pública de projetos publicados"
  ON projetos FOR SELECT
  USING (status = 'publicado');

-- PROJETOS: Apenas usuários autenticados podem gerenciar
CREATE POLICY "Admin pode tudo em projetos"
  ON projetos FOR ALL
  USING (auth.role() = 'authenticated');

-- LEADS: Qualquer um pode INSERIR (formulário do site)
CREATE POLICY "Inserção pública de leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- LEADS: Apenas admin pode LER e ATUALIZAR
CREATE POLICY "Admin lê e atualiza leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin atualiza leads"
  ON leads FOR UPDATE
  USING (auth.role() = 'authenticated');
```

---

## Supabase Storage — Buckets

```
projetos-imagens/        (bucket público)
  └── {projeto_id}/
        ├── capa.webp
        ├── galeria-1.webp
        ├── galeria-2.webp
        └── ...
```

**Política do bucket:** Leitura pública, escrita apenas para usuários autenticados.

```sql
-- Política de storage
CREATE POLICY "Imagens públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projetos-imagens');

CREATE POLICY "Admin faz upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projetos-imagens' AND auth.role() = 'authenticated');

CREATE POLICY "Admin deleta imagens"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'projetos-imagens' AND auth.role() = 'authenticated');
```

---

## API Routes — Next.js

### `GET /api/projetos`
Lista projetos públicos (status = 'publicado').

**Query params:**
- `?destaque=true` — somente destaques
- `?tipo=Sobrado` — filtrar por tipo
- `?limite=6` — limitar resultados

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "titulo": "Casa Moderna 150m²",
      "slug": "casa-moderna-150m2",
      "descricao_curta": "...",
      "preco": 850000,
      "preco_visivel": true,
      "area_total": 200,
      "area_construida": 150,
      "quartos": 3,
      "imagem_capa": "https://...",
      "destaque": true
    }
  ],
  "total": 12
}
```

### `GET /api/projetos/[id]`
Retorna um projeto pelo ID ou slug.

### `POST /api/projetos` *(autenticado)*
Cria novo projeto.

**Body (JSON):**
```json
{
  "titulo": "string (obrigatório)",
  "descricao_curta": "string",
  "descricao_longa": "string (markdown)",
  "preco": 850000,
  "preco_visivel": true,
  "area_total": 200,
  "area_construida": 150,
  "quartos": 3,
  "banheiros": 2,
  "vagas_garagem": 2,
  "tipo_projeto": "Sobrado",
  "estilo": "Moderno",
  "cidade": "São Paulo",
  "estado": "SP",
  "imagem_capa": "url",
  "galeria": ["url1", "url2"],
  "status": "rascunho",
  "destaque": false
}
```

### `PUT /api/projetos/[id]` *(autenticado)*
Atualiza projeto existente. Aceita os mesmos campos do POST.

### `DELETE /api/projetos/[id]` *(autenticado)*
Deleta projeto e suas imagens do storage.

### `POST /api/leads`
Recebe lead do formulário público do site.

**Body:**
```json
{
  "nome": "string (obrigatório)",
  "email": "string (obrigatório)",
  "telefone": "string",
  "mensagem": "string",
  "projeto_id": "uuid (opcional)",
  "utm_source": "string",
  "utm_medium": "string",
  "utm_campaign": "string"
}
```

**Validação com Zod + rate limiting** para evitar spam.

### `POST /api/upload` *(autenticado)*
Faz upload de uma imagem para o Supabase Storage.

**Body:** `FormData` com campo `file` e `projeto_id`.

**Response:**
```json
{
  "url": "https://supabase.storage.url/projetos-imagens/uuid/foto.webp"
}
```

---

## Middleware de Autenticação

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Proteger todas as rotas /admin/* exceto /admin/login
  if (req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/api/projetos/:path*', '/api/upload/:path*']
}
```

---

## Painel Administrativo — Páginas e Funcionalidades

### `/admin/login`
- Formulário de email + senha
- Usa `supabase.auth.signInWithPassword()`
- Redireciona para `/admin/dashboard` após login
- Sem registro público — admin criado manualmente no Supabase Auth

### `/admin/dashboard`
Métricas rápidas em cards:
- Total de projetos publicados
- Total de leads (mês atual vs. anterior)
- Leads novos (status = 'novo')
- Projetos em rascunho

### `/admin/projetos`
Tabela com todos os projetos:
- Colunas: Imagem capa (thumb), Título, Tipo, Preço, Status, Destaque, Ações
- Filtro por status (rascunho / publicado / arquivado)
- Botão "Publicar/Despublicar" inline
- Ações: Editar, Duplicar, Deletar
- Botão "+ Novo Projeto" no topo

### `/admin/projetos/novo` e `/admin/projetos/[id]`
Formulário completo com abas:

**Aba 1 — Informações Básicas:**
- Título (gera slug automaticamente)
- Slug (editável)
- Status (rascunho / publicado / arquivado)
- Destaque (toggle)
- Descrição curta (textarea, max 160 chars)
- Descrição longa (editor markdown ou rich text simples)

**Aba 2 — Detalhes Técnicos:**
- Preço (número formatado como moeda)
- Preço visível (toggle)
- Área total (m²)
- Área construída (m²)
- Quartos, Banheiros, Vagas de garagem
- Tipo do projeto (select)
- Estilo (select)
- Cidade, Estado

**Aba 3 — Mídia:**
- Upload da imagem de capa (drag & drop)
- Preview da imagem de capa
- Upload múltiplo para galeria (drag & drop)
- Reordenar imagens da galeria (arrastar)
- Botão de remover imagem individual
- Todas as imagens convertidas para `.webp` antes do upload

**Aba 4 — SEO:**
- Meta título
- Meta descrição
- Preview de como aparece no Google

### `/admin/leads`
Tabela com todos os leads:
- Colunas: Data, Nome, Email, Telefone, Projeto, Status, Ações
- Filtro por status
- Filtro por projeto
- Filtro por período (data)
- Clique na linha para expandir e ver mensagem + anotações
- Alterar status inline (dropdown)
- Adicionar anotação
- Exportar para CSV

---

## Variáveis de Ambiente

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...   # Apenas server-side, nunca expor

# App
NEXT_PUBLIC_SITE_URL=https://seusite.com.br

# Opcional: notificação de lead por email
SMTP_HOST=smtp.resend.com
SMTP_FROM=noreply@seusite.com.br
LEAD_NOTIFICATION_EMAIL=consultor@email.com
```

---

## Setup Inicial

### Passo 0 — Configurar o Supabase MCP na IDE

Antes de qualquer código, configure o MCP conforme a seção **"Supabase via MCP"** acima. Isso permite criar o schema, aplicar RLS e configurar o storage inteiramente pela IDE, sem abrir o dashboard do Supabase.

**Checklist do MCP antes de começar:**
- [ ] Personal Access Token gerado em supabase.com/dashboard/account/tokens
- [ ] Projeto Supabase criado (pelo dashboard — só uma vez)
- [ ] `.cursor/mcp.json` (ou equivalente da sua IDE) configurado com o token
- [ ] IDE reiniciada e MCP aparecendo como ferramenta disponível
- [ ] Testado com: *"Liste os projetos Supabase da minha conta"*

### Passo 1 — Criar o schema via MCP

Com o MCP ativo, instrua o assistente a aplicar o schema completo:

```
"Use o Supabase MCP para criar as tabelas projetos e leads no projeto
[NOME DO PROJETO], exatamente como está no arquivo BACKEND.md.
Inclua triggers, índices, RLS e o bucket de storage projetos-imagens."
```

### Passo 2 — Criar projeto Next.js e instalar dependências

```bash
# Criar projeto Next.js
npx create-next-app@latest nome-do-projeto --typescript --tailwind --app

# Dependências de runtime (JS Client — roda em produção dentro da app)
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zod
npm install react-hook-form @hookform/resolvers
npm install react-dropzone        # upload de imagens no admin
npm install react-markdown         # renderizar descrição no frontend
npm install sharp                  # conversão para webp (server-side)

# Inicializar shadcn/ui (UI do painel admin)
npx shadcn-ui@latest init

# Componentes shadcn necessários
npx shadcn-ui@latest add button input label textarea select
npx shadcn-ui@latest add table badge tabs card toast dialog
```

> **Nota:** `@supabase/mcp-server-supabase` é invocado via `npx` sob demanda pelo MCP — não precisa entrar no `package.json` do projeto.

---

## Fluxo de Criação de Projeto (Admin)

```
1. Admin preenche o formulário
2. Faz upload das imagens → /api/upload → Supabase Storage → retorna URLs
3. Submete o formulário → /api/projetos (POST) com os dados + URLs das imagens
4. API valida com Zod
5. Salva no Supabase (projetos)
6. Redireciona para a listagem com toast de sucesso
```

## Fluxo de Captação de Lead (Site)

```
1. Visitante preenche o formulário no site
2. Submit → /api/leads (POST)
3. API valida com Zod (nome, email obrigatórios)
4. Salva no Supabase (leads) com UTM params
5. (Opcional) Dispara email de notificação para o consultor
6. Retorna sucesso → frontend exibe mensagem de confirmação
```

---

## Tipos TypeScript

```typescript
// types/index.ts

export type ProjetoStatus = 'rascunho' | 'publicado' | 'arquivado'
export type LeadStatus = 'novo' | 'em_contato' | 'qualificado' | 'convertido' | 'descartado'

export interface Projeto {
  id: string
  created_at: string
  updated_at: string
  titulo: string
  slug: string
  status: ProjetoStatus
  descricao_curta: string | null
  descricao_longa: string | null
  preco: number | null
  preco_visivel: boolean
  area_total: number | null
  area_construida: number | null
  quartos: number | null
  banheiros: number | null
  vagas_garagem: number | null
  tipo_projeto: string | null
  estilo: string | null
  cidade: string | null
  estado: string | null
  imagem_capa: string | null
  galeria: string[]
  meta_titulo: string | null
  meta_descricao: string | null
  ordem: number
  destaque: boolean
}

export interface Lead {
  id: string
  created_at: string
  nome: string
  email: string
  telefone: string | null
  projeto_id: string | null
  projeto_titulo: string | null
  origem: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  mensagem: string | null
  status: LeadStatus
  anotacoes: string | null
}

export interface ProjetoCard extends Pick<Projeto,
  'id' | 'titulo' | 'slug' | 'descricao_curta' | 'preco' |
  'preco_visivel' | 'area_total' | 'area_construida' | 'quartos' |
  'banheiros' | 'vagas_garagem' | 'tipo_projeto' | 'imagem_capa' | 'destaque'
> {}
```
