import styled, { keyframes } from 'styled-components';

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

const markerTooltipIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% + 6px)) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1);
  }
`;

const markerPreviewIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

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

export const ZoneCard = styled.div<{
  $selected: boolean;
  $dragging?: boolean;
  $dragOver?: boolean;
}>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 10px;
  min-height: 240px;
  padding: 16px;
  border: 1px solid
    ${({ $selected, $dragOver }) => {
      if ($dragOver) {
        return 'var(--color-accent)';
      }

      return $selected ? 'var(--color-accent)' : 'var(--color-border)';
    }};
  border-radius: 22px;
  background: ${({ $selected, $dragOver }) => {
    if ($dragOver) {
      return 'var(--color-surface-hover)';
    }

    return $selected ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)';
  }};
  color: var(--color-text-primary);
  cursor: grab;
  opacity: ${({ $dragging }) => ($dragging ? 0.58 : 1)};
  user-select: none;
  transform: ${({ $dragging, $dragOver }) => {
    if ($dragging) {
      return 'scale(0.985)';
    }

    if ($dragOver) {
      return 'translateY(-3px)';
    }

    return 'none';
  }};
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ $selected }) =>
      $selected ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $selected }) =>
      $selected ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }

  &:active {
    cursor: grabbing;
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
  z-index: 1;
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
  z-index: 1;
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
  z-index: 1;
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
  z-index: ${({ $selected }) => ($selected ? 4 : 3)};
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 2px solid var(--color-surface);
  border-radius: 999px;
  background: ${({ $tone }) => ZONE_TONE_VARS[$tone].color};
  box-shadow:
    0 8px 18px rgba(15, 23, 42, 0.18),
    var(--color-shadow);
  color: var(--color-surface);
  outline: ${({ $selected }) =>
    $selected ? '5px solid var(--color-accent-soft)' : '0 solid transparent'};
  outline-offset: 2px;
  touch-action: none;
  transform: translate(-50%, -50%);
  transition:
    transform 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease,
    outline 160ms ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.08);
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

/**
 * 기존 마커 내부 툴팁용 스타일입니다.
 * 부모 overflow에 잘릴 수 있어서 FactoryLayoutPanel에서는 FloatingMarkerTooltip을 사용합니다.
 */
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

export const FloatingMarkerTooltip = styled.div`
  position: fixed;
  z-index: 100000;
  min-width: 150px;
  max-width: min(280px, calc(100vw - 32px));
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow:
    0 20px 54px rgba(15, 23, 42, 0.28),
    var(--color-shadow);
  pointer-events: none;
  transform: translate(-50%, -100%);
  animation: ${markerTooltipIn} 140ms ease both;

  &::after {
    position: absolute;
    top: 100%;
    left: 50%;
    width: 0;
    height: 0;
    border-top: 7px solid var(--color-surface);
    border-right: 7px solid transparent;
    border-left: 7px solid transparent;
    content: '';
    transform: translateX(-50%);
  }
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

export const MarkerPreviewPiP = styled.aside`
  position: fixed;
  right: max(22px, env(safe-area-inset-right));
  bottom: max(22px, env(safe-area-inset-bottom));
  z-index: 99990;
  width: min(360px, calc(100vw - 32px));
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface);
  box-shadow:
    0 24px 72px rgba(15, 23, 42, 0.32),
    var(--color-shadow);
  pointer-events: none;
  animation: ${markerPreviewIn} 170ms ease both;
`;

export const MarkerPreviewHeader = styled.div`
  display: grid;
  gap: 3px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-muted);
`;

export const MarkerPreviewEyebrow = styled.div`
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

export const MarkerPreviewTitle = styled.div`
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MarkerPreviewBody = styled.div`
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  min-height: 160px;
  background: #000000;
`;

export const MarkerPreviewVideo = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const MarkerPreviewPlaceholder = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.16), transparent 34%),
    #0f172a;
  color: rgba(255, 255, 255, 0.76);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
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
