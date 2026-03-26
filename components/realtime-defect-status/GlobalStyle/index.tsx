'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: dark;
    --bg: #040b18;
    --surface-page: rgba(5, 14, 31, 0.96);
    --surface-panel: rgba(8, 18, 39, 0.96);
    --surface-panel-soft: rgba(12, 24, 49, 0.9);
    --surface-card: rgba(16, 31, 61, 0.72);
    --surface-card-strong: rgba(18, 37, 72, 0.92);
    --border-soft: rgba(113, 143, 199, 0.16);
    --border-strong: rgba(79, 143, 255, 0.28);
    --text-strong: #f4f7ff;
    --text-primary: #d7e4ff;
    --text-secondary: #97abd4;
    --text-muted: #6e87b7;
    --blue: #4e8fff;
    --blue-soft: rgba(78, 143, 255, 0.14);
    --cyan: #56d4ff;
    --cyan-soft: rgba(86, 212, 255, 0.14);
    --green: #2fd698;
    --green-soft: rgba(47, 214, 152, 0.14);
    --amber: #ffba55;
    --amber-soft: rgba(255, 186, 85, 0.14);
    --red: #ff6b86;
    --red-soft: rgba(255, 107, 134, 0.14);
    --shadow-lg: 0 24px 72px rgba(0, 0, 0, 0.38);
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
      radial-gradient(circle at 0% 0%, rgba(45, 84, 166, 0.22) 0%, rgba(45, 84, 166, 0) 28%),
      radial-gradient(circle at 100% 0%, rgba(17, 42, 86, 0.3) 0%, rgba(17, 42, 86, 0) 34%),
      linear-gradient(180deg, #07111f 0%, #040c17 46%, #020812 100%);
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
    background: rgba(126, 149, 197, 0.34);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(126, 149, 197, 0.48);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export default GlobalStyle;
