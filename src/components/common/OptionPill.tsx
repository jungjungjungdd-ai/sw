'use client'

interface OptionPillProps {
  label: string
  selected: boolean
  onClick: () => void
}

// 온보딩 화면의 단일/다중 선택 알약(pill) 버튼. 선택 시 초록색으로 채워짐.
export default function OptionPill({ label, selected, onClick }: OptionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        selected
          ? 'border-emerald-600 bg-emerald-600 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
      }`}
    >
      {label}
    </button>
  )
}
