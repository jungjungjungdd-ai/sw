import { EMPTY_ONBOARDING_PROFILE, type OnboardingProfile } from '@/types/onboarding'

const STORAGE_KEY = 'sw:onboarding-profile'
const COMPLETED_KEY = 'sw:onboarding-completed'
const REQUEST_KEY = 'sw:profile-request'

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

// 온보딩(외출 설정)은 최초 로그인 시 한 번만 보여준다.
// "저장하기"든 "나중에 입력하기"든 한 번 지나가면 완료 처리한다.
export function hasCompletedOnboarding(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(COMPLETED_KEY) === 'true'
}

export function markOnboardingCompleted(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COMPLETED_KEY, 'true')
}

export function loadProfileRequest(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(REQUEST_KEY) ?? ''
}

export function saveProfileRequest(request: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(REQUEST_KEY, request.trim())
}
