import styled, { css } from 'styled-components';

import { buttonReset, pulse } from '../shared/styles';

type StatusTone = 'ok' | 'warning' | 'error';
type MiniPillTone = StatusTone | 'neutral';
type NodeStatus = StatusTone | 'idle';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const TONE_VARS: Record<MiniPillTone, ToneVars> = {
  ok: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
  warning: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  error: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
  neutral: {
    color: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    background: 'var(--color-surface-muted)',
  },
};

const NODE_STATUS_VARS: Record<NodeStatus, ToneVars> = {
  ok: TONE_VARS.ok,
  warning: TONE_VARS.warning,
  error: TONE_VARS.error,
  idle: {
    color: 'var(--color-text-tertiary)',
    border: 'var(--color-border)',
    background: 'var(--color-surface-muted)',
  },
};

export const LineHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
`;

export const LineHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const MiniPill = styled.div<{
  $tone: MiniPillTone;
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $tone }) => TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => TONE_VARS[$tone].background};
  color: ${({ $tone }) => TONE_VARS[$tone].color};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

export const LinesArea = styled.div`
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--color-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const LineRow = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) 168px;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 22px;
  background: ${({ $selected }) =>
    $selected ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $selected }) =>
      $selected ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $selected }) =>
      $selected ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }

  @media (max-width: 1180px) {
    grid-template-columns: 96px minmax(0, 1fr) 144px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

export const LineLabelButton = styled.button`
  ${buttonReset};

  display: grid;
  gap: 6px;
  min-width: 0;
  text-align: left;

  &:focus-visible {
    border-radius: 12px;
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }
`;

export const LineName = styled.div`
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
`;

export const LineShift = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.4;
`;

export const NodeRail = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  min-width: 0;
`;

export const NodeTrack = styled.div`
  position: absolute;
  top: 24px;
  left: 9%;
  right: 9%;
  height: 4px;
  border-radius: 999px;
  background: var(--color-border);
`;

export const NodeSlot = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
  min-width: 0;
`;

export const NodeButton = styled.button<{
  $status: NodeStatus;
  $selected: boolean;
}>`
  ${buttonReset};

  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: 2px solid ${({ $status }) => NODE_STATUS_VARS[$status].border};
  border-radius: 999px;
  outline: ${({ $selected }) =>
    $selected ? '5px solid var(--color-accent-soft)' : '0 solid transparent'};
  outline-offset: 2px;
  background: ${({ $status }) => NODE_STATUS_VARS[$status].background};
  color: ${({ $status }) => NODE_STATUS_VARS[$status].color};
  font-size: 28px;
  font-weight: 700;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    outline 160ms ease;

  ${({ $selected }) =>
    $selected
      ? css`
          animation: ${pulse} 2.1s infinite;
        `
      : css`
          animation: none;
        `}

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 5px solid var(--color-focus);
    outline-offset: 3px;
  }
`;

export const NodeLabel = styled.div<{ $selected: boolean }>`
  color: ${({ $selected }) =>
    $selected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'};
  font-size: 16px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  line-height: 1.4;
  text-align: center;
`;

export const LineSummary = styled.div`
  display: grid;
  gap: 8px;
  justify-items: end;

  @media (max-width: 768px) {
    justify-items: start;
  }
`;

export const SummaryPill = styled.div<{ $tone: StatusTone }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => TONE_VARS[$tone].background};
  color: ${({ $tone }) => TONE_VARS[$tone].color};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
`;