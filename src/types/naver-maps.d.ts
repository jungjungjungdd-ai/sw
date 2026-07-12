export {}

// NAVER Maps API v3 (전역 스크립트 로드) 사용에 필요한 최소 타입 선언.
// 전체 API는 https://navermaps.github.io/maps.js.ncp/docs 참고
declare global {
  namespace naver.maps {
    class LatLng {
      constructor(lat: number, lng: number)
      lat(): number
      lng(): number
    }

    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng)
      extend(latlng: LatLng): void
    }

    interface MapOptions {
      center: LatLng
      zoom?: number
    }

    class Map {
      constructor(element: HTMLElement | string, options: MapOptions)
      fitBounds(bounds: LatLngBounds): void
      setCenter(latlng: LatLng): void
    }

    interface MarkerOptions {
      position: LatLng
      map?: Map
      title?: string
    }

    class Marker {
      constructor(options: MarkerOptions)
      getPosition(): LatLng
      setMap(map: Map | null): void
    }

    interface PolylineOptions {
      map?: Map
      path: LatLng[]
      strokeColor?: string
      strokeWeight?: number
    }

    class Polyline {
      constructor(options: PolylineOptions)
      setMap(map: Map | null): void
    }
  }

  interface Window {
    naver?: {
      maps: typeof naver.maps
    }
  }
}
