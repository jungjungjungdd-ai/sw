// 목업 로그인 상태 저장. 실제 인증/백엔드 세션 없이 클라이언트에만 저장한다.
const STORAGE_KEY = 'sw:mock-user'

export function loadMockUser(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function saveMockUser(username: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, username)
}

export function clearMockUser(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
