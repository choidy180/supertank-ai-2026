import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* ✨ 다크 모드 명시 */
    color-scheme: dark;
    
    /* ✨ 깊고 세련된 다크 네이비 배경 */
    --bg: #0b132b;
    
    /* ✨ 표면(카드, 패널) 색상: 배경보다 살짝씩 밝아지는 계층 구조 */
    --surface-1: rgba(18, 32, 60, 0.94);
    --surface-2: rgba(24, 42, 77, 0.94);
    --surface-3: rgba(30, 50, 90, 0.94);
    --surface-4: rgba(38, 62, 110, 0.94);
    
    /* ✨ 테두리 색상: 다크 테마에 맞춰 은은하게 */
    --border-soft: rgba(133, 154, 194, 0.12);
    --border-strong: rgba(133, 154, 194, 0.24);
    
    /* ✨ 텍스트 색상: 가독성 극대화 */
    --text-strong: #ffffff;
    --text-primary: #f8fafc;
    --text-secondary: #9ab0da;
    --text-muted: #7f95c0;
    
    /* ✨ 포인트 컬러: 어두운 배경에서 확 눈에 띄는 형광/파스텔 톤으로 조정 */
    --navy: #4a8cff;
    --navy-soft: rgba(74, 140, 255, 0.15);
    
    --sky: #60a5fa;
    --sky-soft: rgba(96, 165, 250, 0.15);
    
    --teal: #2dd4bf;
    --teal-soft: rgba(45, 212, 191, 0.15);
    
    --gray: #64748b;
    --gray-soft: rgba(100, 116, 139, 0.2);
    
    /* ✨ 구분선 및 그림자 */
    --line: rgba(133, 154, 194, 0.18);
    --shadow-lg: 0 20px 60px rgba(0, 0, 0, 0.4);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: var(--bg);
    color: var(--text-strong);
    /* 폰트는 layout.tsx의 <link>에서 가져오므로 @import 생략 */
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

  /* ✨ 다크 테마에 맞춘 스크롤바 디자인 */
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(133, 154, 194, 0.2);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(133, 154, 194, 0.4);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export default GlobalStyle;