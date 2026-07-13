export type FeedbackChoice = 'possible' | 'difficult' | 'impossible'

export interface PlaceFeedback {
  entrance: FeedbackChoice | null
  movement: FeedbackChoice | null
  restroom: FeedbackChoice | null
  note: string
  photoDataUrl?: string
  createdAt: number
}

const storageKey = (placeId: string) => `sw:place-feedback:${placeId}`

export function loadPlaceFeedback(placeId: string): PlaceFeedback | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey(placeId))
    return raw ? (JSON.parse(raw) as PlaceFeedback) : null
  } catch {
    return null
  }
}

export function savePlaceFeedback(placeId: string, feedback: PlaceFeedback): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey(placeId), JSON.stringify(feedback))
}
