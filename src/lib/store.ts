import { useSyncExternalStore } from 'react'

/** Tiny shared state: the project type to pre-select in the enquiry form (set by "Explore Service" / project CTAs). */
let prefill = ''
const listeners = new Set<() => void>()

export const setEnquiryPrefill = (v: string) => {
  prefill = v
  listeners.forEach((l) => l())
}

export const useEnquiryPrefill = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => prefill,
    () => '',
  )
