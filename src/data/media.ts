/**
 * Photographic stills used across the site — plain JPEG files in /public/images (instant to load, no runtime video work).
 * They were captured from the supplied walkthrough films (`video` + `t` record where each frame came from).
 * To use your own photography, drop a file with the same name into /public/images (or set `image`), and update `alt`.
 */
export type StillId = string

export interface StillDef {
  /** video in /public/media the frame is taken from (stock stills only) */
  video?: string
  /** time in seconds */
  t?: number
  alt: string
  /** optional override: a real photograph in /public/images */
  image?: string
}

const BASE: Record<string, StillDef> = {
  'tour-balcony': { video: 'tour', t: 0.4, alt: 'Contemporary home with a planted first-floor balcony and teak cladding' },
  'tour-porch': { video: 'tour', t: 1.9, alt: 'Shaded porch with planting and a solid timber entrance door' },
  'tour-door': { video: 'tour', t: 3.2, alt: 'Open timber front door flanked by warm wall lights and a stone feature wall' },
  'tour-hall': { video: 'tour', t: 4.6, alt: 'Entrance hall with a timber staircase, console and indoor plant' },
  'tour-living': { video: 'tour', t: 6.0, alt: 'Living room with soft seating, sheer curtains and garden light' },
  'tour-kitchen': { video: 'tour', t: 7.4, alt: 'Modern kitchen with a quartz island and concealed lighting' },
  'tour-bedroom': { video: 'tour', t: 8.8, alt: 'Master bedroom with sheer curtains opening to the garden' },
  'tour-terrace': { video: 'tour', t: 10.2, alt: 'Covered terrace with dining seating at dusk' },
  'tour-dusk': { video: 'tour', t: 11.7, alt: 'Two-storey home glowing warmly at dusk' },
  'tour-aerial': { video: 'tour', t: 12.9, alt: 'Aerial view of a lit contemporary home in its landscaped plot' },
  'two-front': { video: 'twostorey', t: 0.4, alt: 'Front elevation of a two-storey home with a planted balcony and white compound wall' },
  'two-gate': { video: 'twostorey', t: 1.6, alt: 'Stone path leading to the entrance of a two-storey home' },
  'two-porch': { video: 'twostorey', t: 3.2, alt: 'Timber door and stone cladding at the entrance porch' },
  'two-living': { video: 'twostorey', t: 4.8, alt: 'Timber-panelled living room with garden windows' },
  'two-living2': { video: 'twostorey', t: 7.6, alt: 'Living room with two sofas, a timber coffee table and large windows' },
  'walk-front': { video: 'walkthrough', t: 0.25, alt: 'Street view of a contemporary home behind timber gates' },
  'walk-garden': { video: 'walkthrough', t: 1.8, alt: 'Lawn and stepping-stone path leading to a stone-clad entrance' },
  'walk-hall': { video: 'walkthrough', t: 3.3, alt: 'Open living space with a timber staircase' },
  'walk-kitchen': { video: 'walkthrough', t: 4.75, alt: 'Kitchen island with concealed lighting' },
  'walk-dusk': { video: 'walkthrough', t: 6.3, alt: 'Home lit at dusk beneath a coloured sky' },
  'ext-villa': { video: 'exterior', t: 0.2, alt: 'Villa with timber balconies and planters seen from the street' },
  'ext-porch': { video: 'exterior', t: 2.4, alt: 'Approach to a villa entrance beneath a timber soffit' },
  'ext-timber': { video: 'exterior', t: 4.9, alt: 'Timber soffit and slat screen at a villa entrance' },
  'ext-slats': { video: 'exterior', t: 7.6, alt: 'Vertical timber slats and planting beside a villa door' },
}

/** Photographs of the projects in the portfolio (in /public/prasath/projects). */
const P = '/prasath'
const real: Record<string, StillDef> = {
  'p-about': { image: `${P}/about.jpg`, alt: 'A villa from our portfolio' },
  'p-interior': { image: `${P}/interior.jpg`, alt: 'An interior designed and fitted out by our studio' },
  'p-why': { image: `${P}/why.jpg`, alt: 'Why owners choose us' },
  'p-completed-1': { image: `${P}/projects/completed_1.jpg`, alt: "Sanjay's House, Dharmapuri — completed" },
  'p-completed-2': { image: `${P}/projects/completed_2.jpg`, alt: 'Kaveri Residency, Dharmapuri — completed' },
  'p-completed-3': { image: `${P}/projects/completed_3.jpg`, alt: 'Thendral Villa, Palacode — completed' },
  'p-ongoing-1': { image: `${P}/projects/ongoing_1.jpg`, alt: 'Senthil Towers, Harur — ongoing' },
  'p-ongoing-2': { image: `${P}/projects/ongoing_2.jpg`, alt: 'Pachai Illam, Pennagaram — ongoing' },
  'p-ongoing-3': { image: `${P}/projects/ongoing_3.jpg`, alt: 'Surya Heights, Nallampalli — ongoing' },
  'p-upcoming-1': { image: `${P}/projects/upcoming_1.jpg`, alt: 'Oli Residences, Morappur — upcoming' },
  'p-upcoming-2': { image: `${P}/projects/upcoming_2.jpg`, alt: 'Thottam Villa, Karimangalam — upcoming' },
  'p-upcoming-3': { image: `${P}/projects/upcoming_3.jpg`, alt: 'Dharma Heights, Papireddipatti — upcoming' },
}

export const GALLERY_COUNT = 54

/** What each photograph shows. Only what can be seen in the picture; no project names are guessed. */
const kind = (n: number) => {
  if ([6, 24, 31, 33, 36, 39, 48].includes(n)) return 'Site progress'
  if (n === 10) return 'Site visit with owners'
  if ([7, 8, 9, 21, 44].includes(n)) return 'Interior fit-out'
  if ([1, 40, 41, 42, 45].includes(n)) return 'Finished home'
  if (n === 32) return 'Multi-storey building'
  if ([3, 4, 5, 11, 12, 13, 14, 15, 16].includes(n)) return 'Commercial concept'
  return '3D elevation'
}
export const GALLERY_CAPTIONS: Record<string, string> = {}
for (let i = 1; i <= GALLERY_COUNT; i++) {
  const n = String(i).padStart(2, '0')
  GALLERY_CAPTIONS[`g-${n}`] = kind(i)
  real[`g-${n}`] = { image: `${P}/gallery/site-${n}.jpg`, alt: `${kind(i)}, photograph ${i}` }
}

export const STILLS: Record<string, StillDef> = { ...BASE, ...real }
/** left out of the gallery: cafe / warehouse / commercial concepts (3-5, 11-16, 32), the same shot repeated (7, 9, 18, 38, 54) and a broken crop (19) */
const HIDDEN = new Set([3, 4, 5, 7, 9, 11, 12, 13, 14, 15, 16, 18, 19, 32, 38, 54])
const shown = Array.from({ length: GALLERY_COUNT }, (_, i) => i + 1).filter((n) => !HIDDEN.has(n))
export const galleryIds = shown.map((n) => `g-${String(n).padStart(2, '0')}`)

/** width / height of each gallery photograph, so its space is reserved before it loads */
const ALL_RATIOS = [0.75, 1.502, 1.502, 1.502, 1.778, 1.333, 0.75, 0.75, 0.75, 0.562, 1.502, 2.119, 1.527, 1.228, 2.085, 1.502, 1.502, 1.502, 0.666, 1.502, 1.333, 1.502, 1.502, 1.333, 1.404, 1.27, 1.502, 0.916, 1.25, 1.201, 1.333, 1.499, 0.75, 1.502, 1.502, 1.333, 1.257, 1.151, 1.333, 1.333, 1.333, 0.75, 1.502, 1.333, 1.502, 1.502, 1.502, 0.75, 1.502, 1.502, 1.502, 0.666, 1.538, 1.649]
export const GALLERY_RATIOS = shown.map((n) => ALL_RATIOS[n - 1])
