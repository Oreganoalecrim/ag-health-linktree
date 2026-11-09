# AG Health — Link oficial

Microsite estático, mobile-first e sem coleta de dados. A interface reproduz a referência aprovada com painel Liquid Glass, retrato à esquerda, seis destinos oficiais, redes sociais e CTA de agendamento.

## Estrutura

- `index.html`: estrutura semântica, metadados SEO/Open Graph e conteúdo principal.
- `styles.css`: layout responsivo, glassmorphism, estados de interação e acessibilidade.
- `app.js`: renderização segura dos links e ícones a partir da configuração.
- `config.js`: destinos públicos verificados; mensagens WhatsApp pré-preenchidas.
- `assets/portrait.webp`: recorte do retrato gerado e aprovado na referência visual.

## Executar localmente

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Publicação

O repositório oficial é `Oreganoalecrim/ag-health-linktree`. O projeto não utiliza banco de dados, variáveis secretas, autenticação nem dependências de runtime. A publicação pode ser feita como site estático no Lovable ou Vercel.

## Destinos

Os links foram verificados no Linktree oficial existente. Spotify é exibido visualmente, mas permanece desabilitado enquanto não houver URL oficial confirmada. Neurodiet e FutureAge abrem o WhatsApp com mensagem específica, evitando inventar URLs de produto.
