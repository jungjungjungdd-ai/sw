'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OptionPill from '@/components/common/OptionPill'
import {
  AVOID_OPTIONS,
  CONDITION_OPTIONS,
  DISTANCE_OPTIONS,
  WHEELCHAIR_OPTIONS,
} from '@/lib/onboarding-options'
import {
  loadOnboardingProfile,
  markOnboardingCompleted,
  saveOnboardingProfile,
} from '@/lib/onboarding-storage'
import { resolveAndSaveProfileId } from '@/lib/resolve-profile'
import {
  EMPTY_ONBOARDING_PROFILE,
  type AvoidCondition,
  type OnboardingProfile,
} from '@/types/onboarding'

export default function OnboardingPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<OnboardingProfile>(EMPTY_ONBOARDING_PROFILE)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 로컬 저장값 불러오기
    setProfile(loadOnboardingProfile())
  }, [])

  const toggleAvoidCondition = (value: AvoidCondition) => {
    setProfile((prev) => ({
      ...prev,
      avoidConditions: prev.avoidConditions.includes(value)
        ? prev.avoidConditions.filter((v) => v !== value)
        : [...prev.avoidConditions, value],
    }))
  }

  const handleSave = async () => {
    saveOnboardingProfile(profile)
    // 입력한 조건(휠체어 종류 등)으로 실제 백엔드 profile_id를 추정해 저장한다.
    await resolveAndSaveProfileId(profile)
    markOnboardingCompleted()
    router.push('/explore')
  }

  const handleSkip = () => {
    markOnboardingCompleted()
    router.push('/explore')
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 pb-8">
      <h1 className="text-xl font-bold leading-snug text-slate-900">
        나에게 맞는
        <br />
        외출 조건 알려주세요
      </h1>

      <section className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">휠체어 종류</p>
        <div className="flex flex-wrap gap-2">
          {WHEELCHAIR_OPTIONS.map((option) => (
            <OptionPill
              key={option.value}
              label={option.label}
              selected={profile.wheelchairType === option.value}
              onClick={() =>
                setProfile((prev) => ({ ...prev, wheelchairType: option.value }))
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
              selected={profile.movableDistanceM === option.value}
              onClick={() =>
                setProfile((prev) => ({ ...prev, movableDistanceM: option.value }))
              }
            />
          ))}
        </div>
        {/* 프리셋 이상으로 더 이동하고 싶은 사람도 있어서 직접 입력도 열어둔다 */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            min={0}
            step={50}
            inputMode="numeric"
            placeholder="직접 입력"
            value={
              profile.movableDistanceM === 0 || profile.movableDistanceM === null
                ? ''
                : profile.movableDistanceM
            }
            onChange={(e) => {
              const raw = e.target.value
              setProfile((prev) => ({
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
              selected={profile.todayCondition === option.value}
              onClick={() =>
                setProfile((prev) => ({ ...prev, todayCondition: option.value }))
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
              selected={profile.avoidConditions.includes(option.value)}
              onClick={() => toggleAvoidCondition(option.value)}
            />
          ))}
        </div>
      </section>

      <div className="space-y-2 pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          저장하기
        </button>
        <button
          type="button"
          onClick={handleSkip}
          className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          나중에 입력하기
        </button>
      </div>
    </div>
  )
}
