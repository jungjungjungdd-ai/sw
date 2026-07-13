'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppIcon, { type AppIconName } from '@/components/common/AppIcon'

const TABS = [
  { href: '/explore', label: '탐색', icon: 'mapPin', match: ['/explore'] },
  { href: '/courses', label: 'AI 코스', icon: 'route', match: ['/courses', '/result'] },
  { href: '/favorites', label: '저장', icon: 'bookmark', match: ['/favorites'] },
  { href: '/profile', label: '내 정보', icon: 'user', match: ['/profile'] },
] as const

export default function BottomNav() {
  const pathname = usePathname() ?? ''

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
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition-colors ${
                active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500'
              }`}
            >
              <AppIcon name={tab.icon as AppIconName} size={21} />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
