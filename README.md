# AG Health — Link oficial

Microsite estático, mobile-first e sem coleta de dados. O retrato atualmente aprovado é a panorâmica de pôr do sol de 13/11/2026. A imagem ocupa toda a tela sem máscaras, e o painel Liquid Glass sobrepõe a maior parte do rosto no celular, conforme a última orientação. Seis destinos oficiais, redes sociais e CTA de agendamento permanecem clicáveis.

## Estrutura

- `index.html`: estrutura semântica, metadados SEO/Open Graph e conteúdo principal.
- `styles.css`: layout responsivo, glassmorphism, estados de interação e acessibilidade.
- `app.js`: renderização segura dos links e ícones a partir da configuração.
- `config.js`: destinos públicos verificados; mensagens WhatsApp pré-preenchidas.
- `assets/portrait-sunset-wide-20261113.png`: fotografia panorâmica original aprovada, conservada sem alteração.
- `assets/portrait-sunset-wide-20261113.webp`: mesma foto otimizada para web (91% de qualidade, 79 KB).
- `assets/portrait-budget-*`: arquivos históricos preservados para recuperação, mas não utilizados na versão principal.
- `scripts/segment-budget-portrait.swift`: segmenta o retrato exato com o Apple Vision; `scripts/extract-budget-portrait.py` reproduz a extração a partir da imagem do orçamento em arquivo local privado (não versionar o orçamento completo).
- Os retratos anteriores (`portrait-approved`, `portrait-budget-hero`, `portrait.webp`, `portrait-tablet.webp`, `portrait-mobile.webp`) foram preservados, mas não são referenciados pela página principal.

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

O painel usa modo claro: vidro translúcido com blur real, saturação, bordas refletivas e reflexos especulares; os cartões internos também são translúcidos. O fundo fotográfico é full-bleed em todos os breakpoints, sem recortes abruptos. No celular, o painel começa aproximadamente a 25% da altura da tela e sobrepõe mais da metade do rosto; no desktop fica à direita. O CTA Continuar usa vidro mais espesso, highlights e sombras internas. O logotipo AG foi estreitado e os elementos de navegação superiores (seta, X e 1/6) foram removidos. O título permanece `Explore meus conteúdos e projetos`. A página respeita `prefers-reduced-motion` e não carrega fontes remotas, analytics, pixels, banco de dados nem scripts de rastreamento.
