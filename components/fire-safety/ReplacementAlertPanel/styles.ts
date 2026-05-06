import styled from 'styled-components';

import {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  buttonReset,
} from '../shared/styles';

export {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
};

type AlertTone = 'amber' | 'red';

type AlertToneVars = {
  color: string;
  background: string;
};

const ALERT_TONE_VARS: Record<AlertTone, AlertToneVars> = {
  amber: {
    color: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  red: {
    color: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
};

export const AlertList = styled.div`
  display: grid;
  gap: 12px;
  min-height: 0;
  margin-top: 16px;
  padding-right: 4px;
  overflow: auto;

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

export const AlertItem = styled.button<{
  $tone: AlertTone;
  $selected: boolean;
}>`
  ${buttonReset};

  display: grid;
  gap: 6px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid
    ${({ $tone, $selected }) =>
      $selected ? ALERT_TONE_VARS[$tone].color : 'var(--color-border)'};
  border-radius: 18px;
  background: ${({ $tone, $selected }) =>
    $selected ? ALERT_TONE_VARS[$tone].background : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $tone }) => ALERT_TONE_VARS[$tone].color};
    background: ${({ $tone, $selected }) =>
      $selected ? ALERT_TONE_VARS[$tone].background : 'var(--color-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const AlertTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  word-break: keep-all;
`;

export const AlertDate = styled.div<{ $tone?: AlertTone }>`
  color: ${({ $tone = 'amber' }) => ALERT_TONE_VARS[$tone].color};
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

export const AlertMeta = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.45;
  word-break: keep-all;
`;