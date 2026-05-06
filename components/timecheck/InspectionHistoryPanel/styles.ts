import styled from 'styled-components';

import { buttonReset } from '../shared/styles';

type TimelineLevel = 'ok' | 'warning' | 'error';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const TIMELINE_LEVEL_VARS: Record<TimelineLevel, ToneVars> = {
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
};

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: ${({ $active }) =>
    $active ? 'var(--color-accent)' : 'var(--color-text-secondary)'};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $active }) =>
      $active ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
    color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-text-primary)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const TimelineWrap = styled.div`
  flex: 1;
  min-height: 0;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding-right: 8px;

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
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
`;

export const TimelineItem = styled.div`
  width: 100%;
`;

export const TimelineCardButton = styled.button<{ $focused: boolean }>`
  ${buttonReset};

  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  border: 1px solid
    ${({ $focused }) =>
      $focused ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 16px;
  background: ${({ $focused }) =>
    $focused ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $focused }) =>
      $focused ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $focused }) =>
      $focused ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const TimelineCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-bottom: 12px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const TimelineTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
  word-break: keep-all;
`;

export const TimelineBadge = styled.div<{ $level: TimelineLevel }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid ${({ $level }) => TIMELINE_LEVEL_VARS[$level].border};
  border-radius: 999px;
  background: ${({ $level }) => TIMELINE_LEVEL_VARS[$level].background};
  color: ${({ $level }) => TIMELINE_LEVEL_VARS[$level].color};
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
`;

export const TimelineTime = styled.div`
  flex-shrink: 0;
  color: var(--color-text-tertiary);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
`;

export const TimelineDetail = styled.div`
  margin-bottom: 12px;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.6;
  word-break: keep-all;
`;

export const TimelineMeta = styled.div`
  color: var(--color-text-tertiary);
  font-size: 14px;
  line-height: 1.5;
  word-break: keep-all;
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 320px;
  padding: 24px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 20px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 16px;
  line-height: 1.8;
`;