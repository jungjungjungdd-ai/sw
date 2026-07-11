import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: '접근성 경로 추천',
  description:
    '관광공사, 전국/경기도 장애인편의시설 데이터, 지도 POI를 결합한 접근성 경로 추천 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
