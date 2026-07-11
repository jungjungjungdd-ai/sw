import type { CourseCandidateRouteFields } from './common'

// POST /api/trips/plan
export interface TripPlanRequest {
  profile_id: string
  request_text: string
  origin_lat?: number
  origin_lng?: number
  [key: string]: unknown
}

// 직접 경로 프롬프트인 경우 origin/destination/route_points/route_debug 포함
export interface Trip extends Partial<CourseCandidateRouteFields> {
  id: string
  [key: string]: unknown
}

// POST /api/trips/{trip_id}/replan
export interface TripReplanRequest {
  issue_text: string
  [key: string]: unknown
}
