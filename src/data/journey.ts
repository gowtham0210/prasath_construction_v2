import type { StillId } from './media'

export interface JourneyStage {
  number: string
  title: string
  text: string
  image: StillId
}

/** "From napkin sketch to handover keys." */
export const journey: JourneyStage[] = [
  { number: '01', title: 'Consultation', text: 'Free meeting with our architect to understand your needs.', image: 'g-10' },
  { number: '02', title: 'Design & Approvals', text: 'Floor plans, 3D walkthroughs, CMDA approvals.', image: 'g-11' },
  { number: '03', title: 'Estimation', text: 'Fixed-cost BOQ with brand-wise material specs.', image: 'g-12' },
  { number: '04', title: 'Foundation', text: 'Soil testing, excavation, footings and plinth.', image: 'g-27' },
  { number: '05', title: 'Structure', text: 'RCC framing, masonry, plumbing & electrical rough-in.', image: 'g-06' },
  { number: '06', title: 'Finishes', text: 'Tiling, painting, joinery, and interior fit-out.', image: 'g-08' },
  { number: '07', title: 'Handover', text: 'Snag-list closure, warranties, and key handover.', image: 'p-completed-3' },
]
