'use client'

import { useEffect, useState } from 'react'
import { getHealth } from '@/api/health'
import type { HealthStatus } from '@/types/health'

// 개발/디버그용 백엔드 상태 확인 화면. 예전 홈 화면 내용을 그대로 옮겼다.
export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setError('백엔드 상태를 불러오지 못했습니다.'))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">접근성 경로 추천</h1>
      <p className="text-slate-600">
        관광공사, 전국/경기도 장애인편의시설 데이터, 지도 POI를 결합해
        접근성 정보를 제공합니다.
      </p>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">
          백엔드 상태 (/api/health)
        </h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!error && !health && (
          <p className="text-sm text-slate-400">확인 중...</p>
        )}
        {health && (
          <pre className="overflow-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
            {JSON.stringify(health, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
