'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppIcon, { type AppIconName } from '@/components/common/AppIcon'
import NaverMap from '@/components/map/NaverMap'
import { getPlaces } from '@/api/places'
import type { Place } from '@/types/place'

const FILTERS: { value: string | null; label: string; icon: AppIconName }[] = [
  { value: null, label: '전체', icon: 'mapPin' },
  { value: 'tour', label: '관광지', icon: 'landmark' },
  { value: 'restaurant', label: '식당', icon: 'restaurant' },
  { value: 'cafe', label: '카페', icon: 'cafe' },
  { value: 'restroom', label: '화장실', icon: 'restroom' },
]

export default function ExplorePage() {
  const router = useRouter()
  const [places, setPlaces] = useState<Place[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Place | null>(null)
  const [loading, setLoading] = useState(true)

  const runSearch = (category = filter, keyword = q) => {
    setLoading(true)
    getPlaces({ category: category ?? undefined, q: keyword.trim() || undefined })
      .then((res) => {
        setPlaces(res)
        setSelected(res[0] ?? null)
      })
      .catch(() => {
        setPlaces([])
        setSelected(null)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 필터 변경 시 결과를 즉시 갱신한다.
    runSearch(filter, q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const originForMap =
    selected?.lat !== undefined && selected?.lng !== undefined
      ? { lat: selected.lat, lng: selected.lng }
      : undefined

  return (
    <div className="absolute inset-0 bg-slate-100">
      <NaverMap fullBleed origin={originForMap} />

      <div className="pointer-events-none absolute inset-x-0 top-0 space-y-3 px-4 pt-4">
        <form
          className="pointer-events-auto flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-lg shadow-slate-900/5"
          onSubmit={(event) => {
            event.preventDefault()
            runSearch()
          }}
        >
          <AppIcon name="search" className="shrink-0 text-slate-900" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="장소·편의시설 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="submit"
            aria-label="검색"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
          >
            <AppIcon name="search" size={18} />
          </button>
        </form>

        <div className="pointer-events-auto -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {FILTERS.map((item) => {
            const active = filter === item.value
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold shadow-sm transition-colors ${
                  active
                    ? 'border-emerald-600 bg-white text-emerald-700'
                    : 'border-white bg-white/95 text-slate-700'
                }`}
              >
                <AppIcon name={item.icon} size={18} />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <button
          type="button"
          onClick={() => router.push(`/explore/${selected.id}`)}
          className="absolute inset-x-4 bottom-4 flex min-h-24 items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-xl shadow-slate-900/15"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <AppIcon name="mapPin" size={25} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold text-slate-500">
              {selected.category || '주변 장소'}
            </p>
            <p className="truncate text-base font-bold text-slate-950">{selected.name}</p>
            <p className="mt-1 text-xs text-emerald-700">접근성 정보 확인하기</p>
          </div>
          <AppIcon name="chevronRight" className="shrink-0 text-slate-400" />
        </button>
      )}

      {!loading && places.length === 0 && (
        <p className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-5 text-center text-sm text-slate-500 shadow-lg">
          조건에 맞는 장소를 찾지 못했어요.
        </p>
      )}
    </div>
  )
}
