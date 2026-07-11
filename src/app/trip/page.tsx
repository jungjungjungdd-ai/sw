'use client'
import NaverMap from '@/components/map/NaverMap'
import { useState } from 'react'
import { previewRoute } from '@/api/debug'
import type { RoutePreviewResponse } from '@/types/debug'
import { config } from '@/config'

const DEFAULT_PROFILE_ID = 'power_basic'

// /api/debug/routes/preview로 직접 경로 프롬프트 파싱 결과(출발/도착/provider)를
// 미리 확인하는 디버그용 화면. 실제 코스 생성은 /api/trips/plan 참고.
export default function TripPage() {
  const [requestText, setRequestText] = useState(
    '한국공학대학교에서 통큰집 정왕본점 가는 경로 추천해줘',
  )
  const [result, setResult] = useState<RoutePreviewResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePreview = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await previewRoute({
        profile_id: DEFAULT_PROFILE_ID,
        request_text: requestText,
      })
      setResult(res)
    } catch {
      setError('경로 미리보기를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">경로 미리보기</h1>
      <p className="text-sm text-slate-500">
        trip 저장 없이 직접 경로 파싱 결과와 provider 호출 여부를 확인합니다.
      </p>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
        />
        <button
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={handlePreview}
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
