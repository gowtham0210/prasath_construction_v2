import type { StillId } from './media'

export type ProjectCategory = 'Completed' | 'Ongoing' | 'Upcoming'
export const projectFilters: ('All Projects' | ProjectCategory)[] = ['All Projects', 'Completed', 'Ongoing', 'Upcoming']

export interface Project {
  slug: string
  name: string
  category: ProjectCategory
  location: string
  /** e.g. "4800 sq.ft built-up" */
  builtUp: string
  /** short descriptor shown under the name */
  concept: string
  status: string
  /** kept for the project page; all of Prasath Construction's projects are real */
  isConcept: boolean
  cover: StillId
  gallery: StillId[]
  overview: string
  specs: { label: string; value: string }[]
  process: string[]
}

/** The seven stages every Prasath Construction build moves through (from prasathconstructions.in). */
const PROCESS = [
  'Consultation — free meeting with our architect to understand your needs',
  'Design & Approvals — floor plans, 3D walkthroughs, CMDA approvals',
  'Estimation — fixed-cost BOQ with brand-wise material specs',
  'Foundation — soil testing, excavation, footings and plinth',
  'Structure — RCC framing, masonry, plumbing & electrical rough-in',
  'Finishes — tiling, painting, joinery, and interior fit-out',
  'Handover — snag-list closure, warranties, and key handover',
]

interface Row {
  slug: string
  name: string
  category: ProjectCategory
  location: string
  plot: string
  build: string
  portions: string
  cover: StillId
}

const rows: Row[] = [
  { slug: 'sanjays-house', name: "Sanjay's House", category: 'Completed', location: 'Dharmapuri', plot: '3200', build: '4800', portions: 'G+2', cover: 'p-completed-1' },
  { slug: 'kaveri-residency', name: 'Kaveri Residency', category: 'Completed', location: 'Dharmapuri', plot: '2400', build: '3600', portions: 'G+1', cover: 'p-completed-2' },
  { slug: 'thendral-villa', name: 'Thendral Villa', category: 'Completed', location: 'Palacode', plot: '4000', build: '5800', portions: 'G+2', cover: 'p-completed-3' },
  { slug: 'senthil-towers', name: 'Senthil Towers', category: 'Ongoing', location: 'Harur, Dharmapuri', plot: '5400', build: '9200', portions: 'G+3', cover: 'p-ongoing-1' },
  { slug: 'pachai-illam', name: 'Pachai Illam', category: 'Ongoing', location: 'Pennagaram', plot: '2800', build: '4100', portions: 'G+1', cover: 'p-ongoing-2' },
  { slug: 'surya-heights', name: 'Surya Heights', category: 'Ongoing', location: 'Nallampalli, Dharmapuri', plot: '3600', build: '5200', portions: 'G+2', cover: 'p-ongoing-3' },
  { slug: 'oli-residences', name: 'Oli Residences', category: 'Upcoming', location: 'Morappur', plot: '4800', build: '7200', portions: 'G+3', cover: 'p-upcoming-1' },
  { slug: 'thottam-villa', name: 'Thottam Villa', category: 'Upcoming', location: 'Karimangalam', plot: '3000', build: '4200', portions: 'G+1', cover: 'p-upcoming-2' },
  { slug: 'dharma-heights', name: 'Dharma Heights', category: 'Upcoming', location: 'Papireddipatti', plot: '3800', build: '5600', portions: 'G+2', cover: 'p-upcoming-3' },
]

export const projects: Project[] = rows.map((r) => ({
  slug: r.slug,
  name: r.name,
  category: r.category,
  location: r.location,
  builtUp: `${Number(r.build).toLocaleString('en-IN')} sq.ft built-up`,
  concept: `${r.portions} residence on a ${Number(r.plot).toLocaleString('en-IN')} sq.ft plot`,
  status: r.category,
  isConcept: false,
  cover: r.cover,
  gallery: [r.cover],
  overview: `${r.name} is a ${r.category.toLowerCase()} ${r.portions} project in ${r.location}, built on a ${Number(r.plot).toLocaleString('en-IN')} sq.ft plot with ${Number(r.build).toLocaleString('en-IN')} sq.ft of built-up area. Like every Prasath Construction project, it follows a fixed-cost, milestone-driven process with an architect-led design.`,
  specs: [
    { label: 'Status', value: r.category },
    { label: 'Location', value: r.location },
    { label: 'Plot area', value: `${Number(r.plot).toLocaleString('en-IN')} sq.ft` },
    { label: 'Built-up area', value: `${Number(r.build).toLocaleString('en-IN')} sq.ft` },
    { label: 'Portions', value: r.portions },
  ],
  process: PROCESS,
}))

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
