// 온보딩과 개인 맞춤 설정(프로필) 화면이 함께 쓰는 "외출 조건" 선택지 목록.
// 두 화면 모두 같은 조건을 다루므로 옵션 정의를 여기서 공유한다.

import type {
  AvoidCondition,
  MovableDistanceM,
  TodayCondition,
  WheelchairType,
} from '@/types/onboarding'

export const WHEELCHAIR_OPTIONS: { value: WheelchairType; label: string }[] = [
  { value: 'power', label: '전동휠체어' },
  { value: 'manual', label: '수동휠체어' },
  { value: 'none', label: '미보유' },
]

// 0은 '상관없음(제한 없음)'을 뜻하는 값으로 쓴다. null은 '아직 아무것도 선택 안 함'과 구분하기 위해서다.
export const DISTANCE_OPTIONS: { value: MovableDistanceM; label: string }[] = [
  { value: 0, label: '상관없음' },
  { value: 300, label: '300m' },
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
  { value: 3000, label: '3km' },
]

export const CONDITION_OPTIONS: { value: TodayCondition; label: string }[] = [
  { value: 'good', label: '좋음' },
  { value: 'normal', label: '보통' },
  { value: 'hard', label: '힘든 이동 어려움' },
]

export const AVOID_OPTIONS: { value: AvoidCondition; label: string }[] = [
  { value: 'steep_slope', label: '급경사 있음' },
  { value: 'steep_slope_severe', label: '경사 심함' },
  { value: 'no_accessible_restroom', label: '장애인 화장실 없음' },
  { value: 'rainy_day', label: '비 오는 날 이동' },
]
