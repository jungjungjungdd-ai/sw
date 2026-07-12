'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadRecentCourses } from '@/lib/favorites-storage'
import type { SavedCourse } from '@/lib/favorites-storage'

// 디자인의 "AI 코스" 탭 홈. 최근에 만든/조회한 코스 목록 + 하단 입력창.
// 입력창에 목적지를 넣고 보내면 /result?q=...(실제 코스 생성 화면)로 이동한다.
export default function CoursesHomePage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [recent, setRecent] = useState<SavedCourse[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 로컬 저장값 불러오기
    setRecent(loadRecentCourses())
  }, [])

  const handleSubmit = (query?: string) => {
    const q = (query ?? text).trim()
    if (!q) return
    router.push(`/result?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="flex h-full min-h-[calc(100vh-140px)] flex-col">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">무장애 AI 코스</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            개인 접근성 프로필과 장소 정보를 바탕으로
            <br />
            안전한 외출 코스를 함께 계획해요.
          </p>
        </div>

        {recent.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-emerald-600">
              최근 목록
            </h2>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
              {recent.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSubmit(c.requestText ?? c.title)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium text-slate-800"
                >
                  {c.title}
                  <span className="text-slate-300">›</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 mt-6 flex items-center gap-2 rounded-full border border-emerald-600 bg-white px-4 py-3 shadow-sm">
        <input
          className="flex-1 bg-transparent text-sm outline-none"
          placeholder="어디로 가볼까요?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          type="button"
          onClick={() => handleSubmit()}
          aria-label="검색"
          className="text-emerald-600"
        >
          🎙️
        </button>
      </div>
    </div>
  )
}
