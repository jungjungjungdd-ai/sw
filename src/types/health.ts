// GET /api/health 응답
// naver_directions 등 외부 API 설정 여부를 포함. 명세에 전체 필드가
// 확정되어 있지 않아 확장 가능한 형태로 정의.
export interface HealthStatus {
  status: string
  naver_directions: {
    configured: boolean
    [key: string]: unknown
  }
  [key: string]: unknown
}
