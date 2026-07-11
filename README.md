# sw

접근성 경로 추천 서비스 프론트엔드. Next.js(App Router) + TypeScript + Tailwind CSS.

## 시작하기

```bash
npm install
cp .env.example .env.local   # 팀에서 받은 값으로 채우기
npm run dev
```

## 스크립트

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run start` — 빌드 결과 실행
- `npm run lint` — eslint

## 환경 변수 (.env.example 참고)

Next.js는 `.env.local`을 로컬 개발용으로 사용한다 (`.gitignore`에 이미 포함됨).

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API base URL (기본 `http://127.0.0.1:8001`) |
| `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID` | Naver Map SDK 프론트 지도 렌더링용 키 (백엔드 Naver Directions 키와는 별개) |
| `NEXT_PUBLIC_DISABLE_NAVER_MAP` | `true`면 지도 렌더링 스킵 |
| `NEXT_PUBLIC_SHOW_ROUTE_DEBUG` | `true`면 `route_debug` 패널 노출 (경로 미리보기 페이지) |

`src/config.ts`에서 이 값들을 읽어 앱 전역에서 사용한다.

## 폴더 구조

```
src/
  api/          도메인별 API 함수 (health, profiles, places, trips, chat, external, debug)
  types/        API 명세 기반 TypeScript 타입
  components/
    layout/     Header (client component, usePathname 기반 active nav)
    common/     StatusBadge 등 공용 컴포넌트
  app/
    layout.tsx  루트 레이아웃 (Header 포함)
    page.tsx    홈 — /api/health 상태 표시
    chat/       /api/chat/turn 기반 간단 챗봇 UI
    places/     /api/places 목록/검색 + 신뢰도 배지
    trip/       /api/debug/routes/preview 기반 직접 경로 파싱 미리보기
  config.ts     NEXT_PUBLIC_* 환경변수 접근 모듈
```

## API 연동 현황

| 도메인 | 파일 | 엔드포인트 |
| --- | --- | --- |
| Health | `api/health.ts` | `GET /api/health` |
| Profiles | `api/profiles.ts` | `GET /api/profiles`, `GET /api/profiles/{id}` |
| Places | `api/places.ts` | `GET /api/places`, `GET /api/places/{id}`, `POST /api/places/{id}/score`, `POST /api/places/batch/scores` |
| Trips | `api/trips.ts` | `POST /api/trips/plan`, `GET /api/trips/{id}`, `POST /api/trips/{id}/replan` |
| Chat | `api/chat.ts` | `POST /api/chat/turn` |
| External | `api/external.ts` | `/api/external/tour/*`, `/api/external/routes/*` |
| Debug | `api/debug.ts` | `POST /api/debug/routes/preview` |

`RoutePreviewResponse`, `RouteEndpoint`, `RouteDebug`, `RouteEstimateRequest`(points/option)는 팀이 공유한
로컬 확인 명령 예시를 기준으로 타입화했다. 그 외 응답(Trip, ChatTurnResponse, Profile 등)은 명세에
전체 필드가 확정되지 않아 `[key: string]: unknown`으로 확장 가능하게 열어두었다 — 백엔드 확정되면 타입 갱신 필요.

## 참고 — 명세의 "남은 구현" 항목

백엔드 쪽 미구현 항목이라 프론트에서도 아직 실데이터로 검증 불가:

- `places.status`에 `public_overlap` / `poi_only` / `conflict` 반영
- `overlap_sources`, `confidence`, `evidence_json` 저장 구조
- 장소 카드 배지(`겹침 3개`, `공공데이터`, `POI 단독`, `충돌`) — `StatusBadge` 컴포넌트로 뼈대만 구현해둠
- unknown 필드 "확인 필요" 표시 — `StatusBadge`가 status 없을 때 기본 처리
