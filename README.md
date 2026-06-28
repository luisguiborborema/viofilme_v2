# Viofilme — Site Institucional (v2)

Site institucional da agência **Viofilme** — comunicação, performance e branding.
*Make it happen.*

Site estático (HTML + CSS + JS), sem etapa de build, com transições e animações
de scroll (GSAP + ScrollTrigger + Lenis via CDN).

## Estrutura

```
.
├── index.html          # página (todas as seções)
├── assets/
│   ├── css/styles.css  # estilos + estados iniciais das animações
│   ├── js/main.js      # animações (GSAP + ScrollTrigger + Lenis via CDN)
│   └── img/            # logos, ícone e favicon (SVG)
├── Logos/              # identidade visual original (brandboard + logos)
├── viofilme.md         # conteúdo institucional (base do site)
└── README.md
```

## Rodar localmente

Sirva por HTTP (as fontes/libs vêm de CDN):

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Deploy na Vercel

O `index.html` está na **raiz**, então é deploy direto, sem configuração:

1. Importe o repositório em [vercel.com/new](https://vercel.com/new).
2. **Framework Preset:** `Other` · **Build Command:** vazio · **Output Directory:** `./`
3. Deploy. A Vercel serve os arquivos estáticos automaticamente.

O `vercel.json` na raiz já define cache dos assets (`stale-while-revalidate`),
HTML sempre revalidado (deploys aparecem na hora) e headers de segurança.

> Não há etapa de build — também funciona em Netlify, Cloudflare Pages ou GitHub Pages.

## Animações / diferencial

- **Loader** de entrada + **scroll suave** (Lenis) + **barra de progresso** no topo.
- **Hero** com revelação de texto por máscara, ícone flutuante e parallax.
- **Reveals** ao rolar em todas as seções (ScrollTrigger).
- **Contadores** animados, **marquee** infinito.
- **Cursor customizado**, botões **magnéticos** e cards com **tilt 3D** (desktop).
- Respeita `prefers-reduced-motion` e tem fallback total se o CDN cair.

## Como editar o conteúdo

Todo o texto está em `index.html`, dividido por seções comentadas
(`HERO`, `PROVA SOCIAL`, `QUEM SOMOS`, `ECOSSISTEMA`, `PRODUTOS`, `RESULTADOS`,
`MÉTODO`, `CTA`). Os números dos contadores ficam nos atributos `data-count` /
`data-prefix` / `data-suffix` / `data-decimals`. Cores e tipografia são variáveis
no topo de `assets/css/styles.css` (`--blue`, `--lime`, `--cream`, `--coral`).

## Formulário de agendamento (integração com CRM)

O formulário (`#leadForm`) já valida campos, tem máscara de WhatsApp, estado de
loading e sucesso inline. Para enviar os leads ao **Pipedrive / RD Station**:

1. Crie um cenário no **Make (Integromat)** ou **Zapier** com um *webhook* que
   receba JSON e crie o negócio no Pipedrive + dispare o fluxo no RD Station.
2. Cole a URL do webhook no atributo `data-endpoint` do `<form id="leadForm">`
   em `index.html`.

O payload enviado (JSON) tem: `nome, email, whatsapp, empresa, faturamento,
segmento, desafio, origem, pagina`. **Sem `data-endpoint` configurado**, o
formulário cai num *fallback* por e-mail (`mailto:` para contato@viofilme.com.br),
para nenhum lead se perder. Nunca coloque tokens de API no front-end.

## Ativos de produção pendentes (slots já preparados)

A versão final só vai 100% ao ar com estes itens (produção externa):

- **Vídeo do hero** → coloque em `assets/video/hero.mp4` (≤5MB, sem áudio,
  loop 20–40s). Já carrega sozinho no desktop, com fallback ao fundo atual.
- **Logos de clientes** (prova social) · **fotos da equipe/escritório** ·
  **mockups dos cases** · **depoimento em vídeo** · **reel de portfólio**.
- **Ícones animados (Lottie)** no Método.

> A imagem de compartilhamento (`assets/img/og-cover.png`) já foi gerada.
