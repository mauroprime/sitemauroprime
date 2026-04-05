// src/types/index.ts

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
