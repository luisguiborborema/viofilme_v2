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
(`HERO`, `QUEM SOMOS`, `ECOSSISTEMA`, `PRODUTOS`, `RESULTADOS`, `MÉTODO`, `CTA`).
Os números dos contadores ficam nos atributos `data-count` / `data-prefix` /
`data-suffix` / `data-decimals`. Cores e tipografia são variáveis no topo de
`assets/css/styles.css` (`--blue`, `--lime`, `--cream`, `--coral`).
