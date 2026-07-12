'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPlace } from '@/api/places'
import type { Place } from '@/types/place'
import { isFavoritePlace, toggleFavoritePlace } from '@/lib/favorites-storage'

// 무장애 특징 아이콘/별점/리뷰는 백엔드에 아직 API가 없어 디자인 검증용 더미 데이터로 채운다.
// 실제 편의시설 플래그·리뷰 API가 생기면 이 상수들만 교체하면 된다.
const DEMO_FEATURES = [
  { icon: '♿', label: '휠체어 출입 가능' },
  { icon: '🚻', label: '장애인 화장실' },
  { icon: '🛗', label: '엘리베이터' },
  { icon: '🅿️', label: '장애인 주차' },
]

const DEMO_RATINGS = [
  { label: '접근성', score: 4.7 },
  { label: '이동성', score: 4.6 },
  { label: '시설 편의', score: 4.8 },
]

const DEMO_REVIEWS = [
  {
    name: '김민수',
    date: '2024.05.12',
    text: '입구 경사로가 폭 1.5m로 넓고 경사가 완만해서 휠체어로 진입하기 편했어요. 자동문도 원활하게 열립니다. 장애인 화장실이 1층에 있고 넓고 깨끗해요.',
    likes: 12,
  },
  {
    name: '이영희',
    date: '2024.04.28',
    text: '엘리베이터가 모든 층에 연결되어 있고 내부가 넓어 전동휠체어 이용도 가능합니다. 점자 안내판과 촉지도가 있어 시각장애인에게도 도움이 됩니다.',
    likes: 9,
  },
]

export default function PlaceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [place, setPlace] = useState<Place | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [reviews, setReviews] = useState(DEMO_REVIEWS)
  const [reviewText, setReviewText] = useState('')

  useEffect(() => {
    getPlace(id)
      .then(setPlace)
      .catch(() => setPlace(null))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- id 바뀔 때 즐겨찾기 여부 동기화
    setFavorite(isFavoritePlace(id))
  }, [id])

  const handleAddReview = () => {
    const text = reviewText.trim()
    if (!text) return
    setReviews((prev) => [
      {
        name: '나',
        date: new Date().toISOString().slice(0, 10).replaceAll('-', '.'),
        text,
        likes: 0,
      },
      ...prev,
    ])
    setReviewText('')
  }

  if (!place) {
    return <p className="p-4 text-sm text-slate-400">불러오는 중...</p>
  }

  return (
    <div className="space-y-5 pb-6">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로가기"
        className="text-xl text-slate-900"
      >
        ←
      </button>

      <div>
        <h1 className="text-xl font-bold text-slate-900">{place.name}</h1>
        {place.category && (
          <p className="text-sm font-medium text-emerald-600">
            {place.category}
          </p>
        )}
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
        <button
          type="button"
          onClick={() =>
            setFavorite(
              toggleFavoritePlace({
                id: place.id,
                name: place.name,
                category: place.category,
              }),
            )
          }
          aria-label="즐겨찾기"
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow ${
            favorite ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">
          무장애 특징
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {DEMO_FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 py-3 text-center"
            >
              <span className="text-lg">{f.icon}</span>
              <span className="text-[11px] leading-tight text-slate-600">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
        {['위치 정보', '전화 번호', '운영 시간'].map((label) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3 text-sm text-slate-700"
          >
            {label}
            <span className="text-slate-300">›</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">리뷰</h2>
        <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 py-4 text-center">
          {DEMO_RATINGS.map((r) => (
            <div key={r.label}>
              <p className="text-xs text-slate-500">{r.label}</p>
              <p className="text-lg font-bold text-emerald-600">{r.score}</p>
              <p className="text-[11px] text-slate-400">128명 참여</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5">
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            placeholder="접근성 경험을 남겨주세요"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddReview()}
          />
          <button
            type="button"
            onClick={handleAddReview}
            aria-label="리뷰 작성"
            className="text-slate-500"
          >
            ✎
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {reviews.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="space-y-1 border-t border-slate-100 pt-4 text-sm"
            >
              <p className="font-semibold text-slate-900">
                {r.name}{' '}
                <span className="font-normal text-slate-400">· {r.date}</span>
              </p>
              <p className="text-slate-600">{r.text}</p>
              <p className="text-xs text-slate-400">👍 {r.likes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
