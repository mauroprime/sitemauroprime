# Plano de Implementação: Página de Listagem de Projetos com Filtros Avançados

Este plano descreve a criação de uma nova página `/projetos` que exibirá todos os projetos publicados em um grid elegante, com uma barra lateral de filtros dinâmica.

## User Review Required

> [!IMPORTANT]
> A listagem filtrará automaticamente projetos que NÃO estão marcados apenas como galeria (para manter o foco em projetos de venda/construção).
> Utilizaremos um componente de filtros no lado do cliente (Client Component) para garantir interatividade instantânea sem recarregar a página.

## Proposed Changes

### [Nova Página] [projetos/page.tsx](file:///c:/Users/Henrique%20de%20Souza/Desktop/Apps/Site%20Mauro%20-%20Construtora%20Prime/src/app/(public)/projetos/page.tsx) [NEW]

- Implementar a página como um Server Component para buscar os dados iniciais do Supabase.
- Integrar o componente `ProjectFilters` que gerenciará o estado e a exibição.

### [Componente] [ProjectFilters.tsx](file:///c:/Users/Henrique%20de%20Souza/Desktop/Apps/Site%20Mauro%20-%20Construtora%20Prime/src/components/ProjectFilters.tsx) [NEW]

- **Listagem em Grid**: Exibição dos cards de projeto de forma responsiva.
- **Barra Lateral de Filtros**:
    - **Faixa de Preço**: Slider ou inputs de Min/Max.
    - **Cômodos**: Selects ou botões para Quartos, Banheiros.
    - **Diferenciais**: Checkbox para Suíte (verificar no `attributes_json`).
    - **Tipo**: Filtro por categoria (Casa, Sobrado, etc).
- **Lógica de Filtro**: Filtragem em tempo real no array de projetos.

### [Estilo] Design System Elite

- Manter cores `brand-gold`, `zinc-900` e tipagem serifada.
- Cards com hover suave e informações claras de preço e atributos.

## Open Questions

> [!NOTE]
> No banco de dados, o campo `attributes_json` armazena os cômodos. Preciso confirmar se 'suíte' é uma chave padrão nesse JSON ou se devo filtrar pela descrição/título. Vou assumir a lógica de busca no JSON.

## Verification Plan

### Manual Verification
- Testar múltiplos filtros simultâneos (ex: 3 quartos + até R$ 500k).
- Verificar se o botão de "Limpar Filtros" funciona corretamente.
- Atestar a velocidade de filtragem com o estado local.
- Validar a responsividade do grid e da barra de filtros no celular.
