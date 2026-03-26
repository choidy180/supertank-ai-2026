import styled, { css } from 'styled-components';

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
  /* padding: 24px; */
  background: radial-gradient(circle at 0% 0%, rgba(58, 96, 168, 0.22) 0%, rgba(58, 96, 168, 0) 30%), radial-gradient(circle at 100% 0%, rgba(26, 52, 98, 0.28) 0%, rgba(26, 52, 98, 0) 34%), linear-gradient(180deg, #091326 0%, #08101f 40%, #050b16 100%);
  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }
`;

export const Frame = styled.div`
  min-height: 0;
`;

export const SurfacePanel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 22px;
  border: 1px solid var(--border-soft);
  /* background: linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%); */
  box-shadow: var(--shadow-lg);
`;

export const SectionCard = styled.div`
  padding: 18px;
  border-radius: 22px;
  border: 1px solid var(--border-soft);
  /* background: linear-gradient(180deg, var(--surface-2) 0%, var(--surface-3) 100%); */
`;
