"use client";

import Sidebar from "@/components/Sidebar";
import StyledComponentsRegistry from "@/lib/registry";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    /* ✨ 웹 폰트(Pretendard)를 1순위로 적용되도록 추가했습니다 */
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background-color: #111111; /* 기존에 설정하신 다크 배경 */
    color: #ffffff;
  }

  * {
    box-sizing: border-box;
  }
`;

// 전체 화면을 좌우로 나누는 컨테이너
const AppContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

// 우측 실제 페이지 콘텐츠 영역
const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* 안쪽 여백은 필요에 따라 조절하세요 */
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* ✨ 외부 CSS나 폰트는 @import 대신 여기에 <link>로 넣어야 에러가 나지 않습니다 ✨ */}
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <AppContainer>
            {/* 만든 사이드바 컴포넌트 추가 */}
            <Sidebar /> 
            
            {/* 페이지 콘텐츠 */}
            <MainContent>
              {children}
            </MainContent>
          </AppContainer>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}