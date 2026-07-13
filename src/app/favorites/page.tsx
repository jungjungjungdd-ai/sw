'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AppIcon from '@/components/common/AppIcon'
import {
  loadFavoriteCourses,
  loadFavoritePlaces,
  type SavedCourse,
  type SavedPlace,
} from '@/lib/favorites-storage'
import { formatDurationMinutes } from '@/lib/course-steps'

export default function FavoritesPage() {
  const [tab, setTab] = useState<'place' | 'course'>('place')
  const [courses, setCourses] = useState<SavedCourse[]>([])
  const [places, setPlaces] = useState<SavedPlace[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트 로컬 저장소의 목록을 초기화한다.
    setCourses(loadFavoriteCourses())
    setPlaces(loadFavoritePlaces())
  }, [])

  return (
    <div className="space-y-5 pb-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">저장</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">나의 저장 목록</h1>
      </div>

      <div className="flex rounded-2xl bg-slate-100 p-1">
        {([
          ['place', '장소', 'mapPin'],
          ['course', '경로', 'route'],
        ] as const).map(([value, label, icon]) => {
          const active = tab === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors ${
                active ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              <AppIcon name={icon} size={18} />
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'place' && (
        <div className="space-y-3">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/explore/${place.id}`}
              className="flex min-h-24 items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <AppIcon name="mapPin" size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-semibold text-slate-500">{place.category || '저장한 장소'}</p>
                <p className="truncate text-base font-bold text-slate-900">{place.name}</p>
                {(place.distanceLabel || place.rating !== undefined) && (
                  <p className="mt-1 text-xs text-emerald-700">
                    {place.distanceLabel}
                    {place.distanceLabel && place.rating !== undefined ? ' · ' : ''}
                    {place.rating !== undefined ? `접근성 ${place.rating.toFixed(1)}` : ''}
                  </p>
                )}
              </div>
              <AppIcon name="chevronRight" className="shrink-0 text-slate-300" />
            </Link>
          ))}
          {places.length === 0 && <EmptyState label="저장한 장소가 없습니다." icon="mapPin" />}
        </div>
      )}

      {tab === 'course' && (
        <div className="space-y-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/favorites/${course.id}`}
              className="block rounded-2xl border border-slate-100 bg-white p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <AppIcon name="route" size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold text-slate-900">{course.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.durationMinutes ? formatDurationMinutes(course.durationMinutes) : '시간 미정'}
                    {course.stepNames.length > 0 && ` · ${course.stepNames.length}개 장소`}
                  </p>
                </div>
                <AppIcon name="chevronRight" className="shrink-0 text-slate-300" />
              </div>
              {course.stepNames.length > 0 && (
                <div className="mt-4 flex items-center">
                  {course.stepNames.slice(0, 4).map((_, index, steps) => (
                    <div key={index} className="flex flex-1 items-center last:flex-none">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                      {index < steps.length - 1 && <div className="mx-1 h-px flex-1 bg-emerald-200" />}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ))}
          {courses.length === 0 && <EmptyState label="저장한 경로가 없습니다." icon="route" />}
        </div>
      )}
    </div>
  )
}

function EmptyState({ label, icon }: { label: string; icon: 'mapPin' | 'route' }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
        <AppIcon name={icon} size={23} />
      </div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="mt-1 text-xs text-slate-400">상세 화면에서 저장하면 여기에 표시됩니다.</p>
    </div>
  )
}
