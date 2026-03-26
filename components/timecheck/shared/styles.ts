import styled, { css, keyframes } from 'styled-components';

export const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(74, 140, 255, 0.18);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 14px rgba(74, 140, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(74, 140, 255, 0);
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
  box-sizing: border-box;
  min-height: 100vh;
  max-height: 100vh;
  padding: 28px;
  background:
    radial-gradient(circle at 0% 0%, rgba(58, 96, 168, 0.22) 0%, rgba(58, 96, 168, 0) 30%),
    radial-gradient(circle at 100% 0%, rgba(26, 52, 98, 0.28) 0%, rgba(26, 52, 98, 0) 34%),
    linear-gradient(180deg, #091326 0%, #08101f 40%, #050b16 100%);
  color: #f5f7ff;
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr) 440px;
  gap: 20px;
  min-height: calc(100vh - 164px);

  @media (max-width: 1380px) {
    grid-template-columns: 320px minmax(0, 1fr) 360px;
  }
`;

export const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  max-height: calc(100vh - 130px);
`;

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: calc(100vh - 130px);
  padding: 22px;
  border-radius: 26px;
  border: 1px solid rgba(133, 154, 194, 0.16);
  background:
    linear-gradient(180deg, rgba(13, 24, 46, 0.94) 0%, rgba(10, 18, 36, 0.94) 100%);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
`;

export const CenterPanel = styled(Panel)`
  overflow: hidden;
`;

export const RightPanel = styled(Panel)`
  overflow: hidden;
`;

export const PanelTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  overflow: hidden;
`;

export const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

export const PanelCaption = styled.p`
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  color: #c7ecee;
`;
