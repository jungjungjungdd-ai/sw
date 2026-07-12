'use client'

import { useEffect, useState } from 'react'
import { getProfiles } from '@/api/profiles'
import type { Profile } from '@/types/profile'
import { loadSelectedProfileId, saveSelectedProfileId } from '@/lib/profile-storage'
import OptionPill from './OptionPill'

interface ProfileSelectorProps {
  /** 선택이 바뀔 때마다 profile_id를 전달받고 싶으면 지정 */
  onChange?: (profileId: string) => void
}

// GET /api/profiles 목록을 불러와 선택하게 하는 컴포넌트.
// 선택값은 localStorage(sw:selected-profile-id)에 저장되어 챗봇/경로 페이지에서 공용으로 쓰인다.
export default function ProfileSelector({ onChange }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 로컬 저장값 불러오기
    setSelectedId(loadSelectedProfileId())

    getProfiles()
      .then(setProfiles)
      .catch(() => setError('프로필 목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (profileId: string) => {
    setSelectedId(profileId)
    saveSelectedProfileId(profileId)
    onChange?.(profileId)
  }

  if (loading) {
    return <p className="text-sm text-slate-400">프로필 불러오는 중...</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  if (profiles.length === 0) {
    return <p className="text-sm text-slate-400">등록된 프로필이 없습니다.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {profiles.map((profile) => (
        <OptionPill
          key={profile.id}
          label={typeof profile.name === 'string' ? profile.name : profile.id}
          selected={selectedId === profile.id}
          onClick={() => handleSelect(profile.id)}
        />
      ))}
    </div>
  )
}
