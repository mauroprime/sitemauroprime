# Frontend Specification

## Objetivo
Criar um site institucional/comercial para um consultor de vendas, com o mesmo estilo visual, estrutura de landing page e proposta de conversão do site de referência:
https://projetos.baseforteconstrutora.com.br/

A implementação não deve copiar WordPress/Elementor internamente, mas sim reproduzir com alta fidelidade o front-end e a experiência visual, trocando o branding, os textos, as imagens e os dados.

## Stack sugerido
- Next.js 15+
- React
- TypeScript
- Tailwind CSS
- shadcn/ui para componentes de interface e formulários
- Supabase client para leitura de dados públicos
- Deploy na Vercel

## Direção visual
Replicar a linguagem visual do site de referência:
- Hero grande com imagem de fundo
- Header com logo à esquerda, menu central e CTA destacado à direita
- Paleta escura com cor de destaque forte
- Cards de projetos com imagem, título, atributos e CTA
- Blocos de prova social/depoimentos
- Formulário de contato simples
- Botão flutuante de WhatsApp
- Footer completo com contatos, horário, endereço e links legais

## Branding
Trocar completamente:
- Nome da marca
- Logo
- Cores primárias/secundárias
- Tipografia, se desejado
- Textos institucionais
- Conteúdo dos cards
- Imagens dos serviços/produtos
- Contatos e links sociais

## Páginas
### 1. Home
Seções:
- Header fixo
- Hero principal
- Grade de projetos/ofertas/serviços
- Seção de promoções/destaques
- Depoimentos
- Formulário de contato
- Footer

### 2. Listagem de projetos
- Grid com paginação ou load more
- Filtros por categoria, tipo, faixa de preço e destaque
- Busca por título

### 3. Detalhe do projeto
- Galeria de imagens
- Título
- Subtítulo
- Descrição longa
- Lista de atributos
- Preço e preço promocional
- CTA para contato via WhatsApp e formulário
- Projetos relacionados

### 4. Contato
- Formulário
- WhatsApp
- Endereço
- Horários
- Redes sociais

## Componentes
- Header
- Mobile menu
- HeroBanner
- SectionTitle
- ProjectCard
- FeaturedProjectsCarousel
- TestimonialsSection
- ContactForm
- WhatsAppFloatingButton
- Footer
- CTAButtons
- Badge de promoção/destaque

## Responsividade
- Mobile-first
- Layout fiel ao desktop do site de referência, mas adaptado com qualidade ao mobile
- Menu hamburguer no mobile
- Cards empilhados no mobile
- CTAs sempre visíveis
- Botão de WhatsApp com boa área de toque

## Dados dinâmicos
O frontend deve consumir dados do Supabase para:
- projetos
- depoimentos
- configurações do site
- promoções
- contatos institucionais

## SEO
- Metadata por página
- Open Graph
- URLs amigáveis
- JSON-LD básico para professional service, quando aplicável

## Formulários
- Formulário principal de contato
- Formulário em páginas de projeto
- Integração com Supabase para salvar leads
- Possibilidade de envio futuro para webhook, CRM ou e-mail

## Requisitos de fidelidade
- Reproduzir a estrutura visual do site de referência com máxima semelhança
- Manter ritmo de espaçamento, hierarquia visual e blocos comerciais
- Não usar visual genérico de template SaaS
- Priorizar aparência comercial, confiável e de alta conversão

## Requisitos técnicos
- Componentização limpa
- Dados desacoplados da interface
- Fácil troca de branding
- Fácil expansão para novas páginas e seções
- Preparado para integração com painel admin próprio

## Fora do escopo inicial
- Blog completo
- Área do cliente
- CRM interno completo
- Automação avançada de marketing
