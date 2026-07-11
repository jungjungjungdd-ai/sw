import apiClient from './client'
import type { HealthStatus } from '../types/health'

export const getHealth = () =>
  apiClient.get<HealthStatus>('/api/health').then((res) => res.data)
