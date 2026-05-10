import styled from 'styled-components';

import { CIRCLE_CIRCUMFERENCE } from '../model/constants';

export const RingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  margin-top: 20px;
`;

export const RingInner = styled.div`
  position: relative;
  width: 216px;
  height: 266px;
`;

export const RingSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 216px;
  height: 216px;
  transform: rotate(-90deg);
`;

export const RingTrack = styled.circle`
  fill: none;
  stroke: var(--color-border);
  stroke-width: 16;
`;

export const RingValue = styled.circle<{ $percent: number }>`
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 16;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCLE_CIRCUMFERENCE};
  stroke-dashoffset: ${({ $percent }) =>
    CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * $percent) / 100};
  transition:
    stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1),
    stroke 180ms ease;
`;

export const RingCenter = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 216px;
  height: 216px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const RingValueText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RingNumber = styled.div`
  color: var(--color-text-primary);
  font-size: 52px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
`;

export const RingLabel = styled.div`
  position: absolute;
  top: 230px;
  left: 50%;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  transform: translateX(-50%);
`;

export const QuickStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
`;

export const QuickStatCard = styled.div`
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface-muted);
`;

export const QuickStatLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
`;

export const QuickStatValue = styled.div`
  margin-top: 8px;
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;