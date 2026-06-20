# VIOFILME — Site Institucional

Site institucional estático da agência Viofilme. Sem build, sem dependências
para instalar — abre direto no navegador.

## Estrutura

```
site/
├── index.html              # página única (todas as seções)
├── assets/
│   ├── css/styles.css      # estilos + estados iniciais das animações
│   ├── js/main.js          # animações (GSAP + ScrollTrigger + Lenis via CDN)
│   └── img/                # logos, ícone e favicon (SVG)
└── README.md
```

## Como rodar localmente

Por causa das fontes e libs via CDN, sirva por HTTP (abrir o arquivo direto
também funciona, mas servir é mais fiel):

```bash
cd site
python3 -m http.server 8000
# abra http://localhost:8000
```

## Animações / diferencial

- **Loader** de entrada com a marca e barra de progresso.
- **Scroll suave** (Lenis) + **barra de progresso** no topo.
- **Hero** com revelação de texto por máscara, ícone flutuante e parallax.
- **Reveals** ao rolar (fade/slide) em todas as seções (ScrollTrigger).
- **Contadores** animados (180+, ROAS, churn etc.).
- **Marquee** infinito (Performance · Branding · Comunicação).
- **Cursor customizado**, botões **magnéticos** e cards com **tilt 3D** (desktop).
- Respeita `prefers-reduced-motion` e tem fallback total se o CDN cair (conteúdo
  sempre visível, sem travar).

## Como editar o conteúdo

Todo o texto está em `index.html`, dividido por seções comentadas
(`HERO`, `QUEM SOMOS`, `ECOSSISTEMA`, `PRODUTOS`, `RESULTADOS`, `MÉTODO`, `CTA`).
Os números dos contadores ficam no atributo `data-count` (com `data-prefix`,
`data-suffix`, `data-decimals`).

Cores e tipografia estão em variáveis no topo de `assets/css/styles.css`
(`--blue`, `--lime`, `--cream`, `--coral`).

## Deploy

É um site estático: suba a pasta `site/` em qualquer host estático
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3...). Não há etapa de build.

## Próximos passos sugeridos

- Trocar o `mailto:` do CTA por um formulário/agenda (Calendly, Cal.com etc.).
- Adicionar logos reais de clientes na seção de resultados.
- Imagens/vídeo de fundo no hero, se desejar (a estrutura já comporta).
