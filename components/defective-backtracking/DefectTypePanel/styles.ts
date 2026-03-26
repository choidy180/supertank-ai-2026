import styled from 'styled-components';
import { SectionCard } from '../shared/styles';

export const PanelRoot = styled(SectionCard)`
  display: grid;
  gap: 18px;
`;

export const HeaderGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

export const Caption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

export const ContentRow = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 18px;
  align-items: center;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const LegendList = styled.div`
  display: grid;
  gap: 12px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const LegendSwatch = styled.span<{ $color: string }>`
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42);
  flex-shrink: 0;
`;

export const LegendLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
`;

export const LegendValue = styled.div`
  min-width: 58px;
  text-align: right;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-secondary);
`;

export const Footnote = styled.div`
  padding-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted);
`;
