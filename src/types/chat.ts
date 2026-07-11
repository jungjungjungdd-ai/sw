// POST /api/chat/turn
export interface ChatTurnRequest {
  profile_id: string
  message: string
  origin_lat?: number
  origin_lng?: number
  correction_place_id?: string | null
  correction_text?: string | null
}

// 응답 필드는 명세에 명시되지 않아 확정 시 갱신 필요
export interface ChatTurnResponse {
  reply: string
  [key: string]: unknown
}
