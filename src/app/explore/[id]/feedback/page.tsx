'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppIcon from '@/components/common/AppIcon'
import { getPlace } from '@/api/places'
import {
  loadPlaceFeedback,
  savePlaceFeedback,
  type FeedbackChoice,
  type PlaceFeedback,
} from '@/lib/place-feedback-storage'

const QUESTIONS = [
  { key: 'entrance', label: '입구 진입은 가능했나요?' },
  { key: 'movement', label: '내부 이동은 편했나요?' },
  { key: 'restroom', label: '화장실 정보는 정확했나요?' },
] as const

const CHOICES: { value: FeedbackChoice; label: string }[] = [
  { value: 'possible', label: '가능했어요' },
  { value: 'difficult', label: '조금 어려웠어요' },
  { value: 'impossible', label: '불가능했어요' },
]

const EMPTY_FEEDBACK: PlaceFeedback = {
  entrance: null,
  movement: null,
  restroom: null,
  note: '',
  createdAt: 0,
}

export default function PlaceFeedbackPage() {
  const { id = '' } = useParams<{ id: string }>() ?? {}
  const router = useRouter()
  const [placeName, setPlaceName] = useState('장소')
  const [feedback, setFeedback] = useState<PlaceFeedback>(EMPTY_FEEDBACK)
  const [submitted, setSubmitted] = useState(false)
  const [attachmentError, setAttachmentError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    getPlace(id)
      .then((place) => {
        setPlaceName(place.name)
        const saved = loadPlaceFeedback(id)
        if (saved) setFeedback(saved)
      })
      .catch(() => undefined)
  }, [id])

  const choose = (key: keyof Pick<PlaceFeedback, 'entrance' | 'movement' | 'restroom'>, value: FeedbackChoice) => {
    setFeedback((previous) => ({ ...previous, [key]: value }))
  }

  const submit = () => {
    if (!id) return
    savePlaceFeedback(id, { ...feedback, createdAt: Date.now() })
    setSubmitted(true)
  }

  const attachPhoto = (file?: File) => {
    if (!file) return
    if (file.size > 1_000_000) {
      setAttachmentError('사진은 1MB 이하만 첨부할 수 있어요.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFeedback((previous) => ({ ...previous, photoDataUrl: String(reader.result ?? '') }))
      setAttachmentError('')
    }
    reader.readAsDataURL(file)
  }

  const isComplete = QUESTIONS.every((question) => feedback[question.key] !== null)

  return (
    <div className="flex min-h-full flex-col pb-5">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로 가기"
        className="mb-7 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-xl text-slate-800"
      >
        ‹
      </button>

      <p className="text-sm font-semibold text-emerald-700">방문 후기</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{placeName}</h1>
      <h2 className="mt-2 text-xl font-bold text-slate-900">방문은 괜찮으셨나요?</h2>

      <div className="mt-9 space-y-7">
        {QUESTIONS.map((question) => (
          <section key={question.key}>
            <h3 className="mb-3 text-sm font-bold text-slate-800">{question.label}</h3>
            <div className="flex flex-wrap gap-2">
              {CHOICES.map((choice) => {
                const active = feedback[question.key] === choice.value
                return (
                  <button
                    key={choice.value}
                    type="button"
                    onClick={() => choose(question.key, choice.value)}
                    className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {choice.label}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-auto rounded-2xl bg-emerald-50 p-4">
        <h3 className="text-sm font-bold text-slate-800">다음 사용자를 위해 남길 말이 있나요?</h3>
        <p className="mt-1 text-xs text-slate-500">입구 · 경사로 · 화장실 · 통로 정보를 남겨주세요.</p>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => attachPhoto(event.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="사진 첨부"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"
          >
            <AppIcon name="plus" size={19} />
          </button>
          <input
            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            value={feedback.note}
            onChange={(event) => setFeedback((previous) => ({ ...previous, note: event.target.value }))}
            placeholder="경사로가 생각보다 가팔랐어요."
          />
        </div>
        {feedback.photoDataUrl && <p className="mt-2 text-xs font-medium text-emerald-700">사진 1장이 첨부되었습니다.</p>}
        {attachmentError && <p className="mt-2 text-xs font-medium text-red-600">{attachmentError}</p>}
      </section>

      <button
        type="button"
        onClick={submit}
        disabled={!isComplete}
        className="mt-4 min-h-12 rounded-2xl bg-emerald-600 text-sm font-bold text-white disabled:bg-slate-200 disabled:text-slate-500"
      >
        {submitted ? '피드백이 제출되었습니다' : isComplete ? '피드백 제출' : '세 항목을 선택해주세요'}
      </button>
    </div>
  )
}
