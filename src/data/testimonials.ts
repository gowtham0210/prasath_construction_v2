export interface Testimonial {
  quote: string
  /** name as the owner is shown */
  name: string
  /** the project or place */
  detail?: string
}

/** Owner messages shared with the team. Names are shown as given; no project names are attached to them. */
export const testimonials: Testimonial[] = [
  { name: 'Karthik R.', detail: 'Homeowner', quote: 'Honestly the smoothest construction experience. Site engineer responded within minutes on every update. House handed over 12 days early.' },
  { name: 'Priya & Arjun', detail: 'Homeowner', quote: 'We were nervous about builders after a bad first experience. We got a fixed quote and they stuck to it. Quality of finishing — top class.' },
  { name: 'Suresh M.', detail: 'Homeowner', quote: 'App tracking is a game changer. I could see daily progress from Dubai. Material brands matched the BOQ exactly. Highly recommend.' },
  { name: 'Lakshmi V.', detail: 'Homeowner', quote: 'Beyond construction — they helped with interiors, vastu, even loan paperwork. Felt like family by the end.' },
  { name: 'Rahul K.', detail: 'Homeowner', quote: 'Architects actually listened. They redesigned the staircase twice without complaint. The final home is exactly what we imagined.' },
  { name: 'Anitha S.', detail: 'Homeowner', quote: 'Transparent pricing was the deciding factor. No hidden costs popped up later. Will recommend to anyone planning to build in Tamilnadu.' },
]

export const sampleTestimonials: Testimonial[] = []
