import { useState } from 'react'
import { sendChatTurn } from '../api/chat'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

// 기본 프로필 id는 예시값. 실제 프로필 목록은 /api/profiles에서 조회 후 선택 UI로 교체 필요.
const DEFAULT_PROFILE_ID = 'power_basic'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    const message = input.trim()
    if (!message || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: message }])
    setInput('')
    setLoading(true)

    try {
      const res = await sendChatTurn({
        profile_id: DEFAULT_PROFILE_ID,
        message,
      })
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.reply ?? JSON.stringify(res) },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '응답을 받아오지 못했습니다.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border border-slate-200 bg-white">
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate-400">
            예: "한국공학대학교에서 통큰집 정왕본점 가는 경로 추천해줘"
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              m.role === 'user'
                ? 'ml-auto bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-800'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-sm text-slate-400">응답 대기 중...</p>}
      </div>
      <div className="flex gap-2 border-t border-slate-200 p-3">
        <input
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요"
        />
        <button
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          onClick={handleSend}
          disabled={loading}
        >
          전송
        </button>
      </div>
    </div>
  )
}
