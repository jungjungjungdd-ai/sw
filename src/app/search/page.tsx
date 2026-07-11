'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NaverMap from '@/components/map/NaverMap'

// 디자인의 "목적지 입력(지도 배경)" 화면.
// 화면 전체를 지도로 채우고, 중앙 마이크 버튼(음성 입력) + 하단 검색창을 띄운다.
// 검색/음성 입력 결과는 /trip 페이지로 넘겨서 경로 미리보기를 실행한다.
export default function SearchPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [listening, setListening] = useState(false)

  const handleSubmit = () => {
    const q = text.trim()
    if (!q) return
    router.push(`/trip?q=${encodeURIComponent(q)}`)
  }

  const handleVoiceInput = () => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      alert('이 브라우저는 음성 입력을 지원하지 않습니다. 텍스트로 입력해주세요.')
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'ko-KR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript
      if (transcript) setText(transcript)
    }
    recognition.start()
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-100">
      <NaverMap fullBleed />

      <button
        type="button"
        onClick={() => router.back()}
        aria-label="뒤로가기"
        className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow"
      >
        ←
      </button>

      <div className="pointer-events-none absolute inset-x-0 top-1/3 flex flex-col items-center gap-4">
        <p className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow">
          어디로 가고 싶나요?
        </p>
        <button
          type="button"
          onClick={handleVoiceInput}
          aria-label="음성으로 입력"
          className={`pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-lg transition-colors ${
            listening ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
          }`}
        >
          🎤
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex gap-2 px-4">
        <input
          className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm shadow"
          placeholder="어디든 말씀해주세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="검색"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-lg text-white shadow"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
