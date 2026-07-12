import { getProfiles } from '@/api/profiles'
import type { OnboardingProfile, WheelchairType } from '@/types/onboarding'
import { DEFAULT_PROFILE_ID, saveSelectedProfileId } from './profile-storage'

// 온보딩 조건(휠체어 종류 등)으로 실제 백엔드 프로필(profile_id)을 추정해서 매핑한다.
// 백엔드에 "커스텀 프로필 생성" API가 없어서(GET /api/profiles만 존재),
// 이미 있는 프리셋 중 조건과 가장 가까운 것을 이름/id로 매칭해 고르는 임시 방식이다.
// 백엔드에 프로필 생성/커스텀 매핑 API가 생기면 이 함수를 교체해야 한다.
export async function resolveAndSaveProfileId(
  onboarding: OnboardingProfile,
): Promise<string> {
  try {
    const profiles = await getProfiles()
    const keyword = wheelchairKeyword(onboarding.wheelchairType)

    const matched = keyword
      ? profiles.find(
          (p) =>
            p.id.toLowerCase().includes(keyword) ||
            String(p.name ?? '')
              .toLowerCase()
              .includes(keyword),
        )
      : undefined

    const profileId = matched?.id ?? profiles[0]?.id ?? DEFAULT_PROFILE_ID
    saveSelectedProfileId(profileId)
    return profileId
  } catch {
    saveSelectedProfileId(DEFAULT_PROFILE_ID)
    return DEFAULT_PROFILE_ID
  }
}

function wheelchairKeyword(type: WheelchairType | null): string | null {
  switch (type) {
    case 'power':
      return 'power'
    case 'manual':
      return 'manual'
    case 'none':
      return 'basic'
    default:
      return null
  }
}
