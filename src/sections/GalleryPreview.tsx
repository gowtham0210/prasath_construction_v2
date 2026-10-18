import SectionHead from '../components/SectionHead'
import Still from '../components/Still'
import { Reveal, Stagger } from '../components/Reveal'
import { galleryIds } from '../data/media'

/** A strip of site photographs with a link to the full Gallery page. */
export default function GalleryPreview() {
  return (
    <section id="home-gallery" className="relative py-[clamp(60px,9vh,120px)] text-graphite" aria-labelledby="home-gallery-title">
      <div className="container-x">
        <SectionHead id="home-gallery-title" chip="Gallery" lines={['Inside the homes', "we've built."]} accent={['built.']} text="Foundations, framing, finishing and handover — a real look at how we build." />
        <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5" gap={0.07}>
          {galleryIds.slice(6, 14).map((id) => (
            <a key={id} href="#/gallery" className="group relative aspect-square overflow-hidden rounded-[24px] shadow-[0_24px_60px_-40px_rgba(40,60,110,0.6)]" aria-label="Open the gallery">
              <Still id={id} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.1]" />
            </a>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <a href="#/gallery" className="btn-primary">View Full Gallery</a>
        </Reveal>
      </div>
    </section>
  )
}
