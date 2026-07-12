import type { GeoPoint } from '@/types/common'
import type { TripCourse } from '@/types/trip'

export interface CourseStep {
  name: string
  note?: string
  lat?: number
  lng?: number
  walkMinutes?: number
}

function pickName(item: unknown, fallback: string): string {
  if (!item || typeof item !== 'object') return fallback
  const obj = item as Record<string, unknown>
  const candidates = ['name', 'place_name', 'title', 'label']
  for (const key of candidates) {
    const v = obj[key]
    if (typeof v === 'string' && v) return v
  }
  return fallback
}

function pickArray(course: TripCourse): unknown[] | null {
  const keys = ['stops', 'steps', 'places', 'waypoints', 'course_places']
  for (const key of keys) {
    const v = (course as Record<string, unknown>)[key]
    if (Array.isArray(v) && v.length > 0) return v
  }
  return null
}

// 실제 코스 후보(courses[])에 이름 붙은 경유지 배열이 있으면 그걸 쓰고,
// 없으면 origin/destination 두 지점만이라도 타임라인으로 보여준다.
export function buildCourseSteps(
  course: TripCourse | undefined | null,
): CourseStep[] {
  if (!course) return []

  const arr = pickArray(course)
  if (arr) {
    return arr.map((item, i) => {
      const obj = (item && typeof item === 'object' ? item : {}) as Record<
        string,
        unknown
      >
      return {
        name: pickName(item, `지점 ${i + 1}`),
        note:
          typeof obj.note === 'string'
            ? obj.note
            : typeof obj.description === 'string'
              ? obj.description
              : undefined,
        lat: typeof obj.lat === 'number' ? obj.lat : undefined,
        lng: typeof obj.lng === 'number' ? obj.lng : undefined,
        walkMinutes:
          typeof obj.walk_minutes === 'number' ? obj.walk_minutes : undefined,
      }
    })
  }

  const steps: CourseStep[] = []
  if (course.origin) {
    steps.push({
      name: course.origin.name || '출발지',
      lat: course.origin.lat,
      lng: course.origin.lng,
    })
  }
  if (course.destination) {
    steps.push({
      name: course.destination.name || '도착지',
      lat: course.destination.lat,
      lng: course.destination.lng,
    })
  }
  return steps
}

function haversineM(a: GeoPoint, b: GeoPoint): number {
  const R = 6371000
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function estimateDistanceM(routePoints: GeoPoint[]): number {
  let total = 0
  for (let i = 1; i < routePoints.length; i++) {
    total += haversineM(routePoints[i - 1], routePoints[i])
  }
  return Math.round(total)
}

// 도보 속도 약 60m/분(휠체어 이용 고려해 다소 느리게) 가정한 추정치.
export function estimateWalkMinutes(distanceM: number): number {
  return Math.max(1, Math.round(distanceM / 60))
}

// route_points 기반 추정 전에, 백엔드가 이미 계산한 거리 필드가 있으면 그걸 우선 사용한다.
export function resolveDistanceM(course: TripCourse | undefined): number | undefined {
  if (!course) return undefined
  const obj = course as Record<string, unknown>
  for (const key of ['distance_m', 'total_distance_m']) {
    const v = obj[key]
    if (typeof v === 'number') return Math.round(v)
  }
  const points = course.route_points
  return Array.isArray(points) && points.length > 1
    ? estimateDistanceM(points)
    : undefined
}

export function resolveDurationMinutes(
  course: TripCourse | undefined,
  distanceM?: number,
): number | undefined {
  if (!course) return distanceM !== undefined ? estimateWalkMinutes(distanceM) : undefined
  const obj = course as Record<string, unknown>
  for (const key of ['duration_minutes', 'total_duration_min', 'estimated_minutes']) {
    const v = obj[key]
    if (typeof v === 'number') return Math.round(v)
  }
  for (const key of ['duration_s', 'total_duration_s']) {
    const v = obj[key]
    if (typeof v === 'number') return Math.round(v / 60)
  }
  return distanceM !== undefined ? estimateWalkMinutes(distanceM) : undefined
}

export function formatDurationMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h > 0) return `${h}시간 ${m}분`
  return `${m}분`
}
