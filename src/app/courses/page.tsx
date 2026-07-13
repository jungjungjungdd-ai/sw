'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppIcon from '@/components/common/AppIcon'
import { loadRecentCourses, type SavedCourse } from '@/lib/favorites-storage'
import { loadProfileRequest } from '@/lib/onboarding-storage'

const QUICK_PROMPTS = ['관광지', '카페', '화장실']

export default function CoursesHomePage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [recent, setRecent] = useState<SavedCourse[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트에서만 로컬 최근 대화를 읽는다.
    setRecent(loadRecentCourses())
  }, [])

  const handleSubmit = (query?: string) => {
    const q = (query ?? text).trim()
    if (!q) return
    const preference = loadProfileRequest()
    const suffix = preference ? `&pref=${encodeURIComponent(preference)}` : ''
    router.push(`/result?q=${encodeURIComponent(q)}${suffix}`)
  }

  return (
    <div className="flex min-h-full flex-col pb-2">
      <section>
        <p className="text-sm font-semibold text-emerald-700">AI 코스</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          어떤 외출을 계획할까요?
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          개인 접근성 프로필과 실제 장소·경로 정보를 바탕으로
          <br />
          안전한 외출 코스를 함께 계획해요.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">최근 대화</h2>
          {recent.length > 0 && <span className="text-xs text-slate-400">{recent.length}개</span>}
        </div>
        {recent.length > 0 ? (
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
            {recent.slice(0, 3).map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSubmit(course.requestText ?? course.title)}
                className="flex min-h-14 w-full items-center gap-3 px-4 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <AppIcon name="route" size={17} />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{course.title}</span>
                <AppIcon name="chevronRight" size={17} className="text-slate-300" />
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            새 대화를 시작하면 여기에 표시됩니다.
          </p>
        )}
      </section>

      <div className="mt-auto pt-10">
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt, index) => {
            const icon = index === 0 ? 'landmark' : index === 1 ? 'cafe' : 'restroom'
            return (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSubmit(`${prompt}가 포함된 접근성 좋은 외출 코스 추천해줘`)}
                className="flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700"
              >
                <AppIcon name={icon} size={17} />
                {prompt}
              </button>
            )
          })}
        </div>

        <form
          className="mt-4 flex min-h-14 items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="어디든 말씀해주세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            aria-label="코스 요청 보내기"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white disabled:opacity-40"
            disabled={!text.trim()}
          >
            <AppIcon name="mic" size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
