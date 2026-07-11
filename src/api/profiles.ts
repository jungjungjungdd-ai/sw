import apiClient from './client'
import type { Profile } from '../types/profile'

export const getProfiles = () =>
  apiClient.get<Profile[]>('/api/profiles').then((res) => res.data)

export const getProfile = (profileId: string) =>
  apiClient
    .get<Profile>(`/api/profiles/${profileId}`)
    .then((res) => res.data)
