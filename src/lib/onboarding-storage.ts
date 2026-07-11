import { EMPTY_ONBOARDING_PROFILE, type OnboardingProfile } from '@/types/onboarding'

const STORAGE_KEY = 'sw:onboarding-profile'

export function loadOnboardingProfile(): OnboardingProfile {
  if (typeof window === 'undefined') return EMPTY_ONBOARDING_PROFILE

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_ONBOARDING_PROFILE
    return { ...EMPTY_ONBOARDING_PROFILE, ...JSON.parse(raw) }
  } catch {
    return EMPTY_ONBOARDING_PROFILE
  }
}

export function saveOnboardingProfile(profile: OnboardingProfile): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}