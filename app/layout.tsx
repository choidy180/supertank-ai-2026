"use client";

import StyledComponentsRegistry from "@/lib/registry";
import { createGlobalStyle } from "styled-components";

// 브라우저 기본 여백 제거 및 기본 폰트 설정
const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    /* 원하는 웹 폰트가 있다면 여기에 추가하세요 (예: Pretendard) */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background-color: #111111;
  }

  * {
    box-sizing: border-box;
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}