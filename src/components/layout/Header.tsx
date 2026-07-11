'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/onboarding', label: '온보딩' },
  { href: '/search', label: '목적지검색' },
  { href: '/chat', label: '챗봇' },
  { href: '/places', label: '장소' },
  { href: '/trip', label: '경로' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-slate-900">
          접근성 경로 추천
        </span>
        <nav className="flex gap-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
