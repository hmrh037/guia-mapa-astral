# Guia Visual do Mapa Astral — landing page

Site estático (HTML, CSS e JS), pronto para GitHub Pages. Não precisa de Node, servidor ou banco de dados.

**Entrypoint:** `index.html`

## Publicar no GitHub Pages
1. Envie **o conteúdo desta pasta** (inclusive o arquivo `.nojekyll`) para a raiz de um repositório.
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`. Todos os caminhos são relativos, então funciona em subpasta ou em domínio próprio.

## Onde configurar
Tudo em **`assets/js/config.js`**:
- **Checkout:** `checkoutUrl` — com a URL preenchida, todos os botões de compra passam a levar ao checkout.
- **Meta Pixel:** `metaPixel` — ID numérico do Pixel.
- **GA4:** `ga4` — ID no formato `G-XXXXXXXXXX`.

Deixe vazio o que ainda não existir: nada é carregado nem inventado.

Direto no **`index.html`** (há comentários `TODO` marcando cada ponto):
- **Domínio final:** `<link rel="canonical">`, `og:url` e URL absoluta em `og:image` / `twitter:image`.
- **Rodapé:** e-mail de suporte, identificação do vendedor e link da política de privacidade.

## Estrutura
```
index.html          página
robots.txt
.nojekyll           evita processamento Jekyll no GitHub Pages
assets/
  css/styles.css    estilos
  js/config.js      checkout, Pixel, GA4
  js/main.js        comportamento (reveal, CTA fixo, FAQ, tracking)
  img/              mockup, páginas reais do guia, OG image, favicon
  fonts/            fontes (woff2)
```

Projeto-fonte: a landing é gerada por `landing/scripts/build.js` (configuração em `landing/config.js`) e esta pasta por `landing/scripts/export-github-pages.js`.
