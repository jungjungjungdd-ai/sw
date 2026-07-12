import type { CourseCandidateRouteFields } from './common'

// POST /api/trips/plan
export interface TripPlanRequest {
  profile_id: string
  request_text: string
  origin_lat?: number
  origin_lng?: number
  [key: string]: unknown
}

// 실제 확인된 /api/trips/plan 응답 구조 (2026-07-12 기준).
// origin/destination/route_points는 최상위가 아니라 courses[] 각 항목 안에 있다.
export interface TripCourse extends Partial<CourseCandidateRouteFields> {
  [key: string]: unknown
}

export interface ParsedTripRequest {
  purpose?: string
  categories?: string[]
  wants_quiet?: boolean
  rain_or_snow?: boolean
  short_trip?: boolean
  wants_easy_route?: boolean
  needs_toilet?: boolean | null
  food_keywords?: string[]
  raw_conditions?: string[]
  allowed_modes?: string[]
  max_transfers?: number
  [key: string]: unknown
}

export interface AgentTraceStep {
  step: number
  tool: string
  status: string
  output: string
}

export interface TripModelInfo {
  parser?: string
  explainer?: string
  mode?: string
  tool_agent?: string
  [key: string]: unknown
}

export interface Trip {
  trip_id: string
  summary: string
  parsed_request?: ParsedTripRequest
  courses: TripCourse[]
  excluded_places?: unknown[]
  agent_trace?: AgentTraceStep[]
  model?: TripModelInfo
  [key: string]: unknown
}

// POST /api/trips/{trip_id}/replan
export interface TripReplanRequest {
  issue_text: string
  [key: string]: unknown
}