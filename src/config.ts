// 팀 공유 .env 값(NEXT_PUBLIC_*)을 그대로 사용
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8001',
  naverMapKeyId: process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID || '',
  disableNaverMap: process.env.NEXT_PUBLIC_DISABLE_NAVER_MAP === 'true',
  showRouteDebug: process.env.NEXT_PUBLIC_SHOW_ROUTE_DEBUG === 'true',
}
