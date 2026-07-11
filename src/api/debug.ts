import apiClient from './client'
import type {
  RoutePreviewRequest,
  RoutePreviewResponse,
} from '../types/debug'

export const previewRoute = (body: RoutePreviewRequest) =>
  apiClient
    .post<RoutePreviewResponse>('/api/debug/routes/preview', body)
    .then((res) => res.data)
