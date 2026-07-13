'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AppIcon from '@/components/common/AppIcon'
import OptionPill from '@/components/common/OptionPill'
import { clearMockUser, loadMockUser, saveMockUser } from '@/lib/auth-storage'
import {
  AVOID_OPTIONS,
  CONDITION_OPTIONS,
  DISTANCE_OPTIONS,
  WHEELCHAIR_OPTIONS,
} from '@/lib/onboarding-options'
import {
  loadOnboardingProfile,
  loadProfileRequest,
  saveOnboardingProfile,
  saveProfileRequest,
} from '@/lib/onboarding-storage'
import { resolveAndSaveProfileId } from '@/lib/resolve-profile'
import { loadRecentCourses, type SavedCourse } from '@/lib/favorites-storage'
import {
  EMPTY_ONBOARDING_PROFILE,
  type AvoidCondition,
  type OnboardingProfile,
} from '@/types/onboarding'

const WHEELCHAIR_LABEL: Record<string, string> = {
  power: '전동휠체어',
  manual: '수동휠체어',
  none: '보행',
}

const FATIGUE_LABEL: Record<string, string> = {
  good: '좋음',
  normal: '보통',
  hard: '낮음',
}

export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState('사용자')
  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [draft, setDraft] = useState<OnboardingProfile>(EMPTY_ONBOARDING_PROFILE)
  const [request, setRequest] = useState('')
  const [history, setHistory] = useState<SavedCourse[]>([])
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const savedProfile = loadOnboardingProfile()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 브라우저 저장 프로필을 한 번 읽어 화면 상태를 초기화한다.
    setUsername(loadMockUser() || '사용자')
    setProfile(savedProfile)
    setDraft(savedProfile)
    setRequest(loadProfileRequest())
    setHistory(loadRecentCourses().slice(0, 3))
  }, [])

  const wheelchairLabel = profile?.wheelchairType
    ? WHEELCHAIR_LABEL[profile.wheelchairType]
    : '설정 전'
  const distanceLabel = profile?.movableDistanceM ? `${profile.movableDistanceM}m` : '설정 전'
  const fatigueLabel = profile?.todayCondition ? FATIGUE_LABEL[profile.todayCondition] : '설정 전'
  const toggleAvoidCondition = (value: AvoidCondition) => {
    setDraft((prev) => ({
      ...prev,
      avoidConditions: prev.avoidConditions.includes(value)
        ? prev.avoidConditions.filter((item) => item !== value)
        : [...prev.avoidConditions, value],
    }))
  }

  const saveChanges = async () => {
    setSaving(true)
    try {
      saveOnboardingProfile(draft)
      saveProfileRequest(request)
      await resolveAndSaveProfileId(draft)
      setProfile(draft)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const rename = () => {
    const next = window.prompt('표시할 이름을 입력해주세요.', username)
    if (!next?.trim()) return
    const value = next.trim()
    saveMockUser(value)
    setUsername(value)
  }

  return (
    <div className="space-y-6 pb-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">내 정보</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">나의 접근성 프로필</h1>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => {
              setDraft(profile ?? EMPTY_ONBOARDING_PROFILE)
              setEditing(true)
            }}
            className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700"
          >
            수정
          </button>
        )}
      </div>

      <section className="flex flex-col items-center rounded-2xl bg-emerald-50 px-5 py-6 text-center">
        <button
          type="button"
          onClick={rename}
          aria-label="이름 수정"
          className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm"
        >
          <AppIcon name="user" size={30} />
        </button>
        <p className="mt-3 text-lg font-bold text-slate-950">{username}</p>
        <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-emerald-800">
          <AppIcon name="wheelchair" size={17} />
          {wheelchairLabel} 사용자
        </div>
      </section>

      {editing ? (
        <section className="space-y-5 rounded-2xl border border-slate-100 p-5">
          <ProfileEditor draft={draft} setDraft={setDraft} toggleAvoidCondition={toggleAvoidCondition} />
          <RequestField request={request} setRequest={setRequest} />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={saving}
              onClick={saveChanges}
              className="flex-1 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setDraft(profile ?? EMPTY_ONBOARDING_PROFILE)
                setEditing(false)
              }}
              className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-600"
            >
              취소
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            <ProfileRow label="이동 수단" value={wheelchairLabel} />
            <ProfileRow label="이동 가능 거리" value={distanceLabel} />
            <ProfileRow label="기본 피로도" value={fatigueLabel} />
          </section>
          <section>
            <RequestField request={request} setRequest={setRequest} readOnly />
          </section>
        </>
      )}

      {!editing && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">사용 기록</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">최신순</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
            {history.map((course) => (
              <Link
                key={course.id}
                href={`/favorites/${course.id}`}
                className="flex min-h-13 items-center gap-3 border-b border-slate-100 px-4 last:border-0"
              >
                <AppIcon name="mapPin" size={18} className="shrink-0 text-emerald-600" />
                <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{course.title}</span>
                <span className="shrink-0 text-xs text-slate-400">{formatHistoryDate(course.savedAt)}</span>
              </Link>
            ))}
            {history.length === 0 && <p className="p-4 text-sm text-slate-400">아직 생성한 코스가 없습니다.</p>}
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          clearMockUser()
          router.replace('/login')
        }}
        className="w-full py-2 text-sm font-semibold text-slate-400"
      >
        로그아웃
      </button>
    </div>
  )
}

function formatHistoryDate(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}.${date.getDate()}`
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[52px] items-center justify-between border-b border-slate-100 px-4 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  )
}

function RequestField({ request, setRequest, readOnly = false }: { request: string; setRequest: (value: string) => void; readOnly?: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-900">요청사항</p>
        {!readOnly && <span className="text-xs text-slate-400">{request.length}/500</span>}
      </div>
      <p className="mb-3 text-xs leading-5 text-slate-500">다음 AI 코스 요청에 이 선호를 함께 반영합니다.</p>
      {readOnly ? (
        <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm leading-6 text-slate-600">
          {request || '선호하는 장소나 피하고 싶은 조건을 추가해보세요.'}
        </div>
      ) : (
        <textarea
          maxLength={500}
          value={request}
          onChange={(event) => setRequest(event.target.value)}
          placeholder="예: 조용한 장소를 선호하고, 경사가 적으며 장애인 화장실이 있는 코스를 우선 추천해주세요."
          className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-emerald-500"
        />
      )}
    </div>
  )
}

function ProfileEditor({ draft, setDraft, toggleAvoidCondition }: { draft: OnboardingProfile; setDraft: (profile: OnboardingProfile | ((previous: OnboardingProfile) => OnboardingProfile)) => void; toggleAvoidCondition: (value: AvoidCondition) => void }) {
  return (
    <>
      <section className="space-y-2">
        <p className="text-sm font-bold text-slate-800">휠체어 종류</p>
        <div className="flex flex-wrap gap-2">
          {WHEELCHAIR_OPTIONS.map((option) => <OptionPill key={option.value} label={option.label} selected={draft.wheelchairType === option.value} onClick={() => setDraft((prev) => ({ ...prev, wheelchairType: option.value }))} />)}
        </div>
      </section>
      <section className="space-y-2">
        <p className="text-sm font-bold text-slate-800">이동 가능 거리</p>
        <div className="flex flex-wrap gap-2">
          {DISTANCE_OPTIONS.map((option) => <OptionPill key={option.value} label={option.label} selected={draft.movableDistanceM === option.value} onClick={() => setDraft((prev) => ({ ...prev, movableDistanceM: option.value }))} />)}
        </div>
      </section>
      <section className="space-y-2">
        <p className="text-sm font-bold text-slate-800">오늘의 컨디션</p>
        <div className="flex flex-wrap gap-2">
          {CONDITION_OPTIONS.map((option) => <OptionPill key={option.value} label={option.label} selected={draft.todayCondition === option.value} onClick={() => setDraft((prev) => ({ ...prev, todayCondition: option.value }))} />)}
        </div>
      </section>
      <section className="space-y-2">
        <p className="text-sm font-bold text-slate-800">피하고 싶은 조건</p>
        <div className="flex flex-wrap gap-2">
          {AVOID_OPTIONS.map((option) => <OptionPill key={option.value} label={option.label} selected={draft.avoidConditions.includes(option.value)} onClick={() => toggleAvoidCondition(option.value)} />)}
        </div>
      </section>
    </>
  )
}
