'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import OptionPill from '@/components/common/OptionPill'
import { loadOnboardingProfile, saveOnboardingProfile } from '@/lib/onboarding-storage'
import {
  EMPTY_ONBOARDING_PROFILE,
  type AvoidCondition,
  type MovableDistanceM,
  type OnboardingProfile,
  type TodayCondition,
  type WheelchairType,
} from '@/types/onboarding'

const WHEELCHAIR_OPTIONS: { value: WheelchairType; label: string }[] = [
  { value: 'power', label: '전동휠체어' },
  { value: 'manual', label: '수동휠체어' },
  { value: 'none', label: '미보유' },
]

const DISTANCE_OPTIONS: { value: MovableDistanceM; label: string }[] = [
  { value: 300, label: '300m' },
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
]

const CONDITION_OPTIONS: { value: TodayCondition; label: string }[] = [
  { value: 'good', label: '좋음' },
  { value: 'normal', label: '보통' },
  { value: 'hard', label: '힘든 이동 어려움' },
]

const AVOID_OPTIONS: { value: AvoidCondition; label: string }[] = [
  { value: 'steep_slope', label: '급경사 있음' },
  { value: 'steep_slope_severe', label: '경사 심함' },
  { value: 'no_accessible_restroom', label: '장애인 화장실 없음' },
  { value: 'rainy_day', label: '비 오는 날 이동' },
]

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

  const handleSave = () => {
    saveOnboardingProfile(profile)
    router.push('/')
  }

  const handleSkip = () => {
    router.push('/')
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