import styled from 'styled-components';

import { CIRCLE_CIRCUMFERENCE } from '../model/constants';

export const RingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const RingInner = styled.div`
  position: relative;
  width: 216px;
  height: 216px;
  /* ✨ 텍스트가 원 아래에 위치할 수 있도록 하단에 공간 확보 */
  margin-bottom: 50px; 
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
  stroke: rgba(92, 114, 154, 0.18);
  stroke-width: 16;
`;

export const RingValue = styled.circle<{ $percent: number }>`
  fill: none;
  stroke: #4a8cff;
  stroke-width: 16;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCLE_CIRCUMFERENCE};
  stroke-dashoffset: ${({ $percent }) =>
    CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * $percent) / 100};
  transition:
    stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1),
    stroke 180ms ease;
  filter: drop-shadow(0 0 18px rgba(74, 140, 255, 0.28));
`;

export const RingCenter = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
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
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1; 
  color: #ffffff;
`;

export const RingLabel = styled.div`
  /* ✨ 원형 차트 아래로 위치 고정 */
  position: absolute;
  top: 230px; 
  
  /* ✨ 가독성 향상을 위한 스타일링 */
  font-size: 20px; 
  font-weight: 700; 
  color: #ffffff; 
  letter-spacing: -0.02em;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
`;

export const QuickStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
`;

export const QuickStatCard = styled.div`
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(133, 154, 194, 0.12);
  background: rgba(16, 28, 53, 0.8);
`;

export const QuickStatLabel = styled.div`
  font-size: 16px;
  color: #c7ecee;
`;

export const QuickStatValue = styled.div`
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;