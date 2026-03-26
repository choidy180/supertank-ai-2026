import styled from 'styled-components';
import {
  CenterPanel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  buttonReset
} from '../shared/styles';

export {
  CenterPanel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup
};

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(17, 30, 56, 0.72);
`;

export const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
`;

export const LegendDot = styled.span<{ $tone: 'green' | 'amber' | 'red' }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'var(--green)';
        case 'amber':
          return 'var(--amber)';
        case 'red':
          return 'var(--red)';
        default:
          return 'var(--blue)';
      }
    }};
  box-shadow:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return '0 0 12px rgba(47, 209, 132, 0.58)';
        case 'amber':
          return '0 0 12px rgba(255, 190, 87, 0.56)';
        case 'red':
          return '0 0 12px rgba(255, 105, 119, 0.56)';
        default:
          return '0 0 12px rgba(91, 156, 255, 0.56)';
      }
    }};
`;

export const LegendMeta = styled.div`
  font-size: 16px;
  color: #c7ecee;
`;

export const ZoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

export const ZoneCard = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 10px;
  min-height: 240px;
  padding: 16px;
  border-radius: 22px;
  border: 1px solid
    ${({ $selected }) =>
      $selected
        ? 'rgba(91, 156, 255, 0.32)'
        : 'rgba(132, 154, 199, 0.12)'};
  background: ${({ $selected }) =>
    $selected ? 'rgba(18, 35, 67, 0.94)' : 'rgba(14, 26, 49, 0.82)'};
  box-shadow: ${({ $selected }) =>
    $selected ? '0 18px 40px rgba(0, 0, 0, 0.24)' : 'none'};
`;

export const ZoneTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const ZoneTitleGroup = styled.div`
  display: grid;
  gap: 4px;
`;

export const ZoneName = styled.div`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

export const ZoneMeta = styled.div`
  font-size: 18px;
  line-height: 1.5;
  color: #c7ecee;
`;

export const ZoneBadge = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(132, 154, 199, 0.16);
  background: rgba(91, 156, 255, 0.08);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
`;

export const MapArea = styled.div`
  position: relative;
  min-height: 0;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.18);
  background:
    linear-gradient(180deg, rgba(12, 22, 40, 0.9) 0%, rgba(8, 16, 31, 0.92) 100%);
  overflow: hidden;
`;

export const GridLayer = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(132, 154, 199, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(132, 154, 199, 0.08) 1px, transparent 1px);
  background-size: 14.285% 20%;
  opacity: 0.82;
`;

export const AxisLabelX = styled.div`
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: var(--text-muted);
  pointer-events: none;
`;

export const AxisLabelY = styled.div`
  position: absolute;
  top: 14px;
  bottom: 26px;
  left: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  color: var(--text-muted);
  pointer-events: none;
`;

export const AxisCorner = styled.div`
  position: absolute;
  left: 12px;
  bottom: 8px;
  font-size: 15px;
  font-weight: 600;
  color: rgba(245, 248, 255, 0.56);
  pointer-events: none;
`;

export const MarkerButton = styled.button<{
  $tone: 'green' | 'amber' | 'red';
  $selected: boolean;
}>`
  ${buttonReset};
  position: absolute;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.92);
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'linear-gradient(180deg, #39de92 0%, #1fa363 100%)';
        case 'amber':
          return 'linear-gradient(180deg, #ffc96f 0%, #e29a25 100%)';
        case 'red':
          return 'linear-gradient(180deg, #ff8792 0%, #ea495c 100%)';
        default:
          return 'linear-gradient(180deg, #6eafff 0%, #4c84f7 100%)';
      }
    }};
  box-shadow:
    ${({ $tone, $selected }) => {
      const glow =
        $tone === 'green'
          ? 'rgba(47, 209, 132, 0.42)'
          : $tone === 'amber'
            ? 'rgba(255, 190, 87, 0.42)'
            : 'rgba(255, 105, 119, 0.42)';

      return $selected
        ? `0 0 0 6px rgba(91, 156, 255, 0.18), 0 10px 20px ${glow}`
        : `0 10px 18px ${glow}`;
    }};
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.06);
  }
`;

export const MarkerIcon = styled.span`
  position: relative;
  width: 12px;
  height: 14px;

  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 3px;
    width: 6px;
    height: 9px;
    border-radius: 2px 2px 3px 3px;
    background: #ffffff;
  }

  &::after {
    content: '';
    position: absolute;
    left: 1px;
    top: 0;
    width: 6px;
    height: 4px;
    border-radius: 6px 6px 0 0;
    border: 2px solid #ffffff;
    border-bottom: 0;
    transform: rotate(-14deg);
    transform-origin: center;
  }
`;

export const MarkerTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%);
  min-width: 126px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(132, 154, 199, 0.18);
  background: rgba(8, 16, 31, 0.96);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.28);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: none;
  transition: opacity 140ms ease;
`;

export const MarkerTooltipTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-strong);
`;

export const MarkerTooltipMeta = styled.div`
  margin-top: 4px;
  font-size: 15px;
  color: #c7ecee;
`;

export const ZoneFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 16px;
  color: var(--text-secondary);
`;
