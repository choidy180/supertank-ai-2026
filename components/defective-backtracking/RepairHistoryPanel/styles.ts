import styled from 'styled-components';
import { SurfacePanel, buttonReset } from '../shared/styles';

export const HistoryRoot = styled(SurfacePanel)`
  gap: 18px;
  overflow: hidden;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 28px;
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

export const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--border-soft);
  background: var(--surface-4);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
`;

export const TimelineWrap = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

export const TimelineList = styled.div`
  display: grid;
  gap: 18px;
`;

export const TimelineItemButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  width: 100%;
  display: grid;
  grid-template-columns: 66px 44px minmax(0, 1fr);
  gap: 12px;
  align-items: flex-start;
  padding: 8px 8px 8px 0;
  border-radius: 18px;
  background: ${({ $active }) => ($active ? 'rgba(11, 95, 151, 0.08)' : 'transparent')};
  transition: background 150ms ease, transform 150ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(11, 95, 151, 0.06);
  }
`;

export const TimeLabel = styled.div`
  padding-top: 4px;
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
`;

export const AxisCol = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 100%;
`;

export const AxisLine = styled.div`
  position: absolute;
  top: 0;
  bottom: -18px;
  width: 4px;
  border-radius: 999px;
  background: rgba(181, 189, 198, 0.4);
`;

export const IconBubble = styled.div<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: var(--navy);
  color: white;
  box-shadow: ${({ $active }) => ($active ? '0 0 0 6px rgba(11, 95, 151, 0.14)' : '0 8px 18px rgba(11, 95, 151, 0.18)')};
`;

export const Content = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const Connector = styled.div`
  width: 54px;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(11, 95, 151, 0.9) 0%, rgba(11, 95, 151, 0.62) 100%);
  flex-shrink: 0;
`;

export const ItemTitle = styled.div`
  min-width: 0;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.45;
  color: var(--text-strong);
`;

export const MetaText = styled.div`
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-primary);
`;

export const ActionText = styled.div`
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-primary);
`;
