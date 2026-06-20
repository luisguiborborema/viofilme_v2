# Viofilme — Site Institucional (v2)

Site institucional da agência **Viofilme** — comunicação, performance e branding.
*Make it happen.*

Site estático (HTML + CSS + JS), sem etapa de build, com transições e animações
de scroll (GSAP + ScrollTrigger + Lenis via CDN).

## Estrutura do repositório

```
.
├── site/               # o site (abra site/index.html)
│   ├── index.html
│   ├── assets/{css,js,img}
│   └── README.md       # documentação detalhada do site
├── Logos/              # identidade visual (brandboard + logos SVG)
├── viofilme.md         # conteúdo institucional (base do site)
└── README.md
```

## Rodar localmente

```bash
cd site
python3 -m http.server 8000
# abra http://localhost:8000
```

## Deploy

É um site estático: basta publicar a pasta `site/` em Vercel, Netlify,
Cloudflare Pages ou GitHub Pages. Não há build.

Mais detalhes em [`site/README.md`](site/README.md).
