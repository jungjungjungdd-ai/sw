const STORAGE_KEY = 'sw:selected-profile-id'
export const DEFAULT_PROFILE_ID = 'power_basic'

export function loadSelectedProfileId(): string {
  if (typeof window === 'undefined') return DEFAULT_PROFILE_ID
  return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PROFILE_ID
}

export function saveSelectedProfileId(profileId: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, profileId)
}
