import type { ConfidenceStatus } from '../../types/common'

// 신뢰도 기준 표 기반 배지. "남은 구현" 항목(겹침 3개/공공데이터/POI 단독/충돌)의
// 뼈대만 우선 구현. 실제 문구/색상은 디자인 확정 후 조정.
const LABELS: Record<ConfidenceStatus, string> = {
  public_overlap: '공공데이터 겹침',
  public_only: '공공데이터',
  poi_only: 'POI 단독',
  conflict: '확인 필요 (충돌)',
}

const STYLES: Record<ConfidenceStatus, string> = {
  public_overlap: 'bg-emerald-100 text-emerald-800',
  public_only: 'bg-sky-100 text-sky-800',
  poi_only: 'bg-slate-100 text-slate-700',
  conflict: 'bg-amber-100 text-amber-800',
}

interface StatusBadgeProps {
  status?: ConfidenceStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
        확인 필요
      </span>
    )
  }

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  )
}
