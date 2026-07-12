'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  loadFavoriteCourses,
  loadFavoritePlaces,
  type SavedCourse,
  type SavedPlace,
} from '@/lib/favorites-storage'
import { formatDurationMinutes } from '@/lib/course-steps'

// 디자인의 "즐겨찾기" 탭. 코스/장소 두 리스트를 토글한다.
// 둘 다 백엔드 저장 API가 없어 로컬(localStorage)에서 관리한다.
export default function FavoritesPage() {
  const [tab, setTab] = useState<'course' | 'place'>('course')
  const [courses, setCourses] = useState<SavedCourse[]>([])
  const [places, setPlaces] = useState<SavedPlace[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 로컬 저장값 불러오기
    setCourses(loadFavoriteCourses())
    setPlaces(loadFavoritePlaces())
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">즐겨찾기</h1>

      <div className="flex rounded-full bg-slate-100 p-1">
        {(['course', 'place'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === t ? 'bg-emerald-600 text-white' : 'text-slate-500'
            }`}
          >
            {t === 'course' ? '코스' : '장소'}
          </button>
        ))}
      </div>

      {tab === 'course' && (
        <div className="divide-y divide-slate-100">
          {courses.map((c) => (
            <Link key={c.id} href={`/favorites/${c.id}`} className="block py-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-base font-semibold text-slate-900">
                  {c.title}
                </p>
                <span className="text-slate-300">⋮</span>
              </div>
              <p className="mb-2 text-xs text-slate-500">
                {c.durationMinutes
                  ? formatDurationMinutes(c.durationMinutes)
                  : '시간 미정'}
                {c.stepNames.length > 0 &&
                  ` · 접근 가능 정류소 ${c.stepNames.length}개`}
              </p>
              {c.stepNames.length > 0 && (
                <div className="flex items-center">
                  {c.stepNames.map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-1 items-center last:flex-none"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      {i < c.stepNames.length - 1 && (
                        <div className="mx-1 h-px flex-1 bg-emerald-200" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
          {courses.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              저장한 코스가 없습니다.
            </p>
          )}
        </div>
      )}

      {tab === 'place' && (
        <div className="space-y-3">
          {places.map((p) => (
            <Link
              key={p.id}
              href={`/explore/${p.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3"
            >
              <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-100" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {p.name}
                </p>
                {p.category && (
                  <p className="text-xs text-slate-500">{p.category}</p>
                )}
              </div>
              {p.rating !== undefined && (
                <span className="text-xs font-semibold text-emerald-600">
                  ★ {p.rating}
                </span>
              )}
            </Link>
          ))}
          {places.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-400">
              저장한 장소가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
