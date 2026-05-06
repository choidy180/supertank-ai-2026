import styled from 'styled-components';

import { buttonReset } from '../shared/styles';

type StatusTone = 'ok' | 'warning' | 'error';
type DetailStatus = StatusTone | 'idle';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const STATUS_TONE_VARS: Record<DetailStatus, ToneVars> = {
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
  idle: {
    color: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    background: 'var(--color-surface-muted)',
  },
};

export const DetailCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
  gap: 16px;
  margin-top: 18px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

export const DetailInfo = styled.div`
  display: grid;
  gap: 14px;
  min-width: 0;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const DetailTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const DetailEyebrow = styled.div`
  color: var(--color-text-tertiary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DetailTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
`;

export const StatusBadge = styled.div<{ $status: DetailStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $status }) => STATUS_TONE_VARS[$status].border};
  border-radius: 999px;
  background: ${({ $status }) => STATUS_TONE_VARS[$status].background};
  color: ${({ $status }) => STATUS_TONE_VARS[$status].color};
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailMetric = styled.div`
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
`;

export const DetailMetricLabel = styled.div`
  color: var(--color-text-tertiary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DetailMetricValue = styled.div`
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
`;

export const DetailNote = styled.div`
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
`;

export const ActionPanel = styled.div`
  display: grid;
  align-content: space-between;
  gap: 16px;
  min-width: 0;
`;

export const ActionTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
`;

export const ActionDescription = styled.div`
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.45;
`;

export const ActionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatusActionButton = styled.button<{
  $tone: StatusTone;
}>`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding: 0 12px;
  border: 1px solid ${({ $tone }) => STATUS_TONE_VARS[$tone].border};
  border-radius: 16px;
  background: ${({ $tone }) => STATUS_TONE_VARS[$tone].background};
  color: ${({ $tone }) => STATUS_TONE_VARS[$tone].color};
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;