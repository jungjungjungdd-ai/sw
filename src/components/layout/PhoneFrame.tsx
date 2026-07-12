import type { ReactNode } from 'react'

// 데스크톱 브라우저(발표/심사용)에서는 실제 휴대폰처럼 보이도록 프레임(테두리+노치)을 씌우고,
// 실제 모바일 화면(가로폭 640px 미만, Tailwind `sm` 미만)에서는 프레임 없이 화면을 꽉 채운다.
// `transform`을 줘서 이 div를 하위 `position: fixed` 요소의 containing block으로 만들어,
// 데스크톱에서도 SearchPage 같은 전체화면 오버레이가 브라우저 전체가 아니라 폰 프레임 안에만 딱 맞게 표시되게 한다.
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-slate-950 sm:flex sm:items-center sm:justify-center sm:p-6">
      <div
        className="relative h-screen w-full overflow-hidden bg-white sm:h-[844px] sm:w-[390px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-slate-900 sm:shadow-2xl"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 z-50 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900 sm:block" />
        <div className="h-full w-full overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
