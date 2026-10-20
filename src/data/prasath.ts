import { company } from '../config/company'

/** Website content: the structure follows prasathconstructions.in (referenced), set in this site's own design. */
const N = company.name

export const hero = {
  eyebrow: "Tamilnadu's trusted builder",
  lines: ['Building Dreams.', 'Constructing Legacy.'],
  text: 'Architect-led turnkey construction. Fixed cost. Real-time site tracking. Delivered on time across Tamilnadu for over a decade.',
  primary: 'Book a Consultation',
  secondary: 'Know More',
}

export const heroStats = [
  { value: '320+', label: 'Completed Projects' },
  { value: '42+', label: 'Ongoing Projects' },
  { value: '18+', label: 'Upcoming Projects' },
]

export const aboutIntro = {
  chip: `About ${N}`,
  lines: ["We don't just build houses.", 'We engineer the place your', 'family calls home.'],
  text: `Founded in 2014, ${N} has delivered 320+ homes across Tamilnadu with a singular promise — fixed cost, fixed timeline, zero compromise on quality. Our in-house team of architects, structural engineers, and project managers stays with you from the first sketch to handover.`,
  heroTitle: "A studio of architects, engineers & craftspeople building Tamilnadu's most-loved homes.",
  heroText: "Since 2014, we've delivered 320+ homes — each one designed, engineered, and finished by people who treat your build as their own.",
  pillars: ['Architect-led design', 'Transparent BOQ', 'In-house skilled crew', 'Turnkey delivery'],
}

export const mvv = [
  { title: 'Our Mission', tag: 'Why we build', image: 'p-about', text: 'Make premium house construction transparent, predictable, and joyful for every Tamilnadu family.' },
  { title: 'Our Vision', tag: 'Where we are heading', image: 'p-completed-3', text: "Become South India's most trusted name in turnkey home construction — measured in owner happiness, not square feet." },
  { title: 'Our Values', tag: 'How we work', image: 'p-interior', text: 'Craftsmanship over shortcuts. Transparency over upsell. Long-term relationships over one-off jobs.' },
]

export const whyChoose = [
  { title: 'Skilled Engineers', text: 'An in-house team of architects, structural engineers and project managers stays with you from the first sketch to handover.' },
  { title: 'On-Time Delivery', text: 'Fixed timeline contracts and milestone-based planning keep your build on schedule.' },
  { title: 'Turnkey Solutions', text: 'Design, approvals, materials, labour and interiors under one accountable contract.' },
  { title: 'Client-Centric', text: 'A senior architect listens first — and redesigns until the plan fits the way you live.' },
  { title: 'Real-Time Updates', text: 'Daily progress updates and a project tracking app so you can follow your build from anywhere.' },
  { title: 'Transparent Pricing', text: 'Fixed-cost BOQ with brand-wise material specs, so there are no hidden costs later.' },
]

export const trust = {
  chip: 'Why owners trust us',
  lines: ['10 years. 320 homes.', 'Zero broken promises.'],
  text: "We bring the rigor of a corporate construction firm and the warmth of a family-run studio. Fixed cost contracts, 10-year structural warranty, milestone-based payments — that's how we earned the trust of 320+ Tamilnadu families.",
  badges: ['ISO 9001 Certified', 'On-time Delivery', '10-year Warranty'],
}

export const stats = [
  { value: 320, suffix: '+', label: 'Homes Delivered', note: 'Across Tamilnadu & suburbs', image: 'building' },
  { value: 15, suffix: '+', label: 'Areas Covered', note: 'Dharmapuri & the towns around it', image: 'crane' },
  { value: 98, suffix: '%', label: 'On-Time Delivery', note: 'Last 24 months', image: 'helmet' },
  { value: 4.9, suffix: '★', label: 'Owner Rating', note: 'Avg. across 280+ reviews', image: 'building', decimals: 1 },
]

export const timeline = [
  { year: '2014', title: 'Founded with 3 architects', text: 'Started with a vision to bring transparency to home construction.' },
  { year: '2017', title: '100th home delivered', text: 'Built our project tracking app to keep owners updated daily.' },
  { year: '2019', title: 'Interior design studio launched', text: 'End-to-end turnkey delivery from foundation to furniture.' },
  { year: '2022', title: 'ISO 9001 certification', text: 'Formalised quality systems across all 40+ active projects.' },
  { year: '2025', title: '320+ homes & counting', text: 'Now serving across Tamilnadu, from Dharmapuri and the towns around it.' },
]

export const siteVisit = {
  chip: 'Free site visit',
  title: 'Talk to an architect this week.',
  text: 'Our senior architect will visit your plot, study soil + setbacks, and draft a feasibility note — at no cost.',
  points: ['Soil & setback feasibility', 'Approximate cost band', '3 floor-plan directions'],
  cta: 'Schedule a Visit',
}

export const consultation = {
  chip: 'Ready when you are',
  title: 'Your dream home is just one conversation away.',
  text: 'Get a free 60-minute consultation with our senior architect. Walk away with a floor-plan direction, package fit, and a fixed estimate.',
  card: 'Free consultation — 60 mins with a senior architect.',
  points: ['Floor-plan direction', 'Package & cost fit', 'Site visit scheduling', 'No obligation'],
  cta: 'Reserve my slot',
}

export interface Package {
  tag: string
  name: string
  text: string
  price: string
  popular?: boolean
  /** only what sets this package apart; items every package shares are in `packagesCommon` */
  features: string[]
  cta: string
}

export const packagesIntro = {
  chip: 'Construction packages',
  lines: ['Fixed-cost packages,', 'zero surprises.'],
  text: 'Per sq.ft pricing on built-up area. Includes design, approvals, materials, labor, and supervision. Pick what fits — upgrade anytime.',
}

/** Included in all three packages. */
export const packagesCommon = ['Branded electricals and interiors', 'Slab to slab work']

/**
 * Things a package does NOT cover (for example compound wall, sump, approval fees).
 * Left empty on purpose: add only what the company confirms, and the cards and table show it automatically.
 */
export const packagesNotIncluded: string[] = []

export const packages: Package[] = [
  {
    tag: 'Smart Start',
    name: 'Essential',
    text: 'Quality construction with smart material choices for value-conscious owners.',
    price: '1,899',
    features: ['RCC framed structure', 'Standard branded materials', 'Vitrified flooring', 'Basic electrical & plumbing'],
    cta: 'Get a Quote',
  },
  {
    tag: 'Most popular',
    name: 'Signature',
    text: 'Our most-chosen package — balanced finishes, premium fittings, full transparency.',
    price: '2,050',
    popular: true,
    features: ['Premium branded materials', 'Designer vitrified tiles', 'Modular kitchen base', 'Premium electrical (Anchor)'],
    cta: 'Get a Quote',
  },
  {
    tag: 'Top tier',
    name: 'Luxury',
    text: 'Architect-curated finishes, premium imported sanitary, and luxury detailing.',
    price: '2,599',
    features: ['Imported tiles & marble options', 'Luxury sanitary (Kohler/Grohe)', 'Smart-home wiring', 'Full interior package add-on', 'Dedicated project manager'],
    cta: 'Get a Quote',
  },
]

/** Side-by-side rows for the comparison table. A dash (null) means the package does not list that item — ask us to confirm. */
export const packagesCompare: { label: string; cells: (string | null)[] }[] = [
  { label: 'Structure', cells: ['RCC framed structure', null, null] },
  { label: 'Materials', cells: ['Standard branded materials', 'Premium branded materials', 'Architect-curated finishes'] },
  { label: 'Flooring', cells: ['Vitrified flooring', 'Designer vitrified tiles', 'Imported tiles & marble options'] },
  { label: 'Kitchen & interiors', cells: [null, 'Modular kitchen base', 'Full interior package add-on'] },
  { label: 'Electrical & plumbing', cells: ['Basic electrical & plumbing', 'Premium electrical (Anchor)', 'Smart-home wiring'] },
  { label: 'Sanitary', cells: [null, null, 'Luxury sanitary (Kohler/Grohe)'] },
  { label: 'Project management', cells: [null, null, 'Dedicated project manager'] },
]

export const videos = [
  { id: 'rF1vYKGXMIQ', title: 'Choosing the Perfect Tiles for Your Dream Home' },
  { id: 'yFS1YVkogmg', title: 'Choosing the Perfect Tiles for a Dream Home (Part 2)' },
  { id: 'r1qZwFGWjGE', title: 'This Is What Strong Foundations Look Like!' },
  { id: 'XdlCaH6wp30', title: 'A Dream Taking Shape, One Detail at a Time' },
  { id: 'nrKN_wj1_OE', title: 'They Had a Dream. We Built It.' },
  { id: 'IvgeATiws7k', title: 'Building Dreams, One Step at a Time' },
  { id: 'B-HT9k2fl00', title: 'Every Tile Tells a Story' },
]
