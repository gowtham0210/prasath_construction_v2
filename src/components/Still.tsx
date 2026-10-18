import { useState, type CSSProperties } from 'react'
import { STILLS, type StillId } from '../data/media'

interface Props {
  id: StillId
  className?: string
  /** overrides the catalogue alt text */
  alt?: string
  focus?: string
  zoom?: number
  style?: CSSProperties
  priority?: boolean
}

export const stillSrc = (id: StillId) => STILLS[id].image ?? `/images/${id}.jpg`

/** A photograph from /public/images. A calm placeholder shows while it loads, then the picture fades in. */
export default function Still({ id, className = '', alt, focus = '50% 50%', zoom = 1, style, priority }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-[#dfe6f2] ${className}`} style={style} data-still={id}>
      <img
        src={stillSrc(id)}
        alt={alt ?? STILLS[id].alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectPosition: focus, transform: zoom !== 1 ? `scale(${zoom})` : undefined, transformOrigin: focus }}
      />
    </div>
  )
}
