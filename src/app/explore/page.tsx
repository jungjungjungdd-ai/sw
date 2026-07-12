'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NaverMap from '@/components/map/NaverMap'
import { getPlaces } from '@/api/places'
import type { Place } from '@/types/place'

const FILTERS: { value: string; label: string; icon: string }[] = [
  { value: 'restaurant', label: '음식', icon: '🍴' },
  { value: 'transit', label: '교통', icon: '🚌' },
  { value: 'restroom', label: '화장실', icon: '🚻' },
  { value: 'tour', label: '관광', icon: '📷' },
]

// 디자인의 "탐색" 탭. 지도를 꽉 채우고 그 위에 검색바/필터칩/장소 미리보기 카드를 띄운다.
// GET /api/places(q, category)로 마커 후보를 가져오고, 카드를 누르면 /explore/[id] 상세로 이동한다.
export default function ExplorePage() {
  const router = useRouter()
  const [places, setPlaces] = useState<Place[]>([])
  // 카테고리는 선택 사항이라 처음엔 아무 것도 고르지 않은 상태(전체)로 시작한다.
  const [filter, setFilter] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)

  const runSearch = (category: string | null, keyword: string) => {
    setLoading(true)
    getPlaces({ category: category ?? undefined, q: keyword || undefined })
      .then((res) => {
        setPlaces(res)
        setSelected(res[0] ?? null)
      })
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 필터 바뀔 때마다 목록 재조회
    runSearch(filter, q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const originForMap =
    selected?.lat !== undefined && selected?.lng !== undefined
      ? { lat: selected.lat, lng: selected.lng }
      : undefined

  return (
    <div className="absolute inset-0">
      <NaverMap fullBleed origin={originForMap} />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 shadow">
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="어디로 가볼까요?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(filter, q)}
          />
          <button
            type="button"
            aria-label="검색"
            onClick={() => runSearch(filter, q)}
            className="text-emerald-600"
          >
            🎙️
          </button>
        </div>

        <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() =>
                setFilter((prev) => (prev === f.value ? null : f.value))
              }
              className={`flex shrink-0 items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${
                filter === f.value
                  ? 'border-emerald-600 bg-white text-emerald-600'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <button
          type="button"
          onClick={() => router.push(`/explore/${selected.id}`)}
          className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-lg"
        >
          <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-100" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {selected.name}
            </p>
            {selected.category && (
              <p className="text-xs text-emerald-600">{selected.category}</p>
            )}
          </div>
          <span className="text-slate-300">›</span>
        </button>
      )}

      {!loading && places.length === 0 && (
        <p className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 text-center text-sm text-slate-400 shadow">
          주변에서 결과를 찾지 못했습니다.
        </p>
      )}
    </div>
  )
}
