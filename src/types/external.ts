import type { GeoPoint } from './common'

export interface ExternalStatus {
  configured: boolean
  [key: string]: unknown
}

export interface TourNearbyQuery {
  lat: number
  lng: number
}

export interface TourSearchQuery {
  keyword: string
}

// POST /api/external/routes/estimate
// 로컬 확인 명령 예시 기준 실제 요청 바디:
// { "points": [{lat,lng}, {lat,lng}], "option": "trafast" }
export interface RouteEstimateRequest {
  points: GeoPoint[]
  option?: 'trafast' | 'tracomfort' | 'traoptimal' | string
  [key: string]: unknown
}

export interface RouteEstimateResult {
  distance_m?: number
  duration_s?: number
  [key: string]: unknown
}
