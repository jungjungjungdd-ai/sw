'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import NaverMap from '@/components/map/NaverMap'
import {
  getSavedCourse,
  toggleFavoriteCourse,
  type SavedCourse,
} from '@/lib/favorites-storage'
import { buildCourseSteps, type CourseStep } from '@/lib/course-steps'

// 저장한 코스 상세(읽기 전용). trip 원본이 남아있으면 지도/타임라인을 다시 그리고,
// 데모 시드 데이터처럼 trip이 없으면 이름 목록만 타임라인으로 보여준다.
export default function FavoriteCourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [saved, setSaved] = useState<SavedCourse | null>(null)
  const [favorite, setFavorite] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- id 바뀔 때 저장된 코스 조회
    setSaved(getSavedCourse(id))
  }, [id])

  if (!saved) {
    return <p className="p-4 text-sm text-slate-400">불러오는 중...</p>
  }

  const course = saved.trip?.courses?.[0]
  const steps: CourseStep[] = course
    ? buildCourseSteps(course)
    : saved.stepNames.map((name) => ({ name }))

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="text-xl text-slate-900"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setFavorite(toggleFavoriteCourse(saved))}
          aria-label="즐겨찾기"
          className={favorite ? 'text-emerald-600' : 'text-slate-300'}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>

      <h1 className="text-xl font-bold text-slate-900">{saved.title}</h1>

      {course?.route_points && course.route_points.length > 0 && (
        <NaverMap
          origin={course.origin ?? undefined}
          destination={course.destination ?? undefined}
          routePoints={course.route_points}
          height={220}
        />
      )}

      {steps.length > 0 && (
        <>
          <div className="flex items-center">
            {steps.map((_, i) => (
              <div key={i} className="flex flex-1 items-center last:flex-none">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-1 h-px flex-1 bg-emerald-200" />
                )}
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 py-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {step.name}
                  </p>
                  {step.note && (
                    <p className="text-xs text-slate-500">{step.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setFavorite(toggleFavoriteCourse(saved))}
        className={`flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-semibold ${
          favorite
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-slate-200 text-slate-700'
        }`}
      >
        {favorite ? '★ 즐겨찾기 됨' : '☆ 즐겨찾기'}
      </button>
    </div>
  )
}
