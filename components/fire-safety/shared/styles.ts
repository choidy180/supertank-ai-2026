import styled, { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`

  :root {
    color-scheme: dark;
    --bg: #06101f;
    --surface-1: rgba(12, 23, 44, 0.96);
    --surface-2: rgba(16, 31, 58, 0.92);
    --surface-3: rgba(20, 39, 72, 0.86);
    --surface-4: rgba(24, 46, 85, 0.74);
    --border-soft: rgba(139, 160, 204, 0.14);
    --border-strong: rgba(100, 149, 255, 0.28);
    --text-strong: #f5f8ff;
    --text-primary: #dce6fb;
    --text-secondary: #9fb2d9;
    --text-muted: #7f95c2;
    --blue: #5b9cff;
    --blue-soft: rgba(91, 156, 255, 0.14);
    --green: #2fd184;
    --green-soft: rgba(47, 209, 132, 0.12);
    --amber: #ffbe57;
    --amber-soft: rgba(255, 190, 87, 0.12);
    --red: #ff6977;
    --red-soft: rgba(255, 105, 119, 0.12);
    --shadow-lg: 0 24px 68px rgba(0, 0, 0, 0.34);
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
      radial-gradient(circle at 0% 0%, rgba(59, 96, 170, 0.18) 0%, rgba(59, 96, 170, 0) 30%),
      radial-gradient(circle at 100% 0%, rgba(28, 54, 102, 0.22) 0%, rgba(28, 54, 102, 0) 34%),
      linear-gradient(180deg, #091326 0%, #08101f 38%, #050b16 100%);
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
    background: rgba(132, 155, 202, 0.34);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(132, 155, 202, 0.48);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

export const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

export const PageShell = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: 24px;
  overflow: hidden;
`;

export const AppFrame = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  min-height: 0;
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 360px;
  gap: 18px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1400px) {
    grid-template-columns: 280px minmax(0, 1fr) 340px;
  }
`;

export const Column = styled.div`
  min-height: 0;
  display: grid;
  gap: 18px;
`;

export const LeftColumn = styled(Column)`
  grid-template-rows: auto auto minmax(0, 1fr);
`;

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
  border-radius: 26px;
  border: 1px solid var(--border-soft);
  background:
    linear-gradient(180deg, rgba(13, 24, 46, 0.95) 0%, rgba(10, 18, 36, 0.95) 100%);
  box-shadow:
    var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(14px);
  overflow: hidden;
`;

export const CenterPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 14px;
`;

export const RightPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

export const PanelCaption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;
