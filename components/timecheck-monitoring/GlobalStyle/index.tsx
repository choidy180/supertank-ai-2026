'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: dark;
    --monitor-bg: #040c1c;
    --monitor-bg-2: #07162f;
    --monitor-panel: rgba(8, 20, 46, 0.94);
    --monitor-panel-2: rgba(11, 27, 60, 0.94);
    --monitor-panel-3: rgba(17, 38, 79, 0.9);
    --monitor-panel-soft: rgba(18, 41, 88, 0.74);
    --monitor-glass: rgba(15, 33, 72, 0.66);
    --monitor-line: rgba(116, 150, 225, 0.18);
    --monitor-line-strong: rgba(97, 153, 255, 0.4);
    --monitor-blue: #62a3ff;
    --monitor-blue-soft: rgba(98, 163, 255, 0.16);
    --monitor-cyan: #6ad6ff;
    --monitor-green: #2fdc96;
    --monitor-green-soft: rgba(47, 220, 150, 0.14);
    --monitor-amber: #ffc542;
    --monitor-amber-soft: rgba(255, 197, 66, 0.14);
    --monitor-red: #ff6a7a;
    --monitor-red-soft: rgba(255, 106, 122, 0.14);
    --monitor-white: #f7faff;
    --monitor-text: #dfe9ff;
    --monitor-text-secondary: #97abd8;
    --monitor-text-muted: #6e86b7;
    --monitor-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background:
      radial-gradient(circle at 0% 0%, rgba(40, 91, 198, 0.18) 0%, rgba(40, 91, 198, 0) 28%),
      radial-gradient(circle at 100% 0%, rgba(27, 69, 158, 0.2) 0%, rgba(27, 69, 158, 0) 30%),
      linear-gradient(180deg, #071226 0%, #040c1d 42%, #020710 100%);
    color: var(--monitor-white);
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    overflow: hidden;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(112, 143, 214, 0.3);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(112, 143, 214, 0.44);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export default GlobalStyle;
