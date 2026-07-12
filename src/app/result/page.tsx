'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { planTrip } from '@/api/trips'
import type { Trip } from '@/types/trip'
import { loadSelectedProfileId } from '@/lib/profile-storage'
import { config } from '@/config'
import NaverMap from '@/components/map/NaverMap'

// 디자인의 "경로 결과" 화면. /api/trips/plan으로 실제 코스를 생성해서 보여준다.
// 실제 응답 구조(2026-07-12 확인): { trip_id, summary, parsed_request, courses[], agent_trace, model }
// origin/destination/route_points는 courses[] 각 항목 안에 있고, 조건에 맞는 코스가 없으면
// courses가 빈 배열로 오고 summary에 이유가 담긴다.
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
  const requestText = searchParams.get('q') ?? ''

  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!requestText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 쿼리 없을 때 즉시 에러 표시
      setLoading(false)
      setError('요청 내용이 없습니다. 목적지를 다시 입력해주세요.')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    planTrip({
      profile_id: loadSelectedProfileId(),
      request_text: requestText,
    })
      .then((res) => {
        if (!cancelled) setTrip(res)
      })
      .catch(() => {
        if (!cancelled) setError('경로를 만들지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [requestText])

  const course = trip?.courses?.[0]
  const origin = course?.origin ?? null
  const destination = course?.destination ?? null
  const routePoints = course?.route_points ?? []
  const hasCourse = Boolean(course)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">경로 결과</h1>
        <button
          type="button"
          onClick={() => router.push('/search')}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          다시 검색
        </button>
      </div>

      {loading && <p className="text-sm text-slate-400">경로를 찾는 중...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {trip && (
        <>
          {trip.summary && (
            <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
              {trip.summary}
            </p>
          )}

          {!hasCourse && (
            <p className="text-sm text-slate-400">
              조건에 맞는 코스를 찾지 못했습니다. 이동 거리나 조건을 완화해서
              다시 시도해보세요.
            </p>
          )}

          {hasCourse && (
            <>
              <NaverMap
                origin={origin}
                destination={destination}
                routePoints={routePoints}
                height={280}
              />

              <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-sm">
                <div>
                  <p className="mb-1 font-semibold text-slate-700">출발지</p>
                  <p>{origin?.name ?? '-'}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-slate-700">도착지</p>
                  <p>{destination?.name ?? '-'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('음성 안내는 준비 중입니다.')}
                className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                음성 안내 시작
              </button>
            </>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => alert('문제 신고는 준비 중입니다.')}
              className="flex-1 rounded-full border border-slate-200 bg-white py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              문제 신고
            </button>
            <button
              type="button"
              onClick={() => router.push('/search')}
              className="flex-1 rounded-full border border-slate-200 bg-white py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              다른 경로 조회하기
            </button>
          </div>

          {config.showRouteDebug && trip.agent_trace && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
              <p className="mb-1 font-semibold text-slate-700">agent_trace</p>
              <pre className="overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                {JSON.stringify(trip.agent_trace, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  )
}