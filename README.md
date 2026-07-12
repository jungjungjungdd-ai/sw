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
    map/        NaverMap — Naver Maps SDK 로드 + 마커/경로선 렌더링
  app/
    layout.tsx  루트 레이아웃 (PhoneFrame + Header 포함)
    page.tsx    홈 — /api/health 상태 표시
    onboarding/ 프로필(휠체어 종류/이동거리/컨디션/피하고 싶은 조건) 온보딩 폼 — 로컬(localStorage) 저장
    search/     지도 배경 + 음성/텍스트 목적지 입력 화면 → /trip?q=으로 이동
    chat/       /api/chat/turn 기반 간단 챗봇 UI
    places/     /api/places 목록/검색 + 신뢰도 배지
    trip/       /api/debug/routes/preview 기반 직접 경로 파싱 미리보기 + 지도(출발/도착 마커)
                /search에서 넘어온 ?q= 쿼리가 있으면 자동 실행
  config.ts     NEXT_PUBLIC_* 환경변수 접근 모듈
  lib/          onboarding-storage.ts 등 유틸
```

## 폰 프레임 (PhoneFrame)

디자인이 모바일 앱 목업이라, 데스크톱 브라우저(발표/심사용)에서는 `src/components/layout/PhoneFrame.tsx`가
휴대폰처럼 보이는 프레임(테두리+노치)을 씌운다. 실제 모바일 화면(Tailwind `sm` 미만, 640px 미만)에서는
프레임 없이 화면을 꽉 채운다. `search` 페이지처럼 `position: fixed`로 전체화면을 덮는 화면도
`transform` containing block 트릭 덕분에 데스크톱에서 폰 프레임 안에만 표시된다.

## Naver Map 연동

- `src/components/map/NaverMap.tsx`: `next/script`로 SDK를 로드하고(`ncpKeyId` 쿼리 파라미터 사용),
  `origin`/`destination`/`routePoints` props로 마커·폴리라인을 그린다.
- `NEXT_PUBLIC_DISABLE_NAVER_MAP=true`면 지도 대신 안내 문구만 표시한다.
- `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID`가 비어있으면 마찬가지로 안내 문구만 표시한다.
- `src/types/naver-maps.d.ts`에 SDK 전역(`window.naver.maps`) 최소 타입을 선언해뒀다 (공식 npm 타입 패키지가 없어 직접 선언).
- 현재 `/trip` 페이지는 `/api/debug/routes/preview` 응답 기준이라 출발/도착 마커만 표시한다.
  실제 경로선(`route_points`)은 `/api/trips/plan` 응답에만 포함되므로, 그 플로우를 붙일 때 `routePoints` prop을 채워주면 된다.

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

## 페이지 / 플로우

- `/` — 진입점. 로그인/온보딩 상태에 따라 `/login`, `/onboarding`, `/search`로 자동 리다이렉트
- `/login` — 목업 로그인 (아이디/비밀번호 입력하면 무조건 로그인 처리)
- `/onboarding` — 외출 조건 설정. 최초 1회만 노출(저장/건너뛰기 모두 완료 처리), 조건으로 profile_id 자동 매칭
- `/search` — 지도 배경 + 음성/텍스트 목적지 입력, 제출 시 `/result?q=`로 이동
- `/result` — `/api/trips/plan` 기반 실제 경로 결과 화면
- `/trip` — (디버그용) `/api/debug/routes/preview` 기반 직접 경로 파싱 미리보기
- `/status` — `/api/health` 상태 확인 (예전 홈 화면)
- `/chat` — `/api/chat/turn` 기반 간단 챗봇 UI
- `/places` — `/api/places` 목록/검색 + 신뢰도 배지

## 참고 — 명세의 "남은 구현" 항목

백엔드 쪽 미구현 항목이라 프론트에서도 아직 실데이터로 검증 불가:

- `places.status`에 `public_overlap` / `poi_only` / `conflict` 반영
- `overlap_sources`, `confidence`, `evidence_json` 저장 구조
- 장소 카드 배지(`겹침 3개`, `공공데이터`, `POI 단독`, `충돌`) — `StatusBadge` 컴포넌트로 뼈대만 구현해둠
- unknown 필드 "확인 필요" 표시 — `StatusBadge`가 status 없을 때 기본 처리
