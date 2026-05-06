import styled from 'styled-components';

import {
  CenterPanel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  buttonReset,
} from '../shared/styles';

export {
  CenterPanel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
};

type ZoneTone = 'green' | 'amber' | 'red';

type ToneVars = {
  color: string;
  background: string;
  border: string;
};

const ZONE_TONE_VARS: Record<ZoneTone, ToneVars> = {
  green: {
    color: 'var(--color-success)',
    background: 'var(--color-success-soft)',
    border: 'var(--color-success)',
  },
  amber: {
    color: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
    border: 'var(--color-warning)',
  },
  red: {
    color: 'var(--color-error)',
    background: 'var(--color-error-soft)',
    border: 'var(--color-error)',
  },
};

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);
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
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
`;

export const LegendDot = styled.span<{ $tone: ZoneTone }>`
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $tone }) => ZONE_TONE_VARS[$tone].color};
`;

export const LegendMeta = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.4;
`;

export const ZoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--color-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

export const ZoneCard = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 10px;
  min-height: 240px;
  padding: 16px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 22px;
  background: ${({ $selected }) =>
    $selected ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $selected }) =>
      $selected ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $selected }) =>
      $selected ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }
`;

export const ZoneTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const ZoneTitleGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const ZoneName = styled.div`
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

export const ZoneMeta = styled.div`
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.5;
  word-break: keep-all;
`;

export const ZoneBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
`;

export const MapArea = styled.div`
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
`;

export const GridLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: transparent;
`;

export const AxisLabelX = styled.div`
  position: absolute;
  right: 14px;
  bottom: 8px;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-tertiary);
  font-size: 16px;
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
  color: var(--color-text-tertiary);
  font-size: 16px;
  pointer-events: none;
`;

export const AxisCorner = styled.div`
  position: absolute;
  left: 12px;
  bottom: 8px;
  color: var(--color-text-tertiary);
  font-size: 15px;
  font-weight: 600;
  pointer-events: none;
`;

export const MarkerButton = styled.button<{
  $tone: ZoneTone;
  $selected: boolean;
}>`
  ${buttonReset};

  position: absolute;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-surface);
  border-radius: 999px;
  background: ${({ $tone }) => ZONE_TONE_VARS[$tone].color};
  color: var(--color-surface);
  outline: ${({ $selected }) =>
    $selected ? '5px solid var(--color-accent-soft)' : '0 solid transparent'};
  outline-offset: 2px;
  transform: translate(-50%, -50%);
  transition:
    transform 160ms ease,
    background 160ms ease,
    outline 160ms ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.06);
  }

  &:focus-visible {
    outline: 5px solid var(--color-focus);
    outline-offset: 3px;
  }
`;

export const MarkerIcon = styled.span`
  position: relative;
  width: 12px;
  height: 14px;

  &::before {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 6px;
    height: 9px;
    border-radius: 2px 2px 3px 3px;
    background: currentColor;
    content: '';
  }

  &::after {
    position: absolute;
    top: 0;
    left: 1px;
    width: 6px;
    height: 4px;
    border: 2px solid currentColor;
    border-bottom: 0;
    border-radius: 6px 6px 0 0;
    content: '';
    transform: rotate(-14deg);
    transform-origin: center;
  }
`;

export const MarkerTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  min-width: 126px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--color-shadow);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: none;
  transform: translateX(-50%);
  transition: opacity 140ms ease;
`;

export const MarkerTooltipTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
`;

export const MarkerTooltipMeta = styled.div`
  margin-top: 4px;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.4;
`;

export const ZoneFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.4;
`;