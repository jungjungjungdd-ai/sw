'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OptionPill from '@/components/common/OptionPill'
import { clearMockUser, loadMockUser, saveMockUser } from '@/lib/auth-storage'
import {
  AVOID_OPTIONS,
  CONDITION_OPTIONS,
  DISTANCE_OPTIONS,
  WHEELCHAIR_OPTIONS,
} from '@/lib/onboarding-options'
import { loadOnboardingProfile, saveOnboardingProfile } from '@/lib/onboarding-storage'
import { resolveAndSaveProfileId } from '@/lib/resolve-profile'
import {
  EMPTY_ONBOARDING_PROFILE,
  type AvoidCondition,
  type OnboardingProfile,
} from '@/types/onboarding'

const WHEELCHAIR_LABEL: Record<string, string> = {
  power: '전동휠체어',
  manual: '수동휠체어',
  none: '미보유',
}

// 백엔드에 "기본 피로도" 전용 필드가 없어서, 온보딩에서 받은 오늘 컨디션(todayCondition) 값을
// 낮음/보통/높음으로 재사용해 보여준다. 별도 필드가 생기면 이 매핑만 교체하면 된다.
const FATIGUE_LABEL: Record<string, string> = {
  good: '낮음',
  normal: '보통',
  hard: '높음',
}

const MOTION_KEY = 'sw:reduce-motion'

// 디자인의 "맞춤 설정(마이페이지)" 탭. 온보딩에서 저장한 프로필(localStorage)을 읽어 보여주고,
// 외출 조건도 이 화면에서 바로 수정할 수 있다.
export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState('guest')
  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [reduceMotion, setReduceMotion] = useState(true)
  const [editingConditions, setEditingConditions] = useState(false)
  const [draft, setDraft] = useState<OnboardingProfile>(EMPTY_ONBOARDING_PROFILE)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 로컬 저장값 불러오기
    setUsername(loadMockUser() || 'guest')
    setProfile(loadOnboardingProfile())
    setReduceMotion((window.localStorage.getItem(MOTION_KEY) ?? 'true') === 'true')
  }, [])

  const handleRename = () => {
    const next = window.prompt('표시 이름을 입력해주세요', username)
    if (!next) return
    const trimmed = next.trim() || username
    saveMockUser(trimmed)
    setUsername(trimmed)
  }

  const startEditingConditions = () => {
    setDraft(profile ?? EMPTY_ONBOARDING_PROFILE)
    setEditingConditions(true)
  }

  const cancelEditingConditions = () => {
    setEditingConditions(false)
  }

  const toggleAvoidCondition = (value: AvoidCondition) => {
    setDraft((prev) => ({
      ...prev,
      avoidConditions: prev.avoidConditions.includes(value)
        ? prev.avoidConditions.filter((v) => v !== value)
        : [...prev.avoidConditions, value],
    }))
  }

  const handleSaveConditions = async () => {
    setSaving(true)
    try {
      saveOnboardingProfile(draft)
      await resolveAndSaveProfileId(draft)
      setProfile(draft)
      setEditingConditions(false)
    } finally {
      setSaving(false)
    }
  }

  const toggleMotion = () => {
    const next = !reduceMotion
    setReduceMotion(next)
    window.localStorage.setItem(MOTION_KEY, String(next))
  }

  const handleLogout = () => {
    clearMockUser()
    router.replace('/login')
  }

  const initial = username.slice(0, 1).toUpperCase()
  const wheelchairLabel = profile?.wheelchairType
    ? WHEELCHAIR_LABEL[profile.wheelchairType]
    : '미설정'
  const distanceLabel =
    profile?.movableDistanceM === 0
      ? '상관없음'
      : profile?.movableDistanceM
        ? `${profile.movableDistanceM}m`
        : '미설정'
  const fatigueLabel = profile?.todayCondition
    ? FATIGUE_LABEL[profile.todayCondition]
    : '미설정'

  return (
    <div className="space-y-6 pb-6">
      <h1 className="text-xl font-bold text-slate-900">개인 맞춤 설정</h1>

      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-600 text-3xl font-bold text-white">
            {initial}
          </div>
          <button
            type="button"
            onClick={handleRename}
            aria-label="이름 수정"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow"
          >
            ✎
          </button>
        </div>
        <p className="text-lg font-bold text-slate-900">{username}</p>
        <p className="text-sm text-slate-400">{wheelchairLabel} 사용자</p>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <span className="text-base font-semibold text-slate-900">외출 조건</span>
        {!editingConditions && (
          <button
            type="button"
            onClick={startEditingConditions}
            className="text-sm font-semibold text-emerald-600"
          >
            수정
          </button>
        )}
      </div>

      {editingConditions ? (
        <div className="space-y-6">
          <section className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">휠체어 종류</p>
            <div className="flex flex-wrap gap-2">
              {WHEELCHAIR_OPTIONS.map((option) => (
                <OptionPill
                  key={option.value}
                  label={option.label}
                  selected={draft.wheelchairType === option.value}
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, wheelchairType: option.value }))
                  }
                />
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">이동 가능 거리</p>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((option) => (
                <OptionPill
                  key={option.value}
                  label={option.label}
                  selected={draft.movableDistanceM === option.value}
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, movableDistanceM: option.value }))
                  }
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={0}
                step={50}
                inputMode="numeric"
                placeholder="직접 입력"
                value={
                  draft.movableDistanceM === 0 || draft.movableDistanceM === null
                    ? ''
                    : draft.movableDistanceM
                }
                onChange={(e) => {
                  const raw = e.target.value
                  setDraft((prev) => ({
                    ...prev,
                    movableDistanceM: raw === '' ? null : Number(raw),
                  }))
                }}
                className="w-28 rounded-full border border-slate-200 px-4 py-2 text-sm"
              />
              <span className="text-xs text-slate-400">m 단위로 직접 입력 가능</span>
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">오늘의 컨디션</p>
            <div className="flex flex-wrap gap-2">
              {CONDITION_OPTIONS.map((option) => (
                <OptionPill
                  key={option.value}
                  label={option.label}
                  selected={draft.todayCondition === option.value}
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, todayCondition: option.value }))
                  }
                />
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">피하고 싶은 조건</p>
            <div className="flex flex-wrap gap-2">
              {AVOID_OPTIONS.map((option) => (
                <OptionPill
                  key={option.value}
                  label={option.label}
                  selected={draft.avoidConditions.includes(option.value)}
                  onClick={() => toggleAvoidCondition(option.value)}
                />
              ))}
            </div>
          </section>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSaveConditions}
              disabled={saving}
              className="flex-1 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving ? '저장 중…' : '저장하기'}
            </button>
            <button
              type="button"
              onClick={cancelEditingConditions}
              disabled={saving}
              className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          <div className="flex items-center justify-between py-4 text-sm">
            <span className="text-slate-500">휠체어 종류</span>
            <span className="font-medium text-slate-900">{wheelchairLabel}</span>
          </div>
          <div className="flex items-center justify-between py-4 text-sm">
            <span className="text-slate-500">이동 가능 거리</span>
            <span className="font-medium text-slate-900">{distanceLabel}</span>
          </div>
          <div className="flex items-center justify-between py-4 text-sm">
            <span className="text-slate-500">기본 피로도</span>
            <span className="font-medium text-slate-900">{fatigueLabel}</span>
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-base font-semibold text-slate-900">
          모션 설정
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">
              화면 모션 줄이기
            </p>
            <p className="text-xs text-slate-400">
              지도와 화면 전환 움직임을 최소화합니다
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reduceMotion}
            onClick={toggleMotion}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              reduceMotion ? 'bg-emerald-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                reduceMotion ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full rounded-full border border-emerald-600 py-3 text-sm font-semibold text-emerald-600"
      >
        로그아웃
      </button>
    </div>
  )
}
