# AG Health — Link oficial

Microsite estático, mobile-first e sem coleta de dados. O retrato de referência foi extraído diretamente da imagem do orçamento do Custódio, com painel Liquid Glass sobreposto no desktop e em celulares. Seis destinos oficiais, redes sociais e CTA de agendamento permanecem clicáveis.

## Estrutura

- `index.html`: estrutura semântica, metadados SEO/Open Graph e conteúdo principal.
- `styles.css`: layout responsivo, glassmorphism, estados de interação e acessibilidade.
- `app.js`: renderização segura dos links e ícones a partir da configuração.
- `config.js`: destinos públicos verificados; mensagens WhatsApp pré-preenchidas.
- `assets/portrait-budget-exact.png`: recorte sem edição do retrato na arte do orçamento do Custódio (324 × 407 px), sem informações do paciente.
- `assets/portrait-budget-mask.png`: máscara de segmentação criada localmente pelo Apple Vision, apenas pessoa, sem reconstrução de rosto.
- `assets/portrait-budget-hero.webp`: ampliação por Lanczos com pessoa segmentada e bordas suavizadas, sem substituir rosto nem inventar detalhes; usado em todos os breakpoints.
- `scripts/segment-budget-portrait.swift`: segmenta o retrato exato com o Apple Vision; `scripts/extract-budget-portrait.py` reproduz a extração a partir da imagem do orçamento em arquivo local privado (não versionar o orçamento completo).
- Os retratos anteriores (`portrait-approved`, `portrait.webp`, `portrait-tablet.webp`, `portrait-mobile.webp`) não são referenciados pela página.

## Executar localmente

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Publicação

O repositório oficial é `Oreganoalecrim/ag-health-linktree`. O projeto não utiliza banco de dados, variáveis secretas, autenticação nem dependências de runtime. A publicação pode ser feita como site estático no Lovable ou Vercel.

## Destinos

Os links foram verificados no Linktree oficial existente. Spotify é exibido visualmente, mas permanece desabilitado enquanto não houver URL oficial confirmada. Neurodiet e FutureAge abrem o WhatsApp com mensagem específica, evitando inventar URLs de produto.

## Design e privacidade

O painel usa vidro translúcido com blur, saturação, borda e reflexos especulares; os cartões internos são transparentes. O CTA Continuar usa vidro mais espesso, highlights e sombras internas. O logotipo AG foi estreitado e os elementos de navegação superiores (seta, X e 1/6) foram removidos. O título permanece `Explore meus conteúdos e projetos`. A página respeita `prefers-reduced-motion` e não carrega fontes remotas, analytics, pixels, banco de dados nem scripts de rastreamento.
