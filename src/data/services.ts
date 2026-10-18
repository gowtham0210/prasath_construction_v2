import type { StillId } from './media'

export interface Service {
  id: string
  number: string
  title: string
  /** one-line promise */
  headline: string
  summary: string
  /** what the service covers, in plain terms */
  points: string[]
  /** value passed to the enquiry form's "project type" field */
  enquiryType: string
  image: StillId
}

/** Content follows prasathconstructions.in/services */
export const services: Service[] = [
  {
    id: 'house-construction', number: '01', title: 'House Construction',
    headline: 'New homes built on a fixed cost, fixed timeline.',
    summary: 'From soil testing to key handover, our in-house engineers and site supervisors manage every stage of your build — RCC framing, masonry, plumbing, and electrical — with milestone-based payments and daily progress updates.',
    points: ['Soil testing & structural design', 'CMDA / DTCP approvals', 'Fixed-cost BOQ, brand-wise specs', '10-year structural warranty'],
    enquiryType: 'House Construction', image: 'p-about',
  },
  {
    id: 'interior-design', number: '02', title: 'Interior Design',
    headline: 'Spaces that feel as good as they look.',
    summary: 'Our in-house interiors studio designs modular kitchens, wardrobes, lighting, and finishes to match how you actually live — from concept mood boards to on-site fit-out, all under one roof with your construction team.',
    points: ['Modular kitchens & wardrobes', 'Lighting & ceiling design', 'Wall finishes & texture', 'Vastu-aware layouts'],
    enquiryType: 'Interior Design', image: 'p-interior',
  },
  {
    id: 'turnkey-solutions', number: '03', title: 'Turnkey Solutions',
    headline: 'One contract, one team, one key at the end.',
    summary: 'No juggling separate contractors for design, construction, and interiors. Our turnkey packages bundle every stage — design, approvals, materials, labor, and furnishing — into a single accountable, fixed-price contract.',
    points: ['Single point of accountability', 'Design-to-handover under one contract', 'Transparent milestone payments', 'Real-time project tracking app'],
    enquiryType: 'Turnkey Solutions', image: 'p-completed-3',
  },
  {
    id: 'architecture', number: '04', title: 'Architecture',
    headline: 'Floor plans and 3D designs led by senior architects.',
    summary: 'Every project starts with a free consultation and site study. Our architects draft floor-plan directions, structural drawings, and photorealistic 3D walkthroughs so you can see your home before the first brick is laid.',
    points: ['Free feasibility & site study', 'Custom floor plans & elevations', '3D walkthroughs & renders', 'Structural & MEP drawings'],
    enquiryType: 'Architecture', image: 'p-upcoming-2',
  },
  {
    id: 'renovation', number: '05', title: 'Renovation',
    headline: 'Upgrade your existing home without the guesswork.',
    summary: 'Structural repairs, floor additions, re-plastering, or a full interior overhaul — our renovation team assesses your existing structure first, then delivers the same fixed-cost, milestone-driven process as a new build.',
    points: ['Structural assessment & repairs', 'Floor additions (vertical extensions)', 'Re-plastering & waterproofing', 'Full interior overhauls'],
    enquiryType: 'Renovation', image: 'g-07',
  },
]
