// GET /api/profiles, GET /api/profiles/{profile_id}
// 예: profile_id "power_basic"
export interface Profile {
  id: string
  name?: string
  [key: string]: unknown
}
