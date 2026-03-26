'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: dark;
    --bg-0: #040b16;
    --bg-1: #071224;
    --bg-2: #0a1730;
    --surface-1: rgba(9, 21, 43, 0.94);
    --surface-2: rgba(11, 26, 52, 0.94);
    --surface-3: rgba(15, 34, 65, 0.88);
    --surface-4: rgba(18, 42, 81, 0.8);
    --line-soft: rgba(120, 151, 208, 0.16);
    --line-strong: rgba(85, 139, 255, 0.26);
    --text-strong: #f5f8ff;
    --text-primary: #dfe8ff;
    --text-secondary: #9cb1da;
    --text-muted: #7086b3;
    --blue: #4f90ff;
    --blue-soft: rgba(79, 144, 255, 0.14);
    --green: #27d17e;
    --green-soft: rgba(39, 209, 126, 0.14);
    --amber: #f5aa2d;
    --amber-soft: rgba(245, 170, 45, 0.14);
    --red: #f45f74;
    --red-soft: rgba(244, 95, 116, 0.14);
    --shadow-panel: 0 26px 72px rgba(0, 0, 0, 0.34);
    --shadow-soft: 0 12px 28px rgba(0, 0, 0, 0.18);
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
      radial-gradient(circle at 0% 0%, rgba(66, 113, 210, 0.16) 0%, rgba(66, 113, 210, 0) 28%),
      radial-gradient(circle at 100% 0%, rgba(16, 41, 88, 0.26) 0%, rgba(16, 41, 88, 0) 34%),
      linear-gradient(180deg, #07111f 0%, #040c17 48%, #020812 100%);
    color: var(--text-strong);
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
    border-radius: 999px;
    background: rgba(121, 145, 198, 0.32);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(121, 145, 198, 0.44);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export default GlobalStyle;
