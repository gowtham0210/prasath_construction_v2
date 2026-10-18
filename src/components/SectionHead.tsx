import { Reveal, RevealWords } from './Reveal'

interface Props {
  id: string
  chip: string
  lines: string[]
  accent?: string[]
  text?: string
  className?: string
}

/** The one heading pattern used by every section: a pill chip, a large headline and a short line of text. */
export default function SectionHead({ id, chip, lines, accent = [], text, className = 'mx-auto max-w-3xl text-center [&_p]:mx-auto' }: Props) {
  return (
    <div className={className}>
      <Reveal>
        <span className="chip">{chip}</span>
      </Reveal>
      <h2 id={id} className="display mt-6 text-[clamp(2.4rem,5vw,4.8rem)] !leading-[1]" aria-label={lines.join(' ')}>
        <RevealWords as="span" lines={lines} italic={accent} stagger={0.09} />
      </h2>
      {text && (
        <Reveal className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-graphite/65" delay={0.1}>
          {text}
        </Reveal>
      )}
    </div>
  )
}
