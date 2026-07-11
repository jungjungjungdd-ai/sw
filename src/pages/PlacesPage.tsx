import { useEffect, useState } from 'react'
import { getPlaces } from '../api/places'
import type { Place } from '../types/place'
import StatusBadge from '../components/common/StatusBadge'

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaces = () => {
    setLoading(true)
    setError(null)
    getPlaces({ q: q || undefined, category: category || undefined })
      .then(setPlaces)
      .catch(() => setError('장소 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPlaces()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">장소</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="검색어"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPlaces()}
        />
        <input
          className="w-40 rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPlaces()}
        />
        <button
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          onClick={fetchPlaces}
        >
          검색
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-400">불러오는 중...</p>}

      <ul className="space-y-2">
        {places.map((place) => (
          <li
            key={place.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-slate-900">
                {place.name}
              </p>
              {place.category && (
                <p className="text-xs text-slate-500">{place.category}</p>
              )}
            </div>
            <StatusBadge status={place.status} />
          </li>
        ))}
        {!loading && places.length === 0 && (
          <p className="text-sm text-slate-400">결과가 없습니다.</p>
        )}
      </ul>
    </div>
  )
}
