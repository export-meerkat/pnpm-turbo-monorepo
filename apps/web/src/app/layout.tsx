import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Export Meerkat Labs',
  description: '모노레포 환경 기반의 웹기술 테스트 공간',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/*
        antialiased 클래스는 글꼴 픽셀을 부드럽게 다듬어주며,
        min-h-screen 구조를 통해 본문이 찌그러지지 않는 와이드 스크롤의 최소 높이를 확보합니다.
      */}
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
