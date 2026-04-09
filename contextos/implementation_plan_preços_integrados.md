# Plano de Implementação - Sincronização de Preços e Atributos

Este plano descreve as alterações necessárias para que os campos de preço, descrição completa, subtítulo e tipo de projeto sejam editáveis no painel administrativo e exibidos corretamente nas páginas do site.

## User Review Required

> [!IMPORTANT]
> Identifiquei que os campos de **Preço** e **Promoção** estavam ausentes no formulário do painel administrativo. Vou adicioná-los para que você possa definir os valores diretamente por lá.

## Mudanças Propostas

### Server Actions

#### [MODIFY] [projects.ts](file:///c:/Users/Henrique%20de%20Souza/Desktop/Apps/Site%20Mauro%20-%20Construtora%20Prime/src/actions/projects.ts)
- Atualizar as funções `createProject` e `updateProject` para processar e salvar os seguintes campos no banco de dados:
  - `price` (numérico)
  - `promotional_price` (numérico)
  - `full_description` (texto longo)
  - `type` (tipo de projeto: Casa, Sobrado, etc.)
  - `subtitle` (subtítulo do projeto)

### Painel Administrativo (UI)

#### [MODIFY] [new/page.tsx](file:///c:/Users/Henrique%20de%20Souza/Desktop/Apps/Site%20Mauro%20-%20Construtora%20Prime/src/app/admin/projetos/new/page.tsx)
- Adicionar labels e inputs para:
  - Preço de Venda
  - Preço Promocional (opcional)
  - Tipo de Projeto (Casa Térrea, Sobrado, Triplex, etc.)
  - Subtítulo
  - Descrição Completa (Textarea maior)

#### [MODIFY] [edit/page.tsx](file:///c:/Users/Henrique%20de%20Souza/Desktop/Apps/Site%20Mauro%20-%20Construtora%20Prime/src/app/admin/projetos/%5Bid%5D/edit/page.tsx)
- Integrar os mesmos campos acima no formulário de edição, carregando os valores existentes do banco de dados.

### Site Público (UI)

#### [MODIFY] [[slug]/page.tsx](file:///c:/Users/Henrique%20de%20Souza/Desktop/Apps/Site%20Mauro%20-%20Construtora%20Prime/src/app/(public)/projetos/%5Bslug%5D/page.tsx)
- Revisar a formatação dos preços para garantir que usem `Number()` antes do `toLocaleString`, evitando problemas de exibição com valores vindos do banco.

## Plano de Verificação

### Verificação Manual
1. **Admin**: Criar ou editar um projeto definindo um preço (ex: 500000) e um preço promocional (ex: 450000).
2. **Admin**: Verificar se ao salvar e recarregar a página de edição os valores permanecem corretos.
3. **Página do Projeto**: Acessar a página pública do projeto e confirmar se o preço aparece como "R$ 450.000" em destaque e "R$ 500.000" riscado.
4. **Página do Projeto**: Confirmar se a descrição completa e o tipo de projeto também estão sendo exibidos.
