Abaixo está a versão da `skill-meus-principios` focada só em **estrutura neutra** (layout, grid, espaçamento, tipografia, ícones e responsividade). Removi/neutralizei tudo que “manda” em brand do cliente (border-radius específico, se botão tem borda, estética de botão, etc.). [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/155760075/6f0e19d7-69f9-4313-bb6f-b8a951eed974/skill-meus-principios-1.md?AWSAccessKeyId=ASIA2F3EMEYEQZ2URAMH&Signature=p0u%2BPQ%2Bv%2BeF4ttp%2FMsWIxnqO5cw%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEJj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQC5oMS5djkzFAPCoFcbMK1AN1mlT103t0yagCQqXTSKNAIhALK9u2jaQPxInqyqfBDzGS5uqkVGRmrijI%2BWB9RPGAoPKvMECGEQARoMNjk5NzUzMzA5NzA1IgxUOicTkyTucfsQVUwq0AQB553qTUitRb9zyqhnZ1YB43o6bZIzefWmrJN42e7YXKqVz%2FCR5mJNx702rxB5y5uqHmfNFzoETdkgIC6DS2eNv%2FIrp5UaGP9stS8QfnTubYE8kJEtMtOkDr3Y12NsEqk4SQcvc21DREl85HJhrEho7%2BueURojuo1b3GAzQKI0WLJlrttvR8A0owA%2BRR2rXzWsDxmuNscvDTxYa0sHfNK4zVNsTyfY%2BriwA6nxLz3rlVy2UAVgL5mRXpwdp4iHv7JSyXpUqZ%2FEVcGBXfIRp5B%2B%2B2wuQHVwt7rSdHPBoMmJv3HC7P3TbtNC%2Fl6nZdKH5KuLbLn3KIkGWVsWRWNm4bKi9vL8WSBkTVAtjbCt68XfX2%2FkzlAJr81teaRozxdMw%2FpfI13U%2F8c%2FpXJ7jT5qZ8YYpMm70rrgm2VFDcWySQ71KcOw1k9rGwlo2ZmGhdedTJbrfgQ5iFCcddn79%2FSgeJQfJfiVXZHGXD52iGl9mOIQvd6IsMjQRiTBgNhLPAb3TinuC%2FS1dcF5L5Xlk3dkDQLNUW9iwecsCyKryxWzcVIqFB9qvdwpcdK9DfsOMvEB6d%2FEvAnAdaLo%2Bbtudx5Tn7VRhA%2BMw4rWO0%2Fmf9HXxqdsXbedPx8ZmFaJ4m1g%2BVf4rT3w5q1wOzP6jxH0HA5KmWXwQ9r%2FnMuNrvvDAgkE0fByu8%2FMbZsX5gJns%2FOikA6icMo94EOpCx4cqdy3dWahBrGxybNbDoPS4OtsO%2B0Ztda7C4C0SYdNjj%2FQ64HFjWERMAOs35k9DsRyfJ2S0uFp%2Fy9JMP%2FTts4GOpcB9%2FXzf4AfpAfM3Ya0TM4OOhhAkOWkJ47eQKUR0IxmsK4WaUflT0ZvQoB0uPjES4HZNisubOTN7n7l24Wh51nYAXma0KcXR%2BnKNrunpspHgPAJoaP8P3FSIZBJVDLlp6DNqSDCpaNYBIgnxnDF%2Fd0tz0BZIxf%2B2oDfQu2lVqI4iLtCxSAGdt812f5mYdFCSQtX%2BAYE0uoEHQ%3D%3D&Expires=1775088562)

```md
---
name: skill-meus-principios
description: >
  Carregue este skill sempre que for criar qualquer interface, componente, página ou site.
  Contém os meus princípios estruturais de design: layout, espaçamento, tipografia,
  tamanhos mínimos de toques e padrões responsivos — para desktop e mobile.
  Use em conjunto com skill-contexto-da-marca e skill-ds-final-[projeto] para que
  cores, radius, estilos de botão e demais decisões de brand venham SEMPRE do cliente.
---

# Meus Princípios de Design (Estruturais)

## 1. Layout & Grid

### Desktop
- **Largura full:** `100vw` (`w-full`) — de ponta a ponta.
- **Container primário:** `1280px` (`max-w-[80rem]`) — seções gerais de conteúdo.
- **Container secundário:** `1024px` (`max-w-[64rem]`) — seções mais focadas/centradas.
- **Container de texto longo:** `864px` (`max-w-[54rem]`) — introduções e textos extensos.
- **Grid:** uso predominante de `grid-cols-2`, `grid-cols-3`, `grid-cols-4`; frações irregulares
  como `55% / 45%` quando fizer sentido para layouts de destaque (ex.: case de sucesso).

### Mobile
- **Largura full:** `100vw` (`w-full`) — otimizado para modo retrato.
- **Container:** largura total controlada pelos paddings laterais de segurança.
- **Grid:** empilhamento linear vertical — `flex-col` ou `grid-cols-1`.

---

## 2. Espaçamentos

*(Valores são guias estruturais; a marca/projeto pode ajustar desde que respeite as relações.)*

### Desktop
| Contexto                     | Valor de referência | Classe Tailwind sugerida |
|-----------------------------|---------------------|---------------------------|
| Padding lateral (safe area) | 48px                | `px-12`                   |
| Entre seções (vertical)     | 128px               | `py-32`                   |
| Hero — padding superior     | 192px               | `pt-48`                   |
| Hero — padding inferior     | 128px               | `pb-32`                   |
| Padding interno de cards    | 40px – 64px         | `p-10` a `p-16`           |

### Mobile
| Contexto                     | Valor de referência | Classe Tailwind sugerida |
|-----------------------------|---------------------|---------------------------|
| Padding lateral (safe area) | 24px                | `px-6`                    |
| Header e navegação          | 16px                | `px-4`                    |
| Entre seções (vertical)     | 96px                | `py-24`                   |
| Hero — padding superior     | 112px               | `pt-28`                   |
| Hero — padding inferior     | 64px                | `pb-16`                   |
| Padding interno de cards    | 32px – 40px         | `p-8` a `p-10`            |

---

## 3. Tipografia (escala estrutural, independente de família)

### Desktop
| Elemento                | Tamanho | Line-height                               | Letter-spacing                     |
|-------------------------|---------|-------------------------------------------|------------------------------------|
| H1 (Hero)               | 36px    | `leading-none` (1.0) a `leading-tight`    | `tracking-tight` (-0.025em)        |
| Parágrafo Hero          | 18px    | `leading-snug` (1.375) a `leading-normal` | —                                  |
| H2 (Seção)              | 30px    | `leading-none` a `leading-tight`          | `tracking-tight` (-0.025em)        |
| H3 (Card comum)         | 18px    | `leading-snug` a `leading-tight`          | `tracking-tight` (-0.025em)        |
| H3 (destaque/case)      | ≤ 24px  | `leading-tight`                           | `tracking-tight` (-0.025em)        |
| Body (padrão)           | 16px    | `leading-normal` (1.5) a `leading-relaxed`| —                                  |
| Body (máximo)           | 16px    | `leading-relaxed`                         | —                                  |
| Caption / Tag / micro   | 13px    | `leading-snug`                            | `tracking-wider` a `tracking-widest` |
| Stats / datas grandes   | 48px    | `leading-none` a `leading-[1.1]`          | `tracking-tight` (-0.025em)        |

### Mobile
| Elemento              | Tamanho | Line-height                               | Letter-spacing              |
|-----------------------|---------|-------------------------------------------|-----------------------------|
| H1                    | 28px    | `leading-[1.1]` a `leading-tight`        | `tracking-tight` (-0.025em)|
| Parágrafo Hero        | 16px    | `leading-snug` (1.375) a `leading-normal`| —                           |
| H2 (Seção)            | 22px    | `leading-[1.1]` a `leading-tight`        | `tracking-tight` (-0.025em)|
| H3 (Card em grid)     | 16px    | `leading-snug`                            | `tracking-tight` (-0.025em)|
| H3 (Card enfático)    | 20px    | `leading-tight`                           | `tracking-tight` (-0.025em)|
| Body (padrão)         | 15px    | `leading-normal` (1.5)                    | —                           |
| Body (máximo / lead)  | 16px    | `leading-snug` a `leading-normal`        | —                           |
| Caption / Overline    | 12px    | `leading-snug`                            | `tracking-widest` (+0.1em) |
| Stats numéricas       | 24–28px | `leading-tight`                           | `tracking-tight` (-0.025em)|

**Regras gerais de tipografia (neutras de marca):**

- Tamanho mínimo absoluto: **14px** — exclusivo para legendas, tags, overlines e microcópias.
- Tamanho máximo recomendado para corpo corrido: **18px**.
- Títulos: sempre com `tracking-tight` (-0.025em) para sensação mais “sólida”.
- Uppercase (captions, overlines, marquees): `tracking-wider` (+0.05em) a `tracking-widest` (+0.1em).
- Títulos usam line-height mais fechado: `leading-none` (1.0) a `leading-tight` (1.25).
- Corpo usa line-height mais aberto: `leading-snug` (1.375) a `leading-relaxed` (1.625).

A família de fonte (serif/sans, display/body) e cores de texto sempre vêm do
design system da marca do cliente.

---

## 4. Botões (somente princípios estruturais)

Sem definir estilo visual (radius, borda, cor), apenas:

- **Tamanho de alvo mínimo:** altura visual ≥ 44px em desktop e mobile.
- **Padding horizontal recomendado:**
  - Botões principais: ~24–32px (`px-6` a `px-8`).
  - Botões secundários/menores: ~16–24px (`px-4` a `px-6`).
- **Padding vertical recomendado:** ~12–20px (`py-3` a `py-5`), ajustando conforme o tamanho da fonte.
- **Tipografia:** nunca menos que 14px; ideal 14–16px para rótulos de botão.
- **Alinhamento:** texto sempre centralizado vertical e horizontalmente.
- **Mobile:** preferir `w-full` para CTAs principais quando fizer sentido, garantindo toque confortável.

**O que é sempre definido pelo projeto/marca:**

- Cores de fundo, borda e texto do botão.
- Border-radius (quadrado, levemente arredondado, pill, etc.).
- Estilo de borda (solid, outline, ghost).
- Ícones dentro do botão.

---

## 5. Ícones & Elementos

- **Tamanho relativo ao texto:** `1.2em`, `1.5em` ou `1.8em` (evitar px fixo para escalar junto com a tipografia).
- **Alinhamento com texto:** usar `flex items-center` para ícone + label.
- **Gap ícone + texto:** `8px` (`gap-2`) a `12px` (`gap-3`).

**Gaps entre elementos em grid/coluna:**

| Contexto                                   | Desktop                     | Mobile                      |
|--------------------------------------------|-----------------------------|-----------------------------|
| Entre blocos principais (texto + imagem)   | 48px (`gap-12`) a 80px (`gap-20`) | 16px (`gap-4`) a 32px (`gap-8`) |
| Entre elementos menores (checklists, listas)| 16px (`gap-4`) a 24px (`gap-6`)  | 16px (`gap-4`) a 24px (`gap-6`)  |

A iconografia em si (estilo de traço, preenchimento, biblioteca usada) é decisão de brand/projeto.

---

## 6. Padrões Responsivos

| Padrão Desktop                         | Comportamento Mobile                                      |
|----------------------------------------|-----------------------------------------------------------|
| Grids multi-coluna (`grid-cols-2/3/4`) | Empilhamento vertical `flex-col` / `grid-cols-1`         |
| Frações irregulares (55% / 45%)        | Coluna única sequencial                                   |
| Container com largura máxima definida  | Largura total, controlada pelos paddings laterais        |
| Padding lateral 48px                   | Reduz para 24px (corpo) / 16px (navegação)               |
| Espaçamento entre seções 128px         | Reduz para ~96px                                         |
| Hero padding top 192px                 | Reduz para ~112px                                        |
| Hero padding bottom 128px              | Reduz para ~64px                                         |
| Padding interno de cards 40–64px       | Reduz para 32–40px                                       |
| H1 36px                                | Reduz para 28px                                          |
| H2 30px                                | Reduz para 22px                                          |
| Stats 48px                             | Reduz para 24–28px                                       |
| Botões com padding fixo                | Mantêm padding ou expandem para `w-full` como touch target |
| Ícones em `em`                         | Escalam automaticamente com a fonte                      |

Esses padrões garantem uma base consistente; **quem manda no “sabor” visual é sempre
o contexto da marca + design system final do projeto.**
