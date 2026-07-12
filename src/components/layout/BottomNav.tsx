'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/explore', label: '탐색', icon: 'pin', match: ['/explore'] },
  { href: '/courses', label: 'AI 코스', icon: 'route', match: ['/courses', '/result'] },
  { href: '/favorites', label: '즐겨찾기', icon: 'bookmark', match: ['/favorites'] },
  { href: '/profile', label: '맞춤 설정', icon: 'user', match: ['/profile'] },
] as const

function TabIcon({ icon, active }: { icon: (typeof TABS)[number]['icon']; active: boolean }) {
  const stroke = active ? '#059669' : '#64748b'
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (icon === 'pin') {
    return (
      <svg {...common}>
        <path d="M12 22s7-6.8 7-12.5A7 7 0 1 0 5 9.5C5 15.2 12 22 12 22Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    )
  }
  if (icon === 'route') {
    return (
      <svg {...common}>
        <path d="M5 12h11" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    )
  }
  if (icon === 'bookmark') {
    return (
      <svg {...common}>
        <path d="M6 3.5h12v17l-6-4-6 4v-17Z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.7-4 5-6.2 8-6.2S18.3 16 20 20" />
    </svg>
  )
}

// 4개 메인 탭 하단 네비게이션. 로그인/온보딩 화면에서는 AppChrome이 아예 렌더링하지 않는다.
export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="z-30 shrink-0 border-t border-slate-100 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur">
      <div className="mx-auto flex max-w-sm items-stretch justify-between">
        {TABS.map((tab) => {
          const active = tab.match.some(
            (p) => pathname === p || pathname.startsWith(`${p}/`),
          )
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-medium transition-colors ${
                active ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500'
              }`}
            >
              <TabIcon icon={tab.icon} active={active} />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
