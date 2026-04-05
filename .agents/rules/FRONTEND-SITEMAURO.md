# FRONTEND — Site de Projetos para Consultor Imobiliário

## Visão Geral

Site público voltado para tráfego pago, com foco em conversão. Exibe projetos de casas com galeria de fotos, detalhes técnicos e formulários de captação de leads. Inspirado na experiência do WordPress + Elementor + JetEngine, mas construído com Next.js para performance e SEO.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router, SSG/ISR) |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui (seletivo) + componentes próprios |
| Animações | Framer Motion |
| Galeria | yet-another-react-lightbox |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React |
| Fontes | Google Fonts (definir na seção de Design) |
| SEO | next/metadata + JSON-LD |

---

## Identidade Visual — Diretrizes

> Adapte conforme o branding do consultor. As sugestões abaixo são um ponto de partida sólido para o segmento imobiliário de alto padrão.

### Paleta de Cores (variáveis CSS)

```css
:root {
  /* Primária — tom terroso/sofisticado */
  --color-primary:       #1C2B2D;   /* Verde escuro/musgo — confiança, solidez */
  --color-primary-light: #2E4547;
  --color-accent:        #C9A96E;   /* Dourado/champanhe — premium */
  --color-accent-hover:  #B8935A;

  /* Neutros */
  --color-background:    #F8F6F2;   /* Off-white quente */
  --color-surface:       #FFFFFF;
  --color-border:        #E8E3DA;
  --color-muted:         #8A8278;

  /* Texto */
  --color-text-primary:  #1C2B2D;
  --color-text-secondary:#5C5750;
  --color-text-on-dark:  #F8F6F2;
}
```

### Tipografia

```css
/* Títulos — elegante, arquitetônico */
--font-display: 'Cormorant Garamond', Georgia, serif;   /* H1, H2 grandes */

/* Corpo — legível, moderno */
--font-body: 'DM Sans', system-ui, sans-serif;           /* Parágrafos, labels */

/* Detalhe — mono para dados técnicos */
--font-mono: 'DM Mono', monospace;                       /* Preços, metragens */
```

### Escala Tipográfica

```
H1 (hero):        4.5rem / 72px — Cormorant Garamond, weight 300, line-height 1.1
H2 (seções):      2.5rem / 40px — Cormorant Garamond, weight 400
H3 (cards):       1.375rem / 22px — DM Sans, weight 600
Body large:       1.125rem / 18px — DM Sans, weight 400
Body:             1rem / 16px — DM Sans, weight 400
Label/caption:    0.875rem / 14px — DM Sans, weight 500
Preço:            1.75rem / 28px — DM Mono, weight 500
```

### Espaçamentos-chave

```
Section padding:  py-20 md:py-32  (80px / 128px)
Container:        max-w-7xl mx-auto px-6 md:px-12
Card gap:         gap-6 md:gap-8
```

---

## Estrutura de Páginas

```
/ (Home)
├── /projetos               (Listagem de todos os projetos)
└── /projetos/[slug]        (Página individual do projeto)
```

---

## Componentes Globais

### `<Header />`

- Logo à esquerda (texto ou SVG do consultor)
- Navegação: `Projetos` | `Sobre` | `Contato`
- Botão CTA: `Falar com Consultor` (abre WhatsApp ou ancora no formulário)
- Sticky com backdrop blur ao scroll
- Mobile: menu hambúrguer com slide-in lateral

```
Layout:
[LOGO]              [Projetos] [Sobre] [Contato]   [CTA Button]
```

**Comportamento no scroll:**
- Transparente no topo da home (hero com fundo escuro)
- Vira branco com sombra suave após 80px de scroll

### `<Footer />`

- Logo + tagline do consultor
- Links rápidos (Projetos, Contato, WhatsApp)
- Redes sociais (Instagram, LinkedIn)
- Copyright + "Desenvolvido por [Nome]"
- Fundo: `--color-primary` com texto claro

---

## Página: Home `/`

### Seção 1 — Hero

**Objetivo:** Impacto visual imediato, comunicar proposta de valor.

```
Layout:
┌─────────────────────────────────────────────────────┐
│  [IMAGEM DE FUNDO FULLSCREEN — projeto destaque]    │
│  Overlay escuro gradiente (bottom-up)               │
│                                                     │
│  [Texto alinhado à esquerda/inferior]               │
│  Tag: PROJETOS EXCLUSIVOS                           │
│  H1: Casas Projetadas                               │
│      para Construir                                 │
│      Seu Sonho.                                     │
│  Subtítulo: Seleção de projetos...                  │
│                                                     │
│  [Botão: Ver Projetos]  [Botão: Falar Agora →]      │
│                                                     │
│  ↓ scroll indicator animado                         │
└─────────────────────────────────────────────────────┘
```

**Detalhes:**
- Altura: `100vh` (ou `min-h-screen`)
- Imagem de fundo: projeto em destaque (buscar do Supabase), ou imagem estática de fallback
- Overlay: `linear-gradient(to top, rgba(28,43,45,0.9) 0%, rgba(28,43,45,0.3) 60%, transparent 100%)`
- H1 em Cormorant Garamond, branco, weight 300, tamanho 72px desktop / 44px mobile
- Botão primário: fundo `--color-accent`, texto escuro
- Botão secundário: borda branca, texto branco, hover preenche
- Animação de entrada: fade + slide-up com Framer Motion (stagger nos elementos)

### Seção 2 — Números / Credenciais

Faixa horizontal com 3–4 métricas:

```
[ 50+ Projetos ]  [ 10 Anos ]  [ 15 Construtoras ]  [ R$2B+ ]
 Entregues          Mercado      Parceiras            Negociados
```

**Detalhes:**
- Fundo: `--color-primary`
- Texto: `--color-text-on-dark`
- Número em destaque: Cormorant Garamond, dourado (`--color-accent`), 3rem
- Label: DM Sans, muted, 0.875rem
- Counter animation ao entrar na viewport (Framer Motion `useInView`)

### Seção 3 — Projetos em Destaque

**Título da seção:**
```
PORTFÓLIO
Projetos Selecionados
```

Grid responsivo com cards de projetos marcados como `destaque = true` (máx. 6).

**Card de Projeto:**

```
┌──────────────────────────┐
│  [IMAGEM CAPA]           │  altura: 260px, object-fit: cover
│  [TAG: MODERNO]          │  badge absoluto, canto superior esquerdo
├──────────────────────────┤
│  Casa Moderna 180m²      │  H3 — DM Sans 600
│  São Paulo, SP           │  caption — muted
│                          │
│  ┌────┐  ┌────┐  ┌────┐  │
│  │3 🛏│  │2 🚗│  │180│  │  ícones + dados técnicos
│  └────┘  └────┘  └────┘  │
│                          │
│  R$ 850.000              │  DM Mono, accent color, 1.5rem
│                          │
│  [Ver Projeto →]         │  link/botão
└──────────────────────────┘
```

**Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

**Hover no card:**
- Imagem: scale(1.04) com transition suave
- Sombra: eleva
- Botão "Ver Projeto": slide-up do bottom

**Link:** "Ver todos os projetos →" ao final da seção

### Seção 4 — Sobre o Consultor

Layout 50/50:

```
┌─────────────────────┬─────────────────────┐
│  [FOTO DO           │  SOBRE              │
│   CONSULTOR]        │  [Nome completo]    │
│                     │  Consultor          │
│  Imagem com         │  Imobiliário        │
│  borda decorativa   │                     │
│  ou moldura         │  [Parágrafo sobre   │
│  em accent color    │   a experiência]    │
│                     │                     │
│                     │  ✓ Especialista em  │
│                     │  ✓ Parceiros        │
│                     │  ✓ Atendimento      │
│                     │                     │
│                     │  [CTA: Conheça →]   │
└─────────────────────┴─────────────────────┘
```

### Seção 5 — Formulário de Contato / CTA

```
┌─────────────────────────────────────────────┐
│         Fundo: --color-primary              │
│                                             │
│  Interessado em algum projeto?              │  H2 branco
│  Fale com o consultor.                      │
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  Nome    │ │  Email   │ │  Telefone  │  │
│  └──────────┘ └──────────┘ └────────────┘  │
│  ┌──────────────────────────────────────┐   │
│  │  Mensagem (opcional)                │   │
│  └──────────────────────────────────────┘   │
│            [Enviar Mensagem]                │
└─────────────────────────────────────────────┘
```

**Detalhes:**
- Inputs com fundo semi-transparente, borda branca 20% opacity
- Validação em tempo real com React Hook Form + Zod
- Submit: loading state no botão → mensagem de sucesso inline (não redireciona)
- Captura UTM params via `useSearchParams()` e envia junto ao lead

---

## Página: Listagem de Projetos `/projetos`

### Hero Simples

```
┌─────────────────────────────────────────────┐
│  Fundo: --color-primary                     │
│  Breadcrumb: Início > Projetos              │
│  H1: Nossos Projetos                        │
│  Subtítulo: Encontre o projeto ideal...     │
└─────────────────────────────────────────────┘
```

### Barra de Filtros

```
[Todos] [Casa Térrea] [Sobrado] [Duplex] [Minimalista] [Clássico]
                                                    Ordenar: [Mais recentes ▼]
```

**Detalhes:**
- Filtros em pills/tags, filtro ativo com fundo `--color-accent`
- Filtro por `tipo_projeto` e/ou `estilo`
- Ordenação: Mais recentes, Menor preço, Maior preço, Maior área
- Estado gerenciado por URL params (`?tipo=Sobrado&ordem=preco_asc`) para compartilhamento e SEO

### Grid de Projetos

- Mesmo card component da Home
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Paginação ou "Carregar mais" (preferir "Carregar mais" com ISR)
- Estado vazio: ilustração + "Nenhum projeto encontrado com esses filtros"

---

## Página: Projeto Individual `/projetos/[slug]`

### Estrutura da Página

```
┌─────────────────────────────────────────────────────┐
│  HERO / GALERIA PRINCIPAL                           │
│  [Imagem capa fullwidth]  altura: 60vh             │
│  Overlay com: Título, Tipo, Cidade                  │
└─────────────────────────────────────────────────────┘

┌───────────────────────┬─────────────────────────────┐
│  COLUNA PRINCIPAL     │  SIDEBAR STICKY             │
│  (col-span-8)         │  (col-span-4)               │
│                       │                             │
│  [Galeria de fotos]   │  ┌─────────────────────┐   │
│                       │  │ Preço               │   │
│  [Descrição longa]    │  │ R$ 850.000          │   │
│                       │  │                     │   │
│  [Ficha Técnica]      │  │ 🛏 3 Quartos         │   │
│                       │  │ 🚿 2 Banheiros       │   │
│  [Mapa / Localização] │  │ 🚗 2 Vagas           │   │
│                       │  │ 📐 180m² construídos │   │
│                       │  │                     │   │
│                       │  │ [Tenho Interesse]   │   │
│                       │  │ [Falar no WhatsApp] │   │
│                       │  └─────────────────────┘   │
└───────────────────────┴─────────────────────────────┘

[Projetos Relacionados]
[Formulário de contato]
```

**Mobile:** sidebar vira um bloco acima das informações + botão fixo no bottom ("Tenho Interesse")

### Galeria de Fotos

- Thumbnail strip embaixo da imagem principal
- Click abre lightbox fullscreen (`yet-another-react-lightbox`)
- Navegação por setas e swipe no mobile
- Contador "3 / 12"

### Ficha Técnica

Tabela ou grid de ícone + label + valor:

```
┌─────────────────────────────────┐
│  FICHA TÉCNICA                  │
├─────────────┬───────────────────┤
│ Área Total  │ 200 m²           │
│ Área Const. │ 180 m²           │
│ Quartos     │ 3                │
│ Banheiros   │ 2                │
│ Garagem     │ 2 vagas          │
│ Estilo      │ Moderno          │
│ Tipo        │ Sobrado          │
│ Localização │ São Paulo, SP    │
└─────────────┴───────────────────┘
```

### Formulário de Interesse (na página do projeto)

Formulário simples (só nome, email, telefone) + mensagem pré-preenchida:

```
Mensagem: "Tenho interesse no projeto [Título do projeto]"
```

Submete para `POST /api/leads` com `projeto_id`.

### Projetos Relacionados

Grid horizontal com 3 cards de projetos do mesmo tipo ou estilo.
Título: "Veja Também"

---

## Componentes Compartilhados

### `<ProjetoCard />`

```typescript
interface ProjetoCardProps {
  projeto: ProjetoCard
  variant?: 'default' | 'horizontal' | 'featured'
}
```

Variantes:
- `default`: Grid card padrão (usado na listagem e home)
- `horizontal`: Card em linha (possível uso em mobile)
- `featured`: Card maior para destaque hero

### `<ProjetoFicha />`

Tabela de especificações técnicas. Props: `projeto: Projeto`.

### `<LeadForm />`

```typescript
interface LeadFormProps {
  projetoId?: string
  projetoTitulo?: string
  variant?: 'full' | 'compact'  // full = mensagem inclusa, compact = só dados
}
```

### `<ImageGallery />`

```typescript
interface ImageGalleryProps {
  images: string[]     // array de URLs
  capa: string         // imagem principal
}
```

Usa `yet-another-react-lightbox`.

### `<PriceDisplay />`

```typescript
interface PriceDisplayProps {
  preco: number | null
  visivel: boolean
  size?: 'sm' | 'md' | 'lg'
}
// Se visivel = false → exibe "Consulte o preço"
// Se preco = null → exibe "A consultar"
// Se visivel = true → formata como "R$ 850.000"
```

### `<FilterBar />`

Gerencia filtros de projetos via URL params.

### `<WhatsAppButton />`

Botão flutuante fixo no bottom-right com ícone do WhatsApp.
Link: `https://wa.me/55{numero}?text=Olá, tenho interesse em um projeto`

---

## SEO e Performance

### Metadata por Página

```typescript
// app/(site)/projetos/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const projeto = await getProjeto(params.slug)
  return {
    title: projeto.meta_titulo || `${projeto.titulo} | Consultor`,
    description: projeto.meta_descricao || projeto.descricao_curta,
    openGraph: {
      images: [projeto.imagem_capa],
      type: 'website',
    }
  }
}
```

### JSON-LD (dados estruturados)

Adicionar `RealEstateListing` ou `Product` schema nas páginas de projeto para rich results no Google.

### Estratégia de Renderização

| Página | Estratégia | Motivo |
|---|---|---|
| Home | ISR (revalidate: 3600) | Conteúdo muda pouco |
| /projetos | ISR (revalidate: 1800) | Lista atualiza com frequência |
| /projetos/[slug] | ISR (revalidate: 3600) | Projeto raramente muda |
| API routes | On-demand | Dados sempre frescos |

### Imagens

- Sempre usar `next/image` com `fill`, `sizes` adequado e `priority` no hero
- Imagens do Supabase Storage com domínio configurado em `next.config.js`
- Formato: `.webp` (convertido no upload, no admin)

```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

---

## Rastreamento de UTM

Criar um hook `useUTM()` que:
1. Lê `?utm_source`, `utm_medium`, `utm_campaign` da URL
2. Salva em `sessionStorage` (persiste durante a sessão)
3. `<LeadForm />` usa o hook para pegar os valores e enviar junto ao lead

```typescript
// hooks/useUTM.ts
export function useUTM() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const source = searchParams.get('utm_source')
    if (source) {
      sessionStorage.setItem('utm_source', source)
      sessionStorage.setItem('utm_medium', searchParams.get('utm_medium') || '')
      sessionStorage.setItem('utm_campaign', searchParams.get('utm_campaign') || '')
    }
  }, [searchParams])

  return {
    utm_source: sessionStorage.getItem('utm_source'),
    utm_medium: sessionStorage.getItem('utm_medium'),
    utm_campaign: sessionStorage.getItem('utm_campaign'),
  }
}
```

---

## Animações — Framer Motion

### Padrão de entrada de seções

```typescript
// components/SectionReveal.tsx
// Wrapper que aplica fade + slide-up ao entrar no viewport
const variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
```

### Stagger em grids de cards

```typescript
const containerVariants = {
  visible: { transition: { staggerChildren: 0.1 } }
}
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

### Hover em cards

```typescript
// Aplicar no motion.div do card
whileHover={{ y: -4, transition: { duration: 0.2 } }}
```

---

## Responsividade — Breakpoints

```
Mobile first: < 640px  (sm)
Tablet:       640px    (sm)
Desktop MD:   768px    (md)
Desktop LG:   1024px   (lg)
Desktop XL:   1280px   (xl)
```

**Ajustes principais por breakpoint:**

| Elemento | Mobile | Desktop |
|---|---|---|
| H1 hero | 2.5rem | 4.5rem |
| Grid projetos | 1 col | 3 cols |
| Layout projeto individual | stack | 2 cols (8+4) |
| Sidebar projeto | topo da página | sticky lateral |
| CTA | botão fixo no bottom | na sidebar |
| Navegação | hambúrguer | inline |

---

## Acessibilidade

- Todas as imagens com `alt` descritivo (usar título do projeto)
- Botões com `aria-label` quando só ícone
- Formulários com `label` associado via `htmlFor`
- Focus styles visíveis (`focus-visible:ring-2`)
- Contraste de texto mínimo 4.5:1 (verificar paleta)
- `lang="pt-BR"` no `<html>`
- Skip link para conteúdo principal

---

## Checklist de Lançamento

- [ ] Favicon + Apple Touch Icon configurados
- [ ] `robots.txt` e `sitemap.xml` (Next.js `app/sitemap.ts`)
- [ ] Google Analytics / Meta Pixel integrados via `next/script`
- [ ] WhatsApp button funcionando com número real
- [ ] Formulário de lead testado ponta a ponta
- [ ] Todas as imagens com `alt`
- [ ] Mobile testado em iOS Safari e Android Chrome
- [ ] Lighthouse score: Performance > 90, SEO > 95
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Domínio customizado configurado
- [ ] SSL ativo
