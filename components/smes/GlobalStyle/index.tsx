import { createGlobalStyle } from 'styled-components';

const StyledGlobal = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: light;
    --page-bg: #d3dae3;
    --window-bg: #e7ebf0;
    --chrome-bg: linear-gradient(180deg, #f2f4f7 0%, #d7dde6 100%);
    --line: #bac4cf;
    --line-strong: #8f9cad;
    --panel-bg: linear-gradient(180deg, #f6f8fb 0%, #eef2f6 100%);
    --panel-head-bg: linear-gradient(180deg, #f8fafc 0%, #e9eef5 100%);
    --dark-card: linear-gradient(180deg, #07111f 0%, #030a14 100%);
    --dark-card-2: linear-gradient(180deg, #0a1424 0%, #040b16 100%);
    --navy: #071325;
    --navy-soft: #13233d;
    --blue: #2c66ff;
    --cyan: #63b4ff;
    --green: #40ff6a;
    --yellow: #ffe458;
    --orange: #ffbf3f;
    --red: #ef2a2a;
    --white: #ffffff;
    --text-strong: #182537;
    --text-primary: #2f3b4f;
    --text-secondary: #5e6a7d;
    --text-muted: #8290a5;
    --shadow-lg: 0 18px 40px rgba(34, 50, 74, 0.12);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: var(--page-bg);
    color: var(--text-strong);
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  button,
  input,
  select,
  textarea {
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
    background: rgba(122, 136, 158, 0.35);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 124, 148, 0.52);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export default function GlobalStyle() {
  return <StyledGlobal />;
}
