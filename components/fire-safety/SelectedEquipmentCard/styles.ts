import styled from 'styled-components';

type EquipmentTone = 'green' | 'amber' | 'red';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const EQUIPMENT_TONE_VARS: Record<EquipmentTone, ToneVars> = {
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

export const SelectedEquipmentCardWrap = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.7fr);
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);

  @media (max-width: 1460px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

export const SelectedInfo = styled.div`
  display: grid;
  gap: 14px;
  min-width: 0;
`;

export const InfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const InfoEyebrow = styled.div`
  color: var(--color-text-tertiary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const InfoTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

export const StatusBadge = styled.div<{ $tone: EquipmentTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid ${({ $tone }) => EQUIPMENT_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => EQUIPMENT_TONE_VARS[$tone].background};
  color: ${({ $tone }) => EQUIPMENT_TONE_VARS[$tone].color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1460px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  min-width: 0;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
`;

export const MetricLabel = styled.div`
  color: var(--color-text-tertiary);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  text-transform: uppercase;
`;

export const MetricValue = styled.div`
  margin-top: 4px;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  word-break: keep-all;
`;

export const SelectedNote = styled.div`
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.7;
  word-break: keep-all;
`;

export const CoordinateHint = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
  min-width: 0;
`;

export const CoordinateCard = styled.div`
  min-width: 0;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
`;

export const CoordinateTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
`;

export const CoordinateText = styled.div`
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 1.5;
  word-break: keep-all;
`;

export const Formula = styled.code`
  display: block;
  margin-top: 12px;
  padding: 10px 12px;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface-muted);
  color: var(--color-accent);
  font-family:
    'SFMono-Regular',
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;