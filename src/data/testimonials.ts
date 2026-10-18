export interface Testimonial {
  quote: string
  /** name as the owner is shown */
  name: string
  /** the project or place */
  detail?: string
}

/** "Loved by 1,240+ homeowners." */
export const testimonials: Testimonial[] = [
  { name: 'Karthik R.', detail: 'Marina Villa, ECR', quote: 'Honestly the smoothest construction experience. Site engineer responded within minutes on every update. House handed over 12 days early.' },
  { name: 'Priya & Arjun', detail: 'Anugraha Residency', quote: 'We were nervous about builders after a bad first experience. We got a fixed quote and they stuck to it. Quality of finishing — top class.' },
  { name: 'Suresh M.', detail: 'Sea Breeze House', quote: 'App tracking is a game changer. I could see daily progress from Dubai. Material brands matched the BOQ exactly. Highly recommend.' },
  { name: 'Lakshmi V.', detail: 'Aakash Heights', quote: 'Beyond construction — they helped with interiors, vastu, even loan paperwork. Felt like family by the end.' },
  { name: 'Rahul K.', detail: 'Lumière Residences', quote: 'Architects actually listened. They redesigned the staircase twice without complaint. The final home is exactly what we imagined.' },
  { name: 'Anitha S.', detail: 'Aura Villa', quote: 'Transparent pricing was the deciding factor. No hidden costs popped up later. Will recommend to anyone planning to build in Tamilnadu.' },
]

export const sampleTestimonials: Testimonial[] = []
