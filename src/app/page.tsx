'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadMockUser } from '@/lib/auth-storage'
import { hasCompletedOnboarding } from '@/lib/onboarding-storage'

// 첫 진입점. 로그인/온보딩 상태를 보고 적절한 화면으로 보낸다.
// 로그인 안 됨 → /login
// 로그인은 됐지만 온보딩(외출 설정) 미완료 → /onboarding (최초 1회)
// 로그인 + 온보딩 완료 → /search (목적지 검색이 사실상의 홈 화면)
export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (!loadMockUser()) {
      router.replace('/login')
      return
    }
    if (!hasCompletedOnboarding()) {
      router.replace('/onboarding')
      return
    }
    router.replace('/search')
  }, [router])

  return <p className="p-4 text-sm text-slate-400">이동 중...</p>
}
