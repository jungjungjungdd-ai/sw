// 온보딩(프로필 설정) 화면 선택값 타입.
// 백엔드에 커스텀 프로필 생성 API가 아직 없어서(GET /api/profiles만 존재),
// 우선 로컬(localStorage)에 저장하고 profile_id 매핑은 추후 백엔드 확정 시 연결한다.

export type WheelchairType = 'power' | 'manual' | 'none'

// 프리셋(300m/500m/1km...) 외에 직접 입력도 가능해야 해서 리터럴 유니온이 아닌 number로 둔다.
export type MovableDistanceM = number

export type TodayCondition = 'good' | 'normal' | 'hard'

export type AvoidCondition =
  | 'steep_slope'
  | 'steep_slope_severe'
  | 'no_accessible_restroom'
  | 'rainy_day'

export interface OnboardingProfile {
  wheelchairType: WheelchairType | null
  movableDistanceM: MovableDistanceM | null
  todayCondition: TodayCondition | null
  avoidConditions: AvoidCondition[]
}

export const EMPTY_ONBOARDING_PROFILE: OnboardingProfile = {
  wheelchairType: null,
  movableDistanceM: null,
  todayCondition: null,
  avoidConditions: [],
}
