'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { config } from '@/config'
import type { GeoPoint } from '@/types/common'

// 시흥시 기본 좌표 (명세의 정적 위치 후보 kpu 인근)
const DEFAULT_CENTER: GeoPoint = { lat: 37.3439, lng: 126.7364 }

interface NaverMapProps {
  origin?: GeoPoint | null
  destination?: GeoPoint | null
  routePoints?: GeoPoint[]
  height?: number
  /** true면 부모 컨테이너를 꽉 채우고(h-full) 테두리/둥근 모서리 없이 렌더링 */
  fullBleed?: boolean
}

export default function NaverMap({
  origin,
  destination,
  routePoints = [],
  height = 400,
  fullBleed = false,
}: NaverMapProps) {
  const mapElRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<naver.maps.Map | null>(null)
  const overlaysRef = useRef<Array<naver.maps.Marker | naver.maps.Polyline>>([])
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    if (!sdkLoaded || !mapElRef.current || !window.naver) return

    const center = origin ?? DEFAULT_CENTER

    if (!mapRef.current) {
      mapRef.current = new window.naver.maps.Map(mapElRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 15,
      })
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null))
    overlaysRef.current = []

    const centerLatLng = new window.naver.maps.LatLng(center.lat, center.lng)
    const bounds = new window.naver.maps.LatLngBounds(centerLatLng, centerLatLng)
    let hasPoint = false

    if (origin) {
      const position = new window.naver.maps.LatLng(origin.lat, origin.lng)
      const marker = new window.naver.maps.Marker({
        position,
        map: mapRef.current,
        title: '출발지',
      })
      overlaysRef.current.push(marker)
      bounds.extend(position)
      hasPoint = true
    }

    if (destination) {
      const position = new window.naver.maps.LatLng(
        destination.lat,
        destination.lng,
      )
      const marker = new window.naver.maps.Marker({
        position,
        map: mapRef.current,
        title: '도착지',
      })
      overlaysRef.current.push(marker)
      bounds.extend(position)
      hasPoint = true
    }

    if (routePoints.length > 0) {
      const path = routePoints.map(
        (p) => new window.naver!.maps.LatLng(p.lat, p.lng),
      )
      const polyline = new window.naver.maps.Polyline({
        map: mapRef.current,
        path,
        strokeColor: '#0f172a',
        strokeWeight: 4,
      })
      overlaysRef.current.push(polyline)
      path.forEach((p) => bounds.extend(p))
      hasPoint = true
    }

    if (hasPoint) {
      mapRef.current.fitBounds(bounds)
    } else {
      mapRef.current.setCenter(centerLatLng)
    }
  }, [sdkLoaded, origin, destination, routePoints])

  const placeholderClassName = fullBleed
    ? 'flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400'
    : 'flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400'
  const placeholderStyle = fullBleed ? undefined : { height }

  if (config.disableNaverMap) {
    return (
      <div className={placeholderClassName} style={placeholderStyle}>
        지도 비활성화됨 (NEXT_PUBLIC_DISABLE_NAVER_MAP=true)
      </div>
    )
  }

  if (!config.naverMapKeyId) {
    return (
      <div className={placeholderClassName} style={placeholderStyle}>
        NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID가 설정되지 않았습니다
      </div>
    )
  }

  const mapDivClassName = fullBleed
    ? 'h-full w-full'
    : 'w-full rounded-lg border border-slate-200'
  const mapDivStyle = fullBleed ? undefined : { height }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${config.naverMapKeyId}`}
        strategy="afterInteractive"
        onReady={() => setSdkLoaded(true)}
        onError={() => console.error('네이버 지도 SDK 로드 실패')}
      />
      <div ref={mapElRef} style={mapDivStyle} className={mapDivClassName} />
    </>
  )
}
