# Oficina 360 — protótipo navegável

Protótipo de sistema de gestão integrada para oficina mecânica: CRM, orçamentos, ordens de serviço, agenda, estoque, financeiro, marketing e dashboards.

- Site estático (HTML, CSS e JavaScript puro), sem build e sem dependências.
- Todos os dados são fictícios e ficam só na memória do navegador; recarregar a página volta ao estado inicial.

## Rodar localmente

Abra `index.html` por um servidor estático, por exemplo:

```bash
python -m http.server 8080
```

## Publicar na Vercel

Importe o repositório na Vercel com o preset **Other** — sem comando de build e com o diretório de saída na raiz.

## Estrutura

- `index.html` — estrutura da aplicação
- `css/app.css` — design system (verde floresta + lime, componentes em pílula)
- `js/core.js`, `js/charts.js`, `js/shell.js` — utilitários, gráficos SVG, navegação, menus, busca global e tela de módulos
- `js/data.js` — dados de demonstração
- `js/*.js` — um arquivo por módulo
