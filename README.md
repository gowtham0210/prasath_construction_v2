# Prasanth Construction — residential construction website

A cinematic, scroll-driven website for a residential construction company (independent houses, villas, duplexes,
turnkey construction, renovation).

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS v4 ·
GSAP + ScrollTrigger · Lenis · Framer Motion · Lucide.

> **Everything with a company name, contact detail, project or testimonial is a PLACEHOLDER.** See
> [Replacing content](#replacing-content) — nothing is invented as fact: projects are labelled *concepts*, and there are
> no fake testimonials, statistics, awards or certifications.

## What is on the page

| # | Section | Notes |
|---|---------|-------|
| – | **Splash screen** | A short branded splash (house mark + wordmark, ~1.7 s, no loading bar) that lifts away to reveal the hero. |
| 00 | **Hero** | Light sky-to-peach hero: headline *Your Vision. Our Foundation.*, glass card with both CTAs, a project photograph with floating hotspot labels, a style card and a services strip. "Watch the tour" opens the walkthrough video in a lightbox (loaded only on demand). |
| 02 | About | Editorial layout, masks and parallax. |
| 03 | Services | Six image-led rows, each with its own image clip; *Explore Service* pre-selects that service in the enquiry form. |
| 04 | Projects | Filters (All / Independent Houses / Villas / Duplex Homes / Renovation), magazine layout, detail view per project (`#/project/<slug>`). |
| 05 | Our process | Pinned **horizontal** timeline on desktop with synchronised imagery; vertical timeline on mobile. |
| 08 | Testimonials | Neutral placeholder until real testimonials are added (`src/data/testimonials.ts`). |
| 10 | Contact | Validated enquiry form → real backend, loading / success / error states, optional WhatsApp. |
| – | Footer, Privacy page (`#/privacy`) | Only verified contact details are shown. |

## Install & run

```bash
npm install
npm run dev          # http://localhost:5190
npm run server       # in a second terminal: enquiry endpoint on :8787 (Vite proxies /api to it)
npm run build        # type-check + production build into dist/
npm run preview      # serve the production build
```

Handy while developing: open `http://localhost:5190/?fast` to skip the splash screen.

## Enquiry form

`POST /api/enquiry` (JSON). The UI only shows *Thank you* when the server answers `{ "ok": true }`; any failure shows
an honest error (with a WhatsApp fallback if configured).

* **Bundled server** — `server/index.mjs` (no dependencies): validates, rate-limits, ignores a honeypot field, appends to
  `server/data/enquiries.jsonl` and optionally forwards each enquiry to `FORWARD_WEBHOOK_URL` (Slack, Make, Zapier, n8n, CRM…).
* **Hosted form service** — set `VITE_FORM_ENDPOINT` to Formspree / Web3Forms / a Netlify or Vercel function. Any 2xx response counts as success.

## Environment variables

Copy `.env.example` to `.env` and fill in what you have:

```
VITE_FORM_ENDPOINT=/api/enquiry
VITE_COMPANY_EMAIL=            VITE_COMPANY_PHONE=            VITE_COMPANY_ADDRESS=
VITE_SERVICE_AREAS=Area one, Area two
VITE_WHATSAPP_NUMBER=919876543210
VITE_SITE_URL=https://your-domain.com
```

Empty values are simply hidden. Social links and the company name live in `src/config/company.ts`.

## Replacing content

| What | Where |
|------|-------|
| Company name, legal name, social links, `verified` flag | `src/config/company.ts` |
| Tour video (lightbox) | `public/media/tour.mp4` |
| Photographs used everywhere | `src/data/media.ts` — static JPEGs in `public/images/`; replace the files (or point `image` at your own) and update `alt` |
| Projects (replace the concepts with real completed work) | `src/data/projects.ts` — keep `isConcept: true` for illustrative ones |
| Services, journey | `src/data/*.ts` |
| Testimonials (only real, permitted ones) | `src/data/testimonials.ts` |
| Privacy text (a template — have it reviewed) | `src/components/PrivacyPolicy.tsx` |
| `sitemap.xml`, `robots.txt`, `<meta og:image>` | `public/`, `index.html` — set your domain; add `/og-image.jpg` and an `og:image` tag |

Local-business JSON-LD is emitted **only** when `company.verified` is `true` and a name, a phone or email, and an address are set.

## Architecture

```
src/
  config/company.ts          configurable company details
  data/                      typed content (services, projects, journey, testimonials, media)
  lib/                       smooth.ts (Lenis↔GSAP), enquiry.ts, seo.ts, store.ts
  hooks/                     media queries, WebGL detection, hash router
  sections/                  Hero, About, Services, Projects, Journey, Testimonials, Contact
  components/                Nav, Preloader (splash), TourModal, Footer, ProjectDetail, PrivacyPolicy, Still, Reveal, Magnetic, Logo
server/index.mjs             enquiry endpoint
```

### Performance & robustness

* All photographs are static JPEGs; nothing is decoded from video at load. The tour video is fetched only when its lightbox opens.
* Mobile: smaller frames, fewer instances, no shadows, vertical process timeline.
* **Reduced motion:** native scrolling and no entrance animations.
* ScrollTriggers, tweens and Lenis are created inside `gsap.context` / effects and cleaned up on unmount.

## Deploying

```bash
npm run build          # outputs dist/
```

* **Static host (Netlify, Vercel, Cloudflare Pages, S3…):** deploy `dist/`. Point `VITE_FORM_ENDPOINT` at a hosted form service or a serverless function, **or** run `server/index.mjs` on a small Node host and set `VITE_FORM_ENDPOINT` to its full URL (set `ALLOWED_ORIGIN` to your site's origin for CORS).
* **Single VPS:** serve `dist/` with nginx and proxy `/api/` to `node server/index.mjs` (`PORT=8787`), run under pm2/systemd.
* Serve `public/media/*.mp4` with range requests and long cache headers (most hosts do this by default).
* After deploying, set the real domain in `VITE_SITE_URL`, `public/sitemap.xml` and `public/robots.txt`.

## Known limitations / things to supply

* The photographs are AI-generated stills supplied with the project — replace them with real photography of real projects as soon as it exists.
* `og-image.jpg`, a favicon set and real project data are not included.
