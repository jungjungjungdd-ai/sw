'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveMockUser } from '@/lib/auth-storage'

// 목업 로그인 화면. 실제 인증 서버가 없어서 아이디/비밀번호를 입력하면
// 값 검증 없이 무조건 로그인 처리하고 온보딩(프로필 조건 입력)으로 이동한다.
export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    saveMockUser(username.trim() || 'guest')
    router.push('/onboarding')
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col justify-center gap-6 py-12">
      <h1 className="text-xl font-bold text-slate-900">로그인</h1>
      <p className="text-sm text-slate-500">
        (목업) 아이디/비밀번호를 입력하면 별도 인증 없이 로그인 처리됩니다.
      </p>

      <div className="space-y-3">
        <input
          className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleLogin}
        className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        로그인
      </button>

      <button
        type="button"
        onClick={handleLogin}
        className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
      >
        회원가입
      </button>
    </div>
  )
}
