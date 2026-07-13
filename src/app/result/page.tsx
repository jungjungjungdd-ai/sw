'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { planTrip, replanTrip } from '@/api/trips'
import type { Trip, TripCourse } from '@/types/trip'
import { loadSelectedProfileId } from '@/lib/profile-storage'
import { config } from '@/config'
import NaverMap from '@/components/map/NaverMap'
import {
  buildCourseSteps,
  formatDurationMinutes,
  resolveDistanceM,
  resolveDurationMinutes,
} from '@/lib/course-steps'
import {
  addRecentCourse,
  isFavoriteCourse,
  toggleFavoriteCourse,
  type SavedCourse,
} from '@/lib/favorites-storage'

interface Turn {
  userText: string
  trip: Trip | null
  error?: string
}

function tripToSavedCourse(trip: Trip, requestText: string): SavedCourse {
  const course = trip.courses?.[0]
  const steps = buildCourseSteps(course)
  const distanceM = resolveDistanceM(course)
  return {
    id: trip.trip_id,
    title:
      requestText.length > 16
        ? `${requestText.slice(0, 16)}...`
        : requestText || '저장한 코스',
    requestText,
    summary: trip.summary,
    distanceM,
    durationMinutes: resolveDurationMinutes(course, distanceM),
    stepNames: steps.map((s) => s.name),
    trip,
    savedAt: Date.now(),
  }
}

// 디자인의 "AI 코스 생성 결과" 화면. /api/trips/plan으로 실제 코스를 만들고,
// 후속 요청은 /api/trips/{id}/replan(issue_text)으로 이어서 대화하듯 처리한다.
export default function ResultPage() {
  return (
    <Suspense
      fallback={<p className="p-4 text-sm text-slate-400">불러오는 중...</p>}
    >
      <ResultPageInner />
    </Suspense>
  )
}

function ResultPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestText = searchParams?.get('q') ?? ''
  const profileRequest = searchParams?.get('pref') ?? ''
  const planRequestText = profileRequest
    ? `${requestText}\n\n사용자 요청사항: ${profileRequest}`
    : requestText

  const [turns, setTurns] = useState<Turn[]>([])
  const [loading, setLoading] = useState(true)
  const [followUp, setFollowUp] = useState('')
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    if (!requestText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 쿼리 없을 때 즉시 로딩 해제
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    planTrip({ profile_id: loadSelectedProfileId(), request_text: planRequestText })
      .then((trip) => {
        if (cancelled) return
        setTurns([{ userText: requestText, trip }])
        setFavorite(isFavoriteCourse(trip.trip_id))
        addRecentCourse(tripToSavedCourse(trip, requestText))
      })
      .catch(() => {
        if (!cancelled) {
          setTurns([
            { userText: requestText, trip: null, error: '경로를 만들지 못했습니다.' },
          ])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [planRequestText, requestText])

  const lastTrip = [...turns].reverse().find((t) => t.trip)?.trip ?? null
  const course: TripCourse | undefined = lastTrip?.courses?.[0]
  const hasCourse = Boolean(course)
  const steps = buildCourseSteps(course)
  const distanceM = resolveDistanceM(course)
  const durationMinutes = resolveDurationMinutes(course, distanceM)

  const handleFollowUp = async (rawText: string) => {
    const issue = rawText.trim()
    if (!issue || !lastTrip) return
    setFollowUp('')
    setTurns((prev) => [...prev, { userText: issue, trip: null }])
    setLoading(true)
    try {
      const trip = await replanTrip(lastTrip.trip_id, { issue_text: issue })
      setTurns((prev) => {
        const next = [...prev]
        next[next.length - 1] = { userText: issue, trip }
        return next
      })
      addRecentCourse(tripToSavedCourse(trip, requestText))
    } catch {
      setTurns((prev) => {
        const next = [...prev]
        next[next.length - 1] = {
          userText: issue,
          trip: null,
          error: '경로를 다시 만들지 못했습니다.',
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCourse = () => {
    if (!lastTrip) return
    setFavorite(toggleFavoriteCourse(tripToSavedCourse(lastTrip, requestText)))
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="text-xl text-slate-900"
        >
          ←
        </button>
        <h1 className="truncate text-lg font-bold text-slate-900">
          {requestText || '경로 결과'}
        </h1>
      </div>

      {!requestText && (
        <p className="text-sm text-red-600">
          요청 내용이 없습니다. 목적지를 다시 입력해주세요.
        </p>
      )}

      {turns.map((turn, i) => (
        <div key={i} className="space-y-3">
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-800">
            {turn.userText}
          </p>
          {turn.trip?.summary && (
            <p className="text-sm leading-relaxed text-slate-700">
              {turn.trip.summary}
            </p>
          )}
          {turn.error && <p className="text-sm text-red-600">{turn.error}</p>}
        </div>
      ))}

      {loading && <p className="text-sm text-slate-400">경로를 찾는 중...</p>}

      {hasCourse && course && (
        <>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
            ✓ 코스 생성 완료
          </span>

          <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="text-xs font-semibold text-emerald-600">최적</p>
              <p className="text-2xl font-bold text-slate-900">
                {durationMinutes !== undefined
                  ? formatDurationMinutes(durationMinutes)
                  : '-'}
                {distanceM !== undefined && (
                  <span className="ml-2 text-sm font-medium text-slate-500">
                    이동 {(distanceM / 1000).toFixed(1)}km
                  </span>
                )}
              </p>
            </div>

            {steps.length > 0 && (
              <>
                <div className="flex items-start">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex flex-1 items-start last:flex-none"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                        {i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div className="mx-1 flex flex-1 flex-col items-center pt-3">
                          <div className="h-px w-full bg-emerald-200" />
                          {steps[i + 1]?.walkMinutes !== undefined && (
                            <span className="mt-1 whitespace-nowrap text-[10px] text-slate-400">
                              도보 {steps[i + 1]!.walkMinutes}분
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-slate-200">
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
              onClick={handleSaveCourse}
              className={`flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-semibold ${
                favorite
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              {favorite ? '저장됨' : '코스 저장'} {favorite ? '★' : '☆'}
            </button>
          </div>

          {course.route_points && course.route_points.length > 0 && (
            <NaverMap
              origin={course.origin ?? undefined}
              destination={course.destination ?? undefined}
              routePoints={course.route_points}
              height={220}
            />
          )}

          <button
            type="button"
            onClick={() => handleFollowUp('덜 걷는 코스로 바꿔줘')}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            덜 걷는 코스로 바꿔줘
          </button>
        </>
      )}

      {!loading && !hasCourse && turns.length > 0 && (
        <p className="text-sm text-slate-400">
          조건에 맞는 코스를 찾지 못했습니다. 이동 거리나 조건을 완화해서 다시
          시도해보세요.
        </p>
      )}

      {config.showRouteDebug && lastTrip?.agent_trace && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <p className="mb-1 font-semibold text-slate-700">agent_trace</p>
          <pre className="overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
            {JSON.stringify(lastTrip.agent_trace, null, 2)}
          </pre>
        </div>
      )}

      <div className="sticky bottom-4 flex items-center gap-2 rounded-full border border-emerald-600 bg-white px-4 py-3 shadow-sm">
        <input
          className="flex-1 bg-transparent text-sm outline-none"
          placeholder="어디로 가볼까요?"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFollowUp(followUp)}
        />
        <button
          type="button"
          onClick={() => handleFollowUp(followUp)}
          aria-label="전송"
          className="text-emerald-600"
        >
          🎙️
        </button>
      </div>
    </div>
  )
}
