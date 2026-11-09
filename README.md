# AG Health — Link oficial

Microsite estático, mobile-first e sem coleta de dados. A interface reproduz a referência aprovada “Dr. André: Saúde e Longevidade envidraçadas”, com painel Liquid Glass, fotografia original em destaque, seis destinos oficiais, redes sociais e CTA de agendamento. Em desktop/tablet, o retrato ampliado fica atrás do painel; em celulares, o retrato aparece acima do painel e a página rola naturalmente.

## Estrutura

- `index.html`: estrutura semântica, metadados SEO/Open Graph e conteúdo principal.
- `styles.css`: layout responsivo, glassmorphism, estados de interação e acessibilidade.
- `app.js`: renderização segura dos links e ícones a partir da configuração.
- `config.js`: destinos públicos verificados; mensagens WhatsApp pré-preenchidas.
- `assets/portrait.webp`: retrato integral tratado em luz de pôr do sol para desktop.
- `assets/portrait-tablet.webp`: mesmo retrato integral otimizado para tablets.
- `assets/portrait-mobile.webp`: mesmo retrato integral otimizado para celulares.
- `assets/portrait-provenance.md`: procedência e hash da fotografia-fonte; segmentação local com Apple Vision e color grading sem mudança de identidade ou recortes.
- `scripts/build-sunset-portraits.py`: processamento local reproduzível do retrato com máscara gerada pelo Apple Vision; o original não é distribuído no repositório.

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

O painel usa o material deep-glass do IBMI Reference Lab (blur de 40 px, saturação elevada e bordas/reflexos especulares); os cartões internos usam superfícies translúcidas sem blur aninhado. A pessoa é exibida sem ampliação/corte (`background-size: contain`) sobre céu âmbar e lavanda, com deslocamento de profundidade ao movimentar o ponteiro, parallax discreto ao rolar no celular e fallback `prefers-reduced-motion`. O indicador `1/6` e os controles possuem semântica acessível. A página não carrega fontes remotas, analytics, pixels, banco de dados ou scripts de rastreamento.
