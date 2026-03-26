import styled from 'styled-components';

export const TopBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
`;

export const Eyebrow = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const MainTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-strong);
`;

export const Subtitle = styled.p`
  margin: 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

export const TopStats = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const HeaderPill = styled.div<{ $tone?: 'blue' | 'green' | 'amber' | 'red' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone = 'blue' }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.28)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.28)';
        case 'red':
          return 'rgba(255, 105, 119, 0.28)';
        default:
          return 'rgba(91, 156, 255, 0.32)';
      }
    }};
  background:
    ${({ $tone = 'blue' }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.12)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.12)';
        case 'red':
          return 'rgba(255, 105, 119, 0.12)';
        default:
          return 'rgba(91, 156, 255, 0.14)';
      }
    }};
  font-size: 16px;
  font-weight: 600;
  color: var(--text-strong);
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--blue);
  box-shadow: 0 0 16px rgba(91, 156, 255, 0.78);
`;
