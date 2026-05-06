import styled from 'styled-components';

import {
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  RightPanel,
  buttonReset,
} from '../shared/styles';

export {
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  RightPanel,
};

type InspectionTone = 'green' | 'amber' | 'red';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const INSPECTION_TONE_VARS: Record<InspectionTone, ToneVars> = {
  green: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
  amber: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  red: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
};

export const InspectionList = styled.div`
  display: grid;
  gap: 12px;
  min-height: 0;
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

export const InspectionCard = styled.div<{
  $tone: InspectionTone;
  $selected: boolean;
}>`
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 16px;
  border: 1px solid
    ${({ $tone, $selected }) =>
      $selected ? INSPECTION_TONE_VARS[$tone].border : 'var(--color-border)'};
  border-radius: 20px;
  background: ${({ $tone, $selected }) =>
    $selected
      ? INSPECTION_TONE_VARS[$tone].background
      : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $tone }) => INSPECTION_TONE_VARS[$tone].border};
    background: ${({ $tone, $selected }) =>
      $selected
        ? INSPECTION_TONE_VARS[$tone].background
        : 'var(--color-surface-hover)'};
  }
`;

export const InspectionTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InspectionDate = styled.div`
  flex: 0 0 auto;
  color: var(--color-text-tertiary);
  font-size: 14px;
  line-height: 1.4;
  white-space: nowrap;
`;

export const InspectionSummary = styled.div`
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.55;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const InspectionSubtext = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.45;
  word-break: keep-all;
`;

export const InspectionMeta = styled.div`
  color: var(--color-text-tertiary);
  font-size: 16px;
  line-height: 1.45;
  word-break: keep-all;
`;

export const DetailButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: start;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--color-warning);
  border-radius: 12px;
  background: var(--color-warning-soft);
  color: var(--color-warning);
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--color-surface-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;