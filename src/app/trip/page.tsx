'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { previewRoute } from '@/api/debug'
import type { RoutePreviewResponse } from '@/types/debug'
import { config } from '@/config'
import NaverMap from '@/components/map/NaverMap'

const DEFAULT_PROFILE_ID = 'power_basic'

// /api/debug/routes/preview로 직접 경로 프롬프트 파싱 결과(출발/도착/provider)를
// 미리 확인하는 디버그용 화면. 실제 코스 생성은 /api/trips/plan 참고.
// /search 화면에서 "?q=..."로 넘어오면 자동으로 미리보기를 실행한다.
export default function TripPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-slate-400">불러오는 중...</p>}
    >
      <TripPageInner />
    </Suspense>
  )
}

function TripPageInner() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [requestText, setRequestText] = useState(
    initialQuery || '한국공학대학교에서 통큰집 정왕본점 가는 경로 추천해줘',
  )
  const [result, setResult] = useState<RoutePreviewResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runPreview = async (text: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await previewRoute({
        profile_id: DEFAULT_PROFILE_ID,
        request_text: text,
      })
      setResult(res)
    } catch {
      setError('경로 미리보기를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- /search에서 넘어온 쿼리 자동 실행
      void runPreview(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">경로 미리보기</h1>
      <p className="text-sm text-slate-500">
        trip 저장 없이 직접 경로 파싱 결과와 provider 호출 여부를 확인합니다.
        출발/도착 마커만 표시되며, 실제 경로선(route_points)은 /api/trips/plan 응답에만 포함됩니다.
      </p>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
        />
        <button
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={() => runPreview(requestText)}
          disabled={loading}
        >
          확인
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <NaverMap origin={result.origin} destination={result.destination} />
      )}

      {result && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <p className="mb-1 font-semibold text-slate-700">출발지</p>
            <p>{result.origin?.name ?? '-'}</p>
            <p className="text-xs text-slate-500">
              {result.origin ? `${result.origin.lat}, ${result.origin.lng}` : ''}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
            <p className="mb-1 font-semibold text-slate-700">도착지</p>
            <p>{result.destination?.name ?? '-'}</p>
            <p className="text-xs text-slate-500">
              {result.destination
                ? `${result.destination.lat}, ${result.destination.lng}`
                : ''}
            </p>
          </div>
          {config.showRouteDebug && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm sm:col-span-2">
              <p className="mb-1 font-semibold text-slate-700">route_debug</p>
              <pre className="overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                {JSON.stringify(result.route_debug, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
