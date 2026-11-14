# AG Health — Link oficial

Microsite estático, mobile-first e sem coleta de dados. O retrato atualmente aprovado é a panorâmica de pôr do sol de 13/11/2026. A imagem ocupa toda a tela sem máscaras, e o painel Liquid Glass sobrepõe a maior parte do rosto no celular, conforme a última orientação. Seis destinos oficiais, redes sociais e CTA de agendamento permanecem clicáveis.

## Estrutura

- `index.html`: estrutura semântica, metadados SEO/Open Graph e conteúdo principal.
- `styles.css`: base de layout, estados de interação e acessibilidade.
- `reference.css`: retrato full-bleed original e painel translúcido grafite fumê responsivo, com tonalização não destrutiva do fundo.
- `porcelain-links.css`: tabela de links neomórfica em porcelana bege mineral, inspirada no módulo **Light** da AG Clinic (sanca grafite profundamente rebaixada, relevos marcados, nichos de ícones com glifos brancos e comportamento físico de pressão).
- `app.js`: renderização segura dos links e ícones; parallax suave do painel ao mover o cursor e ao rolar a página, sem movimentar a foto.
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

O painel usa vidro translúcido grafite/chumbo, solicitado expressamente para este projeto, com texto claro e bordas refletivas; os cartões são placas sólidas de porcelana **bege** com friso de espessura, sombras internas/externas profundas e ação de pressão 3D. Os glifos **brancos** repousam em nichos escuros esculpidos na pedra. A sanca externa usa sombras internas marcadas e iluminação mineral. A fotografia aprovada não é reprocessada: a tonalização do cenário acontece por CSS e continua full-bleed em todos os breakpoints, sem recortes abruptos. No celular, o painel começa aproximadamente a 25% da altura da tela e sobrepõe mais da metade do rosto; no desktop fica à direita. O CTA Continuar repete o relevo de porcelana. O logotipo AG foi estreitado e os elementos de navegação superiores (seta, X e 1/6) foram removidos. O título permanece `Explore meus conteúdos e projetos`. O parallax acontece exclusivamente no painel e é desabilitado quando `prefers-reduced-motion` está ativo. A página respeita `prefers-reduced-motion`, `prefers-reduced-transparency` e não carrega fontes remotas, analytics, pixels, banco de dados nem scripts de rastreamento.
