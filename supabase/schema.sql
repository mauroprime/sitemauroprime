-- ============================================================
-- SCHEMA COMPLETO — Construtora Prime (Site Mauro)
-- Executar no Supabase SQL Editor em: 
-- https://supabase.com/dashboard/project/ksoxvodsvnyqnzlrchgx/sql/new
-- ============================================================

-- ============================================================
-- 1. TABELA: projetos
-- ============================================================
CREATE TABLE IF NOT EXISTS projetos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Identificação
  titulo      TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  status      TEXT NOT NULL DEFAULT 'rascunho'
              CHECK (status IN ('rascunho', 'publicado', 'arquivado')),

  -- Conteúdo
  descricao_curta   TEXT,
  descricao_longa   TEXT,
  
  -- Financeiro
  preco             NUMERIC(12, 2),
  preco_visivel     BOOLEAN DEFAULT TRUE,
  
  -- Características do imóvel
  area_total        NUMERIC(8, 2),
  area_construida   NUMERIC(8, 2),
  quartos           INTEGER,
  banheiros         INTEGER,
  vagas_garagem     INTEGER,
  tipo_projeto      TEXT,
  estilo            TEXT,
  
  -- Localização
  cidade            TEXT,
  estado            TEXT,
  
  -- Mídia
  imagem_capa       TEXT,
  galeria           TEXT[] DEFAULT '{}',
  
  -- SEO
  meta_titulo       TEXT,
  meta_descricao    TEXT,
  
  -- Ordenação
  ordem             INTEGER DEFAULT 0,
  destaque          BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- 2. TRIGGER: atualizar updated_at automaticamente
-- ============================================================
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

-- ============================================================
-- 3. ÍNDICES: projetos
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);
CREATE INDEX IF NOT EXISTS idx_projetos_slug ON projetos(slug);
CREATE INDEX IF NOT EXISTS idx_projetos_destaque ON projetos(destaque);
CREATE INDEX IF NOT EXISTS idx_projetos_ordem ON projetos(ordem);

-- ============================================================
-- 4. TABELA: leads
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados pessoais
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefone    TEXT,
  
  -- Origem
  projeto_id  UUID REFERENCES projetos(id) ON DELETE SET NULL,
  projeto_titulo TEXT,
  origem      TEXT DEFAULT 'site',
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  
  -- Mensagem
  mensagem    TEXT,
  
  -- Controle
  status      TEXT DEFAULT 'novo'
              CHECK (status IN ('novo', 'em_contato', 'qualificado', 'convertido', 'descartado')),
  anotacoes   TEXT
);

-- ============================================================
-- 5. ÍNDICES: leads
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_projeto ON leads(projeto_id);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

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

-- LEADS: Apenas admin pode LER
CREATE POLICY "Admin lê leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- LEADS: Apenas admin pode ATUALIZAR
CREATE POLICY "Admin atualiza leads"
  ON leads FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. STORAGE: Bucket projetos-imagens
-- ============================================================

-- Criar bucket público para imagens dos projetos
INSERT INTO storage.buckets (id, name, public)
VALUES ('projetos-imagens', 'projetos-imagens', true)
ON CONFLICT (id) DO NOTHING;

-- Política: Leitura pública de imagens
CREATE POLICY "Imagens públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projetos-imagens');

-- Política: Admin faz upload
CREATE POLICY "Admin faz upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'projetos-imagens' AND auth.role() = 'authenticated');

-- Política: Admin deleta imagens
CREATE POLICY "Admin deleta imagens"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'projetos-imagens' AND auth.role() = 'authenticated');
