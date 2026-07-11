import type { RouteEndpoint, RouteDebug } from './common'

// POST /api/debug/routes/preview
export interface RoutePreviewRequest {
  profile_id: string
  request_text: string
  origin_lat?: number
  origin_lng?: number
}

export interface RoutePreviewResponse {
  request_text: string
  route_requested: boolean
  missing_fields: string[]
  origin: RouteEndpoint | null
  destination: RouteEndpoint | null
  route_debug: RouteDebug | null
}
