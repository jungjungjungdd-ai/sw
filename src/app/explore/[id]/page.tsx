'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import AppIcon, { type AppIconName } from '@/components/common/AppIcon'
import { getPlace } from '@/api/places'
import type { Place } from '@/types/place'
import { isFavoritePlace, toggleFavoritePlace } from '@/lib/favorites-storage'
import { loadPlaceFeedback } from '@/lib/place-feedback-storage'

const ACCESS_FEATURES: { icon: AppIconName; label: string }[] = [
  { icon: 'wheelchair', label: '휠체어 출입' },
  { icon: 'restroom', label: '장애인 화장실' },
  { icon: 'location', label: '엘리베이터' },
  { icon: 'mapPin', label: '주차 정보' },
]

const DEMO_RATINGS = [
  { label: '입구 진입', score: 4.7 },
  { label: '내부 이동', score: 4.6 },
  { label: '시설 정보', score: 4.8 },
]

interface Review {
  name: string
  date: string
  text: string
  likes: number
}

const INITIAL_REVIEWS: Review[] = [
  {
    name: '김미수',
    date: '2024.05.12',
    text: '입구 경사로 폭이 넓고 경사가 완만해 휠체어로 진입하기 편했어요. 장애인 화장실도 1층에 있어 좋았습니다.',
    likes: 12,
  },
  {
    name: '이영희',
    date: '2024.04.28',
    text: '엘리베이터가 있고 통로 폭이 넓어 전동휠체어로 이용하기 좋았습니다.',
    likes: 9,
  },
]

export default function PlaceDetailPage() {
  const { id = '' } = useParams<{ id: string }>() ?? {}
  const router = useRouter()
  const [place, setPlace] = useState<Place | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS)
  const [reviewText, setReviewText] = useState('')
  const [hasFeedback, setHasFeedback] = useState(false)

  useEffect(() => {
    if (!id) return
    getPlace(id)
      .then((nextPlace) => {
        setPlace(nextPlace)
        setFavorite(isFavoritePlace(id))
        setHasFeedback(Boolean(loadPlaceFeedback(id)))
      })
      .catch(() => setPlace(null))
  }, [id])

  const addReview = () => {
    const text = reviewText.trim()
    if (!text) return
    setReviews((previous) => [
      {
        name: '나',
        date: new Date().toISOString().slice(0, 10).replaceAll('-', '.'),
        text,
        likes: 0,
      },
      ...previous,
    ])
    setReviewText('')
  }

  if (!place) {
    return <p className="p-4 text-sm text-slate-400">장소 정보를 불러오는 중입니다.</p>
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-800"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() =>
            setFavorite(toggleFavoritePlace({ id: place.id, name: place.name, category: place.category }))
          }
          aria-label="장소 저장"
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${
            favorite ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500'
          }`}
        >
          <AppIcon name="bookmark" size={19} />
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-emerald-700">{place.category || '주변 장소'}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{place.name}</h1>
        <p className="mt-2 text-sm text-slate-500">동선 짧음 · 턱 없음 · 화장실 정보 확인</p>
      </div>

      <section className="grid grid-cols-4 gap-2">
        {ACCESS_FEATURES.map((feature) => (
          <div key={feature.label} className="flex min-h-22 flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 px-1 text-center text-slate-600">
            <AppIcon name={feature.icon} size={21} className="text-emerald-700" />
            <span className="text-[11px] leading-tight">{feature.label}</span>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-100">
        {['위치 정보', '전화번호', '운영 시간'].map((label) => (
          <div key={label} className="flex min-h-13 items-center justify-between border-b border-slate-100 px-4 last:border-0">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <AppIcon name="chevronRight" size={17} className="text-slate-300" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
            <AppIcon name="mapPin" size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-slate-900">방문 경험을 남겨주세요</h2>
            <p className="mt-1 text-xs leading-5 text-slate-600">다음 사용자가 실제 접근성을 판단하는 데 도움이 됩니다.</p>
          </div>
        </div>
        <Link
          href={`/explore/${place.id}/feedback`}
          className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white"
        >
          {hasFeedback ? '내 피드백 수정하기' : '방문 피드백 남기기'}
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-slate-900">방문자 평가</h2>
        <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 py-4 text-center">
          {DEMO_RATINGS.map((rating) => (
            <div key={rating.label}>
              <p className="text-xs text-slate-500">{rating.label}</p>
              <p className="mt-1 text-lg font-bold text-emerald-700">{rating.score}</p>
              <p className="text-[11px] text-slate-400">128명 참여</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-slate-900">한 줄 후기</h2>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4">
          <input
            className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="접근성 경험을 남겨주세요."
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addReview()}
          />
          <button type="button" onClick={addReview} className="text-sm font-bold text-emerald-700">
            등록
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {reviews.map((review, index) => (
            <article key={`${review.name}-${index}`} className="border-t border-slate-100 pt-4">
              <p className="text-sm font-bold text-slate-900">
                {review.name} <span className="ml-1 text-xs font-normal text-slate-400">{review.date}</span>
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{review.text}</p>
              <p className="mt-2 text-xs text-slate-400">도움됨 {review.likes}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
