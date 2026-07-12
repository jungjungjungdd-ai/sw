import type { Trip } from '@/types/trip'

// 백엔드에 "코스 저장/즐겨찾기" 전용 API가 아직 없어서(설계서에 없음),
// 우선 로컬(localStorage)에 저장한다. 최근 목록/즐겨찾기 코스·장소 모두 동일 패턴.
// 처음 실행 시 화면이 완전히 비어 보이지 않도록 디자인 시안과 맞춘 예시 데이터를 시드로 넣어두되,
// 실제로 코스를 생성/저장하면 그 데이터가 목록 맨 앞에 쌓인다.

export interface SavedCourse {
  id: string
  title: string
  requestText?: string
  summary?: string
  durationMinutes?: number
  distanceM?: number
  stepNames: string[]
  trip?: Trip
  savedAt: number
}

export interface SavedPlace {
  id: string
  name: string
  category?: string
  distanceLabel?: string
  rating?: number
  savedAt: number
}

const RECENT_COURSE_KEY = 'sw:recent-courses'
const FAVORITE_COURSE_KEY = 'sw:favorite-courses'
const FAVORITE_PLACE_KEY = 'sw:favorite-places'

const DEMO_RECENT_COURSES: SavedCourse[] = [
  {
    id: 'demo-recent-1',
    title: '한강 나들이 계획',
    stepNames: ['여의나루역', '여의도한강공원', '물빛광장', '더현대 서울'],
    durationMinutes: 200,
    distanceM: 2800,
    savedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'demo-recent-2',
    title: '서울 공연 외출 코스',
    stepNames: [],
    durationMinutes: 65,
    savedAt: Date.now() - 1000 * 60 * 60 * 20,
  },
  {
    id: 'demo-recent-3',
    title: '화장실이 있는 코스',
    stepNames: [],
    savedAt: Date.now() - 1000 * 60 * 60 * 10,
  },
]

const DEMO_FAVORITE_COURSES: SavedCourse[] = [
  {
    id: 'demo-fav-1',
    title: '한강 나들이 코스',
    stepNames: ['여의나루역', '여의도한강공원', '물빛광장', '더현대 서울'],
    durationMinutes: 80,
    distanceM: 2800,
    savedAt: Date.now(),
  },
  {
    id: 'demo-fav-2',
    title: '서울 공연 외출 코스',
    stepNames: [],
    durationMinutes: 65,
    savedAt: Date.now(),
  },
  {
    id: 'demo-fav-3',
    title: '한국공학대학교 정왕1동',
    stepNames: [],
    savedAt: Date.now(),
  },
]

const DEMO_FAVORITE_PLACES: SavedPlace[] = [
  {
    id: 'demo-place-1',
    name: '모퉁이 카페',
    category: '카페',
    distanceLabel: '320m',
    rating: 4.7,
    savedAt: Date.now(),
  },
]

function loadList<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      window.localStorage.setItem(key, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw) as T[]
  } catch {
    return seed
  }
}

function saveList<T>(key: string, list: T[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(list))
}

export function loadRecentCourses(): SavedCourse[] {
  return loadList(RECENT_COURSE_KEY, DEMO_RECENT_COURSES)
}

export function addRecentCourse(course: SavedCourse): void {
  const list = [
    course,
    ...loadRecentCourses().filter((c) => c.id !== course.id),
  ].slice(0, 10)
  saveList(RECENT_COURSE_KEY, list)
}

export function loadFavoriteCourses(): SavedCourse[] {
  return loadList(FAVORITE_COURSE_KEY, DEMO_FAVORITE_COURSES)
}

export function isFavoriteCourse(id: string): boolean {
  return loadFavoriteCourses().some((c) => c.id === id)
}

export function toggleFavoriteCourse(course: SavedCourse): boolean {
  const list = loadFavoriteCourses()
  const exists = list.some((c) => c.id === course.id)
  const next = exists
    ? list.filter((c) => c.id !== course.id)
    : [course, ...list]
  saveList(FAVORITE_COURSE_KEY, next)
  return !exists
}

export function getSavedCourse(id: string): SavedCourse | null {
  return (
    loadFavoriteCourses().find((c) => c.id === id) ??
    loadRecentCourses().find((c) => c.id === id) ??
    null
  )
}

export function loadFavoritePlaces(): SavedPlace[] {
  return loadList(FAVORITE_PLACE_KEY, DEMO_FAVORITE_PLACES)
}

export function isFavoritePlace(id: string): boolean {
  return loadFavoritePlaces().some((p) => p.id === id)
}

export function toggleFavoritePlace(
  place: Pick<SavedPlace, 'id' | 'name' | 'category'>,
): boolean {
  const list = loadFavoritePlaces()
  const exists = list.some((p) => p.id === place.id)
  const next = exists
    ? list.filter((p) => p.id !== place.id)
    : [{ ...place, savedAt: Date.now() }, ...list]
  saveList(FAVORITE_PLACE_KEY, next)
  return !exists
}
