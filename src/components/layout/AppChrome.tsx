'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

// 로그인/온보딩 화면은 탭 구조 밖의 별도 플로우라 하단 탭바를 띄우지 않는다.
const NO_CHROME_PREFIXES = ['/login', '/onboarding']
// 지도가 화면을 꽉 채워야 하는 화면은 좌우 여백(padding)을 주지 않는다.
const FULL_BLEED_PREFIXES = ['/explore']

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const noChrome = matches(pathname, NO_CHROME_PREFIXES)
  const fullBleed = matches(pathname, FULL_BLEED_PREFIXES)

  if (noChrome) {
    return (
      <div className="min-h-full bg-slate-50">
        <main className="px-4 py-6">{children}</main>
      </div>
    )
  }

  // grid-rows-[1fr_auto] + h-full(퍼센트 아님, 정확한 높이)을 써서
  // "탭 내용 영역"이 항상 확정된 높이를 갖게 한다. (전에 flex + min-h-full 조합이었는데,
  // flex 컨테이너 높이가 auto라 지도처럼 내용이 비어있는 화면은 높이가 0으로 찌그러져서
  // 지도가 안 보이는 문제가 있었다.)
  return (
    <div className="grid h-full grid-rows-[1fr_auto] bg-white">
      <main
        className={
          fullBleed
            ? 'relative overflow-hidden'
            : 'overflow-y-auto px-4 py-5'
        }
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
