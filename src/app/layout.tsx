import type { Metadata } from 'next'
import './globals.css'
<<<<<<< HEAD
import PhoneFrame from '@/components/layout/PhoneFrame'
import AppChrome from '@/components/layout/AppChrome'
=======
import Header from '@/components/layout/Header'
import PhoneFrame from '@/components/layout/PhoneFrame'
>>>>>>> f245eea693640518399e0044f04d59336a691b24

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
      <body className="antialiased">
        <PhoneFrame>
<<<<<<< HEAD
          <AppChrome>{children}</AppChrome>
=======
          <div className="min-h-full bg-slate-50">
            <Header />
            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          </div>
>>>>>>> f245eea693640518399e0044f04d59336a691b24
        </PhoneFrame>
      </body>
    </html>
  )
}
