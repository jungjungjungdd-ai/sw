import type { ConfidenceStatus } from './common'

// GET /api/places, GET /api/places/{place_id}
// status/confidence/overlap_sources/evidence_json은 "남은 구현" 항목이라
// 백엔드 확정 전까지 optional로 둔다.
export interface Place {
  id: string
  name: string
  category?: string
  lat?: number
  lng?: number
  status?: ConfidenceStatus
  confidence?: number
  overlap_sources?: string[]
  evidence_json?: Record<string, unknown>
  [key: string]: unknown
}

export interface PlaceListQuery {
  category?: string
  q?: string
}

// POST /api/places/{place_id}/score
export interface PlaceScoreRequest {
  profile_id: string
  [key: string]: unknown
}

export interface PlaceScoreResult {
  place_id: string
  score: number
  [key: string]: unknown
}

// POST /api/places/batch/scores
export interface PlaceBatchScoreRequest {
  profile_id: string
  place_ids: string[]
  [key: string]: unknown
}

export interface PlaceBatchScoreResult {
  results: PlaceScoreResult[]
}
