// After `vite build`: writes one HTML file per route (dist/about/index.html, dist/projects/<slug>/index.html, ...)
// with that page's own title, description, canonical address and a plain-HTML summary with real links, so search
// engines and link previews see every page without running JavaScript. React replaces the summary when the page loads.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const site = (process.env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')
const meta = JSON.parse(readFileSync(join(root, 'src/data/pageMeta.json'), 'utf8'))
const template = readFileSync(join(dist, 'index.html'), 'utf8')

// project slugs and names come straight from the data file
const src = readFileSync(join(root, 'src/data/projects.ts'), 'utf8')
const projects = [...src.matchAll(/slug:\s*'([a-z0-9-]+)',\s*name:\s*(?:'([^']+)'|"([^"]+)")/g)].map((m) => ({ slug: m[1], name: m[2] || m[3] }))

const svcSrc = readFileSync(join(root, 'src/data/services.ts'), 'utf8')
const services = [...svcSrc.matchAll(/id:\s*'([a-z0-9-]+)',\s*number:\s*'\d+',\s*title:\s*'([^']+)',\s*\n\s*headline:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => ({ id: m[1], title: m[2], headline: m[3].replace(/\\'/g, "'") }))

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const nav = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/projects', 'Projects'], ['/gallery', 'Gallery'], ['/packages', 'Packages'], ['/contact', 'Contact']]

function page({ path, title, description }, extra = '') {
  const url = site + (path === '/' ? '/' : path)
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replaceAll('content="/og.jpg"', `content="${site}/og.jpg"`)
    .replace('</head>', `    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />\n  </head>`)
  const summary =
    `<header><nav aria-label="Primary">${nav.map(([h, l]) => `<a href="${h}">${l}</a>`).join(' ')}</nav></header>` +
    `<main><h1>${esc(title.split(' | ')[0].split(' — ')[0])}</h1><p>${esc(description)}</p>${extra}</main>`
  html = html.replace('<div id="root"></div>', `<div id="root">${summary}</div>`)
  return [url, html]
}

const write = (path, html) => {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const urls = []
for (const key of Object.keys(meta)) {
  const m = meta[key]
  const extra = key === 'projects' ? `<ul>${projects.map((p) => `<li><a href="/projects/${p.slug}">${esc(p.name)}</a></li>`).join('')}</ul>` : ''
  const [url, html] = page(m, extra)
  write(m.path, html)
  urls.push([url, key === 'home' ? '1.0' : '0.8'])
}
for (const p of projects) {
  const m = { path: `/projects/${p.slug}`, title: `${p.name} | Prasanth Construction`, description: `${p.name}, a project by Prasanth Construction. See photos, specifications and location.` }
  const [url, html] = page(m, '<p><a href="/projects">All projects</a></p>')
  write(m.path, html)
  urls.push([url, '0.6'])
}

for (const sv of services) {
  const m = { path: `/services/${sv.id}`, title: `${sv.title} | Prasanth Construction`, description: sv.headline }
  const [url, html] = page(m, '<p><a href="/services">All services</a></p>')
  write(m.path, html)
  urls.push([url, '0.7'])
}

writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p]) => `  <url><loc>${u}</loc><priority>${p}</priority></url>`).join('\n')}\n</urlset>\n`,
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
console.log(`prerendered ${urls.length} routes for ${site}`)
