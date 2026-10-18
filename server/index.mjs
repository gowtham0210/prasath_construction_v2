// Minimal enquiry endpoint (no dependencies).
//
//   npm run server                      → listens on :8787 (Vite proxies /api to it in development)
//
// Environment (all optional):
//   PORT                 listen port (default 8787)
//   ENQUIRIES_FILE       where enquiries are appended as JSON lines (default server/data/enquiries.jsonl)
//   FORWARD_WEBHOOK_URL  also POST each enquiry as JSON to this URL (Slack/Make/Zapier/n8n/your CRM…)
//   ALLOWED_ORIGIN       if the site is served from a different origin, allow it here (CORS)
//
// The endpoint only answers { ok: true } after the enquiry has really been stored (and forwarded, if configured).
import http from 'node:http'
import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const FILE = resolve(process.env.ENQUIRIES_FILE || resolve(here, 'data/enquiries.jsonl'))
const WEBHOOK = process.env.FORWARD_WEBHOOK_URL || ''
const ORIGIN = process.env.ALLOWED_ORIGIN || ''
const MAX_BYTES = 20_000

// very small in-memory rate limit: 6 enquiries / 10 minutes / IP
const hits = new Map()
const limited = (ip) => {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 600_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 6
}

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json', ...(ORIGIN ? { 'Access-Control-Allow-Origin': ORIGIN } : {}) })
  res.end(JSON.stringify(body))
}

const clean = (v, max = 2000) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max)

function validate(b) {
  const e = []
  if (clean(b.fullName).length < 2) e.push('full name')
  const digits = clean(b.phone).replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) e.push('phone number')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(b.email))) e.push('email address')
  if (!clean(b.projectType)) e.push('project type')
  if (!clean(b.plotAvailability)) e.push('plot availability')
  if (clean(b.message).length < 10) e.push('project description')
  return e
}

const server = http.createServer(async (req, res) => {
  if (ORIGIN && req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' })
    return res.end()
  }
  if (req.method === 'GET' && req.url === '/api/health') return send(res, 200, { ok: true })
  if (req.method !== 'POST' || req.url !== '/api/enquiry') return send(res, 404, { ok: false, message: 'Not found' })

  const ip = req.socket.remoteAddress || 'unknown'
  if (limited(ip)) return send(res, 429, { ok: false, message: 'Too many enquiries. Please try again later.' })

  let raw = ''
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BYTES) return send(res, 413, { ok: false, message: 'Request too large.' })
    raw += chunk
  }
  let body
  try {
    body = JSON.parse(raw)
  } catch {
    return send(res, 400, { ok: false, message: 'Invalid request.' })
  }

  // honeypot: pretend success to bots, store nothing
  if (clean(body.website)) return send(res, 200, { ok: true })

  const problems = validate(body)
  if (problems.length) return send(res, 422, { ok: false, message: `Please check: ${problems.join(', ')}.` })

  const record = {
    receivedAt: new Date().toISOString(),
    fullName: clean(body.fullName, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    projectType: clean(body.projectType, 120),
    plotAvailability: clean(body.plotAvailability, 120),
    budget: clean(body.budget, 80),
    location: clean(body.location, 160),
    message: clean(body.message, 4000),
    page: clean(body.page, 300),
  }

  try {
    await mkdir(dirname(FILE), { recursive: true })
    await appendFile(FILE, JSON.stringify(record) + '\n', 'utf8')
    if (WEBHOOK) {
      const r = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) })
      if (!r.ok) throw new Error(`webhook responded ${r.status}`)
    }
  } catch (err) {
    console.error('[enquiry] failed:', err.message)
    return send(res, 500, { ok: false, message: 'The enquiry could not be saved. Please try again or contact us directly.' })
  }
  console.log(`[enquiry] stored from ${record.fullName} <${record.email}>`)
  return send(res, 200, { ok: true })
})

server.listen(PORT, () => console.log(`Enquiry server listening on http://localhost:${PORT}  →  ${FILE}`))
