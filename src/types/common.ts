// API 명세 "공통 응답 모델" 기준

export interface GeoPoint {
  lat: number
  lng: number
}

export interface RouteEndpoint {
  id: string
  name: string
  lat: number
  lng: number
  role: 'origin' | 'destination'
  source: string
}

export interface RouteDebug {
  provider:
    | 'tmap_pedestrian'
    | 'graphhopper'
    | 'osrm'
    | 'walkable_astar_fallback'
    | 'naver_directions'
    | string
  status: 'success' | 'failed' | string
  requested_start: string
  requested_goal: string
  requested_waypoints: string[]
  naver_called: boolean
  tmap_called: boolean
  graphhopper_called: boolean
  osrm_called: boolean
  fallback_used: boolean
  message: string
}

/**
 * 신뢰도 기준 표 기반 status.
 * public_overlap: 2개 이상 공공/POI 출처 겹침
 * poi_only: 지도 POI 단독
 * public_only: 관광공사 단독
 * conflict: 값 충돌
 */
export type ConfidenceStatus =
  | 'public_overlap'
  | 'poi_only'
  | 'public_only'
  | 'conflict'

// CourseCandidate의 origin/destination/route_points/route_debug 확장 필드.
// 기본 CourseCandidate 필드(코스 id, 장소 목록 등)는 명세에 명시되지 않아
// 백엔드 확정 시 추가 필요.
export interface CourseCandidateRouteFields {
  origin: RouteEndpoint | null
  destination: RouteEndpoint | null
  route_points: GeoPoint[]
  route_debug: RouteDebug | null
}

export interface CourseCandidate extends CourseCandidateRouteFields {
  [key: string]: unknown
}
